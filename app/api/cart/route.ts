// app/api/cart/route.ts
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// TEMPORARY CART IMPLEMENTATION
// Since cart tables don't exist in current schema, we'll return proper error messages
// Cart functionality should be implemented client-side using localStorage
// TODO: Either create cart tables or implement full client-side cart

// GET /api/cart — return empty cart (client-side cart not implemented yet)
export async function GET() {
	// Return empty cart since we don't have cart tables
	return NextResponse.json({ items: [] }, { status: 200 });
}

// POST /api/cart — cart not implemented in current schema
export async function POST(req: NextRequest) {
	return NextResponse.json(
		{
			error:
				"Cart functionality not implemented in current schema. Please implement client-side cart or create cart tables.",
		},
		{ status: 501 }
	);
}

// PATCH /api/cart — cart not implemented in current schema
export async function PATCH(req: NextRequest) {
	return NextResponse.json(
		{
			error:
				"Cart functionality not implemented in current schema. Please implement client-side cart or create cart tables.",
		},
		{ status: 501 }
	);
}

// DELETE /api/cart — cart not implemented in current schema
export async function DELETE(req: NextRequest) {
	return NextResponse.json(
		{
			error:
				"Cart functionality not implemented in current schema. Please implement client-side cart or create cart tables.",
		},
		{ status: 501 }
	);
}
