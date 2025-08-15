"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingCart, Cloud } from "lucide-react";
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

function SoftModernProductCard({ product }: { product: Product }) {
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
			<div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 rounded-3xl shadow-sm hover:shadow-lg transition-all duration-500 overflow-hidden border border-blue-100/50">
				<div className="relative h-64 bg-gradient-to-br from-blue-100/50 to-indigo-100/50 overflow-hidden rounded-t-3xl">
					{product.image_url ? (
						<Image
							src={product.image_url}
							alt={product.name}
							fill
							className="object-cover transition-transform duration-700 group-hover:scale-105"
							sizes="(max-width: 768px) 100vw, 50vw"
						/>
					) : (
						<div className="w-full h-full flex items-center justify-center">
							<div className="w-20 h-20 bg-gradient-to-br from-blue-200/50 to-indigo-200/50 rounded-2xl flex items-center justify-center">
								<Cloud className="w-8 h-8 text-blue-400" />
							</div>
						</div>
					)}

					<div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-2xl text-sm font-medium text-blue-700">
						£{(product.price_pence / 100).toFixed(2)}
					</div>
				</div>

				<div className="p-8 space-y-4">
					<div>
						<h3 className="text-lg font-medium text-blue-900 leading-tight mb-2">
							{product.name}
						</h3>

						{product.pack_label && (
							<p className="text-sm text-blue-600 bg-blue-50 px-4 py-2 rounded-xl inline-block border border-blue-200/50">
								{product.pack_label}
							</p>
						)}
					</div>

					{product.allergens && product.allergens.length > 0 && (
						<div className="flex flex-wrap gap-2">
							{product.allergens.slice(0, 3).map((allergen) => (
								<span
									key={allergen}
									className="bg-indigo-50 text-indigo-600 text-xs px-3 py-1 rounded-full border border-indigo-200/50">
									{allergen}
								</span>
							))}
							{product.allergens.length > 3 && (
								<span className="text-indigo-400 text-xs">
									+{product.allergens.length - 3}
								</span>
							)}
						</div>
					)}

					<button
						onClick={addToBasket}
						disabled={isAdding || isAdded}
						className={`w-full py-4 rounded-2xl font-medium text-sm transition-all duration-300 ${
							isAdding
								? "bg-blue-100 text-blue-400 cursor-not-allowed"
								: isAdded
								? "bg-emerald-50 text-emerald-600 border border-emerald-200"
								: "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm hover:shadow-lg"
						}`}>
						{isAdding ? "Adding..." : isAdded ? "Added" : "Add to Basket"}
					</button>
				</div>
			</div>
		</motion.div>
	);
}

export default function SoftModernPage() {
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
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
			<header className="bg-white/70 backdrop-blur-lg border-b border-blue-200/50 sticky top-0 z-50">
				<div className="max-w-7xl mx-auto px-6 py-6">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
								<Cloud className="w-5 h-5 text-white" />
							</div>
							<div>
								<h1 className="text-xl font-semibold text-blue-900">
									TJ's Cloud
								</h1>
								<p className="text-sm text-blue-600">Soft & Modern</p>
							</div>
						</div>

						<nav className="flex items-center space-x-8">
							<a
								href="#"
								className="text-blue-700 hover:text-blue-900 font-medium transition-colors">
								Home
							</a>
							<a
								href="#"
								className="text-blue-700 hover:text-blue-900 font-medium transition-colors">
								Products
							</a>
							<a
								href="#"
								className="text-blue-700 hover:text-blue-900 font-medium transition-colors">
								About
							</a>
							<a
								href="#"
								className="text-blue-700 hover:text-blue-900 font-medium transition-colors">
								Contact
							</a>
							<button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-sm hover:shadow-lg flex items-center gap-2">
								<ShoppingCart size={16} />
								<span className="font-medium">Cart</span>
							</button>
						</nav>
					</div>
				</div>
			</header>

			<section className="py-24 px-6">
				<div className="max-w-5xl mx-auto text-center">
					<motion.h2
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.2 }}
						className="text-5xl md:text-6xl font-bold text-blue-900 leading-tight mb-8">
						Light as
						<span className="block text-indigo-600">Clouds</span>
					</motion.h2>
					<motion.p
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.4 }}
						className="text-xl text-blue-700 max-w-3xl mx-auto leading-relaxed">
						Experience the ethereal lightness of our modern creations. Soft
						textures and gentle flavors that float on your palate like morning
						clouds.
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
						className="text-center mb-16">
						<h2 className="text-3xl font-bold text-blue-900 mb-4">
							Cloud Collection
						</h2>
						<div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full mx-auto"></div>
					</motion.div>

					{loading ? (
						<div className="text-center py-20">
							<div className="inline-block w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
							<p className="text-blue-700 mt-4">Loading clouds...</p>
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
							{products.slice(0, 6).map((product) => (
								<SoftModernProductCard key={product.id} product={product} />
							))}
						</div>
					)}
				</div>
			</section>

			<footer className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white py-16 px-6">
				<div className="max-w-6xl mx-auto text-center">
					<div className="flex items-center justify-center gap-3 mb-6">
						<div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center">
							<Cloud className="w-5 h-5 text-white" />
						</div>
						<h3 className="text-xl font-semibold">TJ's Cloud</h3>
					</div>
					<p className="text-blue-200 mb-8">Soft & Modern Bakery</p>
					<div className="text-xs text-blue-300">© 2024 TJ's Cloud Bakery</div>
				</div>
			</footer>
		</div>
	);
}
