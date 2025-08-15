"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingCart, Circle, Leaf, Sun } from "lucide-react";
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

// Scandinavian Product Card Component
function ScandinavianProductCard({ product }: { product: Product }) {
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
			transition={{ duration: 0.6 }}
			className="group">
			{/* Soft rounded container */}
			<div className="bg-white rounded-3xl shadow-sm hover:shadow-md transition-all duration-500 overflow-hidden border border-gray-50 hover:border-gray-100">
				{/* Product Image */}
				<div className="relative h-64 bg-gray-50 overflow-hidden">
					{product.image_url ? (
						<Image
							src={product.image_url}
							alt={product.name}
							fill
							className="object-cover transition-transform duration-700 group-hover:scale-102"
							sizes="(max-width: 768px) 100vw, 50vw"
						/>
					) : (
						<div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
							<div className="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center">
								<Circle className="w-8 h-8 text-gray-300" />
							</div>
						</div>
					)}

					{/* Soft overlay */}
					<div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-all duration-500" />
				</div>

				{/* Content */}
				<div className="p-8 space-y-4">
					<div className="space-y-2">
						<h3 className="text-xl font-light text-gray-800 leading-tight">
							{product.name}
						</h3>
						<p className="text-2xl font-light text-gray-600">
							£{(product.price_pence / 100).toFixed(2)}
						</p>
					</div>

					{product.pack_label && (
						<p className="text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-full inline-block">
							{product.pack_label}
						</p>
					)}

					{product.allergens && product.allergens.length > 0 && (
						<div className="flex flex-wrap gap-2">
							{product.allergens.slice(0, 3).map((allergen) => (
								<span
									key={allergen}
									className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
									{allergen}
								</span>
							))}
							{product.allergens.length > 3 && (
								<span className="text-gray-400 text-xs">
									+{product.allergens.length - 3} more
								</span>
							)}
						</div>
					)}

					<button
						onClick={addToBasket}
						disabled={isAdding || isAdded}
						className={`w-full py-4 rounded-2xl font-light text-sm transition-all duration-300 ${
							isAdding
								? "bg-gray-100 text-gray-400 cursor-not-allowed"
								: isAdded
								? "bg-green-50 text-green-600 border border-green-200"
								: "bg-gray-900 hover:bg-gray-800 text-white hover:shadow-lg"
						}`}>
						{isAdding ? (
							<span className="flex items-center justify-center gap-2">
								<div className="w-4 h-4 border border-gray-400 border-t-transparent rounded-full animate-spin"></div>
								Adding...
							</span>
						) : isAdded ? (
							<span className="flex items-center justify-center gap-2">
								<Circle className="w-4 h-4" />
								Added
							</span>
						) : (
							<span className="flex items-center justify-center gap-2">
								<ShoppingCart className="w-4 h-4" />
								Add to basket
							</span>
						)}
					</button>
				</div>
			</div>
		</motion.div>
	);
}

