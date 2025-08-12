import { NextResponse } from "next/server";
import { admin } from "@/lib/db";
export async function GET() {
	const { data, error } = await admin
		.from("products")
		.select(
			"id, name, sku, short_description, description, price_pence, pack_label, allergens, ingredients, image_url, stock, visible, category_id, created_at, updated_at"
		)
		.order("created_at", { ascending: false });
	if (error)
		return NextResponse.json({ error: error.message }, { status: 500 });
	return NextResponse.json({ products: data });
}
export async function POST(req: Request) {
	const body = await req.json().catch(() => null);
	if (
		!body ||
		!body.name ||
		!body.sku ||
		typeof body.price_pence !== "number"
	) {
		return NextResponse.json(
			{ error: "Missing required fields" },
			{ status: 400 }
		);
	}
	const { data, error } = await admin
		.from("products")
		.insert(body)
		.select(
			"id, name, sku, short_description, description, price_pence, pack_label, allergens, ingredients, image_url, stock, visible, category_id, created_at, updated_at"
		)
		.single();
	if (error)
		return NextResponse.json({ error: error.message }, { status: 500 });
	return NextResponse.json({ product: data });
}
