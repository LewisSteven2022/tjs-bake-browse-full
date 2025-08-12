// app/groceries/page.tsx
import { createClient } from "@supabase/supabase-js";
import ProductGrid from "@/components/ProductGrid";

type Product = {
	id: string;
	name: string;
	price_pence: number;
	image_url?: string | null;
	pack_label?: string | null;
	allergens?: string[] | null;
	category?: {
		id: string;
		name: string;
		slug: string;
	} | null;
};

export const revalidate = 60;

async function fetchGroceries(): Promise<Product[]> {
	const supabase = createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{ auth: { persistSession: false } }
	);

	const { data, error } = await supabase
		.from("products")
		.select(
			`
			id,
			name,
			price_pence,
			image_url,
			pack_label,
			allergens,
			category_id,
			categories!inner(id, name, slug)
		`
		)
		.eq("categories.slug", "groceries")
		.eq("visible", true)
		.gt("stock", 0)
		.order("name", { ascending: true });

	if (error) {
		console.error("fetchGroceries:", error);
		return [];
	}

	// Transform the data to flatten the category info and normalize allergens
	const products = (data ?? []).map((product) => {
		// Normalize allergens to string array
		let normalizedAllergens: string[] | null = null;
		if (Array.isArray(product.allergens)) {
			normalizedAllergens = product.allergens;
		} else if (
			typeof product.allergens === "string" &&
			product.allergens.trim() !== ""
		) {
			try {
				const parsed = JSON.parse(product.allergens);
				normalizedAllergens = Array.isArray(parsed)
					? parsed
					: [product.allergens];
			} catch {
				normalizedAllergens = product.allergens
					.split(",")
					.map((s: string) => s.trim())
					.filter(Boolean);
			}
		}

		return {
			...product,
			allergens: normalizedAllergens,
			category:
				product.categories &&
				Array.isArray(product.categories) &&
				product.categories.length > 0
					? {
							id: product.categories[0].id,
							name: product.categories[0].name,
							slug: product.categories[0].slug,
					  }
					: null,
		};
	});

	return products as Product[];
}

export default async function GroceriesPage() {
	const products = await fetchGroceries();

	return (
		<div className="max-w-6xl mx-auto px-4 py-8">
			<h1 className="mb-8 text-3xl font-bold text-gray-900">Groceries</h1>
			<ProductGrid products={products} />
		</div>
	);
}
