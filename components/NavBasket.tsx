"use client";
import Link from "next/link";
import { useCart } from "./CartContext";

export default function NavBasket() {
	const { itemCount, loading } = useCart();

	return (
		<Link
			href="/basket"
			aria-label={`Basket with ${itemCount} item${itemCount === 1 ? "" : "s"}`}
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
				{!loading && (
                    <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] rounded-full bg-primary px-1 text-[10px] leading-[18px] text-center text-white">
						{Math.max(0, itemCount)}
					</span>
				)}
			</span>
			<span className="hidden sm:inline">Basket</span>
		</Link>
	);
}
