import { NextResponse } from "next/server";
import { admin } from "@/lib/db";

export async function GET() {
	const { data, error } = await admin
		.from("products")
		.select(
			"id, name, sku, short_description, full_description, price_pence, pack_label, allergens, ingredients, image_url, stock_quantity, is_visible, category_id, created_at, updated_at"
		)
		.order("created_at", { ascending: false });

	if (error)
		return NextResponse.json({ error: error.message }, { status: 500 });

	// Transform data for backward compatibility
	const products = (data || []).map((product) => ({
		...product,
		// Backward compatibility mapping
		stock: product.stock_quantity,
		visible: product.is_visible,
		description: product.full_description,
	}));

	return NextResponse.json({ products });
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

	// Transform incoming data to new schema
	const insertData = {
		...body,
		// Map old schema to new schema
		stock_quantity: body.stock || 0,
		is_visible: body.visible !== undefined ? body.visible : true,
		full_description: body.description || body.short_description,
		// Remove old schema fields
		stock: undefined,
		visible: undefined,
		description: undefined,
	};

	const { data, error } = await admin
		.from("products")
		.insert(insertData)
		.select(
			"id, name, sku, short_description, full_description, price_pence, pack_label, allergens, ingredients, image_url, stock_quantity, is_visible, category_id, created_at, updated_at"
		)
		.single();

	if (error)
		return NextResponse.json({ error: error.message }, { status: 500 });

	// Transform response for backward compatibility
	const product = {
		...data,
		stock: data.stock_quantity,
		visible: data.is_visible,
		description: data.full_description,
	};

	return NextResponse.json({ product });
}
