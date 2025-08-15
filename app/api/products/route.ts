// app/api/products/route.ts
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { admin } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
	try {
		// Use service-role server client to avoid any RLS/session issues and ensure consistent reads
		const supabase = admin;

		const url = new URL(request.url);
		const category = url.searchParams.get("category");

		// Fetch visible products without joins for reliability
		const { data: rawProducts, error: productsError } = await supabase
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
			return NextResponse.json(
				{ error: "Failed to fetch products", details: productsError.message },
				{ status: 500 }
			);
		}

		const products = rawProducts || [];

		// Build category map for attached metadata and optional filtering
		const categoryIds = Array.from(
			new Set(products.map((p: any) => p.category_id).filter(Boolean))
		);
		let categoryMap = new Map<string, any>();
		if (categoryIds.length > 0) {
			const { data: cats } = await supabase
				.from("categories")
				.select("id, name, slug, description")
				.in("id", categoryIds);
			for (const c of cats || []) categoryMap.set(c.id, c);
		}

		// If categories join fails, fall back to products only
		// Optional filter by category slug
		let filtered = products;
		if (category) {
			const match = Array.from(categoryMap.values()).find(
				(c: any) => c.slug === category
			);
			filtered = match
				? products.filter((p: any) => p.category_id === match.id)
				: [];
		}

		// Products fetched successfully

		// Transform products to include backward compatibility
		const normalizedProducts = (filtered || []).map((product: any) => {
			const catObj = product.category_id
				? categoryMap.get(product.category_id) || null
				: null;
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
				// Ensure categories is always an array with the looked-up object
				categories: catObj ? [catObj] : [],
			};
			return transformed;
		});

		// Products transformed successfully

		// Include minimal diagnostics to verify environment alignment
		const supabaseUrlHost = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!).host;
		return NextResponse.json(
			{ products: normalizedProducts },
			{
				headers: {
					"Cache-Control": "no-store",
					"X-Supabase-Host": supabaseUrlHost,
				},
			}
		);
	} catch (error) {
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
