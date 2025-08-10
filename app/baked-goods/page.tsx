import ProductGrid, { Product } from "@/components/ProductGrid";
import { createClient } from "@supabase/supabase-js";

export const revalidate = 60;

async function fetchBakedGoods(): Promise<Product[]> {
	const supabase = createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{ auth: { persistSession: false } }
	);

	const { data, error } = await supabase
		.from("products")
		.select("id, name, price_pence, image_url, pack_label, allergens")
		.eq("category", "baked_goods")
		.eq("visible", true)
		.gt("stock", 0)
		.order("name", { ascending: true });

	if (error) {
		console.error("fetchBakedGoods:", error);
		return [];
	}
	return (data ?? []) as Product[];
}

export default async function BakedGoodsPage() {
	const products = await fetchBakedGoods();
	return (
		<main className="mx-auto max-w-5xl p-4">
			<h1 className="mb-4 text-2xl font-semibold">Baked Goods</h1>
			{products.length === 0 ? (
				<p>No baked goods available right now.</p>
			) : (
				<ProductGrid products={products} />
			)}
		</main>
	);
}
