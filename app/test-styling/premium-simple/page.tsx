"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingCart, Award } from "lucide-react";
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

function PremiumProductCard({ product }: { product: Product }) {
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
			<div className="bg-white border border-stone-200 hover:border-stone-300 transition-all duration-300 overflow-hidden">
				<div className="relative h-72 bg-stone-50 overflow-hidden">
					{product.image_url ? (
						<Image
							src={product.image_url}
							alt={product.name}
							fill
							className="object-cover transition-transform duration-500 group-hover:scale-105"
							sizes="(max-width: 768px) 100vw, 50vw"
						/>
					) : (
						<div className="w-full h-full bg-stone-100 flex items-center justify-center">
							<Award className="w-12 h-12 text-stone-400" />
						</div>
					)}
				</div>

				<div className="p-8 space-y-4">
					<div className="space-y-2">
						<h3 className="text-xl font-light text-stone-900 tracking-wide">
							{product.name}
						</h3>
						<p className="text-2xl font-light text-stone-700">
							£{(product.price_pence / 100).toFixed(2)}
						</p>
					</div>

					{product.pack_label && (
						<p className="text-sm text-stone-600 bg-stone-50 px-4 py-2 inline-block border border-stone-200">
							{product.pack_label}
						</p>
					)}

					<button
						onClick={addToBasket}
						disabled={isAdding || isAdded}
						className={`w-full py-4 font-light text-sm tracking-wide transition-all duration-300 ${
							isAdding
								? "bg-stone-100 text-stone-400 cursor-not-allowed"
								: isAdded
								? "bg-green-50 text-green-700 border border-green-200"
								: "bg-stone-900 hover:bg-stone-800 text-white"
						}`}>
						{isAdding ? "Adding..." : isAdded ? "Added" : "Add to Cart"}
					</button>
				</div>
			</div>
		</motion.div>
	);
}

export default function PremiumSimplePage() {
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
		<div className="min-h-screen bg-stone-50">
			<header className="bg-white border-b border-stone-200">
				<div className="max-w-6xl mx-auto px-6 py-8">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-3xl font-light text-stone-900 tracking-wider">
								TJ'S
							</h1>
							<p className="text-sm text-stone-600 font-light mt-1">
								Premium Bakery
							</p>
						</div>
						<nav className="flex items-center space-x-12 text-sm font-light">
							<a
								href="#"
								className="text-stone-600 hover:text-stone-900 transition-colors">
								Products
							</a>
							<a
								href="#"
								className="text-stone-600 hover:text-stone-900 transition-colors">
								About
							</a>
							<a
								href="#"
								className="text-stone-600 hover:text-stone-900 transition-colors">
								Contact
							</a>
							<button className="bg-stone-900 text-white px-6 py-3 hover:bg-stone-800 transition-colors">
								<ShoppingCart size={16} />
							</button>
						</nav>
					</div>
				</div>
			</header>

			<section className="py-32 px-6">
				<div className="max-w-4xl mx-auto text-center">
					<h2 className="text-6xl font-light text-stone-900 leading-tight mb-8">
						Premium
						<br />
						<span className="text-stone-600">Quality</span>
					</h2>
					<p className="text-lg text-stone-700 font-light leading-relaxed max-w-2xl mx-auto">
						Excellence in every detail. Our premium collection represents the
						finest in artisan baking, crafted with exceptional ingredients and
						unwavering dedication.
					</p>
				</div>
			</section>

			<section className="py-24 px-6">
				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-16">
						<h2 className="text-3xl font-light text-stone-900 mb-4 tracking-wide">
							Premium Collection
						</h2>
						<div className="w-16 h-px bg-stone-300 mx-auto"></div>
					</div>

					{loading ? (
						<div className="text-center py-20">
							<div className="inline-block w-6 h-6 border border-stone-300 border-t-stone-600 rounded-full animate-spin"></div>
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
							{products.slice(0, 6).map((product) => (
								<PremiumProductCard key={product.id} product={product} />
							))}
						</div>
					)}
				</div>
			</section>

			<footer className="bg-white border-t border-stone-200 py-16 px-6">
				<div className="max-w-5xl mx-auto text-center">
					<h3 className="text-xl font-light text-stone-900 tracking-wider mb-2">
						TJ'S
					</h3>
					<p className="text-sm text-stone-600 font-light mb-8">
						Premium Bakery
					</p>
					<div className="text-xs text-stone-500 font-light">
						© 2024 TJ's Premium Bakery
					</div>
				</div>
			</footer>
		</div>
	);
}
