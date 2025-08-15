"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import NavAuth from "@/components/NavAuth";
import NavBasket from "@/components/NavBasket";

export default function ModernNavbar() {
	return (
		<nav className="nav-elegance sticky top-0 z-50">
			<div className="container-elegance">
				<div className="flex items-center justify-between h-16">
					{/* Left: Brand + Nav items */}
					<div className="flex items-center space-x-8">
						<Link
							href="/"
							className="text-xl font-light tracking-wide text-neutral-900 hover:text-neutral-700 transition-colors duration-300">
							TJ's Bake & Browse
						</Link>
						<ul className="hidden md:flex items-center space-x-8">
							<li>
								<Link href="/about" className="nav-elegance-link">
									About
								</Link>
							</li>
							<ProductsDropdown />
						</ul>

						{/* Mobile trigger */}
						<div className="md:hidden ml-auto">
							<MobileMenu />
						</div>
					</div>

					{/* Right: Auth actions and basket */}
					<div className="hidden md:flex items-center space-x-4">
						<NavAuth />
						<NavBasket />
					</div>
				</div>
			</div>
		</nav>
	);
}

function MobileMenu() {
	const [open, setOpen] = useState(false);
	return (
		<div className="relative">
			<button
				onClick={() => setOpen((v) => !v)}
				className="nav-elegance-button text-sm">
				Menu
			</button>
			<div
				className={`${
					open ? "block" : "hidden"
				} absolute right-0 mt-2 w-56 bg-white border border-neutral-200 shadow-lg p-4 z-[60]`}>
				<Link
					href="/about"
					className="block py-2 nav-elegance-link"
					onClick={() => setOpen(false)}>
					About
				</Link>
				<div className="py-1 text-elegance-caption">Products</div>
				<Link
					href="/baked-goods"
					className="block py-2 nav-elegance-link"
					onClick={() => setOpen(false)}>
					Baked Goods
				</Link>
				<Link
					href="/groceries"
					className="block py-2 nav-elegance-link"
					onClick={() => setOpen(false)}>
					Groceries
				</Link>
				<div className="my-3 border-t border-neutral-200" />
				<div className="space-y-2">
					<NavAuth />
					<NavBasket />
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
				className="nav-elegance-link">
				Products
			</button>
			<div
				className={`${
					open ? "block" : "hidden"
				} absolute left-0 top-full mt-2 w-48 bg-white border border-neutral-200 shadow-lg overflow-hidden z-[60]`}
				role="menu">
				<Link
					href="/baked-goods"
					className="block px-4 py-3 nav-elegance-link"
					role="menuitem"
					onClick={() => setOpen(false)}>
					Baked Goods
				</Link>
				<Link
					href="/groceries"
					className="block px-4 py-3 nav-elegance-link"
					role="menuitem"
					onClick={() => setOpen(false)}>
					Groceries
				</Link>
			</div>
		</li>
	);
}
