"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
	ShoppingCart,
	Star,
	ArrowRight,
	Zap,
	Shield,
	Award,
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

// Modern Geometric Product Card
function GeometricProductCard({
	product,
	index,
}: {
	product: Product;
	index: number;
}) {
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

	// Different geometric shapes for variety
	const shapes = [
		"polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)", // Octagon
		"polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)", // Parallelogram
		"polygon(0% 0%, 100% 25%, 100% 75%, 0% 100%)", // Different parallelogram
		"circle(50%)", // Circle
		"polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)", // Diamond
		"polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)", // Trapezoid
	];

	const colors = [
		"from-purple-500 to-pink-500",
		"from-blue-500 to-cyan-500",
		"from-green-500 to-teal-500",
		"from-orange-500 to-red-500",
		"from-indigo-500 to-purple-500",
		"from-cyan-500 to-blue-500",
	];

	const shapeStyle = shapes[index % shapes.length];
	const colorStyle = colors[index % colors.length];

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
			whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
			viewport={{ once: true }}
			transition={{ duration: 0.6, delay: index * 0.1 }}
			whileHover={{ scale: 1.05, rotate: 2 }}
			className="relative group">
			{/* Background geometric shape */}
			<div
				className={`absolute inset-0 bg-gradient-to-br ${colorStyle} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}
				style={{ clipPath: shapeStyle }}></div>

			<div className="relative bg-white border-2 border-gray-100 hover:border-gray-300 transition-all duration-300 overflow-hidden">
				{/* Header with geometric accent */}
				<div className="relative h-12 bg-gradient-to-r from-gray-900 to-gray-700">
					<div
						className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${colorStyle} opacity-80`}
						style={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 100%)" }}></div>
					<div className="absolute top-3 left-4 text-white font-bold text-xs tracking-widest uppercase">
						{product.categories?.[0]?.name || "BAKERY"}
					</div>
				</div>

				{/* Product Image */}
				<div className="relative h-48 bg-gray-50 overflow-hidden">
					{product.image_url ? (
						<Image
							src={product.image_url}
							alt={product.name}
							fill
							className="object-cover transition-transform duration-500 group-hover:scale-110"
							sizes="(max-width: 768px) 100vw, 33vw"
						/>
					) : (
						<div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative">
							<div
								className={`w-24 h-24 bg-gradient-to-br ${colorStyle} opacity-20`}
								style={{ clipPath: shapeStyle }}></div>
							<Zap className="absolute w-12 h-12 text-gray-400" />
						</div>
					)}

					{/* Price tag */}
					<div className="absolute top-4 left-4">
						<div className="bg-black text-white px-3 py-1 text-sm font-bold tracking-wider">
							£{(product.price_pence / 100).toFixed(2)}
						</div>
						<div className="w-0 h-0 border-l-[12px] border-l-black border-t-[8px] border-t-transparent"></div>
					</div>
				</div>

				{/* Content */}
				<div className="p-6 space-y-4">
					<div>
						<h3 className="text-xl font-black text-gray-900 mb-2 leading-tight uppercase tracking-wide">
							{product.name}
						</h3>

						{product.pack_label && (
							<div className="inline-block">
								<span className="bg-gray-900 text-white text-xs px-3 py-1 font-bold tracking-wider uppercase">
									{product.pack_label}
								</span>
							</div>
						)}
					</div>

					{product.allergens && product.allergens.length > 0 && (
						<div className="flex flex-wrap gap-1">
							{product.allergens.slice(0, 2).map((allergen, i) => (
								<span
									key={allergen}
									className={`text-xs px-2 py-1 font-semibold uppercase tracking-wide text-white bg-gradient-to-r ${
										colors[i % colors.length]
									}`}>
									{allergen}
								</span>
							))}
							{product.allergens.length > 2 && (
								<span className="text-xs px-2 py-1 bg-gray-200 text-gray-600 font-bold">
									+{product.allergens.length - 2}
								</span>
							)}
						</div>
					)}

					<button
						onClick={addToBasket}
						disabled={isAdding || isAdded}
						className={`w-full py-4 font-black text-sm tracking-widest uppercase transition-all duration-300 relative overflow-hidden group/btn ${
							isAdding
								? "bg-gray-300 text-gray-500 cursor-not-allowed"
								: isAdded
								? "bg-green-500 text-white"
								: "bg-gray-900 hover:bg-black text-white"
						}`}>
						{/* Animated background */}
						<div
							className={`absolute inset-0 bg-gradient-to-r ${colorStyle} transform translate-x-full group-hover/btn:translate-x-0 transition-transform duration-300`}></div>

						<span className="relative z-10 flex items-center justify-center gap-2">
							{isAdding ? (
								<>
									<div className="w-4 h-4 border-2 border-gray-500 border-t-transparent animate-spin"></div>
									ADDING...
								</>
							) : isAdded ? (
								<>
									<Star className="w-4 h-4" />
									ADDED!
								</>
							) : (
								<>
									<ShoppingCart className="w-4 h-4" />
									ADD TO CART
									<ArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
								</>
							)}
						</span>
					</button>
				</div>
			</div>
		</motion.div>
	);
}

