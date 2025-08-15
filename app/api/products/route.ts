// app/api/products/route.ts
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
	try {
		const supabase = createClient(
			process.env.NEXT_PUBLIC_SUPABASE_URL!,
			process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
			{ auth: { persistSession: false } }
		);

		// First, try to get products with categories
		let { data, error } = await supabase
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
				categories:categories!products_category_id_fkey(
					id,
					name,
					slug,
					description
				)
			`
			)
			.eq("is_visible", true)
			// .gt("stock_quantity", 0)  // TEMPORARILY COMMENTED OUT FOR DEBUGGING
			.order("name");

		// If categories join fails, fall back to products only
		if (error && error.message.includes("categories")) {
			const { data: productsOnly, error: productsError } = await supabase
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
					updated_at
				`
				)
				.eq("is_visible", true)
				.order("name");

			if (productsError) {
				// silently handle error in response
				return NextResponse.json(
					{ error: "Failed to fetch products", details: productsError.message },
					{ status: 500 }
				);
			}

			// Add categories property to match expected structure
			data = (productsOnly || []).map((product) => ({
				...product,
				categories: [],
			}));
		} else if (error) {
			return NextResponse.json(
				{ error: "Failed to fetch products", details: error.message },
				{ status: 500 }
			);
		}

		// DEBUG: Log raw data from database
		console.log("🔍 PRODUCTS API DEBUG - Raw data from DB (first 2 products):");
		console.log(JSON.stringify((data || []).slice(0, 2), null, 2));

		// Transform products to include backward compatibility
		const normalizedProducts = (data || []).map((product) => {
			// Normalise categories to always be an array for frontend filtering
			const categoriesArray = product?.categories
				? Array.isArray(product.categories)
					? product.categories
					: [product.categories]
				: [];

			const transformed = {
				...product,
				// Backward compatibility mapping for components that expect old names
				stock: product.stock_quantity,
				visible: product.is_visible,
				category: product.category_id,
				description: product.short_description,
				// Explicitly preserve critical fields to ensure they're not lost
				image_url: product.image_url,
				price_pence: product.price_pence,
				// Ensure categories is always an array
				categories: categoriesArray,
			};
			return transformed;
		});

		// DEBUG: Log transformed data
		console.log("🔍 PRODUCTS API DEBUG - Transformed data (first 2 products):");
		console.log(JSON.stringify(normalizedProducts.slice(0, 2), null, 2));

		return NextResponse.json(
			{ products: normalizedProducts },
			{ headers: { "Cache-Control": "no-store" } }
		);
	} catch (error) {
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
