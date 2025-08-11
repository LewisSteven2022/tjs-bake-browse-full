"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { getCart, clearCart, type CartItem } from "@/lib/cart";
import { BAG_PENCE, formatGBP, calcSubtotal } from "@/lib/checkout";

export default function BasketPage() {
	const [items, setItems] = useState<CartItem[]>([]);
	const [bag, setBag] = useState(false);

	useEffect(() => {
		(async () => {
			const cart = await getCart();
			setItems(Array.isArray(cart) ? cart : []);
		})();
		try {
			const savedBag = localStorage.getItem("bag_opt_in");
			setBag(savedBag ? JSON.parse(savedBag) === true : false);
		} catch {}
	}, []);

	const subtotal = useMemo(() => calcSubtotal(items), [items]);
	const total = bag ? subtotal + BAG_PENCE : subtotal;

	return (
		<main className="mx-auto max-w-4xl p-6">
			<h1 className="mb-4 text-2xl font-semibold">Your basket</h1>

			{items.length === 0 ? (
				<div className="rounded-2xl border p-6 bg-white text-gray-600">
					<p>
						Your basket is empty.{" "}
						<Link href="/baked-goods" className="text-blue-600 hover:underline">
							Browse products
						</Link>
						.
					</p>
				</div>
			) : (
				<div className="space-y-4">
					{items.map((i) => (
						<div
							key={i.product_id}
							className="flex items-center justify-between rounded-2xl border p-3 bg-white">
							<div>
								<div className="font-medium">{i.name}</div>
								<div className="text-sm opacity-70">
									{i.qty} × {formatGBP(i.price_pence)}
								</div>
							</div>
							<div className="font-medium">
								{formatGBP(i.price_pence * i.qty)}
							</div>
						</div>
					))}

					<label className="flex w-fit cursor-pointer select-none items-center gap-2 rounded-xl border px-3 py-2 hover:bg-gray-50 bg-white">
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

					<div className="mt-4 flex items-center justify-between border-t pt-4">
						<span className="font-semibold">Total</span>
						<span className="font-semibold">{formatGBP(total)}</span>
					</div>

					<Link
						href="/checkout"
						className="block w-full rounded-xl bg-blue-600 px-4 py-2 text-center text-white hover:bg-blue-700">
						Checkout
					</Link>
				</div>
			)}
		</main>
	);
}
