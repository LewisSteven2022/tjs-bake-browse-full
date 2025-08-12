import { createClient } from "@supabase/supabase-js";
import ParallaxHero from "@/components/ParallaxHero";
import ProductGrid from "@/components/ProductGrid";

export type Product = {
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

async function fetchBakedGoods(): Promise<Product[]> {
	const supabase = createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{ auth: { persistSession: false } }
	);

	console.log("Fetching baked goods at:", new Date().toISOString());

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
		.eq("categories.slug", "baked_goods")
		.eq("visible", true)
		.gt("stock", 0)
		.order("name", { ascending: true });

	if (error) {
		console.error("fetchBakedGoods:", error);
		return [];
	}

	// Normalise allergens + flatten category
	const products = (data ?? []).map((product) => {
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

		const normalizedProduct = {
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

		console.log(
			`Product: ${normalizedProduct.name}, Price: ${
				normalizedProduct.price_pence
			} pence (£${(normalizedProduct.price_pence / 100).toFixed(2)})`
		);
		return normalizedProduct;
	});

	return products as Product[];
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function BakedGoodsPage() {
	const products = await fetchBakedGoods();

	return (
		<main className="bg-white">
			<ParallaxHero
				title="Our Baked Goods"
				subtitle="Freshly baked, allergen-conscious treats made daily."
				image="/images/baked-goods-hero.jpg"
				height="300px"
			/>

			<section className="max-w-6xl mx-auto px-4 py-16">
				<h1 className="mb-8 text-3xl font-bold text-primaryDark">
					Browse Baked Goods
				</h1>
				<ProductGrid products={products} />
			</section>
		</main>
	);
}
