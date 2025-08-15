"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingCart, Star, Heart } from "lucide-react";
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

function BoutiqueProductCard({ product }: { product: Product }) {
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
			<div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-400 overflow-hidden border border-gray-100 hover:border-rose-200">
				<div className="relative h-64 bg-rose-50 overflow-hidden">
					{product.image_url ? (
						<Image
							src={product.image_url}
							alt={product.name}
							fill
							className="object-cover transition-transform duration-500 group-hover:scale-105"
							sizes="(max-width: 768px) 100vw, 50vw"
						/>
					) : (
						<div className="w-full h-full bg-rose-100 flex items-center justify-center">
							<Star className="w-10 h-10 text-rose-300" />
						</div>
					)}

					<div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-rose-700">
						£{(product.price_pence / 100).toFixed(2)}
					</div>
				</div>

				<div className="p-6 space-y-4">
					<div>
						<h3 className="text-lg font-medium text-gray-800 leading-tight mb-2">
							{product.name}
						</h3>

						{product.pack_label && (
							<p className="text-sm text-rose-600 bg-rose-50 px-3 py-1 rounded-full inline-block">
								{product.pack_label}
							</p>
						)}
					</div>

					{product.allergens && product.allergens.length > 0 && (
						<div className="flex flex-wrap gap-2">
							{product.allergens.slice(0, 3).map((allergen) => (
								<span
									key={allergen}
									className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
									{allergen}
								</span>
							))}
							{product.allergens.length > 3 && (
								<span className="text-gray-400 text-xs">
									+{product.allergens.length - 3}
								</span>
							)}
						</div>
					)}

					<button
						onClick={addToBasket}
						disabled={isAdding || isAdded}
						className={`w-full py-3 rounded-lg font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
							isAdding
								? "bg-gray-100 text-gray-400 cursor-not-allowed"
								: isAdded
								? "bg-green-50 text-green-600 border border-green-200"
								: "bg-rose-600 hover:bg-rose-700 text-white shadow-sm hover:shadow-md"
						}`}>
						{isAdding ? (
							<>
								<div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
								Adding...
							</>
						) : isAdded ? (
							<>
								<Heart className="w-4 h-4" />
								Added to cart
							</>
						) : (
							<>
								<ShoppingCart className="w-4 h-4" />
								Add to cart
							</>
						)}
					</button>
				</div>
			</div>
		</motion.div>
	);
}

