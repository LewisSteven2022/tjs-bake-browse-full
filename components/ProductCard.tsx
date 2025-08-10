// components/ProductCard.tsx
"use client";

import { addItem } from "@/lib/cart";
import { toast } from "react-hot-toast";

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
		<div className="rounded-2xl border bg-white overflow-hidden shadow-sm flex flex-col">
			<img
				src={product.image_url || "/images/placeholder.svg"}
				alt={product.name}
				className="w-full h-48 object-cover"
				loading="lazy"
				decoding="async"
				onError={(e) => {
					const img = e.currentTarget as HTMLImageElement;
					img.onerror = null;
					img.src = "/images/placeholder.svg";
				}}
			/>

			<div className="p-4 flex-1 flex flex-col gap-2">
				<div className="font-medium">{product.name}</div>
				{product.pack_label && (
					<div className="text-xs text-gray-500">{product.pack_label}</div>
				)}
				<div className="text-sm opacity-70">
					£{(product.price_pence / 100).toFixed(2)}
				</div>

				<button
					type="button"
					className="mt-auto rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
					onClick={handleAdd}>
					Add to basket
				</button>
			</div>
		</div>
	);
}
