"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import NavAuth from "@/components/NavAuth";
import NavBasket from "@/components/NavBasket";

export default function ModernNavbar() {
	return (
		<div className="w-full flex items-center justify-center pt-0 pb-0.5 sm:pt-3 sm:pb-2">
			<nav className="bg-transparent shadow-sm rounded-full px-0.5 sm:px-3 py-0.5 sm:py-2 container-modern flex items-center gap-1 sm:gap-3 overflow-visible relative z-50">
				{/* Left: Brand + Nav items */}
				<div className="flex items-center gap-1 sm:gap-2 overflow-visible flex-1">
					<Link
						href="/"
						className="pl-2 pr-1 sm:px-3 py-0 sm:py-1 rounded-md md:rounded-full text-sm sm:text-base md:text-lg font-extrabold tracking-tight text-primaryDark hover:bg-surface transition-colors">
						TJ's Bake & Browse
					</Link>
					<ul className="hidden md:flex items-center gap-1">
						<li>
							<Link
								href="/about"
								className="px-2 sm:px-3 md:px-4 py-1 md:py-2 rounded-full text-xs sm:text-sm font-medium text-textPrimary hover:bg-surface focus:outline-none focus:ring-2 focus:ring-ringBrand transition-colors">
								About us
							</Link>
						</li>
						<ProductsDropdown />
					</ul>

					{/* Mobile trigger */}
					<div className="md:hidden ml-auto pr-2 mr-1">
						<MobileMenu />
					</div>
				</div>

				{/* Right: Auth actions and basket */}
				<div className="hidden md:flex items-center gap-1 sm:gap-2 shrink-0">
					<NavAuth />
					<NavBasket />
				</div>
			</nav>
		</div>
	);
}

function MobileMenu() {
	const [open, setOpen] = useState(false);
	return (
		<div className="relative">
			<button
				onClick={() => setOpen((v) => !v)}
				className="px-3 py-2 rounded-full text-sm font-semibold text-textPrimary bg-transparent hover:bg-surface transition-colors">
				Menu ▾
			</button>
			<div
				className={`${
					open ? "block" : "hidden"
				} absolute right-0 mt-2 w-56 bg-cardBg border border-surfaceAlt rounded-xl shadow-lg p-2 z-[60]`}>
				<Link
					href="/about"
					className="block px-3 py-2 rounded-full text-textPrimary hover:bg-surface transition-colors"
					onClick={() => setOpen(false)}>
					About us
				</Link>
				<div className="px-3 py-1 text-xs font-semibold text-textSecondary opacity-60">
					Products
				</div>
				<Link
					href="/baked-goods"
					className="block px-3 py-2 rounded-full text-textPrimary hover:bg-surface transition-colors"
					onClick={() => setOpen(false)}>
					Baked Goods
				</Link>
				<Link
					href="/groceries"
					className="block px-3 py-2 rounded-full text-textPrimary hover:bg-surface transition-colors"
					onClick={() => setOpen(false)}>
					Groceries
				</Link>
				<div className="my-1 border-t border-surfaceAlt" />
				<div className="p-2">
					<NavAuth />
					<div className="mt-2">
						<NavBasket />
					</div>
				</div>
			</div>
		</div>
	);
}

function ProductsDropdown() {
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLLIElement>(null);

	useEffect(() => {
		function handleDocClick(e: MouseEvent) {
			if (!ref.current) return;
			if (!ref.current.contains(e.target as Node)) setOpen(false);
		}
		function handleEsc(e: KeyboardEvent) {
			if (e.key === "Escape") setOpen(false);
		}
		document.addEventListener("mousedown", handleDocClick);
		document.addEventListener("keydown", handleEsc);
		return () => {
			document.removeEventListener("mousedown", handleDocClick);
			document.removeEventListener("keydown", handleEsc);
		};
	}, []);

	return (
		<li ref={ref} className="relative">
			<button
				type="button"
				aria-haspopup="menu"
				aria-expanded={open}
				onClick={() => setOpen((v) => !v)}
				className="px-4 py-2 rounded-full text-sm font-medium text-textPrimary hover:bg-surface focus:outline-none focus:ring-2 focus:ring-ringBrand transition-colors">
				Products
				<span className="ml-2 inline-block align-middle">▾</span>
			</button>
			<div
				className={`${
					open ? "block" : "hidden"
				} absolute left-0 top-full mt-2 w-56 bg-cardBg border border-surfaceAlt rounded-xl shadow-lg overflow-hidden z-[60]`}
				role="menu">
				<Link
					href="/baked-goods"
					className="block px-4 py-2 text-sm text-textPrimary hover:bg-surface transition-colors rounded-full"
					role="menuitem"
					onClick={() => setOpen(false)}>
					Baked Goods
				</Link>
				<Link
					href="/groceries"
					className="block px-4 py-2 text-sm text-textPrimary hover:bg-surface transition-colors rounded-full"
					role="menuitem"
					onClick={() => setOpen(false)}>
					Groceries
				</Link>
			</div>
		</li>
	);
}
