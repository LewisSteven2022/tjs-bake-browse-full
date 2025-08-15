"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingCart, Dot } from "lucide-react";
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

function RefinedProductCard({ product }: { product: Product }) {
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
			initial={{ opacity: 0, y: 15 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ duration: 0.5 }}
			className="group">
			<div className="bg-white border border-neutral-100 hover:border-neutral-200 transition-all duration-400 overflow-hidden shadow-sm hover:shadow-lg">
				<div className="relative h-80 bg-neutral-50 overflow-hidden">
					{product.image_url ? (
						<Image
							src={product.image_url}
							alt={product.name}
							fill
							className="object-cover transition-transform duration-600 group-hover:scale-102"
							sizes="(max-width: 768px) 100vw, 50vw"
						/>
					) : (
						<div className="w-full h-full bg-neutral-100 flex items-center justify-center">
							<Dot className="w-16 h-16 text-neutral-300" />
						</div>
					)}

					<div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-400" />
				</div>

				<div className="p-8 space-y-5">
					<div className="space-y-3">
						<h3 className="text-xl font-light text-neutral-800 tracking-wide leading-snug">
							{product.name}
						</h3>
						<p className="text-2xl font-light text-neutral-600 tracking-wide">
							£{(product.price_pence / 100).toFixed(2)}
						</p>
					</div>

					{product.pack_label && (
						<p className="text-sm text-neutral-500 bg-neutral-50 px-4 py-2 inline-block tracking-wide">
							{product.pack_label}
						</p>
					)}

					{product.allergens && product.allergens.length > 0 && (
						<div className="space-y-2">
							<div className="flex flex-wrap gap-2">
								{product.allergens.slice(0, 3).map((allergen) => (
									<span
										key={allergen}
										className="bg-neutral-100 text-neutral-600 text-xs px-3 py-1 tracking-wide">
										{allergen}
									</span>
								))}
								{product.allergens.length > 3 && (
									<span className="text-neutral-400 text-xs tracking-wide">
										+{product.allergens.length - 3} more
									</span>
								)}
							</div>
						</div>
					)}

					<button
						onClick={addToBasket}
						disabled={isAdding || isAdded}
						className={`w-full py-4 font-light text-sm tracking-widest uppercase transition-all duration-300 ${
							isAdding
								? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
								: isAdded
								? "bg-green-50 text-green-600"
								: "bg-transparent hover:bg-neutral-900 text-neutral-900 hover:text-white border border-neutral-900"
						}`}>
						{isAdding ? "Adding..." : isAdded ? "Added" : "Add to Cart"}
					</button>
				</div>
			</div>
		</motion.div>
	);
}

