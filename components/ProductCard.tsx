"use client";

import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { addItem } from "@/lib/cart";
import {
	useNotifications,
	showBasketNotification,
} from "./NotificationManager";
import type { Product } from "./ProductGrid";

export default function ProductCard({ product }: { product: Product }) {
	const [isAdding, setIsAdding] = useState(false);
	const [isAdded, setIsAdded] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { showNotification } = useNotifications();

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

			// Show premium notification
			showBasketNotification(
				showNotification,
				product.name,
				() => {
					// Navigate to basket page
					window.location.href = "/basket";
				},
				() => {
					// Continue shopping - just close notification
				}
			);

			// Success feedback
			console.log(`Added ${product.name} to basket`);
			setIsAdded(true);

			// Reset success state after 2 seconds
			setTimeout(() => setIsAdded(false), 2000);
		} catch (err: any) {
			console.error("Failed to add to basket:", err);
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
				initial={{ opacity: 0 }}
				whileInView={{ opacity: 1 }}
				viewport={{ once: true }}
				transition={{ duration: 0.2 }}
				className="bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col h-full">
				{/* Product Image */}
				<div className="w-full h-48 relative">
					{product.image_url ? (
						<Image
							src={product.image_url}
							alt={product.name}
							fill
							className="object-cover"
							sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
						/>
					) : (
						<div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
							<svg
								className="w-12 h-12"
								fill="currentColor"
								viewBox="0 0 20 20">
								<path
									fillRule="evenodd"
									d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
									clipRule="evenodd"
								/>
							</svg>
						</div>
					)}
				</div>

				{/* Content */}
				<div className="flex flex-col items-center text-center p-6 space-y-4 flex-grow">
					<h3 className="font-semibold text-xl text-primaryDark leading-tight">
						{product.name}
					</h3>
					<p className="text-primaryDark font-semibold text-lg">
						£{(product.price_pence / 100).toFixed(2)}
					</p>

					{/* Optional elements container with consistent height */}
					<div className="min-h-[60px] flex flex-col items-center justify-center space-y-2">
						{product.pack_label && (
							<span className="text-sm text-gray-600 italic bg-gray-50 px-3 py-1 rounded-full">
								{product.pack_label}
							</span>
						)}

						{product.allergens && product.allergens.length > 0 && (
							<div className="flex flex-wrap justify-center gap-2">
								{product.allergens.map((allergen) => (
									<span
										key={allergen}
										className="bg-primaryLight text-primaryDark text-xs px-3 py-1.5 rounded-full font-medium">
										{allergen}
									</span>
								))}
							</div>
						)}
					</div>

					{error && (
						<div className="text-red-500 text-sm mt-2 bg-red-50 px-3 py-2 rounded-lg">
							{error}
						</div>
					)}

					<button
						onClick={addToBasket}
						disabled={isAdding || isAdded}
						className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded font-semibold transition-colors duration-200 ${
							isAdding
								? "bg-gray-300 text-gray-500 cursor-not-allowed"
								: isAdded
								? "bg-green-500 text-white cursor-default"
								: "bg-primary hover:bg-primaryDark text-white"
						}`}>
						{isAdding ? (
							<>
								<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
								Adding...
							</>
						) : isAdded ? (
							<>
								<svg
									className="w-4 h-4"
									fill="currentColor"
									viewBox="0 0 20 20">
									<path
										fillRule="evenodd"
										d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
										clipRule="evenodd"
									/>
								</svg>
								Added to Basket!
							</>
						) : (
							<>
								<ShoppingCart size={18} />
								Add to Basket
							</>
						)}
					</button>
				</div>
			</motion.div>
		</>
	);
}
