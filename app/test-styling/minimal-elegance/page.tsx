"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingCart, Star, Clock, Award } from "lucide-react";
import { addItem } from "@/lib/cart";
import AllergenIcons from "@/components/AllergenIcons";



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

// Minimal Product Card Component
function MinimalProductCard({ product }: { product: Product }) {
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
			transition={{ duration: 0.5 }}
			className="group cursor-pointer">
			{/* Product Image */}
			<div className="relative h-80 bg-neutral-50 overflow-hidden mb-6">
				{product.image_url ? (
					<Image
						src={product.image_url}
						alt={product.name}
						fill
						className="object-cover transition-transform duration-700 group-hover:scale-105"
						sizes="(max-width: 768px) 100vw, 50vw"
					/>
				) : (
					<div className="w-full h-full bg-neutral-100 flex items-center justify-center">
						<div className="w-20 h-20 rounded-full bg-neutral-200 flex items-center justify-center">
							<span className="text-neutral-400 text-2xl font-light">?</span>
						</div>
					</div>
				)}

				{/* Hover Overlay */}
				<div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />

				{/* Add to Cart Button - appears on hover */}
				<motion.button
					onClick={addToBasket}
					disabled={isAdding || isAdded}
					className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white text-black px-8 py-3 text-sm font-medium tracking-wider uppercase hover:bg-neutral-100 disabled:opacity-50"
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}>
					{isAdding ? "Adding..." : isAdded ? "Added ✓" : "Add to Cart"}
				</motion.button>
			</div>

			{/* Product Info */}
			<div className="text-center space-y-2">
				<h3 className="text-lg font-light tracking-wide text-neutral-800">
					{product.name}
				</h3>
				<p className="text-sm text-neutral-500 tracking-wider uppercase">
					£{(product.price_pence / 100).toFixed(2)}
				</p>
				{product.pack_label && (
					<p className="text-xs text-neutral-400 italic">
						{product.pack_label}
					</p>
				)}

				{/* Allergen Icons */}
				<div className="flex justify-center">
					<AllergenIcons allergens={product.allergens || []} variant="minimal" />
				</div>
			</div>
		</motion.div>
	);
}

