// components/ProductCard.tsx
"use client";
import { addItem } from "@/lib/cart";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

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
	const { data: session, status } = useSession();
	const router = useRouter();
	if (!product) return null;

	const handleAdd = async () => {
		if (status !== "loading" && !session) {
			router.push(
				`/login?callbackUrl=${encodeURIComponent(location.pathname)}`
			);
			return;
		}
		try {
			await addItem({
				product_id: product.id,
				name: product.name,
				price_pence: product.price_pence,
				qty: 1,
			});
			toast.success(`${product.name} added to basket`);
		} catch (e: any) {
			toast.error(e?.message || "Could not add to basket");
		}
	};

	return (
		<div className="rounded-2xl border p-4 shadow-sm bg-white">
			{product.image_url && (
				<img
					src={product.image_url}
					alt={product.name}
					className="mb-3 h-40 w-full object-cover rounded-xl"
					loading="lazy"
					decoding="async"
					onError={(e) => {
						(e.currentTarget as HTMLImageElement).style.display = "none";
					}}
				/>
			)}
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
