import { NextResponse } from "next/server";
import { admin } from "@/lib/db";

export async function PATCH(
	req: Request,
	{ params }: { params: { id: string } }
) {
	const body = await req.json().catch(() => null);

	// Transform incoming data to new schema
	const updateData = {
		...body,
		// Map old schema to new schema
		stock_quantity: body.stock !== undefined ? body.stock : undefined,
		is_visible: body.visible !== undefined ? body.visible : undefined,
		full_description: body.description || undefined,
		// Remove old schema fields
		stock: undefined,
		visible: undefined,
		description: undefined,
	};

	const { data, error } = await admin
		.from("products")
		.update(updateData)
		.eq("id", params.id)
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

export async function DELETE(
	_: Request,
	{ params }: { params: { id: string } }
) {
	const { error } = await admin.from("products").delete().eq("id", params.id);
	if (error)
		return NextResponse.json({ error: error.message }, { status: 500 });
	return NextResponse.json({ ok: true });
}
