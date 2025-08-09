"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Item = {
	product_id: string;
	name: string;
	price_pence: number;
	qty: number;
};

export default function BasketPage() {
	const key = "basket_v1";
	const [items, setItems] = useState<Item[]>([]);

	useEffect(() => {
		setItems(JSON.parse(localStorage.getItem(key) || "[]"));
	}, []);
	function write(next: Item[]) {
		setItems(next);
		localStorage.setItem(key, JSON.stringify(next));
	}
	function inc(id: string) {
		write(
			items.map((i) => (i.product_id === id ? { ...i, qty: i.qty + 1 } : i))
		);
	}
	function dec(id: string) {
		write(
			items.flatMap((i) =>
				i.product_id === id
					? i.qty > 1
						? [{ ...i, qty: i.qty - 1 }]
						: []
					: [i]
			)
		);
	}
	function remove(id: string) {
		write(items.filter((i) => i.product_id !== id));
	}

	const subtotal = items.reduce((s, i) => s + i.price_pence * i.qty, 0);

	return (
		<section className="space-y-4 max-w-2xl mx-auto">
			<h1 className="text-2xl font-semibold">Your basket</h1>
			{!items.length && <p>Your basket is empty.</p>}
			{items.map((i) => (
				<div
					key={i.product_id}
					className="flex items-center justify-between border rounded-2xl p-3">
					<div>
						<div className="font-medium">{i.name}</div>
						<div className="text-sm text-gray-500">
							£{(i.price_pence / 100).toFixed(2)}
						</div>
					</div>
					<div className="flex items-center gap-2">
						<button
							className="px-2 py-1 border rounded-xl"
							onClick={() => dec(i.product_id)}>
							-
						</button>
						<span>{i.qty}</span>
						<button
							className="px-2 py-1 border rounded-xl"
							onClick={() => inc(i.product_id)}>
							+
						</button>
						<button
							className="px-2 py-1 rounded-xl bg-red-100 text-red-700"
							onClick={() => remove(i.product_id)}>
							Remove
						</button>
					</div>
				</div>
			))}
			{!!items.length && (
				<div className="flex items-center justify-between">
					<div className="text-lg font-semibold">
						Subtotal: £{(subtotal / 100).toFixed(2)}
					</div>
					<Link
						className="rounded-xl px-4 py-2 bg-blue-400 text-white"
						href="/checkout">
						Checkout
					</Link>
				</div>
			)}
			<p className="text-xs text-gray-600">
				Note: Bag surcharge (£0.70) can be added on the checkout page.
			</p>
		</section>
	);
}
