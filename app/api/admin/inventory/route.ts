import { NextRequest, NextResponse } from "next/server";
import { admin } from "@/lib/db";

// NOTE: Admin access is enforced by middleware.ts (matcher: /api/:path* and /admin/:path*)

/** GET /api/admin/inventory
 *  Returns lightweight product list for the management UI.
 */
export async function GET() {
	try {
		const { data, error } = await admin
			.from("products")
			.select("id,name,price_pence,stock,visible,image_url,category,allergens")
			.order("name", { ascending: true });

		if (error) throw error;
		return NextResponse.json({ products: data ?? [] }, { status: 200 });
	} catch (e: any) {
		return NextResponse.json(
			{ error: e?.message ?? "Failed to load inventory" },
			{ status: 500 }
		);
	}
}

/** PATCH /api/admin/inventory
 *  Body: { id: string, stock: number, visible: boolean, allergens?: string | string[] | null }
 *  (Extend later with price updates if you’d like.)
 */
export async function PATCH(req: NextRequest) {
	try {
		const body = await req.json().catch(() => null);
		const id = body?.id as string | undefined;
		const stock = body?.stock;
		const visible = body?.visible;
		let allergens = body?.allergens as string | string[] | null | undefined;

		if (!id || typeof stock !== "number" || typeof visible !== "boolean") {
			return NextResponse.json(
				{
					error:
						"Fields required: id (string), stock (number), visible (boolean)",
				},
				{ status: 400 }
			);
		}
		if (!Number.isInteger(stock) || stock < 0) {
			return NextResponse.json(
				{ error: "stock must be a non-negative integer" },
				{ status: 400 }
			);
		}

		// Normalise allergens for Postgres text[] column
		// Accepts: JSON string ("[\"eggs\"]"), comma-separated string ("eggs, milk"),
		// or a real array ["eggs", "milk"].
		let updateFields: any = { stock, visible };
		if (typeof allergens !== "undefined") {
			let arr: string[] | null = null;
			if (Array.isArray(allergens)) {
				arr = allergens.map((s: any) => String(s).trim()).filter(Boolean);
			} else if (allergens === null || allergens === "") {
				arr = [];
			} else if (typeof allergens === "string") {
				try {
					const parsed = JSON.parse(allergens);
					if (Array.isArray(parsed)) {
						arr = parsed.map((s: any) => String(s).trim()).filter(Boolean);
					}
				} catch {
					arr = allergens
						.split(",")
						.map((s: string) => s.trim())
						.filter(Boolean);
				}
			}
			if (arr !== null) {
				updateFields.allergens = arr; // Supabase maps JS arrays to Postgres text[]
			}
		}

		const { data, error } = await admin
			.from("products")
			.update(updateFields)
			.eq("id", id)
			.select("id")
			.single();

		if (error) throw error;
		if (!data) {
			return NextResponse.json({ error: "Product not found" }, { status: 404 });
		}

		return NextResponse.json({ ok: true, id: data.id }, { status: 200 });
	} catch (e: any) {
		return NextResponse.json(
			{ error: e?.message ?? "Failed to update inventory" },
			{ status: 500 }
		);
	}
}