export default function BoutiqueSimplePage() {
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
		<div className="min-h-screen bg-rose-50">
			<header className="bg-white/90 backdrop-blur-sm border-b border-rose-200 sticky top-0 z-50">
				<div className="max-w-6xl mx-auto px-6 py-6">
					<div className="flex items-center justify-between">
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.6 }}
							className="flex items-center gap-3">
							<div className="w-10 h-10 bg-rose-500 rounded-full flex items-center justify-center">
								<Star className="w-5 h-5 text-white" />
							</div>
							<div>
								<h1 className="text-xl font-semibold text-gray-800">
									TJ's Boutique
								</h1>
								<p className="text-sm text-rose-600">Simple & Sweet</p>
							</div>
						</motion.div>

						<nav className="flex items-center space-x-8">
							<a
								href="#"
								className="text-gray-600 hover:text-gray-800 font-medium transition-colors">
								Home
							</a>
							<a
								href="#"
								className="text-gray-600 hover:text-gray-800 font-medium transition-colors">
								Collection
							</a>
							<a
								href="#"
								className="text-gray-600 hover:text-gray-800 font-medium transition-colors">
								About
							</a>
							<a
								href="#"
								className="text-gray-600 hover:text-gray-800 font-medium transition-colors">
								Contact
							</a>
							<button className="bg-rose-600 text-white px-6 py-3 rounded-lg hover:bg-rose-700 transition-colors flex items-center gap-2">
								<ShoppingCart size={16} />
								<span className="font-medium">Cart</span>
							</button>
						</nav>
					</div>
				</div>
			</header>

			<section className="py-20 px-6">
				<div className="max-w-4xl mx-auto text-center">
					<motion.h2
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.2 }}
						className="text-5xl md:text-6xl font-bold text-gray-800 leading-tight mb-6">
						Sweet
						<span className="block text-rose-600">Simplicity</span>
					</motion.h2>
					<motion.p
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.4 }}
						className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
						A charming boutique bakery where simple ingredients create
						extraordinary moments. Each treat is crafted with care and presented
						with love.
					</motion.p>

					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.6 }}
						className="mt-12">
						<button className="bg-rose-600 hover:bg-rose-700 text-white px-8 py-4 rounded-lg font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-300">
							Browse Our Collection
						</button>
					</motion.div>
				</div>
			</section>

			<section className="py-16 px-6 bg-white">
				<div className="max-w-6xl mx-auto">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6 }}
							className="text-center p-6">
							<div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
								<Heart className="w-6 h-6 text-rose-500" />
							</div>
							<h4 className="text-lg font-medium text-gray-800 mb-3">
								Made with Love
							</h4>
							<p className="text-gray-600 text-sm leading-relaxed">
								Every item is handcrafted with genuine care and attention to
								detail.
							</p>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.2 }}
							className="text-center p-6">
							<div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
								<Star className="w-6 h-6 text-rose-500" />
							</div>
							<h4 className="text-lg font-medium text-gray-800 mb-3">
								Quality Ingredients
							</h4>
							<p className="text-gray-600 text-sm leading-relaxed">
								We source only the finest ingredients for exceptional taste and
								quality.
							</p>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.4 }}
							className="text-center p-6">
							<div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
								<div className="w-6 h-6 bg-rose-500 rounded-full"></div>
							</div>
							<h4 className="text-lg font-medium text-gray-800 mb-3">
								Simple Beauty
							</h4>
							<p className="text-gray-600 text-sm leading-relaxed">
								Beautiful presentation that celebrates the natural charm of
								simple designs.
							</p>
						</motion.div>
					</div>
				</div>
			</section>

			<section className="py-24 px-6">
				<div className="max-w-7xl mx-auto">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className="text-center mb-16">
						<h2 className="text-3xl font-bold text-gray-800 mb-4">
							Our Sweet Collection
						</h2>
						<div className="w-20 h-1 bg-rose-400 rounded-full mx-auto"></div>
						<p className="text-gray-600 max-w-2xl mx-auto mt-6">
							Discover handcrafted treats made with simple ingredients and
							endless love
						</p>
					</motion.div>

					{loading ? (
						<div className="text-center py-20">
							<div className="inline-block w-8 h-8 border-2 border-rose-200 border-t-rose-600 rounded-full animate-spin"></div>
							<p className="text-gray-600 mt-4">
								Loading our sweet collection...
							</p>
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
							{products.slice(0, 6).map((product) => (
								<BoutiqueProductCard key={product.id} product={product} />
							))}
						</div>
					)}

					<motion.div
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, delay: 0.3 }}
						className="text-center mt-16">
						<button className="bg-rose-600 hover:bg-rose-700 text-white px-10 py-4 rounded-lg font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 mx-auto">
							<Star className="w-5 h-5" />
							View All Treats
						</button>
					</motion.div>
				</div>
			</section>

			<footer className="bg-gray-800 text-white py-16 px-6">
				<div className="max-w-6xl mx-auto text-center">
					<div className="flex items-center justify-center gap-3 mb-6">
						<div className="w-10 h-10 bg-rose-500 rounded-full flex items-center justify-center">
							<Star className="w-5 h-5 text-white" />
						</div>
						<h3 className="text-xl font-semibold">TJ's Boutique</h3>
					</div>
					<p className="text-gray-400 mb-8">Simple & Sweet Bakery</p>
					<div className="flex justify-center space-x-8 text-sm">
						<a
							href="#"
							className="text-gray-400 hover:text-white transition-colors">
							Collection
						</a>
						<a
							href="#"
							className="text-gray-400 hover:text-white transition-colors">
							About
						</a>
						<a
							href="#"
							className="text-gray-400 hover:text-white transition-colors">
							Contact
						</a>
						<a
							href="#"
							className="text-gray-400 hover:text-white transition-colors">
							Terms
						</a>
					</div>
					<div className="mt-8 text-xs text-gray-500">
						© 2024 TJ's Boutique Bakery. Made with love.
					</div>
				</div>
			</footer>
		</div>
	);
}
