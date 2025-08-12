"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

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
import DateTimePicker from "@/components/DateTimePicker";
import {
	useNotifications,
	showErrorNotification,
	showSuccessNotification,
} from "@/components/NotificationManager";

type Customer = {
	name: string;
	email: string;
	phone: string;
};

export default function CheckoutPage() {
	const router = useRouter();
	const { data: session, status } = useSession();
	const { showNotification } = useNotifications();

	// --- Soft nudge when not signed in ---
	if (status !== "loading" && !session) {
		return (
			<main className="mx-auto max-w-5xl p-6">
				<h1 className="mb-4 text-2xl font-semibold">Checkout</h1>
				<div className="rounded-2xl border p-6 bg-white">
					<p className="mb-3">Please sign in to place your order.</p>
					<a
						href={`/login?callbackUrl=${encodeURIComponent("/checkout")}`}
						className="inline-block rounded-full bg-blue-800 px-4 py-2 text-white hover:bg-blue-700">
						Sign in
					</a>
				</div>
			</main>
		);
	}

	// --- Basket + form state ---
	const [items, setItems] = useState<CartItem[]>([]);
	const [bag, setBag] = useState<boolean>(false);

	const [customer, setCustomer] = useState<Customer>({
		name: "",
		email: "",
		phone: "",
	});

	const [date, setDate] = useState<string>("");
	const [time, setTime] = useState<string>("");

	// Compute date bounds immediately so the picker never allows past dates
	const { minDate: initialMinDate, maxDate: initialMaxDate } = useMemo(
		() => computeDateBounds(new Date()),
		[]
	);
	const [minDate, setMinDate] = useState<string>(initialMinDate);
	const [maxDate, setMaxDate] = useState<string>(initialMaxDate);
	const slots = useMemo(() => buildSlots("09:00", "17:30", 30), []);

	// Load basket and bag
	useEffect(() => {
		(async () => {
			const cart = await getCart();
			setItems(Array.isArray(cart) ? cart : []);
		})();
		try {
			const savedBag = localStorage.getItem("bag_opt_in");
			setBag(savedBag ? JSON.parse(savedBag) === true : false);
		} catch {}
		// Default the selected date to the earliest allowed date
		setDate(initialMinDate);
	}, [initialMinDate]);

	// Prefill from session
	useEffect(() => {
		if (!session) return;
		setCustomer((c) => ({
			name: c.name || (session.user?.name ?? ""),
			email: c.email || (session.user?.email ?? ""),
			phone: c.phone || "",
		}));
	}, [session]);

	// Money
	const subtotal = useMemo(
		() =>
			(Array.isArray(items) ? items : []).reduce(
				(s, i) => s + i.price_pence * i.qty,
				0
			),
		[items]
	);
	const gst = calcGST(subtotal, bag);
	const total = calcTotal(Array.isArray(items) ? items : [], bag);

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
		return null;
	};

	const placeOrder = async () => {
		const errMsg = validateForm();
		if (errMsg) {
			showErrorNotification(showNotification, "Form Validation Error", errMsg);
			return;
		}
		try {
			// Re-validate slot availability just before placing the order
			const r = await fetch(`/api/slots`, { cache: "no-store" });
			const j = await r.json();
			const day = (Array.isArray(j.slots) ? j.slots : []).find(
				(d: any) => d.date === date
			);
			const slot = day?.times?.find((t: any) => t.time === time);
			if (!slot || slot.disabled) {
				showErrorNotification(
					showNotification,
					"Time Slot Unavailable",
					"That time slot is full. Please choose another."
				);
				return;
			}
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

			await clearCart();
			showSuccessNotification(
				showNotification,
				"Order Placed Successfully! 🎉",
				"Your order has been confirmed. You'll receive a confirmation email shortly."
			);
			try {
				localStorage.setItem("bag_opt_in", JSON.stringify(bag));
				localStorage.setItem("last_customer", JSON.stringify(customer));
			} catch {}

			const orderId = data?.order_id;

			// Small delay to show the success notification
			setTimeout(() => {
				router.push(
					orderId ? `/order-success?order_id=${orderId}` : "/order-success"
				);
			}, 1500);
		} catch (e: any) {
			showErrorNotification(
				showNotification,
				"Order Failed",
				e?.message || "Something went wrong. Please try again."
			);
		}
	};

	// Date selection is now driven by DateTimePicker which already hides/locks Sundays

	return (
		<main className="mx-auto max-w-5xl p-4">
			<h1 className="mb-4 text-2xl font-semibold">Checkout</h1>

			{items.length === 0 ? (
				<div className="rounded-2xl border p-6 text-gray-600 bg-white">
					<p>Your basket is empty. Browse items here.</p>
				</div>
			) : (
				<div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
					{/* Left: Items + Form */}
					<div className="space-y-6">
						{/* Items */}
						<div className="space-y-3">
							{items.map((i) => (
								<div
									key={i.product_id}
									className="flex items-center justify-between rounded-2xl border p-3 bg-white">
									<div className="min-w-0">
										<div className="truncate font-medium">{i.name}</div>
										<div className="text-sm opacity-70">
											{i.qty} × {formatGBP(i.price_pence)}
										</div>
									</div>
									<div className="font-medium">
										{formatGBP(i.price_pence * i.qty)}
									</div>
								</div>
							))}

							<label className="mt-3 flex w-fit cursor-pointer select-none items-center gap-2 rounded-xl border px-3 py-2 hover:bg-gray-50 bg-white">
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

						{/* Customer */}
						<section className="rounded-2xl border p-4 bg-white">
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
										className="mt-1 w-full rounded-full border px-3 py-2"
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
										className="mt-1 w-full rounded-full border px-3 py-2"
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
										className="mt-1 w-full rounded-full border px-3 py-2"
										placeholder="07700 900000"
									/>
								</div>
							</div>
						</section>

						{/* Pickup */}
						<section className="rounded-2xl border p-4 bg-white">
							<h2 className="mb-3 text-lg font-semibold">Pickup</h2>
							<DateTimePicker
								onChange={(d, t) => {
									setDate(d);
									setTime(t);
								}}
							/>
						</section>
					</div>

					{/* Right: Summary */}
					<aside className="rounded-2xl border p-4 bg-white">
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
							className="mt-4 w-full rounded-full bg-blue-800 px-4 py-2 text-white hover:bg-blue-700">
							Place order
						</button>
					</aside>
				</div>
			)}
		</main>
	);
}
