"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingCart, Plus, ArrowUpRight, Check } from "lucide-react";
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

// Modern Clean Product Card Component
function ModernCleanProductCard({ product }: { product: Product }) {
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
			initial={{ opacity: 0, y: 25 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ duration: 0.5 }}
			className="group">
			{/* Clean modern container */}
			<div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-slate-100">
				{/* Product Image */}
				<div className="relative h-72 bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
					{product.image_url ? (
						<Image
							src={product.image_url}
							alt={product.name}
							fill
							className="object-cover transition-transform duration-500 group-hover:scale-105"
							sizes="(max-width: 768px) 100vw, 50vw"
						/>
					) : (
						<div className="w-full h-full flex items-center justify-center">
							<div className="w-24 h-24 rounded-xl bg-white shadow-sm flex items-center justify-center">
								<Plus className="w-8 h-8 text-slate-400" />
							</div>
						</div>
					)}

					{/* Subtle gradient overlay */}
					<div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

					{/* Floating price tag */}
					<div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-lg shadow-sm">
						<span className="text-sm font-medium text-slate-700">
							£{(product.price_pence / 100).toFixed(2)}
						</span>
					</div>
				</div>

				{/* Content */}
				<div className="p-6 space-y-4">
					<div>
						<h3 className="text-lg font-medium text-slate-800 leading-tight mb-1">
							{product.name}
						</h3>

						{product.pack_label && (
							<p className="text-sm text-slate-500 bg-slate-50 px-3 py-1 rounded-md inline-block">
								{product.pack_label}
							</p>
						)}
					</div>

					{product.allergens && product.allergens.length > 0 && (
						<div className="flex flex-wrap gap-1">
							{product.allergens.slice(0, 4).map((allergen) => (
								<span
									key={allergen}
									className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-md">
									{allergen}
								</span>
							))}
							{product.allergens.length > 4 && (
								<span className="text-slate-400 text-xs px-2 py-1">
									+{product.allergens.length - 4}
								</span>
							)}
						</div>
					)}

					<button
						onClick={addToBasket}
						disabled={isAdding || isAdded}
						className={`w-full py-3 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
							isAdding
								? "bg-slate-100 text-slate-400 cursor-not-allowed"
								: isAdded
								? "bg-emerald-50 text-emerald-600 border border-emerald-200"
								: "bg-slate-900 hover:bg-slate-800 text-white shadow-sm hover:shadow-md"
						}`}>
						{isAdding ? (
							<>
								<div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
								Adding...
							</>
						) : isAdded ? (
							<>
								<Check className="w-4 h-4" />
								Added to basket
							</>
						) : (
							<>
								<ShoppingCart className="w-4 h-4" />
								Add to basket
							</>
						)}
					</button>
				</div>
			</div>
		</motion.div>
	);
}

