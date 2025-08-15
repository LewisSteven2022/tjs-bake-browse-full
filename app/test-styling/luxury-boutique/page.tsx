"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
	ShoppingCart,
	Crown,
	Star,
	Gift,
	Diamond,
	Sparkles,
} from "lucide-react";
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

// Luxury Product Card Component
function LuxuryProductCard({ product }: { product: Product }) {
	const [isAdding, setIsAdding] = useState(false);
	const [isAdded, setIsAdded] = useState(false);
	const [isHovered, setIsHovered] = useState(false);

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
			setTimeout(() => setIsAdded(false), 3000);
		} catch (err) {
			console.error("Failed to add to basket:", err);
		} finally {
			setIsAdding(false);
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 50 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ duration: 0.8 }}
			onHoverStart={() => setIsHovered(true)}
			onHoverEnd={() => setIsHovered(false)}
			className="relative group">
			{/* Luxury card background with gradient border */}
			<div className="relative bg-gradient-to-br from-amber-100 via-yellow-50 to-amber-100 p-1 rounded-2xl">
				<div className="bg-white rounded-xl overflow-hidden shadow-2xl">
					{/* Premium badge */}
					<div className="absolute top-4 left-4 z-10">
						<div className="bg-gradient-to-r from-amber-400 to-yellow-500 text-white px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
							<Crown className="w-3 h-3" />
							<span className="text-xs font-bold">PREMIUM</span>
						</div>
					</div>

					{/* Product Image */}
					<div className="relative h-72 overflow-hidden bg-gradient-to-br from-amber-50 to-yellow-50">
						{product.image_url ? (
							<Image
								src={product.image_url}
								alt={product.name}
								fill
								className="object-cover transition-all duration-700 group-hover:scale-105"
								sizes="(max-width: 768px) 100vw, 50vw"
							/>
						) : (
							<div className="w-full h-full flex items-center justify-center relative">
								<div className="w-32 h-32 bg-gradient-to-br from-amber-200 to-yellow-200 rounded-full flex items-center justify-center">
									<Diamond className="w-16 h-16 text-amber-600" />
								</div>
								{/* Floating sparkles */}
								<Sparkles className="absolute top-16 right-16 w-6 h-6 text-amber-400 animate-pulse" />
								<Sparkles className="absolute bottom-20 left-12 w-4 h-4 text-yellow-500 animate-pulse delay-300" />
								<Sparkles className="absolute top-24 left-20 w-5 h-5 text-amber-500 animate-pulse delay-700" />
							</div>
						)}

						{/* Luxury overlay effect */}
						<div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

						{/* Floating rating */}
						<motion.div
							initial={{ opacity: 0, scale: 0 }}
							animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0 }}
							transition={{ duration: 0.3 }}
							className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
							<div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg flex items-center gap-1">
								{[...Array(5)].map((_, i) => (
									<Star
										key={i}
										className="w-3 h-3 fill-amber-400 text-amber-400"
									/>
								))}
								<span className="text-xs font-bold text-gray-700 ml-1">
									5.0
								</span>
							</div>
						</motion.div>
					</div>

					{/* Content */}
					<div className="p-8">
						{/* Header */}
						<div className="text-center mb-6">
							<h3 className="text-2xl font-serif text-gray-800 mb-2 leading-tight">
								{product.name}
							</h3>
							<div className="flex items-center justify-center gap-2 text-amber-600 mb-3">
								<div className="w-8 h-px bg-amber-300"></div>
								<Diamond className="w-4 h-4" />
								<div className="w-8 h-px bg-amber-300"></div>
							</div>
							<p className="text-3xl font-serif text-amber-700 font-bold">
								£{(product.price_pence / 100).toFixed(2)}
							</p>
						</div>

						{/* Description */}
						{product.pack_label && (
							<div className="text-center mb-6">
								<p className="text-sm text-gray-600 italic bg-amber-50 px-4 py-2 rounded-lg border border-amber-200">
									{product.pack_label}
								</p>
							</div>
						)}

						{/* Allergens as luxury badges */}
						{product.allergens && product.allergens.length > 0 && (
							<div className="flex flex-wrap justify-center gap-2 mb-6">
								{product.allergens.slice(0, 3).map((allergen) => (
									<span
										key={allergen}
										className="bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 text-xs px-3 py-1 rounded-full border border-amber-200 font-medium">
										{allergen}
									</span>
								))}
								{product.allergens.length > 3 && (
									<span className="text-amber-600 text-xs font-medium">
										& {product.allergens.length - 3} more
									</span>
								)}
							</div>
						)}

						{/* Add to Cart Button */}
						<button
							onClick={addToBasket}
							disabled={isAdding || isAdded}
							className={`w-full py-4 rounded-xl font-serif text-lg transition-all duration-500 relative overflow-hidden group/btn ${
								isAdding
									? "bg-amber-200 text-amber-600 cursor-not-allowed"
									: isAdded
									? "bg-green-500 text-white"
									: "bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white shadow-lg hover:shadow-2xl transform hover:scale-105"
							}`}>
							{/* Shimmer effect */}
							<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>

							<span className="relative z-10 flex items-center justify-center gap-2">
								{isAdding ? (
									<>
										<div className="w-5 h-5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
										Adding to Collection...
									</>
								) : isAdded ? (
									<>
										<Crown className="w-5 h-5" />
										Added to Your Collection
									</>
								) : (
									<>
										<ShoppingCart className="w-5 h-5" />
										Add to Collection
									</>
								)}
							</span>
						</button>

						{/* Trust badges */}
						<div className="flex justify-center items-center gap-4 mt-4 text-xs text-gray-500">
							<div className="flex items-center gap-1">
								<Gift className="w-3 h-3" />
								<span>Gift Ready</span>
							</div>
							<div className="w-px h-3 bg-gray-300"></div>
							<div className="flex items-center gap-1">
								<Star className="w-3 h-3" />
								<span>Premium Quality</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</motion.div>
	);
}