export default function MinimalElegancePage() {
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
		<div className="min-h-screen bg-white">
			{/* Header */}
			<header className="border-b border-neutral-100">
				<div className="max-w-7xl mx-auto px-4 py-6">
					<div className="flex items-center justify-between">
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.6 }}>
							<h1 className="text-2xl font-light tracking-widest text-neutral-800">
								TJ'S BAKERY
							</h1>
							<p className="text-xs text-neutral-500 tracking-wider uppercase mt-1">
								Artisan Baked Goods
							</p>
						</motion.div>

						<nav className="flex items-center space-x-8 text-sm tracking-wider uppercase">
							<a
								href="#"
								className="text-neutral-600 hover:text-neutral-800 transition-colors">
								Products
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
							<button className="relative p-2">
								<ShoppingCart size={20} className="text-neutral-600" />
							</button>
						</nav>
					</div>
				</div>
			</header>

			{/* Hero Section */}
			<section className="py-20 px-4">
				<div className="max-w-4xl mx-auto text-center">
					<motion.h2
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.2 }}
						className="text-5xl md:text-7xl font-extralight tracking-widest text-neutral-800 mb-6">
						CRAFTED
					</motion.h2>
					<motion.h3
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.4 }}
						className="text-2xl md:text-3xl font-light tracking-wide text-neutral-600 mb-8">
						With Purpose & Passion
					</motion.h3>
					<motion.p
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.6 }}
						className="text-lg text-neutral-500 max-w-2xl mx-auto leading-relaxed">
						Every piece is thoughtfully created using the finest ingredients,
						delivering an experience that transcends the ordinary.
					</motion.p>
				</div>
			</section>

			{/* Features */}
			<section className="py-16 px-4 bg-neutral-50">
				<div className="max-w-6xl mx-auto">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6 }}
							className="text-center">
							<Award className="w-8 h-8 mx-auto mb-4 text-neutral-600" />
							<h4 className="text-lg font-light tracking-wide text-neutral-800 mb-3">
								Premium Quality
							</h4>
							<p className="text-neutral-500 text-sm leading-relaxed">
								Sourced from local farms and artisan suppliers for exceptional
								taste.
							</p>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.1 }}
							className="text-center">
							<Clock className="w-8 h-8 mx-auto mb-4 text-neutral-600" />
							<h4 className="text-lg font-light tracking-wide text-neutral-800 mb-3">
								Fresh Daily
							</h4>
							<p className="text-neutral-500 text-sm leading-relaxed">
								Baked fresh every morning using traditional techniques and care.
							</p>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.2 }}
							className="text-center">
							<Star className="w-8 h-8 mx-auto mb-4 text-neutral-600" />
							<h4 className="text-lg font-light tracking-wide text-neutral-800 mb-3">
								Artisan Craft
							</h4>
							<p className="text-neutral-500 text-sm leading-relaxed">
								Each item is hand-crafted with attention to detail and
								perfection.
							</p>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.3 }}
							className="text-center">
							<div className="w-8 h-8 mx-auto mb-4 text-neutral-600">
								<svg
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="1.5">
									<path d="M12 2v20M2 12h20M6 6l12 12M18 6L6 18" />
								</svg>
							</div>
							<h4 className="text-lg font-light tracking-wide text-neutral-800 mb-3">
								Clear Allergens
							</h4>
							<p className="text-neutral-500 text-sm leading-relaxed">
								Clean, intuitive icons clearly display all allergen information.
							</p>
						</motion.div>
					</div>
				</div>
			</section>

			{/* Products Section */}
			<section className="py-20 px-4">
				<div className="max-w-7xl mx-auto">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className="text-center mb-16">
						<h2 className="text-4xl font-light tracking-widest text-neutral-800 mb-4">
							COLLECTION
						</h2>
						<div className="w-16 h-px bg-neutral-300 mx-auto"></div>
					</motion.div>

					{loading ? (
						<div className="text-center py-20">
							<div className="inline-block w-8 h-8 border-2 border-neutral-300 border-t-neutral-600 rounded-full animate-spin"></div>
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
							{products.slice(0, 6).map((product) => (
								<MinimalProductCard key={product.id} product={product} />
							))}
						</div>
					)}

					<motion.div
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, delay: 0.3 }}
						className="text-center mt-16">
						<button className="text-neutral-600 text-sm tracking-wider uppercase border-b border-neutral-300 pb-1 hover:border-neutral-600 transition-colors">
							View All Products
						</button>
					</motion.div>
				</div>
			</section>

			{/* Allergen Guide */}
			<section className="py-16 px-4 bg-neutral-50">
				<div className="max-w-6xl mx-auto">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className="text-center mb-12">
						<h2 className="text-3xl font-light tracking-widest text-neutral-800 mb-4">
							ALLERGEN GUIDE
						</h2>
						<div className="w-16 h-px bg-neutral-300 mx-auto mb-6"></div>
						<p className="text-neutral-500 text-sm leading-relaxed max-w-2xl mx-auto">
							We use clear, simple icons to help you identify allergens at a
							glance. Hover over any icon for detailed information.
						</p>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, delay: 0.2 }}
						className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
						{[
							{ name: "Gluten", key: "gluten" },
							{ name: "Milk", key: "milk" },
							{ name: "Eggs", key: "eggs" },
							{ name: "Nuts", key: "nuts" },
							{ name: "Soya", key: "soya" },
							{ name: "Sesame", key: "sesame" },
							{ name: "Fish", key: "fish" },
						].map((allergen) => (
							<div key={allergen.key} className="text-center group">
								<div className="w-12 h-12 mx-auto mb-3 text-neutral-400 group-hover:text-neutral-600 transition-colors">
									<AllergenIcons allergens={[allergen.key]} variant="minimal" />
								</div>
								<p className="text-xs text-neutral-500 tracking-wide uppercase">
									{allergen.name}
								</p>
							</div>
						))}
					</motion.div>

					<motion.div
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, delay: 0.4 }}
						className="text-center mt-12">
						<p className="text-xs text-neutral-400 tracking-wide uppercase">
							Complete allergen information available upon request
						</p>
					</motion.div>
				</div>
			</section>

			{/* Footer */}
			<footer className="bg-neutral-900 text-white py-16 px-4">
				<div className="max-w-6xl mx-auto text-center">
					<h3 className="text-2xl font-light tracking-widest mb-4">
						TJ'S BAKERY
					</h3>
					<p className="text-neutral-400 text-sm tracking-wide uppercase mb-8">
						Artisan Baked Goods
					</p>
					<div className="flex justify-center space-x-8 text-sm tracking-wider uppercase">
						<a
							href="#"
							className="text-neutral-400 hover:text-white transition-colors">
							Terms
						</a>
						<a
							href="#"
							className="text-neutral-400 hover:text-white transition-colors">
							Privacy
						</a>
						<a
							href="#"
							className="text-neutral-400 hover:text-white transition-colors">
							Contact
						</a>
					</div>
					<div className="mt-8 text-xs text-neutral-500 tracking-wide">
						© 2024 TJ's Bakery. All rights reserved.
					</div>
				</div>
			</footer>
		</div>
	);
}
