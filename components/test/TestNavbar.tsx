"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function TestNavbar() {
	return (
		<div className="w-full flex items-center justify-center pt-0 pb-0.5 sm:pt-3 sm:pb-2">
			<nav className="bg-transparent shadow-sm rounded-full px-0.5 sm:px-3 py-0.5 sm:py-2 w-[min(1100px,95%)] flex items-center gap-1 sm:gap-3 overflow-visible relative z-50">
				{/* Left: Brand + Nav items */}
				<div className="flex items-center gap-1 sm:gap-2 overflow-visible flex-1">
					<Link
						href="/"
						className="pl-2 pr-1 sm:px-3 py-0 sm:py-1 rounded-md md:rounded-full text-sm sm:text-base md:text-lg font-extrabold tracking-tight text-[#1E40AF] hover:bg-[#F0F3FA]">
						TJ's Bake &amp; Browse
					</Link>
					<ul className="hidden md:flex items-center gap-1">
						<li>
							<Link
								href="/about"
								className="px-2 sm:px-3 md:px-4 py-1 md:py-2 rounded-md md:rounded-full text-xs sm:text-sm font-medium text-[#395B86] hover:bg-[#F0F3FA] focus:outline-none focus:ring-2 focus:ring-[#B1C9EF]">
								About us
							</Link>
						</li>
						<ProductsDropdown />
						<li>
							<Link
								href="/contact-us"
								className="px-2 sm:px-3 md:px-4 py-1 md:py-2 rounded-md md:rounded-full text-xs sm:text-sm font-medium text-[#395B86] hover:bg-[#F0F3FA] focus:outline-none focus:ring-2 focus:ring-[#B1C9EF]">
								Contact Us
							</Link>
						</li>
					</ul>

					{/* Mobile trigger */}
					<div className="md:hidden ml-auto pr-2 mr-1">
						<MobileMenu />
					</div>
				</div>

				{/* Right: Auth actions and basket */}
				<div className="hidden md:flex items-center gap-1 sm:gap-2 shrink-0">
					<Link
						href="/login"
						className="px-3 sm:px-4 py-2 rounded-md md:rounded-full text-sm font-semibold text-[#395B86] bg-white hover:bg-[#F0F3FA] border border-[#D5DEEF]">
						Sign In
					</Link>
					<Link
						href="/basket"
						className="px-3 sm:px-4 py-2 rounded-md md:rounded-full text-sm font-semibold text-white bg-gradient-to-r from-[#638ECB] to-[#395B86] shadow hover:from-[#8AAEE0] hover:to-[#395B86]">
						Basket
					</Link>
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
				className="px-3 py-2 rounded-md text-sm font-semibold text-[#395B86] bg-transparent hover:bg-transparent">
				Menu ▾
			</button>
			<div
				className={`${
					open ? "block" : "hidden"
				} absolute right-0 mt-2 w-56 bg-white border border-[#D5DEEF] rounded-xl shadow-lg p-2 z-[60]`}>
				<Link
					href="/about"
					className="block px-3 py-2 rounded-lg text-[#395B86] hover:bg-[#F0F3FA]">
					About us
				</Link>
				<div className="px-3 py-1 text-xs font-semibold text-[#395B86] opacity-60">
					Products
				</div>
				<Link
					href="/baked-goods"
					className="block px-3 py-2 rounded-lg text-[#395B86] hover:bg-[#F0F3FA]">
					Baked Goods
				</Link>
				<Link
					href="/groceries"
					className="block px-3 py-2 rounded-lg text-[#395B86] hover:bg-[#F0F3FA]">
					Groceries
				</Link>
				<Link
					href="/contact-us"
					className="block px-3 py-2 rounded-lg text-[#395B86] hover:bg-[#F0F3FA]">
					Contact Us
				</Link>
				<div className="my-1 border-t border-[#D5DEEF]" />
				<Link
					href="/login"
					className="block px-3 py-2 rounded-lg text-[#395B86] hover:bg-[#F0F3FA]">
					Sign In
				</Link>
				<Link
					href="/basket"
					className="block px-3 py-2 rounded-lg text-white bg-[#638ECB] hover:bg-[#395B86]">
					Basket
				</Link>
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
				className="px-4 py-2 rounded-full text-sm font-medium text-[#395B86] hover:bg-[#F0F3FA] focus:outline-none focus:ring-2 focus:ring-[#B1C9EF]">
				Products
				<span className="ml-2 inline-block align-middle">▾</span>
			</button>
			<div
				className={`${
					open ? "block" : "hidden"
				} absolute left-0 top-full mt-2 w-56 bg-white border border-[#D5DEEF] rounded-xl shadow-lg overflow-hidden z-[60]`}
				role="menu">
				<Link
					href="/baked-goods"
					className="block px-4 py-2 text-sm text-[#395B86] hover:bg-[#F0F3FA]"
					role="menuitem"
					onClick={() => setOpen(false)}>
					Baked Goods
				</Link>
				<Link
					href="/groceries"
					className="block px-4 py-2 text-sm text-[#395B86] hover:bg-[#F0F3FA]"
					role="menuitem"
					onClick={() => setOpen(false)}>
					Groceries
				</Link>
			</div>
		</li>
	);
}
