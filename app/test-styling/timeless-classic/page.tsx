"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingCart, Clock } from "lucide-react";
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

function TimelessProductCard({ product }: { product: Product }) {
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
			<div className="bg-white border-2 border-amber-200 hover:border-amber-300 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md">
				<div className="relative h-64 bg-amber-50 overflow-hidden">
					{product.image_url ? (
						<Image
							src={product.image_url}
							alt={product.name}
							fill
							className="object-cover transition-transform duration-500 group-hover:scale-105"
							sizes="(max-width: 768px) 100vw, 50vw"
						/>
					) : (
						<div className="w-full h-full bg-amber-100 flex items-center justify-center">
							<Clock className="w-12 h-12 text-amber-400" />
						</div>
					)}
				</div>

				<div className="p-6 space-y-4 border-t border-amber-200">
					<div>
						<h3 className="text-lg font-serif text-amber-900 leading-tight mb-2">
							{product.name}
						</h3>
						<p className="text-xl font-serif text-amber-800">
							£{(product.price_pence / 100).toFixed(2)}
						</p>
					</div>

					{product.pack_label && (
						<p className="text-sm text-amber-700 bg-amber-50 px-3 py-1 inline-block border border-amber-200">
							{product.pack_label}
						</p>
					)}

					<button
						onClick={addToBasket}
						disabled={isAdding || isAdded}
						className={`w-full py-3 font-serif text-sm transition-all duration-300 border-2 ${
							isAdding
								? "bg-amber-100 text-amber-400 border-amber-200 cursor-not-allowed"
								: isAdded
								? "bg-green-50 text-green-700 border-green-300"
								: "bg-transparent hover:bg-amber-800 text-amber-800 hover:text-white border-amber-800"
						}`}>
						{isAdding ? "Adding..." : isAdded ? "Added" : "Add to Basket"}
					</button>
				</div>
			</div>
		</motion.div>
	);
}

export default function TimelessClassicPage() {
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
		<div className="min-h-screen bg-amber-50">
			<header className="bg-white border-b-2 border-amber-200">
				<div className="max-w-6xl mx-auto px-6 py-8">
					<div className="flex items-center justify-between">
						<div className="text-center">
							<h1 className="text-3xl font-serif text-amber-900">
								TJ's Traditional Bakery
							</h1>
							<p className="text-sm text-amber-700 mt-1">
								Est. 1924 • Family Recipes
							</p>
						</div>
						<nav className="flex items-center space-x-8 text-sm font-serif">
							<a
								href="#"
								className="text-amber-700 hover:text-amber-900 transition-colors">
								Home
							</a>
							<a
								href="#"
								className="text-amber-700 hover:text-amber-900 transition-colors">
								Recipes
							</a>
							<a
								href="#"
								className="text-amber-700 hover:text-amber-900 transition-colors">
								Heritage
							</a>
							<a
								href="#"
								className="text-amber-700 hover:text-amber-900 transition-colors">
								Contact
							</a>
							<button className="bg-amber-800 text-white px-6 py-3 hover:bg-amber-900 transition-colors border-2 border-amber-800">
								<ShoppingCart size={16} />
							</button>
						</nav>
					</div>
				</div>
			</header>

			<section className="py-20 px-6">
				<div className="max-w-4xl mx-auto text-center">
					<h2 className="text-5xl font-serif text-amber-900 leading-tight mb-6">
						Time-Honoured
						<br />
						<span className="text-amber-700">Traditions</span>
					</h2>
					<p className="text-lg text-amber-800 font-serif leading-relaxed max-w-3xl mx-auto">
						For four generations, we've been baking with the same love, care,
						and traditional recipes that have made us a cornerstone of our
						community.
					</p>
				</div>
			</section>

			<section className="py-16 px-6 bg-white border-y-2 border-amber-200">
				<div className="max-w-6xl mx-auto">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
						<div className="p-6">
							<div className="w-16 h-16 bg-amber-100 border-2 border-amber-300 mx-auto mb-4 flex items-center justify-center">
								<Clock className="w-8 h-8 text-amber-600" />
							</div>
							<h4 className="text-lg font-serif text-amber-900 mb-2">
								Since 1924
							</h4>
							<p className="text-amber-700 text-sm font-serif">
								Four generations of baking excellence
							</p>
						</div>
						<div className="p-6">
							<div className="w-16 h-16 bg-amber-100 border-2 border-amber-300 mx-auto mb-4 flex items-center justify-center">
								<div className="w-8 h-8 bg-amber-600"></div>
							</div>
							<h4 className="text-lg font-serif text-amber-900 mb-2">
								Family Recipes
							</h4>
							<p className="text-amber-700 text-sm font-serif">
								Handed down through the generations
							</p>
						</div>
						<div className="p-6">
							<div className="w-16 h-16 bg-amber-100 border-2 border-amber-300 mx-auto mb-4 flex items-center justify-center">
								<div className="w-8 h-8 bg-amber-600 rounded-full"></div>
							</div>
							<h4 className="text-lg font-serif text-amber-900 mb-2">
								Fresh Daily
							</h4>
							<p className="text-amber-700 text-sm font-serif">
								Baked fresh every morning at dawn
							</p>
						</div>
					</div>
				</div>
			</section>

			<section className="py-24 px-6">
				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-16">
						<h2 className="text-3xl font-serif text-amber-900 mb-4">
							Our Traditional Selection
						</h2>
						<div className="w-24 h-1 bg-amber-400 mx-auto"></div>
					</div>

					{loading ? (
						<div className="text-center py-20">
							<div className="inline-block w-8 h-8 border-2 border-amber-300 border-t-amber-700 animate-spin"></div>
							<p className="text-amber-700 mt-4 font-serif">
								Preparing our selection...
							</p>
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
							{products.slice(0, 6).map((product) => (
								<TimelessProductCard key={product.id} product={product} />
							))}
						</div>
					)}
				</div>
			</section>

			<footer className="bg-amber-800 text-white py-16 px-6">
				<div className="max-w-6xl mx-auto text-center">
					<h3 className="text-2xl font-serif mb-2">TJ's Traditional Bakery</h3>
					<p className="text-amber-200 font-serif mb-8">
						Est. 1924 • Four Generations of Excellence
					</p>
					<div className="text-xs text-amber-300 font-serif">
						© 2024 TJ's Traditional Bakery
					</div>
				</div>
			</footer>
		</div>
	);
}
