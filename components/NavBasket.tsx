"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

type CartItem = { product_id: string; qty: number };

async function fetchCount(): Promise<number> {
	try {
		const res = await fetch("/api/cart", { cache: "no-store" });
		if (!res.ok) return 0;
		const j = await res.json();
		const items: CartItem[] = Array.isArray(j.items) ? j.items : [];
		return items.reduce((s, i) => s + (Number(i.qty) || 0), 0);
	} catch {
		return 0;
	}
}

export default function NavBasket() {
	const [count, setCount] = useState(0);

	useEffect(() => {
		let mounted = true;
		const update = async () => {
			const c = await fetchCount();
			if (mounted) setCount(c);
		};
		update();
		const handler = async () => {
			// Always re-fetch to avoid any drift and ensure exact count
			await update();
		};
		window.addEventListener("cart:changed", handler as any);
		return () => {
			mounted = false;
			window.removeEventListener("cart:changed", handler as any);
		};
	}, []);

	return (
		<Link
			href="/basket"
			aria-label={`Basket with ${count} item${count === 1 ? "" : "s"}`}
			className="relative inline-flex items-center gap-2">
			<span className="relative inline-flex">
				<svg
					className="h-5 w-5"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.8"
					strokeLinecap="round"
					strokeLinejoin="round"
					aria-hidden="true">
					<path d="M6 7l-2 4v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V11l-2-4H6z" />
					<path d="M9 11V7a3 3 0 0 1 6 0v4" />
				</svg>
				<span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] rounded-full bg-blue-600 px-1 text-[10px] leading-[18px] text-center text-white">
					{Math.max(0, count)}
				</span>
			</span>
			<span className="hidden sm:inline">Basket</span>
		</Link>
	);
}
