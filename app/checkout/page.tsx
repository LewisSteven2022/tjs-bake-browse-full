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
};

export default function CheckoutPage() {
	const router = useRouter();
	const { data: session, status } = useSession();
	const { showNotification } = useNotifications();

	// --- Soft nudge when not signed in ---
	if (status !== "loading" && !session) {
		return (
			<main className="min-h-screen bg-elegance">
				<div className="container-elegance section-elegance">
					<h1 className="text-3xl text-elegance-heading mb-8 text-center">
						Checkout
					</h1>
					<div className="card-elegance border border-neutral-200 p-8 max-w-md mx-auto text-center">
						<p className="text-elegance-body mb-6">
							Please sign in to place your order.
						</p>
						<a
							href={`/login?callbackUrl=${encodeURIComponent("/checkout")}`}
							className="btn-elegance-primary">
							Sign in
						</a>
					</div>
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
			if (savedBag != null) {
				setBag(JSON.parse(savedBag) === true);
			} else {
				// If no local preference, try user preference from server
				fetch("/api/user/preferences", { cache: "no-store" })
					.then((r) => (r.ok ? r.json() : Promise.resolve({})))
					.then((j) => {
						if (typeof j?.bag_pref === "boolean") setBag(j.bag_pref);
					})
					.catch(() => {});
			}
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
				// Persist preference for signed-in users
				if (session) {
					fetch("/api/user/preferences", {
						method: "PATCH",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ bag_pref: bag }),
					}).catch(() => {});
				}
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
		<main className="min-h-screen bg-elegance">
			<div className="container-elegance section-elegance">
				<h1 className="text-3xl text-elegance-heading mb-12 text-center">
					Checkout
				</h1>

				{items.length === 0 ? (
					<div className="card-elegance border border-neutral-200 p-8 text-center max-w-md mx-auto">
						<p className="text-elegance-body">
							Your basket is empty. Browse items here.
						</p>
					</div>
				) : (
					<div className="grid gap-12 lg:grid-cols-[2fr_1fr]">
						{/* Left: Items + Form */}
						<div className="space-y-8">
							{/* Items */}
							<div className="space-y-4">
								{items.map((i) => (
									<div
										key={i.product_id}
										className="card-elegance border-b border-neutral-200 pb-4">
										<div className="flex items-center justify-between">
											<div className="min-w-0">
												<div className="text-elegance-heading">{i.name}</div>
												<div className="text-elegance-caption">
													{i.qty} × {formatGBP(i.price_pence)}
												</div>
											</div>
											<div className="text-elegance-heading">
												{formatGBP(i.price_pence * i.qty)}
											</div>
										</div>
									</div>
								))}

								<label className="flex items-center space-x-3 cursor-pointer select-none py-4">
									<input
										type="checkbox"
										className="h-4 w-4 border border-neutral-300"
										checked={bag}
										onChange={() => {
											const next = !bag;
											setBag(next);
											try {
												localStorage.setItem(
													"bag_opt_in",
													JSON.stringify(next)
												);
											} catch {}
										}}
									/>
									<span className="text-elegance-body">
										Add a bag (+{formatGBP(BAG_PENCE)})
									</span>
								</label>
							</div>

							{/* Customer */}
							<section className="card-elegance border border-neutral-200 p-8">
								<h2 className="text-elegance-subheading mb-6">Your Details</h2>
								<div className="space-y-6">
									<div>
										<label className="label-elegance">Full Name</label>
										<input
											type="text"
											value={customer.name}
											onChange={(e) =>
												setCustomer({ ...customer, name: e.target.value })
											}
											className="input-elegance"
											placeholder={session?.user?.name || "Jane Doe"}
										/>
									</div>
									<div>
										<label className="label-elegance">Email</label>
										<input
											type="email"
											value={customer.email}
											onChange={(e) =>
												setCustomer({ ...customer, email: e.target.value })
											}
											className="input-elegance"
											placeholder={session?.user?.email || "jane@example.com"}
										/>
									</div>
								</div>
							</section>

							{/* Pickup */}
							<section className="card-elegance border border-neutral-200 p-8">
								<h2 className="text-elegance-subheading mb-6">Pickup</h2>
								<DateTimePicker
									onChange={(d, t) => {
										setDate(d);
										setTime(t);
									}}
								/>
							</section>
						</div>

						{/* Right: Summary */}
						<aside className="card-elegance border border-neutral-200 p-8 h-fit">
							<h2 className="text-elegance-subheading mb-6">Order Summary</h2>
							<div className="space-y-4 text-elegance-body">
								<div className="flex items-center justify-between">
									<span>Subtotal</span>
									<span className="text-elegance-heading">
										{formatGBP(subtotal)}
									</span>
								</div>
								<div className="flex items-center justify-between">
									<span>Bag</span>
									<span className="text-elegance-heading">
										{bag ? `+ ${formatGBP(BAG_PENCE)}` : formatGBP(0)}
									</span>
								</div>
								<div className="flex items-center justify-between">
									<span>GST (6%)</span>
									<span className="text-elegance-heading">
										{formatGBP(gst)}
									</span>
								</div>
								<div className="mt-6 flex items-center justify-between border-t border-neutral-200 pt-6">
									<span className="text-elegance-heading text-lg">Total</span>
									<span className="text-elegance-heading text-lg">
										{formatGBP(total)}
									</span>
								</div>
							</div>

							<button
								onClick={placeOrder}
								className="btn-elegance-primary w-full mt-8">
								Place Order
							</button>
						</aside>
					</div>
				)}
			</div>
		</main>
	);
}
