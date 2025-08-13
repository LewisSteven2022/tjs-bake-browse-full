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
	};
};

async function fetchGroceries(): Promise<Product[]> {
	try {
		const response = await fetch("/api/products");
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data = await response.json();
		const products = data.products || [];

		// Get the groceries category ID
		const groceriesCategoryId = "groceries"; // This should match your category slug

		// Filter products by category (using the new schema category_id field)
		return products.filter(
			(product: Product) =>
				product.category_id === groceriesCategoryId ||
				product.category === "groceries" // Fallback for different category formats
		);
	} catch (error) {
		console.error("Error fetching groceries:", error);
		throw error;
	}
}

export default function GroceriesPage() {
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const loadProducts = async () => {
			try {
				setLoading(true);
				setError(null);
				const data = await fetchGroceries();
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
	}, []);

	if (loading) {
		return (
			<div className="min-h-screen bg-white">
				<div className="container mx-auto px-4 py-8">
					<div className="text-center">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
						<p className="mt-4 text-blue-600">Loading groceries...</p>
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-white">
				<div className="container mx-auto px-4 py-8">
					<div className="text-center">
						<p className="text-red-600 mb-4">Error: {error}</p>
						<button
							onClick={() => window.location.reload()}
							className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
							Retry
						</button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-white">
			<div className="container mx-auto px-4 py-8">
				<div className="text-center mb-12">
					<h1 className="text-4xl font-bold text-blue-600 mb-4">
						Fresh Groceries
					</h1>
					<p className="text-lg text-blue-600 max-w-2xl mx-auto">
						Quality ingredients and essential grocery items for all your baking
						and cooking needs.
					</p>
				</div>

				{products.length === 0 ? (
					<div className="text-center text-blue-600 text-lg">
						No groceries available at the moment.
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
