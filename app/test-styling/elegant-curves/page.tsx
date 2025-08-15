"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingCart, Moon, Flower } from "lucide-react";
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

function ElegantProductCard({ product }: { product: Product }) {
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
			initial={{ opacity: 0, scale: 0.95 }}
			whileInView={{ opacity: 1, scale: 1 }}
			viewport={{ once: true }}
			transition={{ duration: 0.6 }}
			className="group">
			<div
				className="bg-gradient-to-br from-rose-50 via-white to-violet-50 shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden group"
				style={{
					borderRadius: "3rem 1rem 3rem 1rem",
					transform: "rotate(-1deg)",
				}}>
				<div
					className="relative h-64 overflow-hidden bg-gradient-to-br from-rose-100 to-violet-100"
					style={{ borderRadius: "3rem 1rem 0 0" }}>
					{product.image_url ? (
						<Image
							src={product.image_url}
							alt={product.name}
							fill
							className="object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
							sizes="(max-width: 768px) 100vw, 50vw"
						/>
					) : (
						<div className="w-full h-full flex items-center justify-center">
							<div
								className="w-20 h-20 bg-gradient-to-br from-rose-200 to-violet-200 flex items-center justify-center"
								style={{ borderRadius: "2rem 0.5rem 2rem 0.5rem" }}>
								<Flower className="w-8 h-8 text-rose-400" />
							</div>
						</div>
					)}

					<div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

					<div
						className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 text-sm font-medium text-rose-700"
						style={{ borderRadius: "1rem 0.25rem 1rem 0.25rem" }}>
						£{(product.price_pence / 100).toFixed(2)}
					</div>
				</div>

				<div className="p-8 space-y-5" style={{ transform: "rotate(1deg)" }}>
					<div>
						<h3 className="text-xl font-serif text-rose-900 leading-tight mb-2">
							{product.name}
						</h3>

						{product.pack_label && (
							<p
								className="text-sm text-rose-600 bg-rose-50 px-4 py-2 inline-block border border-rose-200"
								style={{ borderRadius: "1.5rem 0.5rem 1.5rem 0.5rem" }}>
								{product.pack_label}
							</p>
						)}
					</div>

					{product.allergens && product.allergens.length > 0 && (
						<div className="flex flex-wrap gap-2">
							{product.allergens.slice(0, 3).map((allergen) => (
								<span
									key={allergen}
									className="bg-violet-50 text-violet-700 text-xs px-3 py-1 border border-violet-200"
									style={{ borderRadius: "1rem 0.25rem 1rem 0.25rem" }}>
									{allergen}
								</span>
							))}
							{product.allergens.length > 3 && (
								<span className="text-violet-500 text-xs">
									+{product.allergens.length - 3} more
								</span>
							)}
						</div>
					)}

					<button
						onClick={addToBasket}
						disabled={isAdding || isAdded}
						className={`w-full py-4 font-serif text-sm transition-all duration-300 ${
							isAdding
								? "bg-rose-100 text-rose-400 cursor-not-allowed"
								: isAdded
								? "bg-emerald-100 text-emerald-700 border border-emerald-200"
								: "bg-gradient-to-r from-rose-600 to-violet-600 hover:from-rose-700 hover:to-violet-700 text-white shadow-md hover:shadow-lg"
						}`}
						style={{ borderRadius: "2rem 0.5rem 2rem 0.5rem" }}>
						{isAdding ? (
							<span className="flex items-center justify-center gap-2">
								<div className="w-4 h-4 border-2 border-rose-400 border-t-transparent rounded-full animate-spin"></div>
								Adding to basket...
							</span>
						) : isAdded ? (
							<span className="flex items-center justify-center gap-2">
								<Flower className="w-4 h-4" />
								Added to basket
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

export default function ElegantCurvesPage() {
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
		<div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-violet-50">
			<header className="bg-white/80 backdrop-blur-lg border-b border-rose-200/50 sticky top-0 z-50">
				<div className="max-w-7xl mx-auto px-6 py-6">
					<div className="flex items-center justify-between">
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.6 }}
							className="flex items-center gap-3">
							<div
								className="w-12 h-12 bg-gradient-to-br from-rose-400 to-violet-500 flex items-center justify-center"
								style={{ borderRadius: "1.5rem 0.5rem 1.5rem 0.5rem" }}>
								<Flower className="w-6 h-6 text-white" />
							</div>
							<div>
								<h1 className="text-2xl font-serif text-rose-900">
									TJ's Garden
								</h1>
								<p className="text-sm text-rose-600">Organic & Beautiful</p>
							</div>
						</motion.div>

						<nav className="flex items-center space-x-8">
							<a
								href="#"
								className="text-rose-700 hover:text-rose-900 font-medium transition-colors">
								Home
							</a>
							<a
								href="#"
								className="text-rose-700 hover:text-rose-900 font-medium transition-colors">
								Collection
							</a>
							<a
								href="#"
								className="text-rose-700 hover:text-rose-900 font-medium transition-colors">
								About
							</a>
							<a
								href="#"
								className="text-rose-700 hover:text-rose-900 font-medium transition-colors">
								Contact
							</a>
							<button
								className="relative bg-gradient-to-r from-rose-500 to-violet-500 text-white px-6 py-3 hover:from-rose-600 hover:to-violet-600 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
								style={{ borderRadius: "1.5rem 0.5rem 1.5rem 0.5rem" }}>
								<ShoppingCart size={18} />
								<span className="font-medium">Basket</span>
							</button>
						</nav>
					</div>
				</div>
			</header>

			<section className="py-24 px-6">
				<div className="max-w-5xl mx-auto text-center">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.2 }}
						className="space-y-8">
						<h2 className="text-6xl md:text-7xl font-serif text-rose-900 leading-tight">
							Naturally
							<span className="block text-violet-700">Beautiful</span>
						</h2>
						<p className="text-xl text-rose-700 max-w-3xl mx-auto leading-relaxed">
							Where nature's bounty meets artisan craftsmanship. Every creation
							celebrates the organic beauty of natural ingredients and flowing,
							elegant design.
						</p>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.6 }}
						className="mt-12 flex flex-col sm:flex-row gap-6 justify-center">
						<button
							className="bg-gradient-to-r from-rose-600 to-violet-600 hover:from-rose-700 hover:to-violet-700 text-white px-10 py-4 font-serif text-lg shadow-lg hover:shadow-xl transition-all duration-300"
							style={{ borderRadius: "2rem 0.5rem 2rem 0.5rem" }}>
							Discover Our Garden
						</button>
						<button
							className="border-2 border-rose-600 text-rose-700 hover:bg-rose-600 hover:text-white px-10 py-4 font-serif text-lg transition-all duration-300"
							style={{ borderRadius: "2rem 0.5rem 2rem 0.5rem" }}>
							Our Story
						</button>
					</motion.div>
				</div>
			</section>

			<section className="py-16 px-6 bg-white/60 backdrop-blur-sm">
				<div className="max-w-6xl mx-auto">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-12">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6 }}
							className="text-center">
							<div
								className="w-20 h-20 bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center mx-auto mb-6"
								style={{ borderRadius: "2.5rem 0.5rem 2.5rem 0.5rem" }}>
								<Flower className="w-8 h-8 text-white" />
							</div>
							<h4 className="text-xl font-serif text-rose-900 mb-4">
								Organic Ingredients
							</h4>
							<p className="text-rose-700 leading-relaxed">
								Sourced from local organic farms, celebrating the pure essence
								of nature's gifts.
							</p>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.2 }}
							className="text-center">
							<div
								className="w-20 h-20 bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center mx-auto mb-6"
								style={{ borderRadius: "2.5rem 0.5rem 2.5rem 0.5rem" }}>
								<Moon className="w-8 h-8 text-white" />
							</div>
							<h4 className="text-xl font-serif text-rose-900 mb-4">
								Artisan Craft
							</h4>
							<p className="text-rose-700 leading-relaxed">
								Each piece is lovingly handcrafted with flowing, organic
								techniques and care.
							</p>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.4 }}
							className="text-center">
							<div
								className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mx-auto mb-6"
								style={{ borderRadius: "2.5rem 0.5rem 2.5rem 0.5rem" }}>
								<div className="w-6 h-6 bg-white rounded-full"></div>
							</div>
							<h4 className="text-xl font-serif text-rose-900 mb-4">
								Natural Beauty
							</h4>
							<p className="text-rose-700 leading-relaxed">
								Celebrating the inherent beauty found in natural forms and
								organic shapes.
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
						className="text-center mb-20">
						<h2 className="text-4xl font-serif text-rose-900 mb-6">
							Our Garden Collection
						</h2>
						<div
							className="w-24 h-2 bg-gradient-to-r from-rose-400 to-violet-500 mx-auto"
							style={{ borderRadius: "1rem" }}></div>
						<p className="text-lg text-rose-700 max-w-2xl mx-auto mt-6">
							Discover artisan creations that bloom with natural beauty and
							organic elegance
						</p>
					</motion.div>

					{loading ? (
						<div className="text-center py-20">
							<div className="inline-block w-8 h-8 border-2 border-rose-200 border-t-rose-600 rounded-full animate-spin"></div>
							<p className="text-rose-700 mt-4 font-serif">
								Blooming your collection...
							</p>
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
							{products.slice(0, 6).map((product) => (
								<ElegantProductCard key={product.id} product={product} />
							))}
						</div>
					)}

					<motion.div
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, delay: 0.3 }}
						className="text-center mt-20">
						<button
							className="bg-gradient-to-r from-rose-600 to-violet-600 hover:from-rose-700 hover:to-violet-700 text-white px-12 py-4 font-serif text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 mx-auto"
							style={{ borderRadius: "2rem 0.5rem 2rem 0.5rem" }}>
							<Flower className="w-5 h-5" />
							Explore Full Garden
						</button>
					</motion.div>
				</div>
			</section>

			<footer className="bg-gradient-to-br from-rose-900 to-violet-900 text-white py-16 px-6">
				<div className="max-w-6xl mx-auto text-center">
					<div className="flex items-center justify-center gap-3 mb-6">
						<div
							className="w-12 h-12 bg-gradient-to-br from-rose-400 to-violet-500 flex items-center justify-center"
							style={{ borderRadius: "1.5rem 0.5rem 1.5rem 0.5rem" }}>
							<Flower className="w-6 h-6 text-white" />
						</div>
						<h3 className="text-2xl font-serif">TJ's Garden</h3>
					</div>
					<p className="text-rose-200 mb-8 max-w-md mx-auto">
						Where natural beauty blooms in every artisan creation
					</p>
					<div className="flex justify-center space-x-8 text-sm">
						<a
							href="#"
							className="text-rose-300 hover:text-white transition-colors">
							Collection
						</a>
						<a
							href="#"
							className="text-rose-300 hover:text-white transition-colors">
							About
						</a>
						<a
							href="#"
							className="text-rose-300 hover:text-white transition-colors">
							Contact
						</a>
						<a
							href="#"
							className="text-rose-300 hover:text-white transition-colors">
							Terms
						</a>
					</div>
					<div className="mt-8 text-xs text-rose-400">
						© 2024 TJ's Garden Bakery. Naturally beautiful.
					</div>
				</div>
			</footer>
		</div>
	);
}
