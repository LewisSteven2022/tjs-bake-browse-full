// app/api/admin/inventory/export/route.ts
import { NextResponse } from "next/server";
import { admin } from "@/lib/db";

// GET /api/admin/inventory/export
export async function GET() {
	// Select a comprehensive, safe set of columns we've used across the app
	const { data, error } = await admin
		.from("products")
		.select(
			`
			id,
			name,
			category_id,
			categories!inner(id, name, slug),
			price_pence,
			pack_label,
			allergens,
			ingredients,
			short_description,
			image_url,
			stock,
			visible
		`
		)
		.order("name", { ascending: true });

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	const rows = data ?? [];

	// CSV header
	const header = [
		"id",
		"name",
		"category",
		"price_pence",
		"pack_label",
		"allergens", // pipe-separated (e.g., milk|tree_nuts)
		"ingredients", // plain text
		"short_description", // plain text
		"image_url",
		"stock",
		"visible",
	];

	// Escape any embedded quotes; keep CSV simple (no newlines inside fields ideally)
	const esc = (v: any) => {
		const s = v === null || v === undefined ? "" : String(v);
		const needsQuotes = /[",\n]/.test(s);
		const q = s.replace(/"/g, '""');
		return needsQuotes ? `"${q}"` : q;
	};

	const lines = [header.join(",")];

	for (const r of rows) {
		const allergensJoined = Array.isArray(r.allergens)
			? r.allergens.join("|")
			: "";
		const categorySlug =
			r.categories && Array.isArray(r.categories) && r.categories.length > 0
				? r.categories[0].slug
				: "";
		const line = [
			esc(r.id),
			esc(r.name),
			esc(categorySlug),
			esc(r.price_pence ?? ""),
			esc(r.pack_label ?? ""),
			esc(allergensJoined),
			esc(r.ingredients ?? ""),
			esc(r.short_description ?? ""),
			esc(r.image_url ?? ""),
			esc(r.stock ?? 0),
			esc(r.visible === true ? "true" : "false"),
		].join(",");
		lines.push(line);
	}

	const csv = lines.join("\n");

	return new NextResponse(csv, {
		status: 200,
		headers: {
			"Content-Type": "text/csv; charset=utf-8",
			"Content-Disposition": `attachment; filename="products_export.csv"`,
			"Cache-Control": "no-store",
		},
	});
}
