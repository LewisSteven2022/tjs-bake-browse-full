"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingCart, Heart, Coffee, Wheat, Users } from "lucide-react";
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

// Warm Product Card Component
function WarmProductCard({ product }: { product: Product }) {
	const [isAdding, setIsAdding] = useState(false);
	const [isAdded, setIsAdded] = useState(false);
	const [isLiked, setIsLiked] = useState(false);

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
			initial={{ opacity: 0, y: 30 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ duration: 0.6 }}
			className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
			{/* Product Image */}
			<div className="relative h-64 overflow-hidden">
				{product.image_url ? (
					<Image
						src={product.image_url}
						alt={product.name}
						fill
						className="object-cover transition-transform duration-500 group-hover:scale-110"
						sizes="(max-width: 768px) 100vw, 50vw"
					/>
				) : (
					<div className="w-full h-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
						<div className="w-24 h-24 rounded-full bg-amber-200 flex items-center justify-center">
							<Wheat className="w-12 h-12 text-amber-600" />
						</div>
					</div>
				)}

				{/* Like Button */}
				<button
					onClick={() => setIsLiked(!isLiked)}
					className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
					<Heart
						className={`w-5 h-5 transition-colors ${
							isLiked ? "text-red-500 fill-current" : "text-gray-600"
						}`}
					/>
				</button>

				{/* Price Badge */}
				<div className="absolute bottom-4 left-4 bg-amber-600 text-white px-3 py-1 rounded-full font-semibold text-sm">
					£{(product.price_pence / 100).toFixed(2)}
				</div>
			</div>

			{/* Content */}
			<div className="p-6">
				<h3 className="text-xl font-bold text-amber-900 mb-2 group-hover:text-amber-700 transition-colors">
					{product.name}
				</h3>

				{product.pack_label && (
					<p className="text-amber-600 text-sm font-medium mb-3 bg-amber-100 inline-block px-3 py-1 rounded-full">
						{product.pack_label}
					</p>
				)}

				{product.allergens && product.allergens.length > 0 && (
					<div className="flex flex-wrap gap-2 mb-4">
						{product.allergens.slice(0, 3).map((allergen) => (
							<span
								key={allergen}
								className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-lg font-medium">
								{allergen}
							</span>
						))}
						{product.allergens.length > 3 && (
							<span className="text-orange-600 text-xs">
								+{product.allergens.length - 3} more
							</span>
						)}
					</div>
				)}

				<button
					onClick={addToBasket}
					disabled={isAdding || isAdded}
					className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
						isAdding
							? "bg-amber-200 text-amber-600 cursor-not-allowed"
							: isAdded
							? "bg-green-500 text-white"
							: "bg-amber-600 hover:bg-amber-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
					}`}>
					{isAdding ? (
						<>
							<div className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
							Adding to Cart...
						</>
					) : isAdded ? (
						<>
							<Heart className="w-4 h-4" />
							Added with Love!
						</>
					) : (
						<>
							<ShoppingCart className="w-4 h-4" />
							Add to Cart
						</>
					)}
				</button>
			</div>
		</motion.div>
	);
}

export default function WarmEarthPage() {
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
		<div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
			{/* Header */}
			<header className="bg-white/80 backdrop-blur-lg border-b border-amber-200 sticky top-0 z-50">
				<div className="max-w-7xl mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.6 }}
							className="flex items-center gap-3">
							<div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
								<Wheat className="w-6 h-6 text-white" />
							</div>
							<div>
								<h1 className="text-2xl font-bold text-amber-900">
									TJ's Bakery
								</h1>
								<p className="text-sm text-amber-600">Warm. Fresh. Family.</p>
							</div>
						</motion.div>

						<nav className="flex items-center space-x-6">
							<a
								href="#"
								className="text-amber-700 hover:text-amber-900 font-medium transition-colors">
								Home
							</a>
							<a
								href="#"
								className="text-amber-700 hover:text-amber-900 font-medium transition-colors">
								Products
							</a>
							<a
								href="#"
								className="text-amber-700 hover:text-amber-900 font-medium transition-colors">
								About
							</a>
							<a
								href="#"
								className="text-amber-700 hover:text-amber-900 font-medium transition-colors">
								Contact
							</a>
							<button className="relative p-3 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors">
								<ShoppingCart size={20} />
								<span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
									3
								</span>
							</button>
						</nav>
					</div>
				</div>
			</header>

			{/* Hero Section */}
			<section className="py-20 px-4 relative overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-orange-400/20"></div>
				<div className="max-w-6xl mx-auto relative z-10">
					<div className="text-center mb-12">
						<motion.h2
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, delay: 0.2 }}
							className="text-5xl md:text-7xl font-bold text-amber-900 mb-6">
							Baked with
							<span className="text-orange-600 block">Love & Care</span>
						</motion.h2>
						<motion.p
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, delay: 0.4 }}
							className="text-xl text-amber-700 max-w-3xl mx-auto leading-relaxed">
							Every morning, we knead warmth into our dough, fold kindness into
							our pastries, and bake memories that bring families together
							around the table.
						</motion.p>
					</div>

					{/* CTA Button */}
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.6 }}
						className="text-center">
						<button className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
							Shop Our Fresh Bakes
						</button>
					</motion.div>
				</div>
			</section>

			{/* Values Section */}
			<section className="py-16 px-4 bg-white/60 backdrop-blur-sm">
				<div className="max-w-6xl mx-auto">
					<motion.h3
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className="text-3xl font-bold text-center text-amber-900 mb-12">
						What Makes Us Special
					</motion.h3>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6 }}
							className="text-center p-6 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl">
							<div className="w-16 h-16 bg-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
								<Coffee className="w-8 h-8 text-white" />
							</div>
							<h4 className="text-xl font-bold text-amber-900 mb-3">
								Fresh Daily
							</h4>
							<p className="text-amber-700 leading-relaxed">
								We rise before the sun to ensure every item is baked fresh for
								you every single day.
							</p>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.2 }}
							className="text-center p-6 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl">
							<div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
								<Heart className="w-8 h-8 text-white" />
							</div>
							<h4 className="text-xl font-bold text-amber-900 mb-3">
								Made with Love
							</h4>
							<p className="text-amber-700 leading-relaxed">
								Every recipe is passed down through generations, infused with
								family traditions and care.
							</p>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.4 }}
							className="text-center p-6 bg-gradient-to-br from-red-100 to-amber-100 rounded-2xl">
							<div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
								<Users className="w-8 h-8 text-white" />
							</div>
							<h4 className="text-xl font-bold text-amber-900 mb-3">
								Community First
							</h4>
							<p className="text-amber-700 leading-relaxed">
								We're not just a bakery - we're your neighbors, creating moments
								that bring people together.
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
						<h2 className="text-4xl font-bold text-amber-900 mb-4">
							Our Daily Delights
						</h2>
						<p className="text-xl text-amber-700 max-w-2xl mx-auto">
							From sunrise to sunset, we're baking happiness into every bite
						</p>
					</motion.div>

					{loading ? (
						<div className="text-center py-20">
							<div className="inline-block w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
							<p className="text-amber-700 mt-4 font-medium">
								Loading our fresh delights...
							</p>
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
							{products.slice(0, 6).map((product) => (
								<WarmProductCard key={product.id} product={product} />
							))}
						</div>
					)}

					<motion.div
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, delay: 0.3 }}
						className="text-center mt-16">
						<button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
							Explore All Our Treats
						</button>
					</motion.div>
				</div>
			</section>

			{/* Testimonial */}
			<section className="py-16 px-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white">
				<div className="max-w-4xl mx-auto text-center">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}>
						<p className="text-2xl font-light mb-6 italic">
							"TJ's Bakery doesn't just bake bread - they bake memories. Every
							visit feels like coming home."
						</p>
						<div className="flex items-center justify-center gap-1 mb-4">
							{[...Array(5)].map((_, i) => (
								<Heart
									key={i}
									className="w-5 h-5 fill-current text-yellow-300"
								/>
							))}
						</div>
						<p className="font-semibold">Sarah & Mike Johnson</p>
						<p className="text-amber-100">Long-time customers & neighbors</p>
					</motion.div>
				</div>
			</section>

			{/* Footer */}
			<footer className="bg-amber-900 text-amber-100 py-12 px-4">
				<div className="max-w-6xl mx-auto">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<div>
							<div className="flex items-center gap-3 mb-4">
								<div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center">
									<Wheat className="w-5 h-5 text-white" />
								</div>
								<h3 className="text-xl font-bold text-white">TJ's Bakery</h3>
							</div>
							<p className="text-amber-200 leading-relaxed">
								Bringing warmth and joy to our community, one fresh-baked item
								at a time.
							</p>
						</div>

						<div>
							<h4 className="font-bold text-white mb-4">Quick Links</h4>
							<div className="space-y-2">
								<a
									href="#"
									className="block hover:text-white transition-colors">
									Our Story
								</a>
								<a
									href="#"
									className="block hover:text-white transition-colors">
									Products
								</a>
								<a
									href="#"
									className="block hover:text-white transition-colors">
									Catering
								</a>
								<a
									href="#"
									className="block hover:text-white transition-colors">
									Contact
								</a>
							</div>
						</div>

						<div>
							<h4 className="font-bold text-white mb-4">Visit Us</h4>
							<p className="text-amber-200 mb-2">123 Main Street</p>
							<p className="text-amber-200 mb-2">Your City, State 12345</p>
							<p className="text-amber-200 mb-2">Phone: (555) 123-4567</p>
							<p className="text-amber-200">Open: 6am - 6pm Daily</p>
						</div>
					</div>

					<div className="border-t border-amber-700 mt-8 pt-8 text-center text-amber-200">
						<p>&copy; 2024 TJ's Bakery. Made with love for our community.</p>
					</div>
				</div>
			</footer>
		</div>
	);
}
