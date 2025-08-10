// app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { admin } from "@/lib/db";

const ALLOWED_CATEGORIES = ["baked_goods", "groceries"] as const;

export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);
		const category = searchParams.get("category");
		const limitRaw = searchParams.get("limit");
		const offsetRaw = searchParams.get("offset");

		if (category && !ALLOWED_CATEGORIES.includes(category as any)) {
			return NextResponse.json({ error: "Invalid category" }, { status: 400 });
		}

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
				"id,name,price_pence,image_url,pack_label,allergens,sku,category,stock,visible,created_at"
			)
			.eq("visible", true)
			.gt("stock", 0)
			.order("created_at", { ascending: false });

		if (category) q = q.eq("category", category);

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

		return NextResponse.json(
			{ products: data ?? [] },
			{
				headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=300" },
			}
		);
	} catch (err) {
		console.error("GET /api/products (unhandled):", err);
		return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
	}
}
