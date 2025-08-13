// app/api/cart/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getCart, addItem, setQty, removeItem, clearCart } from "@/lib/cart";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/cart — return current cart from localStorage
export async function GET() {
	try {
		const items = await getCart();
		return NextResponse.json({ items }, { status: 200 });
	} catch (error) {
		// silent
		return NextResponse.json({ items: [] }, { status: 200 });
	}
}

// POST /api/cart — add item to cart
export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const { product_id, name, price_pence, qty = 1 } = body;

		if (!product_id || !name || price_pence === undefined) {
			return NextResponse.json(
				{ error: "Missing required fields: product_id, name, price_pence" },
				{ status: 400 }
			);
		}

		await addItem({ product_id, name, price_pence, qty });
		return NextResponse.json({ success: true }, { status: 200 });
	} catch (error) {
		// silent
		return NextResponse.json(
			{ error: "Failed to add item to cart" },
			{ status: 500 }
		);
	}
}

// PATCH /api/cart — update item quantity
export async function PATCH(req: NextRequest) {
	try {
		const body = await req.json();
		const { product_id, qty } = body;

		if (!product_id || qty === undefined) {
			return NextResponse.json(
				{ error: "Missing required fields: product_id, qty" },
				{ status: 400 }
			);
		}

		await setQty(product_id, qty);
		return NextResponse.json({ success: true }, { status: 200 });
	} catch (error) {
		// silent
		return NextResponse.json(
			{ error: "Failed to update cart item" },
			{ status: 500 }
		);
	}
}

// DELETE /api/cart — remove item or clear cart
export async function DELETE(req: NextRequest) {
	try {
		const body = await req.json();
		const { product_id, all } = body;

		if (all) {
			// Clear entire cart
			await clearCart();
		} else if (product_id) {
			// Remove specific item
			await removeItem(product_id);
		} else {
			return NextResponse.json(
				{ error: "Missing product_id or all flag" },
				{ status: 400 }
			);
		}

		return NextResponse.json({ success: true }, { status: 200 });
	} catch (error) {
		// silent
		return NextResponse.json(
			{ error: "Failed to remove item from cart" },
			{ status: 500 }
		);
	}
}
