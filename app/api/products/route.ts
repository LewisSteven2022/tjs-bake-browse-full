// app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { admin } from "@/lib/db";

export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);
		const category = searchParams.get("category");
		const limitRaw = searchParams.get("limit");
		const offsetRaw = searchParams.get("offset");

		const limit = Number.isFinite(Number(limitRaw))
			? parseInt(limitRaw as string, 10)
			: 0;
		const offset = Number.isFinite(Number(offsetRaw))
			? parseInt(offsetRaw as string, 10)
			: 0;

		// Base query: only visible, in‑stock products
		let q = admin
			.from("products")
			.select(
				`
				id,
				name,
				price_pence,
				image_url,
				pack_label,
				allergens,
				sku,
				category_id,
				categories!inner(id, name, slug),
				stock,
				visible,
				created_at
			`
			)
			.eq("visible", true)
			.gt("stock", 0)
			.order("created_at", { ascending: false });

		if (category) {
			// If category is provided, join with categories table to filter by slug
			q = q.eq("categories.slug", category);
		}

		// Optional pagination
		if (offset > 0 || limit > 0) {
			const pageSize = limit > 0 ? limit : 50;
			q = q.range(offset, offset + pageSize - 1);
		}

		const { data, error } = await q;

		if (error) {
			console.error("GET /api/products:", error);
			return NextResponse.json({ error: error.message }, { status: 500 });
		}

		// Transform the data to flatten the category info
		const products = (data ?? []).map((product) => ({
			...product,
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
		}));

		return NextResponse.json(
			{ products },
			{
				headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=300" },
			}
		);
	} catch (err) {
		console.error("GET /api/products (unhandled):", err);
		return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
	}
}
