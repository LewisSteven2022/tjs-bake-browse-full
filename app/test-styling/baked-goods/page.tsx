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

		return normalizedProduct;
	});

	return products as Product[];
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function TestBakedGoodsPage() {
	const products = await fetchBakedGoods();

	return (
		<main className="min-h-screen bg-white">
			{/* Enhanced Hero Section with New Styling */}
			<ParallaxHero
				title="Our Baked Goods"
				subtitle="Freshly baked, allergen-conscious treats made daily."
				image="/images/baked-goods-hero.jpg"
				height="400px"
			/>

			{/* Enhanced Content Section */}
			<section className="max-w-7xl mx-auto px-6 py-20">
				{/* Enhanced Header */}
				<div className="text-center mb-16">
					<h1 className="text-5xl font-bold text-blue-800 mb-6">
						Browse Baked Goods
					</h1>
					<p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
						Discover our handcrafted selection of gluten-free and
						allergen-conscious treats, made with premium ingredients and baked
						fresh daily in our artisan kitchen.
					</p>
				</div>

				{/* Enhanced Product Grid Container */}
				<div className="bg-white rounded-lg shadow-lg border border-blue-100 p-8">
					<ProductGrid products={products} />
				</div>

				{/* Call to Action Buttons */}
				<div className="text-center mt-16">
					<a href="/groceries" className="inline-block">
						<div className="bg-white text-blue-800 border-2 border-blue-800 px-8 py-4 rounded-full hover:bg-blue-50 transition-colors font-semibold">
							Shop Groceries
						</div>
					</a>
				</div>
			</section>

			{/* Enhanced Features Section */}
			<section className="bg-blue-50 text-gray-800 py-20">
				<div className="max-w-7xl mx-auto px-6">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<div className="text-center">
							<div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
								<svg
									className="w-8 h-8 text-white"
									fill="currentColor"
									viewBox="0 0 20 20">
									<path
										fillRule="evenodd"
										d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
										clipRule="evenodd"
									/>
								</svg>
							</div>
							<h3 className="text-xl font-semibold mb-2 text-gray-900">
								Gluten-Free
							</h3>
							<p className="text-gray-700">
								All our baked goods are carefully crafted to be gluten-free
							</p>
						</div>
						<div className="text-center">
							<div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
								<svg
									className="w-8 h-8 text-white"
									fill="currentColor"
									viewBox="0 0 20 20">
									<path
										fillRule="evenodd"
										d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
										clipRule="evenodd"
									/>
								</svg>
							</div>
							<h3 className="text-xl font-semibold mb-2 text-gray-900">
								Allergen-Conscious
							</h3>
							<p className="text-gray-700">
								Clear labelling and careful ingredient selection
							</p>
						</div>
						<div className="text-center">
							<div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
								<svg
									className="w-8 h-8 text-white"
									fill="currentColor"
									viewBox="0 0 20 20">
									<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
							</div>
							<h3 className="text-xl font-semibold mb-2 text-gray-900">
								Quality Assured
							</h3>
							<p className="text-gray-700">
								Every product meets our high standards for taste and quality
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Back to Test Styling */}
			<section className="max-w-6xl mx-auto px-6 py-12">
				<div className="text-center">
					<a
						href="/test-styling"
						className="inline-flex items-center gap-2 text-blue-800 hover:text-blue-700 transition-colors font-semibold">
						<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
							<path
								fillRule="evenodd"
								d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
								clipRule="evenodd"
							/>
						</svg>
						<span>Back to Test Styling</span>
					</a>
				</div>
			</section>
		</main>
	);
}
