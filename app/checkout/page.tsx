"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getCart, clearCart, type CartItem } from "@/lib/cart";
import {
	formatGBP,
	BAG_PENCE,
	calcGST,
	calcTotal,
	computeDateBounds,
	isSunday,
	buildSlots,
} from "@/lib/checkout";
import { toast } from "react-hot-toast";

type Customer = {
	name: string;
	email: string;
	phone: string;
};

type SlotMeta = { remaining: number; full: boolean };

// Persist helper that plays nicely with existing/legacy keys
function persistCart(next: CartItem[]) {
	try {
		localStorage.setItem("basket_v1", JSON.stringify(next));
		// keep legacy key in sync (harmless if unused)
		localStorage.setItem("basket", JSON.stringify(next));
	} catch {}
}

export default function CheckoutPage() {
	const router = useRouter();
	const { data: session } = useSession();

	const [items, setItems] = useState<CartItem[]>([]);
	const [bag, setBag] = useState<boolean>(false);

	// Customer details (prefill from session and localStorage)
	const [customer, setCustomer] = useState<Customer>({
		name: "",
		email: "",
		phone: "",
	});

	// Date/time
	const [date, setDate] = useState<string>("");
	const [time, setTime] = useState<string>("");

	// Bounds + slots
	const [minDate, setMinDate] = useState<string>("");
	const [maxDate, setMaxDate] = useState<string>("");
	const timeSlots = useMemo(() => buildSlots("09:00", "17:30", 30), []);

	// Availability
	const [slotInfo, setSlotInfo] = useState<Record<string, SlotMeta>>({});
	const [loadingSlots, setLoadingSlots] = useState(false);

	// --- Cart line item modifiers ---
	const changeQty = (product_id: string, nextQty: number) => {
		setItems((prev) => {
			const next = prev
				.map((l) => (l.product_id === product_id ? { ...l, qty: nextQty } : l))
				.filter((l) => l.qty > 0); // auto-drop if qty goes to 0
			persistCart(next);
			return next;
		});
	};

	const inc = (product_id: string) => {
		const line = items.find((l) => l.product_id === product_id);
		changeQty(product_id, (line?.qty || 0) + 1);
	};

	const dec = (product_id: string) => {
		const line = items.find((l) => l.product_id === product_id);
		if (!line) return;
		if (line.qty <= 1) {
			// remove instead of going to 0
			removeLine(product_id);
		} else {
			changeQty(product_id, line.qty - 1);
		}
	};

	const removeLine = (product_id: string) => {
		setItems((prev) => {
			const next = prev.filter((l) => l.product_id !== product_id);
			persistCart(next);
			return next;
		});
		toast.success("Item removed from basket");
	};

	// Load basket, bag, and compute date window on mount
	useEffect(() => {
		setItems(getCart());

		try {
			const savedBag = localStorage.getItem("bag_opt_in");
			setBag(savedBag ? JSON.parse(savedBag) === true : false);

			const last = localStorage.getItem("last_customer");
			if (last) {
				const parsed = JSON.parse(last);
				setCustomer((c) => ({
					name: parsed?.name || c.name,
					email: parsed?.email || c.email,
					phone: parsed?.phone || c.phone,
				}));
			}
		} catch {
			// ignore storage errors
		}

		const { minDate: minD, maxDate: maxD } = computeDateBounds(new Date());
		setMinDate(minD);
		setMaxDate(maxD);
		setDate(minD); // default to earliest valid date
	}, []);

	// Prefill from session (only fills empty fields so user edits stick)
	useEffect(() => {
		if (!session) return;
		setCustomer((c) => ({
			name: c.name || (session.user?.name ?? ""),
			email: c.email || (session.user?.email ?? ""),
			phone: c.phone || "", // map here if you later store phone on session.user
		}));
	}, [session]);

	// Money calcs
	const subtotal = useMemo(
		() => items.reduce((s, i) => s + i.price_pence * i.qty, 0),
		[items]
	);
	const gst = calcGST(subtotal, bag);
	const total = calcTotal(items, bag);

	// Availability: fetch when date changes (and is valid)
	useEffect(() => {
		let cancelled = false;
		async function run() {
			if (!date) return;
			setLoadingSlots(true);
			try {
				const res = await fetch(`/api/availability?date=${date}`, {
					cache: "no-store",
				});
				if (!res.ok) throw new Error(`Availability ${res.status}`);
				const j = await res.json();
				const map: Record<string, SlotMeta> = {};
				(j.slots || []).forEach(
					(s: any) => (map[s.time] = { remaining: s.remaining, full: !!s.full })
				);
				if (!cancelled) {
					setSlotInfo(map);
					// If currently selected time is now full, reset it
					if (time && map[time]?.full) setTime("");
				}
			} catch {
				if (!cancelled) {
					setSlotInfo({});
					toast.error("Couldn’t load availability. Try again.");
				}
			} finally {
				if (!cancelled) setLoadingSlots(false);
			}
		}
		run();
		return () => {
			cancelled = true;
		};
	}, [date]); // eslint-disable-line react-hooks/exhaustive-deps

	// Validation helpers
	const validateDate = (iso: string) => {
		if (!iso) return "Please choose a date.";
		if (iso < minDate || iso > maxDate)
			return "Please pick a date within the next 7 days.";
		if (isSunday(iso))
			return "We’re closed on Sundays. Please pick another day.";
		return null;
	};

	const validateForm = () => {
		if (!items.length) return "Your basket is empty.";
		if (!customer.name.trim()) return "Please enter your full name.";
		if (!customer.email.trim()) return "Please enter your email.";
		if (!customer.phone.trim()) return "Please enter your phone number.";

		const dateErr = validateDate(date);
		if (dateErr) return dateErr;

		if (!time) return "Please choose a pickup time.";
		if (slotInfo[time]?.full)
			return "That time slot just became full. Please pick another.";
		return null;
	};

	const placeOrder = async () => {
		const errMsg = validateForm();
		if (errMsg) {
			toast.error(errMsg);
			return;
		}

		try {
			const payload = {
				items,
				bag_opt_in: bag,
				pickup_date: date, // "YYYY-MM-DD"
				pickup_time: time, // "HH:mm"
				customer_name: customer.name,
				customer_email: customer.email,
				customer_phone: customer.phone,
			};

			const res = await fetch("/api/orders", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});

			const data = await res.json();
			if (!res.ok) throw new Error(data?.error || "Failed to place order.");

			clearCart();
			toast.success("Order placed!");
			const orderId = data?.order_id;

			// Persist last-used info for convenience
			try {
				localStorage.setItem("bag_opt_in", JSON.stringify(bag));
				localStorage.setItem("last_customer", JSON.stringify(customer));
			} catch {}

			router.push(
				orderId ? `/order-success?order_id=${orderId}` : "/order-success"
			);
		} catch (err: any) {
			console.error(err);
			toast.error(err?.message || "Something went wrong.");
		}
	};

	// On date change, enforce Sunday block
	const handleDateChange = (iso: string) => {
		if (!iso) {
			setDate("");
			return;
		}
		if (isSunday(iso)) {
			toast.error("We’re closed on Sundays. Please pick another day.");
			return;
		}
		setDate(iso);
	};

	return (
		<main className="mx-auto max-w-5xl p-4">
			<h1 className="mb-4 text-2xl font-semibold">Checkout</h1>

			{items.length === 0 ? (
				<div className="rounded-2xl border p-6 text-gray-600">
					<p>Your basket is empty. Browse groceries or baked goods.</p>
				</div>
			) : (
				<div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
					{/* Left: Items + Form */}
					<div className="space-y-6">
						{/* Items Review with quantity controls */}
						<div className="space-y-3">
							{items.map((i) => (
								<div
									key={i.product_id}
									className="flex items-center justify-between gap-4 rounded-2xl border p-3">
									<div className="min-w-0 flex-1">
										<div className="truncate font-medium">{i.name}</div>
										<div className="text-sm opacity-70">
											{formatGBP(i.price_pence)} each
										</div>
									</div>

									{/* Qty controls */}
									<div className="flex items-center gap-2">
										<button
											className="h-8 w-8 rounded-lg border text-lg leading-none hover:bg-gray-50"
											aria-label="Decrease quantity"
											onClick={() => dec(i.product_id)}>
											–
										</button>
										<input
											type="number"
											min={1}
											value={i.qty}
											onChange={(e) => {
												const n = Number(e.target.value);
												if (Number.isNaN(n) || n < 1) return;
												changeQty(i.product_id, Math.floor(n));
											}}
											className="w-14 rounded-lg border px-2 py-1 text-center"
										/>
										<button
											className="h-8 w-8 rounded-lg border text-lg leading-none hover:bg-gray-50"
											aria-label="Increase quantity"
											onClick={() => inc(i.product_id)}>
											+
										</button>
									</div>

									{/* Line total + remove */}
									<div className="flex items-center gap-3">
										<div className="font-medium w-20 text-right">
											{formatGBP(i.price_pence * i.qty)}
										</div>
										<button
											className="text-sm text-red-600 hover:underline"
											onClick={() => removeLine(i.product_id)}>
											Remove
										</button>
									</div>
								</div>
							))}

							<label className="mt-3 flex w-fit cursor-pointer select-none items-center gap-2 rounded-xl border px-3 py-2 hover:bg-gray-50">
								<input
									type="checkbox"
									className="h-4 w-4"
									checked={bag}
									onChange={() => {
										const next = !bag;
										setBag(next);
										try {
											localStorage.setItem("bag_opt_in", JSON.stringify(next));
										} catch {}
									}}
								/>
								Add a bag (+{formatGBP(BAG_PENCE)})
							</label>
						</div>

						{/* Customer Details */}
						<section className="rounded-2xl border p-4">
							<h2 className="mb-3 text-lg font-semibold">Your details</h2>

							<div className="grid gap-3 sm:grid-cols-2">
								<div className="sm:col-span-2">
									<label className="block text-sm text-gray-600">
										Full name
									</label>
									<input
										type="text"
										value={customer.name}
										onChange={(e) =>
											setCustomer({ ...customer, name: e.target.value })
										}
										className="mt-1 w-full rounded-xl border px-3 py-2"
										placeholder={session?.user?.name || "Jane Doe"}
									/>
								</div>

								<div>
									<label className="block text-sm text-gray-600">Email</label>
									<input
										type="email"
										value={customer.email}
										onChange={(e) =>
											setCustomer({ ...customer, email: e.target.value })
										}
										className="mt-1 w-full rounded-xl border px-3 py-2"
										placeholder={session?.user?.email || "jane@example.com"}
									/>
								</div>

								<div>
									<label className="block text-sm text-gray-600">Phone</label>
									<input
										type="tel"
										value={customer.phone}
										onChange={(e) =>
											setCustomer({ ...customer, phone: e.target.value })
										}
										className="mt-1 w-full rounded-xl border px-3 py-2"
										placeholder="07700 900000"
									/>
								</div>
							</div>
						</section>

						{/* Pickup Date & Time */}
						<section className="rounded-2xl border p-4">
							<h2 className="mb-3 text-lg font-semibold">Pickup</h2>

							<div className="grid gap-3 sm:grid-cols-2">
								<div>
									<label className="block text-sm text-gray-600">Date</label>
									<input
										type="date"
										className="mt-1 w-full rounded-xl border px-3 py-2"
										value={date}
										onChange={(e) => handleDateChange(e.target.value)}
										min={minDate}
										max={maxDate}
									/>
									<p className="mt-1 text-xs text-gray-500">
										Sundays are unavailable. Window: {minDate} → {maxDate}
									</p>
								</div>

								<div>
									<label className="block text-sm text-gray-600">Time</label>
									<select
										className="mt-1 w-full rounded-xl border px-3 py-2"
										value={time}
										onChange={(e) => setTime(e.target.value)}
										disabled={!date || loadingSlots}>
										<option value="">
											{loadingSlots ? "Loading slots…" : "Select a time"}
										</option>
										{timeSlots.map((t) => {
											const meta = slotInfo[t];
											const disabled = !!meta?.full;
											const label = meta
												? `${t} ${
														meta.full
															? "— FULL"
															: `(remaining ${meta.remaining})`
												  }`
												: t;
											return (
												<option key={t} value={t} disabled={disabled}>
													{label}
												</option>
											);
										})}
									</select>
								</div>
							</div>
						</section>
					</div>

					{/* Right: Summary */}
					<aside className="rounded-2xl border p-4">
						<h2 className="mb-3 text-lg font-semibold">Order summary</h2>

						<div className="space-y-2 text-sm">
							<div className="flex items-center justify-between">
								<span>Subtotal</span>
								<span className="font-medium">{formatGBP(subtotal)}</span>
							</div>

							<div className="flex items-center justify-between">
								<span>Bag</span>
								<span className="font-medium">
									{bag ? `+ ${formatGBP(BAG_PENCE)}` : formatGBP(0)}
								</span>
							</div>

							<div className="flex items-center justify-between">
								<span>GST (6%)</span>
								<span className="font-medium">{formatGBP(gst)}</span>
							</div>

							<div className="mt-3 flex items-center justify-between border-t pt-3 text-base">
								<span className="font-semibold">Total</span>
								<span className="font-semibold">{formatGBP(total)}</span>
							</div>
						</div>

						<button
							onClick={placeOrder}
							className="mt-4 w-full rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
							Place order
						</button>
					</aside>
				</div>
			)}
		</main>
	);
}
