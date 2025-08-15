"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import { addItem } from "@/lib/cart";
import AllergenIcons from "@/components/AllergenIcons";

type Product = {
	id: string;
	name: string;
	price_pence: number;
	image_url?: string | null;
	pack_label?: string | null;
	allergens?: string[] | null;
};

export default function ProductCard({ product }: { product: Product }) {
	const [isAdding, setIsAdding] = useState(false);
	const [isAdded, setIsAdded] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const addToBasket = async () => {
		if (isAdding) return;

		setIsAdding(true);
		setError(null);

		try {
			await addItem({
				product_id: product.id,
				name: product.name,
				price_pence: product.price_pence,
				qty: 1,
			});

			// Success feedback
			setIsAdded(true);

			// Reset success state after 2 seconds
			setTimeout(() => setIsAdded(false), 2000);
		} catch (err: any) {
			setError(err?.message || "Failed to add to basket. Please try again.");
		} finally {
			setIsAdding(false);
		}
	};

	return (
		<>
			{/* ARIA live region for screen readers */}
			<div aria-live="polite" className="sr-only">
				{isAdded && `${product.name} added to basket`}
			</div>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.5 }}
				className="card-elegance-product group">
				{/* Product Image */}
				<div className="relative h-80 bg-neutral-50 overflow-hidden mb-6">
					{product.image_url ? (
						<Image
							src={product.image_url}
							alt={product.name}
							fill
							className="img-elegance-product"
							sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
						className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 btn-elegance-secondary disabled:opacity-50"
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
					<p className="text-elegance-price">
						£{(product.price_pence / 100).toFixed(2)}
					</p>
					{product.pack_label && (
						<p className="text-xs text-neutral-400 italic">
							{product.pack_label}
						</p>
					)}

					{/* Error Display */}
					{error && (
						<div className="text-red-500 text-xs mt-2 bg-red-50 px-3 py-2 rounded">
							{error}
						</div>
					)}

					{/* Allergen Icons */}
					<div className="flex justify-center">
						<AllergenIcons
							allergens={product.allergens || []}
							variant="minimal"
						/>
					</div>
				</div>
			</motion.div>
		</>
	);
}
