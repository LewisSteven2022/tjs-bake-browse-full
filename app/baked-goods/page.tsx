"use client";
import { useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard";

// Define Product type locally to avoid import issues
type Product = {
	id: string;
	name: string;
	price_pence: number;
	image_url?: string | null;
	pack_label?: string | null;
	allergens?: string[] | null;
	category?: string | null;
	category_id?: string | null;
	stock?: number;
	stock_quantity?: number;
	visible?: boolean;
	is_visible?: boolean;
	categories?: {
		id: string;
		name: string;
		slug: string;
		description: string | null;
	}[];
};

async function fetchBakedGoods(): Promise<Product[]> {
	try {
		const response = await fetch(`/api/products?category=baked_goods&t=${Date.now()}`, {
			cache: "no-store",
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();

		return data.products || [];
	} catch (error) {
		throw error;
	}
}

export default function BakedGoodsPage() {
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const loadProducts = async () => {
			try {
				setLoading(true);
				setError(null);
				const data = await fetchBakedGoods();
				setProducts(data);
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "Failed to load products"
				);
			} finally {
				setLoading(false);
			}
		};

		loadProducts();

		// Add interval to refresh data every 30 seconds for real-time updates
		const interval = setInterval(loadProducts, 30000);

		// Listen for visibility change to refresh when user returns to tab
		const handleVisibilityChange = () => {
			if (!document.hidden) {
				loadProducts();
			}
		};
		document.addEventListener("visibilitychange", handleVisibilityChange);

		return () => {
			clearInterval(interval);
			document.removeEventListener("visibilitychange", handleVisibilityChange);
		};
	}, []);

	if (loading) {
		return (
			<div className="min-h-screen bg-elegance">
				<div className="container-elegance section-elegance">
					<div className="text-center">
						<div className="animate-spin rounded-full h-8 w-8 border-b border-neutral-400 mx-auto"></div>
						<p className="mt-4 text-elegance-body">Loading baked goods...</p>
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-elegance">
				<div className="container-elegance section-elegance">
					<div className="text-center space-elegance-compact">
						<p className="text-red-600 mb-4">Error: {error}</p>
						<button
							onClick={() => window.location.reload()}
							className="btn-elegance-secondary">
							Retry
						</button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-elegance">
			<div className="container-elegance section-elegance">
				<div className="text-center mb-16">
					<h1 className="text-4xl text-elegance-heading mb-4">
						Fresh Baked Goods
					</h1>
					<p className="text-elegance-body max-w-2xl mx-auto">
						Discover our selection of freshly baked breads, pastries, and sweet
						treats made with love and quality ingredients.
					</p>
				</div>

				{products.length === 0 ? (
					<div className="text-center text-elegance-body">
						No baked goods available at the moment.
					</div>
				) : (
					<div className="grid-elegance-products">
						{products.map((product) => (
							<ProductCard
								key={product.id}
								product={{
									id: product.id,
									name: product.name,
									price_pence: product.price_pence,
									image_url: product.image_url,
									pack_label: product.pack_label,
									allergens: product.allergens,
								}}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
