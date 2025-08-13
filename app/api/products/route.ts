// app/api/products/route.ts
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const supabase = createClient(
			process.env.NEXT_PUBLIC_SUPABASE_URL!,
			process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
			{ auth: { persistSession: false } }
		);

		// Use the EXACT column names that exist in your database
		const { data, error } = await supabase
			.from("products")
			.select(
				`
				id,
				name,
				sku,
				short_description,
				price_pence,
				pack_label,
				allergens,
				ingredients,
				image_url,
				stock_quantity,
				is_visible,
				category_id,
				created_at,
				updated_at,
				categories!inner (
					id,
					name,
					slug,
					description
				)
			`
			)
			.eq("is_visible", true)
			.gt("stock_quantity", 0)
			.order("name");

		if (error) {
			console.error("Supabase error:", error);
			return NextResponse.json(
				{ error: "Failed to fetch products", details: error.message },
				{ status: 500 }
			);
		}

		// Transform products to include backward compatibility
		const normalizedProducts = (data || []).map((product) => {
			return {
				...product,
				// Backward compatibility mapping for components that expect old names
				stock: product.stock_quantity,
				visible: product.is_visible,
				category: product.category_id,
				description: product.short_description,
				// Ensure categories object exists
				categories: product.categories || {
					id: product.category_id,
					name: "Category",
					slug: "category",
					description: null,
				},
			};
		});

		return NextResponse.json({ products: normalizedProducts });
	} catch (error) {
		console.error("Unexpected error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