export default function ModernGeometricPage() {
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
			<header className="relative bg-gray-900 text-white overflow-hidden">
				{/* Geometric background shapes */}
				<div className="absolute inset-0">
					<div
						className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-500 to-pink-500 opacity-20"
						style={{
							clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
						}}></div>
					<div
						className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-blue-500 to-cyan-500 opacity-20"
						style={{
							clipPath:
								"polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
						}}></div>
				</div>

				<div className="relative z-10 max-w-7xl mx-auto px-4 py-6">
					<div className="flex items-center justify-between">
						<motion.div
							initial={{ opacity: 0, x: -30 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.6 }}
							className="flex items-center gap-4">
							<div
								className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 relative"
								style={{
									clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
								}}></div>
							<div>
								<h1 className="text-3xl font-black tracking-wider">TJ'S</h1>
								<p className="text-sm font-bold tracking-widest uppercase text-gray-300">
									Modern Bakery
								</p>
							</div>
						</motion.div>

						<nav className="flex items-center space-x-8">
							<a
								href="#"
								className="font-bold text-sm tracking-widest uppercase hover:text-purple-400 transition-colors">
								HOME
							</a>
							<a
								href="#"
								className="font-bold text-sm tracking-widest uppercase hover:text-purple-400 transition-colors">
								PRODUCTS
							</a>
							<a
								href="#"
								className="font-bold text-sm tracking-widest uppercase hover:text-purple-400 transition-colors">
								ABOUT
							</a>
							<a
								href="#"
								className="font-bold text-sm tracking-widest uppercase hover:text-purple-400 transition-colors">
								CONTACT
							</a>
							<button className="relative bg-white text-gray-900 px-4 py-2 font-black text-sm tracking-widest uppercase hover:bg-gray-100 transition-colors">
								<ShoppingCart size={16} className="inline mr-2" />
								CART
							</button>
						</nav>
					</div>
				</div>
			</header>

			{/* Hero Section */}
			<section className="relative py-24 px-4 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
				{/* Geometric background elements */}
				<div className="absolute inset-0">
					<div
						className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-green-400 to-teal-500 opacity-10"
						style={{
							clipPath: "polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)",
						}}></div>
					<div
						className="absolute top-40 right-32 w-48 h-48 bg-gradient-to-br from-orange-400 to-red-500 opacity-10"
						style={{ clipPath: "circle(50%)" }}></div>
					<div
						className="absolute bottom-20 left-1/2 w-40 h-40 bg-gradient-to-br from-indigo-400 to-purple-500 opacity-10"
						style={{
							clipPath:
								"polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
						}}></div>
				</div>

				<div className="relative z-10 max-w-6xl mx-auto text-center">
					<motion.h2
						initial={{ opacity: 0, y: 50, scale: 0.8 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						transition={{ duration: 0.8, delay: 0.2 }}
						className="text-6xl md:text-8xl font-black text-gray-900 mb-6 leading-none">
						FRESH
						<span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
							BOLD
						</span>
						<span className="block">DELICIOUS</span>
					</motion.h2>

					<motion.p
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.6 }}
						className="text-xl text-gray-600 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
						Revolutionizing the bakery experience with cutting-edge flavors,
						innovative techniques, and geometric perfection in every bite.
					</motion.p>

					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.8 }}
						className="flex flex-col sm:flex-row gap-4 justify-center">
						<button className="bg-gray-900 hover:bg-black text-white px-8 py-4 font-black text-sm tracking-widest uppercase transition-all duration-300 relative overflow-hidden group">
							<span className="relative z-10">SHOP NOW</span>
							<div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
						</button>
						<button className="border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white px-8 py-4 font-black text-sm tracking-widest uppercase transition-all duration-300">
							LEARN MORE
						</button>
					</motion.div>
				</div>
			</section>

			{/* Features */}
			<section className="py-20 px-4 bg-gray-900 text-white">
				<div className="max-w-6xl mx-auto">
					<motion.h3
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className="text-4xl font-black text-center mb-16 tracking-wider uppercase">
						Why Choose TJ'S
					</motion.h3>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<motion.div
							initial={{ opacity: 0, x: -30 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6 }}
							className="text-center relative">
							<div
								className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 mx-auto mb-6 flex items-center justify-center"
								style={{
									clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
								}}>
								<Zap className="w-8 h-8 text-white" />
							</div>
							<h4 className="text-xl font-black tracking-wide uppercase mb-4">
								INNOVATIVE
							</h4>
							<p className="text-gray-300 font-medium">
								Cutting-edge techniques and flavors that push the boundaries of
								traditional baking.
							</p>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.2 }}
							className="text-center relative">
							<div
								className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 mx-auto mb-6 flex items-center justify-center"
								style={{
									clipPath:
										"polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
								}}>
								<Shield className="w-8 h-8 text-white" />
							</div>
							<h4 className="text-xl font-black tracking-wide uppercase mb-4">
								QUALITY
							</h4>
							<p className="text-gray-300 font-medium">
								Premium ingredients sourced globally, combined with precision
								and excellence.
							</p>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, x: 30 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.4 }}
							className="text-center relative">
							<div
								className="w-20 h-20 bg-gradient-to-br from-green-500 to-teal-500 mx-auto mb-6 flex items-center justify-center"
								style={{ clipPath: "circle(50%)" }}>
								<Award className="w-8 h-8 text-white" />
							</div>
							<h4 className="text-xl font-black tracking-wide uppercase mb-4">
								AWARD-WINNING
							</h4>
							<p className="text-gray-300 font-medium">
								Recognized internationally for excellence in modern bakery
								innovation.
							</p>
						</motion.div>
					</div>
				</div>
			</section>

			{/* Products Section */}
			<section className="py-24 px-4 bg-gray-50">
				<div className="max-w-7xl mx-auto">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className="text-center mb-16">
						<h2 className="text-5xl font-black text-gray-900 mb-4 tracking-wider uppercase">
							Our Products
						</h2>
						<div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mb-6"></div>
						<p className="text-xl text-gray-600 font-medium max-w-2xl mx-auto">
							Bold flavors meet geometric perfection in our collection of modern
							baked goods.
						</p>
					</motion.div>

					{loading ? (
						<div className="text-center py-20">
							<div className="inline-block w-16 h-16 border-4 border-gray-200 border-t-purple-500 animate-spin"></div>
							<p className="text-gray-600 mt-4 font-bold tracking-widest uppercase">
								Loading Products...
							</p>
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
							{products.slice(0, 6).map((product, index) => (
								<GeometricProductCard
									key={product.id}
									product={product}
									index={index}
								/>
							))}
						</div>
					)}

					<motion.div
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, delay: 0.3 }}
						className="text-center mt-16">
						<button className="bg-gray-900 hover:bg-black text-white px-12 py-4 font-black text-sm tracking-widest uppercase transition-all duration-300 relative overflow-hidden group">
							<span className="relative z-10 flex items-center justify-center gap-2">
								VIEW ALL PRODUCTS
								<ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
							</span>
							<div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 transform translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
						</button>
					</motion.div>
				</div>
			</section>

			{/* Footer */}
			<footer className="bg-gray-900 text-white py-16 px-4">
				<div className="max-w-6xl mx-auto">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
						<div className="md:col-span-2">
							<div className="flex items-center gap-4 mb-6">
								<div
									className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500"
									style={{
										clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
									}}></div>
								<div>
									<h3 className="text-2xl font-black tracking-wider">TJ'S</h3>
									<p className="text-sm font-bold tracking-widest uppercase text-gray-400">
										Modern Bakery
									</p>
								</div>
							</div>
							<p className="text-gray-300 font-medium leading-relaxed max-w-md">
								Pushing the boundaries of traditional baking with innovative
								techniques, bold flavors, and geometric perfection.
							</p>
						</div>

						<div>
							<h4 className="font-black tracking-wider uppercase mb-6">
								Quick Links
							</h4>
							<div className="space-y-3">
								<a
									href="#"
									className="block text-gray-300 hover:text-white font-medium transition-colors">
									Products
								</a>
								<a
									href="#"
									className="block text-gray-300 hover:text-white font-medium transition-colors">
									About Us
								</a>
								<a
									href="#"
									className="block text-gray-300 hover:text-white font-medium transition-colors">
									Contact
								</a>
								<a
									href="#"
									className="block text-gray-300 hover:text-white font-medium transition-colors">
									Careers
								</a>
							</div>
						</div>

						<div>
							<h4 className="font-black tracking-wider uppercase mb-6">
								Connect
							</h4>
							<div className="space-y-3">
								<a
									href="#"
									className="block text-gray-300 hover:text-white font-medium transition-colors">
									Instagram
								</a>
								<a
									href="#"
									className="block text-gray-300 hover:text-white font-medium transition-colors">
									Facebook
								</a>
								<a
									href="#"
									className="block text-gray-300 hover:text-white font-medium transition-colors">
									Twitter
								</a>
								<a
									href="#"
									className="block text-gray-300 hover:text-white font-medium transition-colors">
									LinkedIn
								</a>
							</div>
						</div>
					</div>

					<div className="border-t border-gray-700 mt-12 pt-8 text-center">
						<p className="text-gray-400 font-medium">
							© 2024 TJ'S Modern Bakery. All rights reserved. |
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 font-bold">
								Innovating Taste
							</span>
						</p>
					</div>
				</div>
			</footer>
		</div>
	);
}