export default function ModernCleanPage() {
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
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
			{/* Header */}
			<header className="bg-white/80 backdrop-blur-lg border-b border-slate-200/50 sticky top-0 z-50">
				<div className="max-w-7xl mx-auto px-6 py-5">
					<div className="flex items-center justify-between">
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.6 }}>
							<h1 className="text-xl font-semibold text-slate-800">
								TJ's Bakery
							</h1>
							<p className="text-sm text-slate-500">Modern artisan baking</p>
						</motion.div>

						<nav className="flex items-center space-x-8">
							<a
								href="#"
								className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
								Home
							</a>
							<a
								href="#"
								className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
								Products
							</a>
							<a
								href="#"
								className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
								About
							</a>
							<a
								href="#"
								className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
								Contact
							</a>
							<button className="relative bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2">
								<ShoppingCart size={16} />
								<span className="text-sm font-medium">Cart</span>
							</button>
						</nav>
					</div>
				</div>
			</header>

			{/* Hero Section */}
			<section className="py-20 px-6">
				<div className="max-w-5xl mx-auto">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
						{/* Text Content */}
						<motion.div
							initial={{ opacity: 0, x: -30 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.8, delay: 0.2 }}
							className="space-y-6">
							<h2 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight">
								Modern
								<span className="block text-slate-600">baking</span>
							</h2>
							<p className="text-lg text-slate-600 leading-relaxed">
								Where traditional techniques meet contemporary design. We create
								exceptional baked goods for the modern lifestyle.
							</p>
							<div className="flex gap-4">
								<button className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md">
									Shop now
								</button>
								<button className="text-slate-600 hover:text-slate-900 px-6 py-3 font-medium transition-colors flex items-center gap-2">
									Learn more
									<ArrowUpRight className="w-4 h-4" />
								</button>
							</div>
						</motion.div>

						{/* Visual Element */}
						<motion.div
							initial={{ opacity: 0, x: 30 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.8, delay: 0.4 }}
							className="relative">
							<div className="w-full h-96 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl shadow-lg">
								<div className="absolute inset-0 bg-gradient-to-br from-slate-900/5 to-transparent rounded-2xl"></div>
								<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
									<div className="w-32 h-32 bg-white rounded-full shadow-lg flex items-center justify-center">
										<Plus className="w-12 h-12 text-slate-400" />
									</div>
								</div>
							</div>
						</motion.div>
					</div>
				</div>
			</section>

			{/* Features */}
			<section className="py-16 px-6 bg-white">
				<div className="max-w-6xl mx-auto">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6 }}
							className="text-center p-6">
							<div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mx-auto mb-4">
								<div className="w-6 h-6 bg-slate-400 rounded-full"></div>
							</div>
							<h4 className="text-lg font-medium text-slate-800 mb-2">
								Premium Quality
							</h4>
							<p className="text-slate-600 text-sm leading-relaxed">
								Only the finest ingredients selected for exceptional taste and
								quality.
							</p>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.2 }}
							className="text-center p-6">
							<div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mx-auto mb-4">
								<div className="w-6 h-6 bg-slate-400 rounded-sm"></div>
							</div>
							<h4 className="text-lg font-medium text-slate-800 mb-2">
								Fresh Daily
							</h4>
							<p className="text-slate-600 text-sm leading-relaxed">
								Baked fresh every morning using time-tested techniques and
								modern precision.
							</p>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.4 }}
							className="text-center p-6">
							<div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mx-auto mb-4">
								<div className="w-6 h-6 bg-slate-400 transform rotate-45"></div>
							</div>
							<h4 className="text-lg font-medium text-slate-800 mb-2">
								Modern Approach
							</h4>
							<p className="text-slate-600 text-sm leading-relaxed">
								Contemporary techniques and presentation for today's discerning
								customers.
							</p>
						</motion.div>
					</div>
				</div>
			</section>

			{/* Products Section */}
			<section className="py-24 px-6">
				<div className="max-w-7xl mx-auto">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className="text-center mb-16">
						<h2 className="text-3xl font-bold text-slate-900 mb-4">
							Featured products
						</h2>
						<p className="text-slate-600 max-w-2xl mx-auto">
							Discover our carefully curated selection of artisan baked goods
						</p>
					</motion.div>

					{loading ? (
						<div className="text-center py-20">
							<div className="inline-block w-8 h-8 border-2 border-slate-200 border-t-slate-600 rounded-full animate-spin"></div>
							<p className="text-slate-600 mt-4">Loading products...</p>
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
							{products.slice(0, 6).map((product) => (
								<ModernCleanProductCard key={product.id} product={product} />
							))}
						</div>
					)}

					<motion.div
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, delay: 0.3 }}
						className="text-center mt-16">
						<button className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2 mx-auto">
							View all products
							<ArrowUpRight className="w-4 h-4" />
						</button>
					</motion.div>
				</div>
			</section>

			{/* Footer */}
			<footer className="bg-slate-900 text-white py-16 px-6">
				<div className="max-w-6xl mx-auto">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<div>
							<h3 className="text-lg font-semibold mb-3">TJ's Bakery</h3>
							<p className="text-slate-400 text-sm leading-relaxed">
								Modern artisan baking for contemporary lifestyles.
							</p>
						</div>

						<div>
							<h4 className="font-medium mb-4">Quick links</h4>
							<div className="space-y-2 text-sm">
								<a
									href="#"
									className="block text-slate-400 hover:text-white transition-colors">
									Products
								</a>
								<a
									href="#"
									className="block text-slate-400 hover:text-white transition-colors">
									About
								</a>
								<a
									href="#"
									className="block text-slate-400 hover:text-white transition-colors">
									Contact
								</a>
								<a
									href="#"
									className="block text-slate-400 hover:text-white transition-colors">
									Terms
								</a>
							</div>
						</div>

						<div>
							<h4 className="font-medium mb-4">Contact</h4>
							<div className="space-y-2 text-sm text-slate-400">
								<p>123 Modern Street</p>
								<p>City, State 12345</p>
								<p>hello@tjsbakery.com</p>
							</div>
						</div>
					</div>

					<div className="border-t border-slate-700 mt-12 pt-8 text-center text-sm text-slate-400">
						© 2024 TJ's Bakery. All rights reserved.
					</div>
				</div>
			</footer>
		</div>
	);
}
