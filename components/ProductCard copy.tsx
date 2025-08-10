// components/ProductCard.tsx
"use client";

import { addItem } from "@/lib/cart";
import { toast } from "react-hot-toast"; // ✅ named import

type Product = {
	id: string;
	name: string;
	price_pence: number;
	image_url?: string | null;
	pack_label?: string | null;
	allergens?: string[] | null;
};
type Props = { product?: Product };

export default function ProductCard({ product }: Props) {
	if (!product) return null;

	const handleAdd = () => {
		addItem({
			product_id: product.id,
			name: product.name,
			price_pence: product.price_pence,
			qty: 1,
		});
		toast.success(`${product.name} added to basket`);
	};

	return (
		<div className="rounded-2xl border p-4 shadow-sm">
			<div className="font-medium">{product.name}</div>
			<div className="text-sm opacity-70">
				£{(product.price_pence / 100).toFixed(2)}
			</div>
			<button
				type="button"
				className="mt-3 rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
				onClick={handleAdd}>
				Add to basket
			</button>
		</div>
	);
}
