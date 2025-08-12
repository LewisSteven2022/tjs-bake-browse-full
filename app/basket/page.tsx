"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
	getCart,
	clearCart as clearCartApi,
	setQty as setQtyApi,
	removeItem as removeItemApi,
	type CartItem,
} from "@/lib/cart";
import { BAG_PENCE, formatGBP, calcSubtotal } from "@/lib/checkout";

export default function BasketPage() {
	const [items, setItems] = useState<CartItem[]>([]);
	const [bag, setBag] = useState(false);
	const [busyId, setBusyId] = useState<string | null>(null);
	const [flash, setFlash] = useState<
		Record<string, "inc" | "dec" | "remove" | null>
	>({});

	useEffect(() => {
		(async () => {
			await refresh();
		})();
		try {
			const savedBag = localStorage.getItem("bag_opt_in");
			setBag(savedBag ? JSON.parse(savedBag) === true : false);
		} catch {}
	}, []);

	const refresh = async () => {
		const cart = await getCart();
		setItems(Array.isArray(cart) ? cart : []);
	};

	const inc = async (id: string) => {
		const current = items.find((i) => i.product_id === id)?.qty ?? 0;
		setBusyId(id);
		setFlash((f) => ({ ...f, [id]: "inc" }));
		setTimeout(() => setFlash((f) => ({ ...f, [id]: null })), 500);
		try {
			await setQtyApi(id, current + 1);
			await refresh();
		} finally {
			setBusyId(null);
		}
	};

	const dec = async (id: string) => {
		const current = items.find((i) => i.product_id === id)?.qty ?? 0;
		const next = current - 1;
		setBusyId(id);
		setFlash((f) => ({ ...f, [id]: "dec" }));
		setTimeout(() => setFlash((f) => ({ ...f, [id]: null })), 500);
		try {
			if (next <= 0) {
				await removeItemApi(id);
			} else {
				await setQtyApi(id, next);
			}
			await refresh();
		} finally {
			setBusyId(null);
		}
	};

	const remove = async (id: string) => {
		setBusyId(id);
		setFlash((f) => ({ ...f, [id]: "remove" }));
		// Briefly show the red state before removing
		await new Promise((r) => setTimeout(r, 400));
		try {
			await removeItemApi(id);
			await refresh();
		} finally {
			setBusyId(null);
		}
	};

	const clearAll = async () => {
		setBusyId("__all__");
		try {
			await clearCartApi();
			await refresh();
		} finally {
			setBusyId(null);
		}
	};

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
							className="flex items-center rounded-2xl border p-3 bg-white">
							<div className="flex-1 min-w-0 pr-4">
								<div className="font-medium truncate leading-6">{i.name}</div>
								<div className="text-sm opacity-70">
									{formatGBP(i.price_pence)} each
								</div>
							</div>
							<div className="flex items-center gap-3">
								<div className="flex items-center gap-2">
									<button
										className={`h-9 w-9 inline-flex items-center justify-center rounded-lg border transition ${
											flash[i.product_id] === "dec"
												? "bg-red-600 text-white border-red-600"
												: "hover:bg-gray-50"
										}`}
										onClick={() => dec(i.product_id)}
										disabled={busyId === i.product_id}
										aria-label={`Decrease ${i.name}`}>
										−
									</button>
									<span className="w-9 text-center tabular-nums">{i.qty}</span>
									<button
										className={`h-9 w-9 inline-flex items-center justify-center rounded-lg border transition ${
											flash[i.product_id] === "inc"
												? "bg-green-600 text-white border-green-600"
												: "hover:bg-gray-50"
										}`}
										onClick={() => inc(i.product_id)}
										disabled={busyId === i.product_id}
										aria-label={`Increase ${i.name}`}>
										+
									</button>
								</div>
								<div className="w-24 text-right tabular-nums font-medium">
									{formatGBP(i.price_pence * i.qty)}
								</div>
								<button
									className={`h-9 inline-flex items-center justify-center rounded-lg border px-3 transition ${
										flash[i.product_id] === "remove"
											? "bg-red-600 text-white border-red-600"
											: "hover:bg-gray-50"
									}`}
									onClick={() => remove(i.product_id)}
									disabled={busyId === i.product_id}
									aria-label={`Remove ${i.name}`}>
									Remove
								</button>
							</div>
						</div>
					))}

					<label className="flex w-fit cursor-pointer select-none items-center gap-2 rounded-full border px-3 py-2 hover:bg-gray-50 bg-white">
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

					<div className="grid sm:grid-cols-2 gap-2">
						<button
							onClick={clearAll}
							className="w-full rounded-full border px-4 py-2 hover:bg-gray-50 disabled:opacity-60"
							disabled={busyId === "__all__"}>
							Clear basket
						</button>
						<Link
							href="/checkout"
							className="block w-full rounded-full bg-blue-800 px-4 py-2 text-center text-white hover:bg-blue-700">
							Checkout
						</Link>
					</div>
				</div>
			)}
		</main>
	);
}
