"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
	getCart,
	updateQty,
	removeItem,
	clearCart,
	type CartItem,
} from "@/lib/cart";
import { formatGBP, BAG_PENCE } from "@/lib/checkout";
import { toast } from "react-hot-toast";

export default function BasketPage() {
	const [items, setItems] = useState<CartItem[]>([]);
	const [bag, setBag] = useState<boolean>(false);

	// Initial load
	useEffect(() => {
		setItems(getCart());
		try {
			const saved = localStorage.getItem("bag_opt_in");
			setBag(saved ? JSON.parse(saved) === true : false);
		} catch {}
	}, []);

	// React to changes from other tabs or adds from other pages
	useEffect(() => {
		const onStorage = (e: StorageEvent) => {
			if (e.key === "basket_v1" || e.key === "bag_opt_in") {
				setItems(getCart());
				try {
					const saved = localStorage.getItem("bag_opt_in");
					setBag(saved ? JSON.parse(saved) === true : false);
				} catch {}
			}
		};
		const onVis = () => {
			if (!document.hidden) {
				setItems(getCart());
				try {
					const saved = localStorage.getItem("bag_opt_in");
					setBag(saved ? JSON.parse(saved) === true : false);
				} catch {}
			}
		};
		window.addEventListener("storage", onStorage);
		document.addEventListener("visibilitychange", onVis);
		return () => {
			window.removeEventListener("storage", onStorage);
			document.removeEventListener("visibilitychange", onVis);
		};
	}, []);

	const subtotal = useMemo(
		() => items.reduce((s, i) => s + i.price_pence * i.qty, 0),
		[items]
	);
	const total = bag ? subtotal + BAG_PENCE : subtotal;

	const onQtyChange = (id: string, next: number) => {
		const clamped = Math.max(1, Number(next) || 1);
		updateQty(id, clamped);
		setItems(getCart());
	};

	const onRemove = (id: string) => {
		const found = items.find((i) => i.product_id === id);
		removeItem(id);
		setItems(getCart());
		if (found) toast.success(`${found.name} removed`);
	};

	const onClear = () => {
		clearCart();
		setItems([]);
		toast.success("Basket cleared");
	};

	const onToggleBag = () => {
		const next = !bag;
		setBag(next);
		try {
			localStorage.setItem("bag_opt_in", JSON.stringify(next));
		} catch {}
	};

	return (
		<main className="mx-auto max-w-5xl p-4">
			<h1 className="mb-4 text-2xl font-semibold">Your basket</h1>

			{items.length === 0 ? (
				<div className="rounded-2xl border p-6 text-gray-600">
					<p>Your basket is empty.</p>
					<div className="mt-4 flex gap-3">
						<Link
							href="/baked-goods"
							className="rounded-xl border px-4 py-2 hover:bg-gray-50">
							Browse Baked Goods
						</Link>
						<Link
							href="/groceries"
							className="rounded-xl border px-4 py-2 hover:bg-gray-50">
							Browse Groceries
						</Link>
					</div>
				</div>
			) : (
				<div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
					{/* Items */}
					<div className="space-y-3">
						{items.map((i) => (
							<div
								key={i.product_id}
								className="flex items-center justify-between rounded-2xl border p-3">
								<div className="min-w-0">
									<div className="truncate font-medium">{i.name}</div>
									<div className="text-sm opacity-70">
										{formatGBP(i.price_pence)} each
									</div>
								</div>

								<div className="flex items-center gap-2">
									<label
										className="text-sm opacity-70"
										htmlFor={`qty-${i.product_id}`}>
										Qty
									</label>
									<input
										id={`qty-${i.product_id}`}
										type="number"
										min={1}
										value={i.qty}
										onChange={(e) =>
											onQtyChange(i.product_id, Number(e.target.value))
										}
										className="w-20 rounded border px-2 py-1"
									/>
									<button
										className="rounded-xl border px-3 py-1 hover:bg-gray-50"
										onClick={() => onRemove(i.product_id)}>
										Remove
									</button>
								</div>
							</div>
						))}

						<button
							onClick={onClear}
							className="rounded-xl border px-4 py-2 hover:bg-gray-50">
							Clear basket
						</button>
					</div>

					{/* Summary */}
					<aside className="rounded-2xl border p-4">
						<h2 className="mb-3 text-lg font-semibold">Order summary</h2>

						<div className="space-y-2 text-sm">
							<div className="flex items-center justify-between">
								<span>Subtotal</span>
								<span className="font-medium">{formatGBP(subtotal)}</span>
							</div>

							<div className="flex items-center justify-between">
								<label className="flex items-center gap-2">
									<input
										type="checkbox"
										checked={bag}
										onChange={onToggleBag}
										className="h-4 w-4"
									/>
									Add a bag (+{formatGBP(BAG_PENCE)})
								</label>
								<span className="font-medium">
									{bag ? `+ ${formatGBP(BAG_PENCE)}` : formatGBP(0)}
								</span>
							</div>

							<div className="flex items-center justify-between">
								<span>GST (6%)</span>
								<span className="font-medium">
									{formatGBP(
										Math.round((subtotal + (bag ? BAG_PENCE : 0)) * 0.06)
									)}
								</span>
							</div>

							<div className="mt-3 flex items-center justify-between border-t pt-3 text-base">
								<span className="font-semibold">Total</span>
								<span className="font-semibold">{formatGBP(total)}</span>
							</div>
						</div>

						<div className="mt-4 space-y-2">
							<Link
								href="/checkout"
								className={`block w-full rounded-xl px-4 py-2 text-center text-white ${
									items.length === 0
										? "bg-blue-300 cursor-not-allowed"
										: "bg-blue-600 hover:bg-blue-700"
								}`}
								aria-disabled={items.length === 0}>
								Proceed to checkout
							</Link>
							<Link
								href="/baked-goods"
								className="block w-full rounded-xl border px-4 py-2 text-center hover:bg-gray-50">
								Continue shopping
							</Link>
						</div>
					</aside>
				</div>
			)}
		</main>
	);
}
