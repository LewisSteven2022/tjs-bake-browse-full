// app/groceries/page.tsx
import ProductGrid, { Product } from "@/components/ProductGrid";
import { createClient } from "@supabase/supabase-js";

export const revalidate = 60;

async function fetchGroceries(): Promise<Product[]> {
	const supabase = createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{ auth: { persistSession: false } }
	);

	const { data, error } = await supabase
		.from("products")
		.select("id, name, price_pence, image_url, pack_label, allergens")
		.eq("category", "groceries")
		.eq("visible", true)
		.gt("stock", 0)
		.order("name", { ascending: true });

	if (error) {
		console.error("fetchGroceries:", error);
		return [];
	}
	return (data ?? []) as Product[];
}

export default async function GroceriesPage() {
	const products = await fetchGroceries();

	return (
		<main className="mx-auto max-w-5xl p-4">
			<h1 className="mb-4 text-2xl font-semibold">Groceries</h1>
			{products.length === 0 ? (
				<p>No groceries available right now.</p>
			) : (
				<ProductGrid products={products} />
			)}
		</main>
	);
}
