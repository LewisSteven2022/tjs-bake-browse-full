"use client";

import { useCart } from "@/components/CartContext";
import { setQty, removeItem, clearCart } from "@/lib/cart";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const GBP = (p: number) => `£${(p / 100).toFixed(2)}`;

export default function BasketPage() {
	const { items, total, loading, refreshCart } = useCart();
	const [updating, setUpdating] = useState<string | null>(null);

	const handleQuantityChange = async (product_id: string, newQty: number) => {
		if (newQty < 1) return;
		setUpdating(product_id);
		try {
			await setQty(product_id, newQty);
			await refreshCart();
		} catch (error) {
			// silent
		} finally {
			setUpdating(null);
		}
	};

	const handleRemoveItem = async (product_id: string) => {
		setUpdating(product_id);
		try {
			await removeItem(product_id);
			await refreshCart();
		} catch (error) {
			// silent
		} finally {
			setUpdating(null);
		}
	};

	const handleClearCart = async () => {
		try {
			await clearCart();
			await refreshCart();
		} catch (error) {
			// silent
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
					<p className="text-gray-600">Loading your basket...</p>
				</div>
			</div>
		);
	}

	if (items.length === 0) {
		return (
			<div className="min-h-screen">
				<div className="max-w-4xl mx-auto px-4 py-8">
					{/* Header */}
					<div className="mb-8">
						<Link
							href="/"
							className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors mb-4">
							<ArrowLeft className="w-4 h-4" />
							Continue Shopping
						</Link>
						<h1 className="text-3xl font-bold text-gray-800 text-center">
							Your Basket
						</h1>
					</div>

					{/* Empty State */}
					<div className="text-center max-w-md mx-auto">
						<ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
						<h1 className="text-2xl font-bold text-gray-800 mb-2">
							Your basket is empty
						</h1>
						<p className="text-gray-600 mb-6">
							Looks like you haven't added any items to your basket yet.
						</p>
						<Link
							href="/baked-goods"
							className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
							<ShoppingBag className="w-5 h-5" />
							Start Shopping
						</Link>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen">
			<div className="max-w-4xl mx-auto px-4 py-8">
				{/* Header */}
				<div className="mb-8">
					<Link
						href="/"
						className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors mb-4">
						<ArrowLeft className="w-4 h-4" />
						Continue Shopping
					</Link>
					<div className="flex items-center justify-between">
						<h1 className="text-3xl font-bold text-gray-800">Your Basket</h1>
						<button
							onClick={handleClearCart}
							disabled={updating === "clear"}
							className="inline-flex items-center gap-2 text-red-600 hover:text-red-800 transition-colors disabled:opacity-50">
							<Trash2 className="w-4 h-4" />
							Clear Basket
						</button>
					</div>
				</div>

				{/* Basket Items */}
				<div className="space-y-4 mb-8">
					{items.map((item) => (
						<div
							key={item.product_id}
							className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
							<div className="flex items-center gap-4">
								{/* Product Image */}
								<div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
									{item.image_url ? (
										<img
											src={item.image_url}
											alt={item.name}
											className="w-full h-full object-cover rounded-lg"
										/>
									) : (
										<ShoppingBag className="w-8 h-8 text-gray-400" />
									)}
								</div>

								{/* Product Info */}
								<div className="flex-1">
									<h3 className="font-semibold text-gray-800 text-lg">
										{item.name}
									</h3>
									<p className="text-gray-600">{GBP(item.price_pence)} each</p>
								</div>

								{/* Quantity Controls */}
								<div className="flex items-center gap-2">
									<button
										onClick={() =>
											handleQuantityChange(item.product_id, item.qty - 1)
										}
										disabled={updating === item.product_id || item.qty <= 1}
										className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
										<Minus className="w-4 h-4" />
									</button>
									<span className="w-12 text-center font-medium">
										{item.qty}
									</span>
									<button
										onClick={() =>
											handleQuantityChange(item.product_id, item.qty + 1)
										}
										disabled={updating === item.product_id}
										className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50">
										<Plus className="w-4 h-4" />
									</button>
								</div>

								{/* Item Total */}
								<div className="text-right min-w-[80px]">
									<p className="font-semibold text-gray-800">
										{GBP(item.price_pence * item.qty)}
									</p>
								</div>

								{/* Remove Button */}
								<button
									onClick={() => handleRemoveItem(item.product_id)}
									disabled={updating === item.product_id}
									className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50">
									<Trash2 className="w-4 h-4" />
								</button>
							</div>
						</div>
					))}
				</div>

				{/* Order Summary */}
				<div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-xl font-semibold text-gray-800">
							Order Summary
						</h2>
					</div>

					<div className="space-y-3 mb-6">
						<div className="flex justify-between text-gray-600">
							<span>
								Subtotal ({items.reduce((sum, item) => sum + item.qty, 0)}{" "}
								items)
							</span>
							<span>{GBP(total)}</span>
						</div>
					</div>

					{/* Checkout Button */}
					<div className="flex gap-4">
						<Link
							href="/checkout"
							className="flex-1 bg-blue-600 text-white text-center py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium">
							Proceed to Checkout
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