export default function LuxuryBoutiquePage() {
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
		<div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-50">
			{/* Header */}
			<header className="bg-white/80 backdrop-blur-lg border-b border-amber-200 sticky top-0 z-50">
				<div className="max-w-7xl mx-auto px-4 py-6">
					<div className="flex items-center justify-between">
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.6 }}
							className="flex items-center gap-4">
							<div className="relative">
								<div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
									<Crown className="w-8 h-8 text-white" />
								</div>
								<div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center">
									<Sparkles className="w-3 h-3 text-white" />
								</div>
							</div>
							<div>
								<h1 className="text-3xl font-serif text-gray-800 font-bold">
									TJ's Boutique
								</h1>
								<p className="text-sm text-amber-600 font-medium">
									Artisan Luxury Bakery
								</p>
							</div>
						</motion.div>

						<nav className="flex items-center space-x-8">
							<a
								href="#"
								className="text-gray-700 hover:text-amber-600 font-medium transition-colors">
								Collections
							</a>
							<a
								href="#"
								className="text-gray-700 hover:text-amber-600 font-medium transition-colors">
								Bespoke Orders
							</a>
							<a
								href="#"
								className="text-gray-700 hover:text-amber-600 font-medium transition-colors">
								Our Story
							</a>
							<a
								href="#"
								className="text-gray-700 hover:text-amber-600 font-medium transition-colors">
								Contact
							</a>
							<button className="relative bg-gradient-to-r from-amber-600 to-yellow-600 text-white px-6 py-3 rounded-xl hover:from-amber-700 hover:to-yellow-700 transition-all duration-300 shadow-lg flex items-center gap-2">
								<ShoppingCart size={18} />
								<span className="font-medium">My Collection</span>
								<span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
									2
								</span>
							</button>
						</nav>
					</div>
				</div>
			</header>

			{/* Hero Section */}
			<section className="relative py-24 px-4 overflow-hidden">
				{/* Floating decorative elements */}
				<div className="absolute inset-0 overflow-hidden">
					<Sparkles className="absolute top-20 left-20 w-8 h-8 text-amber-400 opacity-50 animate-pulse" />
					<Diamond className="absolute top-40 right-32 w-6 h-6 text-yellow-500 opacity-30 animate-bounce" />
					<Crown className="absolute bottom-32 left-1/4 w-10 h-10 text-amber-500 opacity-20" />
					<Star className="absolute top-60 right-20 w-5 h-5 text-yellow-400 opacity-40 animate-pulse delay-500" />
				</div>

				<div className="relative z-10 max-w-6xl mx-auto text-center">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.2 }}
						className="mb-8">
						<div className="flex items-center justify-center gap-4 mb-6">
							<div className="w-16 h-px bg-amber-400"></div>
							<Crown className="w-8 h-8 text-amber-600" />
							<div className="w-16 h-px bg-amber-400"></div>
						</div>
						<h2 className="text-6xl md:text-8xl font-serif text-gray-800 mb-6 leading-none">
							Exquisite
							<span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-yellow-600">
								Artistry
							</span>
						</h2>
					</motion.div>

					<motion.p
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.6 }}
						className="text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
						Where culinary mastery meets luxury craftsmanship. Each creation is
						a testament to our dedication to perfection, using only the finest
						ingredients sourced from around the world.
					</motion.p>

					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.8 }}
						className="flex flex-col sm:flex-row gap-6 justify-center">
						<button className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white px-10 py-4 rounded-xl font-serif text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3">
							<Crown className="w-5 h-5" />
							Explore Our Collection
						</button>
						<button className="border-2 border-amber-600 text-amber-700 hover:bg-amber-600 hover:text-white px-10 py-4 rounded-xl font-serif text-lg transition-all duration-300 flex items-center justify-center gap-3">
							<Gift className="w-5 h-5" />
							Bespoke Commissions
						</button>
					</motion.div>
				</div>
			</section>

			{/* Features */}
			<section className="py-20 px-4 bg-white/60 backdrop-blur-sm">
				<div className="max-w-6xl mx-auto">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className="text-center mb-16">
						<h3 className="text-4xl font-serif text-gray-800 mb-6">
							The TJ's Experience
						</h3>
						<div className="flex items-center justify-center gap-4 mb-8">
							<div className="w-12 h-px bg-amber-400"></div>
							<Diamond className="w-6 h-6 text-amber-600" />
							<div className="w-12 h-px bg-amber-400"></div>
						</div>
					</motion.div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6 }}
							className="text-center p-8 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl border border-amber-200">
							<div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
								<Crown className="w-10 h-10 text-white" />
							</div>
							<h4 className="text-xl font-serif text-gray-800 mb-4 font-bold">
								Royal Treatment
							</h4>
							<p className="text-gray-600 leading-relaxed">
								Every customer receives our white-glove service with
								personalized attention and exquisite presentation worthy of
								royalty.
							</p>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.2 }}
							className="text-center p-8 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl border border-yellow-200">
							<div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
								<Diamond className="w-10 h-10 text-white" />
							</div>
							<h4 className="text-xl font-serif text-gray-800 mb-4 font-bold">
								Rare Ingredients
							</h4>
							<p className="text-gray-600 leading-relaxed">
								Sourced from exclusive suppliers worldwide, including Madagascar
								vanilla, Belgian chocolate, and French butter.
							</p>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.4 }}
							className="text-center p-8 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl border border-amber-200">
							<div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
								<Sparkles className="w-10 h-10 text-white" />
							</div>
							<h4 className="text-xl font-serif text-gray-800 mb-4 font-bold">
								Artisan Mastery
							</h4>
							<p className="text-gray-600 leading-relaxed">
								Each piece is handcrafted by master artisans with decades of
								experience in luxury patisserie techniques.
							</p>
						</motion.div>
					</div>
				</div>
			</section>

			{/* Products Section */}
			<section className="py-24 px-4">
				<div className="max-w-7xl mx-auto">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className="text-center mb-20">
						<h2 className="text-5xl font-serif text-gray-800 mb-6">
							Luxury Collection
						</h2>
						<div className="flex items-center justify-center gap-4 mb-8">
							<div className="w-16 h-px bg-amber-400"></div>
							<Crown className="w-8 h-8 text-amber-600" />
							<div className="w-16 h-px bg-amber-400"></div>
						</div>
						<p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
							Discover our curated selection of premium confections, each one a
							masterpiece of flavor and artistry designed to create
							unforgettable moments.
						</p>
					</motion.div>

					{loading ? (
						<div className="text-center py-20">
							<div className="inline-flex items-center gap-4">
								<div className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
								<p className="text-amber-700 font-serif text-lg">
									Curating your luxury collection...
								</p>
							</div>
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
							{products.slice(0, 6).map((product) => (
								<LuxuryProductCard key={product.id} product={product} />
							))}
						</div>
					)}

					<motion.div
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, delay: 0.3 }}
						className="text-center mt-20">
						<button className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white px-12 py-4 rounded-xl font-serif text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 mx-auto">
							<Crown className="w-5 h-5" />
							View Complete Collection
							<Sparkles className="w-5 h-5" />
						</button>
					</motion.div>
				</div>
			</section>

			{/* Testimonial */}
			<section className="py-20 px-4 bg-gradient-to-r from-amber-600 to-yellow-600 text-white relative overflow-hidden">
				{/* Decorative elements */}
				<div className="absolute inset-0">
					<Crown className="absolute top-10 left-10 w-12 h-12 opacity-20" />
					<Diamond className="absolute bottom-16 right-16 w-8 h-8 opacity-30" />
					<Sparkles className="absolute top-1/2 left-20 w-6 h-6 opacity-25" />
				</div>

				<div className="relative z-10 max-w-4xl mx-auto text-center">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}>
						<Crown className="w-12 h-12 mx-auto mb-6 text-yellow-200" />
						<p className="text-3xl font-serif mb-8 italic font-light leading-relaxed">
							"TJ's Boutique has elevated our celebrations to an art form. Each
							creation is not just dessert—it's an experience that lingers in
							memory long after the last bite."
						</p>
						<div className="flex items-center justify-center gap-2 mb-6">
							{[...Array(5)].map((_, i) => (
								<Star
									key={i}
									className="w-6 h-6 fill-current text-yellow-200"
								/>
							))}
						</div>
						<h4 className="font-serif text-xl font-bold mb-2">
							Lady Catherine Pemberton
						</h4>
						<p className="text-yellow-200 font-medium">
							Renowned Food Critic & Luxury Lifestyle Expert
						</p>
					</motion.div>
				</div>
			</section>

			{/* Footer */}
			<footer className="bg-gray-900 text-white py-16 px-4">
				<div className="max-w-6xl mx-auto">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
						<div className="md:col-span-2">
							<div className="flex items-center gap-4 mb-6">
								<div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center">
									<Crown className="w-8 h-8 text-white" />
								</div>
								<div>
									<h3 className="text-2xl font-serif font-bold">
										TJ's Boutique
									</h3>
									<p className="text-sm text-gray-300 font-medium">
										Artisan Luxury Bakery
									</p>
								</div>
							</div>
							<p className="text-gray-300 leading-relaxed max-w-md mb-6">
								Creating extraordinary moments through the art of luxury
								confectionery. Each piece is a testament to our commitment to
								excellence and artistry.
							</p>
							<div className="flex items-center gap-4">
								<span className="text-sm text-gray-400">
									Follow our journey:
								</span>
								<div className="flex gap-3">
									<div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center">
										<span className="text-xs font-bold">IG</span>
									</div>
									<div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center">
										<span className="text-xs font-bold">FB</span>
									</div>
								</div>
							</div>
						</div>

						<div>
							<h4 className="font-serif font-bold mb-6 text-lg">Collections</h4>
							<div className="space-y-3">
								<a
									href="#"
									className="block text-gray-300 hover:text-amber-400 transition-colors">
									Signature Cakes
								</a>
								<a
									href="#"
									className="block text-gray-300 hover:text-amber-400 transition-colors">
									Artisan Pastries
								</a>
								<a
									href="#"
									className="block text-gray-300 hover:text-amber-400 transition-colors">
									Luxury Chocolates
								</a>
								<a
									href="#"
									className="block text-gray-300 hover:text-amber-400 transition-colors">
									Bespoke Orders
								</a>
							</div>
						</div>

						<div>
							<h4 className="font-serif font-bold mb-6 text-lg">Experience</h4>
							<div className="space-y-3">
								<a
									href="#"
									className="block text-gray-300 hover:text-amber-400 transition-colors">
									Private Tastings
								</a>
								<a
									href="#"
									className="block text-gray-300 hover:text-amber-400 transition-colors">
									Catering Services
								</a>
								<a
									href="#"
									className="block text-gray-300 hover:text-amber-400 transition-colors">
									Gift Collections
								</a>
								<a
									href="#"
									className="block text-gray-300 hover:text-amber-400 transition-colors">
									Contact Us
								</a>
							</div>
						</div>
					</div>

					<div className="border-t border-gray-700 mt-12 pt-8 text-center">
						<p className="text-gray-400 font-medium">
							© 2024 TJ's Boutique Bakery. All rights reserved. |
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-500 font-serif">
								Luxury Redefined
							</span>
						</p>
					</div>
				</div>
			</footer>
		</div>
	);
}
