// components/ProductGrid.tsx
import ProductCard from "./ProductCard";

export type Product = {
	id: string;
	name: string;
	price_pence: number;
	image_url?: string | null;
	pack_label?: string | null;
	allergens?: string[] | null;
};

export default function ProductGrid({ products }: { products: Product[] }) {
	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{products.map((p) => (
				<ProductCard key={p.id} product={p} />
			))}
		</div>
	);
}
