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
			<div className="min-h-screen bg-elegance flex items-center justify-center">
				<div className="text-center">
					<div className="w-8 h-8 border border-neutral-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
					<p className="text-elegance-body">Loading your basket...</p>
				</div>
			</div>
		);
	}

	if (items.length === 0) {
		return (
			<div className="min-h-screen bg-elegance">
				<div className="container-elegance section-elegance">
					{/* Header */}
					<div className="mb-16">
						<Link
							href="/"
							className="inline-flex items-center space-x-2 nav-elegance-link mb-8">
							<ArrowLeft className="w-4 h-4" />
							<span>Continue Shopping</span>
						</Link>
						<h1 className="text-3xl text-elegance-heading text-center">
							Your Basket
						</h1>
					</div>

					{/* Empty State */}
					<div className="text-center max-w-md mx-auto space-elegance-compact">
						<ShoppingBag className="w-16 h-16 text-neutral-400 mx-auto mb-6" />
						<h2 className="text-elegance-heading text-xl mb-3">
							Your basket is empty
						</h2>
						<p className="text-elegance-body mb-8">
							Looks like you haven't added any items to your basket yet.
						</p>
						<Link
							href="/baked-goods"
							className="btn-elegance-primary inline-flex items-center space-x-2">
							<ShoppingBag className="w-4 h-4" />
							<span>Start Shopping</span>
						</Link>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-elegance">
			<div className="container-elegance section-elegance">
				{/* Header */}
				<div className="mb-6">
					<Link
						href="/"
						className="inline-flex items-center space-x-2 nav-elegance-link mb-4">
						<ArrowLeft className="w-4 h-4" />
						<span>Continue Shopping</span>
					</Link>
					<div className="flex items-center justify-between">
						<h1 className="text-3xl text-elegance-heading">Your Basket</h1>
						<button
							onClick={handleClearCart}
							disabled={updating === "clear"}
							className="btn-elegance-ghost text-red-600 hover:text-red-800 disabled:opacity-50">
							<Trash2 className="w-4 h-4 mr-2" />
							Clear Basket
						</button>
					</div>
				</div>

				{/* Basket Items */}
				<div className="space-y-3 mb-6">
					{items.map((item) => (
						<div
							key={item.product_id}
							className="card-elegance border-b border-neutral-200 pb-3">
							<div className="flex items-center space-x-3">
								{/* Product Image */}
								<div className="w-14 h-14 bg-neutral-50 flex items-center justify-center overflow-hidden rounded">
									{item.image_url ? (
										<img
											src={item.image_url}
											alt={item.name}
											className="w-full h-full object-cover"
											onError={(e) => {
												const target = e.target as HTMLImageElement;
												target.style.display = 'none';
												target.nextElementSibling?.classList.remove('hidden');
											}}
										/>
									) : null}
									<ShoppingBag className={`w-5 h-5 text-neutral-400 ${item.image_url ? 'hidden' : ''}`} />
								</div>

								{/* Product Info */}
								<div className="flex-1">
									<h3 className="text-elegance-heading text-lg mb-1">
										{item.name}
									</h3>
									<p className="text-elegance-price">
										{GBP(item.price_pence)} each
									</p>
								</div>

								{/* Quantity Controls */}
								<div className="flex items-center space-x-2">
									<button
										onClick={() =>
											handleQuantityChange(item.product_id, item.qty - 1)
										}
										disabled={updating === item.product_id || item.qty <= 1}
										className="w-8 h-8 flex items-center justify-center border border-neutral-300 hover:border-neutral-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
										<Minus className="w-4 h-4" />
									</button>
									<span className="w-10 text-center text-elegance-body font-medium">
										{item.qty}
									</span>
									<button
										onClick={() =>
											handleQuantityChange(item.product_id, item.qty + 1)
										}
										disabled={updating === item.product_id}
										className="w-8 h-8 flex items-center justify-center border border-neutral-300 hover:border-neutral-400 disabled:opacity-50 transition-colors">
										<Plus className="w-4 h-4" />
									</button>
								</div>

								{/* Item Total */}
								<div className="text-right min-w-[70px]">
									<p className="text-elegance-heading">
										{GBP(item.price_pence * item.qty)}
									</p>
								</div>

								{/* Remove Button */}
								<button
									onClick={() => handleRemoveItem(item.product_id)}
									disabled={updating === item.product_id}
									className="p-2 text-red-600 hover:text-red-800 transition-colors disabled:opacity-50">
									<Trash2 className="w-4 h-4" />
								</button>
							</div>
						</div>
					))}
				</div>

				{/* Order Summary */}
				<div className="card-elegance border border-neutral-200 p-5">
					<div className="flex items-center justify-between mb-5">
						<h2 className="text-elegance-heading text-xl">Order Summary</h2>
					</div>

					<div className="space-y-2 mb-5">
						<div className="flex justify-between text-elegance-body">
							<span>
								Subtotal ({items.reduce((sum, item) => sum + item.qty, 0)}{" "}
								items)
							</span>
							<span className="text-elegance-heading">{GBP(total)}</span>
						</div>
					</div>

					{/* Checkout Button */}
					<div>
						<Link
							href="/checkout"
							className="btn-elegance-primary w-full text-center block">
							Proceed to Checkout
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
