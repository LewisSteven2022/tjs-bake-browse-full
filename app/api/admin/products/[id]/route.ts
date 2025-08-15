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
	try {
		// First, check if the product exists and get its details
		const { data: product, error: fetchError } = await admin
			.from("products")
			.select("id, name, sku")
			.eq("id", params.id)
			.single();

		if (fetchError || !product) {
			return NextResponse.json({ error: "Product not found" }, { status: 404 });
		}

		// Check for existing order items that reference this product
		const { data: orderItems, error: orderItemsError } = await admin
			.from("order_items")
			.select("id")
			.eq("product_id", params.id)
			.limit(1);

		if (orderItemsError) {
			return NextResponse.json(
				{ error: "Failed to check order references" },
				{ status: 500 }
			);
		}

		// If there are order items, prevent deletion
		if (orderItems && orderItems.length > 0) {
			return NextResponse.json(
				{
					error:
						"Cannot delete product: it is referenced in existing orders. Consider hiding it instead.",
				},
				{ status: 400 }
			);
		}

		// Proceed with deletion - database will handle cascade for product_images table
		const { error: deleteError } = await admin
			.from("products")
			.delete()
			.eq("id", params.id);

		if (deleteError) {
			return NextResponse.json({ error: deleteError.message }, { status: 500 });
		}

		// Log successful deletion for audit purposes
		console.log(
			`Product deleted: ${product.name} (${product.sku}) - ID: ${params.id}`
		);

		return NextResponse.json({
			success: true,
			message: `Product "${product.name}" has been permanently deleted`,
		});
	} catch (error: any) {
		console.error("Product deletion error:", error);
		return NextResponse.json(
			{ error: "Failed to delete product" },
			{ status: 500 }
		);
	}
}