export default function ScandinavianMinimalPage() {
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
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<header className="bg-white/90 backdrop-blur-sm border-b border-gray-100">
				<div className="max-w-6xl mx-auto px-6 py-6">
					<div className="flex items-center justify-between">
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.6 }}>
							<h1 className="text-2xl font-light text-gray-800 tracking-wide">
								TJ's
							</h1>
							<p className="text-sm text-gray-500 font-light">artisan bakery</p>
						</motion.div>

						<nav className="flex items-center space-x-8 text-sm font-light">
							<a
								href="#"
								className="text-gray-600 hover:text-gray-800 transition-colors">
								Products
							</a>
							<a
								href="#"
								className="text-gray-600 hover:text-gray-800 transition-colors">
								About
							</a>
							<a
								href="#"
								className="text-gray-600 hover:text-gray-800 transition-colors">
								Contact
							</a>
							<button className="relative p-3 hover:bg-gray-50 rounded-full transition-colors">
								<ShoppingCart size={18} className="text-gray-600" />
							</button>
						</nav>
					</div>
				</div>
			</header>

			{/* Hero Section */}
			<section className="py-24 px-6">
				<div className="max-w-4xl mx-auto text-center">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.2 }}
						className="space-y-6">
						<h2 className="text-5xl md:text-6xl font-extralight text-gray-800 leading-tight">
							Simple
							<br />
							<span className="text-gray-500">goodness</span>
						</h2>
						<p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed font-light">
							We believe in the beauty of simplicity. Each product is carefully
							crafted with the finest ingredients, allowing natural flavours to
							shine.
						</p>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.6 }}
						className="mt-12">
						<button className="bg-gray-800 hover:bg-gray-900 text-white px-8 py-4 rounded-2xl font-light text-sm transition-all duration-300 hover:shadow-lg">
							Explore collection
						</button>
					</motion.div>
				</div>
			</section>

			{/* Values */}
			<section className="py-16 px-6 bg-white">
				<div className="max-w-5xl mx-auto">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-12">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6 }}
							className="text-center">
							<div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
								<Leaf className="w-6 h-6 text-gray-600" />
							</div>
							<h4 className="text-lg font-light text-gray-800 mb-3">Natural</h4>
							<p className="text-gray-600 text-sm leading-relaxed font-light">
								Only the purest ingredients, sourced locally and sustainably.
							</p>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.2 }}
							className="text-center">
							<div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
								<Sun className="w-6 h-6 text-gray-600" />
							</div>
							<h4 className="text-lg font-light text-gray-800 mb-3">Fresh</h4>
							<p className="text-gray-600 text-sm leading-relaxed font-light">
								Baked daily in small batches to ensure perfect quality.
							</p>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.4 }}
							className="text-center">
							<div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
								<Circle className="w-6 h-6 text-gray-600" />
							</div>
							<h4 className="text-lg font-light text-gray-800 mb-3">Simple</h4>
							<p className="text-gray-600 text-sm leading-relaxed font-light">
								Honest recipes that celebrate the essence of each ingredient.
							</p>
						</motion.div>
					</div>
				</div>
			</section>

			{/* Products Section */}
			<section className="py-24 px-6">
				<div className="max-w-6xl mx-auto">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className="text-center mb-16">
						<h2 className="text-4xl font-light text-gray-800 mb-4">
							Our selection
						</h2>
						<div className="w-12 h-px bg-gray-300 mx-auto"></div>
					</motion.div>

					{loading ? (
						<div className="text-center py-20">
							<div className="inline-block w-6 h-6 border border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
							{products.slice(0, 6).map((product) => (
								<ScandinavianProductCard key={product.id} product={product} />
							))}
						</div>
					)}

					<motion.div
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, delay: 0.3 }}
						className="text-center mt-16">
						<button className="text-gray-600 text-sm font-light border-b border-gray-300 pb-1 hover:border-gray-600 transition-colors">
							View all products
						</button>
					</motion.div>
				</div>
			</section>

			{/* Footer */}
			<footer className="bg-white py-16 px-6 border-t border-gray-100">
				<div className="max-w-5xl mx-auto text-center">
					<h3 className="text-xl font-light text-gray-800 mb-2">TJ's</h3>
					<p className="text-sm text-gray-500 font-light mb-8">
						artisan bakery
					</p>
					<div className="flex justify-center space-x-8 text-sm font-light">
						<a
							href="#"
							className="text-gray-500 hover:text-gray-800 transition-colors">
							About
						</a>
						<a
							href="#"
							className="text-gray-500 hover:text-gray-800 transition-colors">
							Contact
						</a>
						<a
							href="#"
							className="text-gray-500 hover:text-gray-800 transition-colors">
							Terms
						</a>
					</div>
					<div className="mt-8 text-xs text-gray-400 font-light">
						© 2024 TJ's Bakery
					</div>
				</div>
			</footer>
		</div>
	);
}