export default function RefinedMinimalPage() {
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
		<div className="min-h-screen bg-neutral-50">
			<header className="bg-white/95 backdrop-blur-sm border-b border-neutral-200 sticky top-0 z-50">
				<div className="max-w-6xl mx-auto px-8 py-8">
					<div className="flex items-center justify-between">
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.6 }}>
							<h1 className="text-2xl font-extralight text-neutral-800 tracking-[0.15em]">
								TJ'S
							</h1>
							<div className="w-12 h-px bg-neutral-400 mt-2"></div>
						</motion.div>

						<nav className="flex items-center space-x-12 text-sm font-light tracking-widest uppercase">
							<a
								href="#"
								className="text-neutral-600 hover:text-neutral-800 transition-colors">
								Products
							</a>
							<a
								href="#"
								className="text-neutral-600 hover:text-neutral-800 transition-colors">
								Craft
							</a>
							<a
								href="#"
								className="text-neutral-600 hover:text-neutral-800 transition-colors">
								About
							</a>
							<a
								href="#"
								className="text-neutral-600 hover:text-neutral-800 transition-colors">
								Contact
							</a>
							<button className="border border-neutral-800 text-neutral-800 px-6 py-2 hover:bg-neutral-800 hover:text-white transition-all duration-300">
								<ShoppingCart size={14} className="inline mr-2" />
								Cart
							</button>
						</nav>
					</div>
				</div>
			</header>

			<section className="py-32 px-8">
				<div className="max-w-4xl mx-auto text-center">
					<motion.h2
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.2 }}
						className="text-6xl md:text-7xl font-extralight text-neutral-800 leading-none tracking-[0.05em] mb-12">
						REFINED
						<br />
						<span className="text-neutral-500">SIMPLICITY</span>
					</motion.h2>
					<motion.p
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.6 }}
						className="text-lg text-neutral-600 font-light leading-relaxed max-w-2xl mx-auto tracking-wide">
						Where less becomes more. Each creation represents the essence of its
						ingredients, distilled to pure, refined perfection.
					</motion.p>
				</div>
			</section>

			<section className="py-20 px-8 bg-white">
				<div className="max-w-5xl mx-auto">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6 }}>
							<div className="w-2 h-2 bg-neutral-400 mx-auto mb-8"></div>
							<h4 className="text-lg font-light text-neutral-800 tracking-wide mb-4">
								Essential
							</h4>
							<p className="text-neutral-600 text-sm font-light leading-relaxed tracking-wide">
								Only what is necessary, nothing more, creating pure essence.
							</p>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.2 }}>
							<div className="w-2 h-2 bg-neutral-400 mx-auto mb-8"></div>
							<h4 className="text-lg font-light text-neutral-800 tracking-wide mb-4">
								Precise
							</h4>
							<p className="text-neutral-600 text-sm font-light leading-relaxed tracking-wide">
								Every element carefully considered, each detail thoughtfully
								placed.
							</p>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.4 }}>
							<div className="w-2 h-2 bg-neutral-400 mx-auto mb-8"></div>
							<h4 className="text-lg font-light text-neutral-800 tracking-wide mb-4">
								Refined
							</h4>
							<p className="text-neutral-600 text-sm font-light leading-relaxed tracking-wide">
								Sophisticated simplicity that speaks through understated
								elegance.
							</p>
						</motion.div>
					</div>
				</div>
			</section>

			<section className="py-32 px-8">
				<div className="max-w-7xl mx-auto">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className="text-center mb-20">
						<h2 className="text-3xl font-light text-neutral-800 tracking-[0.1em] mb-6">
							COLLECTION
						</h2>
						<div className="w-20 h-px bg-neutral-400 mx-auto"></div>
					</motion.div>

					{loading ? (
						<div className="text-center py-24">
							<div className="inline-block w-6 h-6 border border-neutral-300 border-t-neutral-600 animate-spin"></div>
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
							{products.slice(0, 6).map((product) => (
								<RefinedProductCard key={product.id} product={product} />
							))}
						</div>
					)}

					<motion.div
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, delay: 0.3 }}
						className="text-center mt-20">
						<button className="text-neutral-600 text-sm font-light tracking-widest uppercase border-b border-neutral-300 pb-1 hover:border-neutral-600 transition-colors">
							View complete collection
						</button>
					</motion.div>
				</div>
			</section>

			<footer className="bg-neutral-900 text-white py-20 px-8">
				<div className="max-w-5xl mx-auto text-center">
					<h3 className="text-xl font-extralight tracking-[0.15em] mb-3">
						TJ'S
					</h3>
					<div className="w-12 h-px bg-neutral-600 mx-auto mb-12"></div>
					<div className="flex justify-center space-x-12 text-sm font-light tracking-widest uppercase">
						<a
							href="#"
							className="text-neutral-500 hover:text-neutral-300 transition-colors">
							About
						</a>
						<a
							href="#"
							className="text-neutral-500 hover:text-neutral-300 transition-colors">
							Contact
						</a>
						<a
							href="#"
							className="text-neutral-500 hover:text-neutral-300 transition-colors">
							Terms
						</a>
					</div>
					<div className="mt-12 text-xs text-neutral-600 font-light tracking-widest uppercase">
						© 2024 TJ'S
					</div>
				</div>
			</footer>
		</div>
	);
}
