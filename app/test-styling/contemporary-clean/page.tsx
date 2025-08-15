"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingCart, Square } from "lucide-react";
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

function ContemporaryProductCard({ product }: { product: Product }) {
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
			className="group">
			<div className="bg-white border border-gray-200 hover:border-gray-300 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md">
				<div className="relative h-72 bg-gray-50 overflow-hidden">
					{product.image_url ? (
						<Image
							src={product.image_url}
							alt={product.name}
							fill
							className="object-cover transition-transform duration-500 group-hover:scale-105"
							sizes="(max-width: 768px) 100vw, 50vw"
						/>
					) : (
						<div className="w-full h-full bg-gray-100 flex items-center justify-center">
							<Square className="w-12 h-12 text-gray-400" />
						</div>
					)}
				</div>

				<div className="p-6 space-y-4">
					<div className="space-y-2">
						<h3 className="text-lg font-medium text-gray-900 leading-tight">
							{product.name}
						</h3>
						<p className="text-xl font-medium text-gray-700">
							£{(product.price_pence / 100).toFixed(2)}
						</p>
					</div>

					{product.pack_label && (
						<p className="text-sm text-gray-600 bg-gray-50 px-3 py-2 inline-block border border-gray-200">
							{product.pack_label}
						</p>
					)}

					<button
						onClick={addToBasket}
						disabled={isAdding || isAdded}
						className={`w-full py-3 font-medium text-sm transition-all duration-200 ${
							isAdding
								? "bg-gray-100 text-gray-400 cursor-not-allowed"
								: isAdded
								? "bg-green-50 text-green-700 border border-green-200"
								: "bg-gray-900 hover:bg-gray-800 text-white"
						}`}>
						{isAdding ? "Adding..." : isAdded ? "Added" : "Add to Cart"}
					</button>
				</div>
			</div>
		</motion.div>
	);
}

export default function ContemporaryCleanPage() {
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
			<header className="border-b border-gray-200 bg-white sticky top-0 z-50">
				<div className="max-w-7xl mx-auto px-6 py-6">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-2xl font-semibold text-gray-900">
								TJ's Contemporary
							</h1>
							<p className="text-sm text-gray-600">Modern Bakery</p>
						</div>

						<nav className="flex items-center space-x-8">
							<a
								href="#"
								className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
								Products
							</a>
							<a
								href="#"
								className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
								About
							</a>
							<a
								href="#"
								className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
								Contact
							</a>
							<button className="bg-gray-900 text-white px-6 py-3 hover:bg-gray-800 transition-colors flex items-center gap-2">
								<ShoppingCart size={16} />
								Cart
							</button>
						</nav>
					</div>
				</div>
			</header>

			<section className="py-24 px-6">
				<div className="max-w-5xl mx-auto">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
						<div className="space-y-6">
							<h2 className="text-5xl font-bold text-gray-900 leading-tight">
								Contemporary
								<span className="block text-gray-600">Baking</span>
							</h2>
							<p className="text-lg text-gray-600 leading-relaxed">
								Clean lines, pure flavors, and contemporary presentation. We
								bring modern sensibility to traditional baking craftsmanship.
							</p>
							<button className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 font-medium transition-colors">
								Shop Collection
							</button>
						</div>

						<div className="relative">
							<div className="w-full h-96 bg-gray-100 flex items-center justify-center">
								<Square className="w-24 h-24 text-gray-300" />
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="py-16 px-6 bg-gray-50">
				<div className="max-w-6xl mx-auto">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<div className="text-center p-6">
							<div className="w-12 h-12 bg-gray-200 mx-auto mb-4"></div>
							<h4 className="text-lg font-medium text-gray-900 mb-2">
								Clean Design
							</h4>
							<p className="text-gray-600 text-sm">
								Contemporary presentation with minimalist aesthetics
							</p>
						</div>
						<div className="text-center p-6">
							<div className="w-12 h-12 bg-gray-200 mx-auto mb-4 rounded-full"></div>
							<h4 className="text-lg font-medium text-gray-900 mb-2">
								Pure Flavors
							</h4>
							<p className="text-gray-600 text-sm">
								Focusing on the essential taste without distraction
							</p>
						</div>
						<div className="text-center p-6">
							<div className="w-12 h-12 bg-gray-200 mx-auto mb-4 transform rotate-45"></div>
							<h4 className="text-lg font-medium text-gray-900 mb-2">
								Modern Craft
							</h4>
							<p className="text-gray-600 text-sm">
								Traditional techniques with contemporary innovation
							</p>
						</div>
					</div>
				</div>
			</section>

			<section className="py-24 px-6">
				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-16">
						<h2 className="text-3xl font-bold text-gray-900 mb-4">
							Featured Products
						</h2>
						<div className="w-16 h-1 bg-gray-300 mx-auto"></div>
					</div>

					{loading ? (
						<div className="text-center py-20">
							<div className="inline-block w-8 h-8 border-2 border-gray-200 border-t-gray-600 animate-spin"></div>
							<p className="text-gray-600 mt-4">Loading products...</p>
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
							{products.slice(0, 6).map((product) => (
								<ContemporaryProductCard key={product.id} product={product} />
							))}
						</div>
					)}
				</div>
			</section>

			<footer className="bg-gray-900 text-white py-16 px-6">
				<div className="max-w-6xl mx-auto text-center">
					<h3 className="text-xl font-semibold mb-2">TJ's Contemporary</h3>
					<p className="text-gray-400 mb-8">Modern Bakery</p>
					<div className="text-xs text-gray-500">
						© 2024 TJ's Contemporary Bakery
					</div>
				</div>
			</footer>
		</div>
	);
}
