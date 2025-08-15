"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingCart, Minus } from "lucide-react";
import { addItem } from "@/lib/cart";

interface Product {
	id: string;
	name: string;
	price_pence: number;
	image_url?: string;
	pack_label?: string;
	allergens?: string[];
	short_description?: string;
	categories?: any[];
}

function SophisticatedProductCard({ product }: { product: Product }) {
	const [isAdding, setIsAdding] = useState(false);
	const [isAdded, setIsAdded] = useState(false);

	const addToBasket = async () => {
		if (isAdding) return;
		setIsAdding(true);

		try {
			await addItem({
				product_id: product.id,
				name: product.name,
				price_pence: product.price_pence,
				qty: 1,
			});
			setIsAdded(true);
			setTimeout(() => setIsAdded(false), 2000);
		} catch (err) {
			console.error("Failed to add to basket:", err);
		} finally {
			setIsAdding(false);
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ duration: 0.7 }}
			className="group">
			<div className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all duration-500 overflow-hidden">
				<div className="relative h-80 bg-zinc-800 overflow-hidden">
					{product.image_url ? (
						<Image
							src={product.image_url}
							alt={product.name}
							fill
							className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
							sizes="(max-width: 768px) 100vw, 50vw"
						/>
					) : (
						<div className="w-full h-full flex items-center justify-center">
							<Minus className="w-8 h-8 text-zinc-500" />
						</div>
					)}
					<div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-500" />
				</div>

				<div className="p-8 space-y-6">
					<div className="border-b border-zinc-800 pb-4">
						<h3 className="text-xl font-light text-white tracking-wide leading-tight">
							{product.name.toUpperCase()}
						</h3>
						<p className="text-2xl font-light text-zinc-400 mt-2">
							£{(product.price_pence / 100).toFixed(2)}
						</p>
					</div>

					{product.pack_label && (
						<p className="text-sm text-zinc-500 uppercase tracking-widest border border-zinc-700 px-4 py-2 inline-block">
							{product.pack_label}
						</p>
					)}

					{product.allergens && product.allergens.length > 0 && (
						<div className="space-y-2">
							<p className="text-xs text-zinc-600 uppercase tracking-widest">
								Contains:
							</p>
							<div className="flex flex-wrap gap-1">
								{product.allergens.slice(0, 3).map((allergen) => (
									<span
										key={allergen}
										className="text-xs text-zinc-400 uppercase tracking-wide">
										{allergen}
									</span>
								))}
								{product.allergens.length > 3 && (
									<span className="text-xs text-zinc-500">
										+{product.allergens.length - 3}
									</span>
								)}
							</div>
						</div>
					)}

					<button
						onClick={addToBasket}
						disabled={isAdding || isAdded}
						className={`w-full py-4 font-light text-sm uppercase tracking-widest transition-all duration-300 border ${
							isAdding
								? "bg-zinc-800 text-zinc-600 border-zinc-800 cursor-not-allowed"
								: isAdded
								? "bg-zinc-700 text-zinc-300 border-zinc-700"
								: "bg-transparent hover:bg-white text-white hover:text-black border-white"
						}`}>
						{isAdding ? "Adding..." : isAdded ? "Added" : "Add to Collection"}
					</button>
				</div>
			</div>
		</motion.div>
	);
}

export default function SophisticatedMonoPage() {
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetch("/api/products")
			.then((res) => res.json())
			.then((data) => {
				setProducts(data.products || []);
				setLoading(false);
			})
			.catch((err) => {
				console.error("Failed to fetch products:", err);
				setLoading(false);
			});
	}, []);

	return (
		<div className="min-h-screen bg-black">
			<header className="border-b border-zinc-800 bg-black/95 backdrop-blur-sm sticky top-0 z-50">
				<div className="max-w-7xl mx-auto px-6 py-6">
					<div className="flex items-center justify-between">
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.6 }}>
							<h1 className="text-2xl font-light text-white tracking-[0.2em]">
								TJ'S
							</h1>
							<div className="w-8 h-px bg-white mt-1"></div>
						</motion.div>

						<nav className="flex items-center space-x-12 text-sm font-light uppercase tracking-widest">
							<a
								href="#"
								className="text-zinc-400 hover:text-white transition-colors">
								Collection
							</a>
							<a
								href="#"
								className="text-zinc-400 hover:text-white transition-colors">
								About
							</a>
							<a
								href="#"
								className="text-zinc-400 hover:text-white transition-colors">
								Contact
							</a>
							<button className="border border-zinc-700 text-white px-6 py-2 hover:bg-white hover:text-black transition-all duration-300">
								<ShoppingCart size={14} className="inline mr-2" />
								Cart
							</button>
						</nav>
					</div>
				</div>
			</header>

			<section className="py-32 px-6">
				<div className="max-w-4xl mx-auto text-center">
					<motion.h2
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.2 }}
						className="text-6xl md:text-8xl font-thin text-white leading-none tracking-[0.1em] mb-8">
						ARTISAN
						<br />
						<span className="text-zinc-600">CRAFT</span>
					</motion.h2>
					<motion.p
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.6 }}
						className="text-lg text-zinc-400 font-light leading-relaxed max-w-2xl mx-auto">
						Where sophistication meets substance. Each creation embodies our
						commitment to uncompromising quality and refined taste.
					</motion.p>
				</div>
			</section>

			<section className="py-24 px-6">
				<div className="max-w-7xl mx-auto">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className="text-center mb-20">
						<h2 className="text-3xl font-light text-white tracking-[0.1em] mb-4">
							COLLECTION
						</h2>
						<div className="w-16 h-px bg-zinc-700 mx-auto"></div>
					</motion.div>

					{loading ? (
						<div className="text-center py-20">
							<div className="inline-block w-6 h-6 border border-zinc-700 border-t-white rounded-full animate-spin"></div>
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
							{products.slice(0, 6).map((product) => (
								<SophisticatedProductCard key={product.id} product={product} />
							))}
						</div>
					)}
				</div>
			</section>

			<footer className="border-t border-zinc-800 py-16 px-6">
				<div className="max-w-6xl mx-auto text-center">
					<h3 className="text-xl font-light text-white tracking-[0.2em] mb-2">
						TJ'S
					</h3>
					<div className="w-8 h-px bg-zinc-700 mx-auto mb-8"></div>
					<div className="flex justify-center space-x-12 text-sm font-light uppercase tracking-widest">
						<a
							href="#"
							className="text-zinc-600 hover:text-zinc-400 transition-colors">
							About
						</a>
						<a
							href="#"
							className="text-zinc-600 hover:text-zinc-400 transition-colors">
							Contact
						</a>
						<a
							href="#"
							className="text-zinc-600 hover:text-zinc-400 transition-colors">
							Terms
						</a>
					</div>
					<div className="mt-12 text-xs text-zinc-700 font-light uppercase tracking-widest">
						© 2024 TJ'S Bakery
					</div>
				</div>
			</footer>
		</div>
	);
}
