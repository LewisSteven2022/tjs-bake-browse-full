// app/api/admin/inventory/import/route.ts
import { NextRequest, NextResponse } from "next/server";
import { admin } from "@/lib/db";

// POST /api/admin/inventory/import (multipart/form-data)
// field: file (CSV)
export async function POST(req: NextRequest) {
	try {
		const form = await req.formData().catch(() => null);
		if (!form) {
			return NextResponse.json(
				{ error: "No form-data received" },
				{ status: 400 }
			);
		}

		const file = form.get("file") as File | null;
		if (!file) {
			return NextResponse.json(
				{ error: "Missing 'file' field" },
				{ status: 400 }
			);
		}

		// Basic size guard (2MB)
		if (typeof file.size === "number" && file.size > 2 * 1024 * 1024) {
			return NextResponse.json(
				{ error: "File too large (max 2MB)" },
				{ status: 413 }
			);
		}

		const text = await file.text();

		// --- CSV parsing (simple) ---
		// Assumptions: no newlines inside fields; quoted commas are rare.
		// Headers expected (case-insensitive):
		// id,name,category,price_pence,pack_label,allergens,ingredients,short_description,image_url,stock,visible
		const lines = text
			.split(/\r?\n/)
			.map((l) => l.trim())
			.filter((l) => l.length > 0);

		if (lines.length === 0) {
			return NextResponse.json({ error: "CSV is empty" }, { status: 400 });
		}

		const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
		const idx = (name: string) => headers.indexOf(name);

		const required = ["name", "price_pence", "category", "stock", "visible"];
		for (const r of required) {
			if (idx(r) === -1) {
				return NextResponse.json(
					{ error: `Missing required column: ${r}` },
					{ status: 400 }
				);
			}
		}

		const rows = lines.slice(1);

		const toBool = (v: string) => {
			const s = (v || "").trim().toLowerCase();
			return s === "1" || s === "true" || s === "yes" || s === "y";
		};
		const toInt = (v: string, def = 0) => {
			const n = parseInt((v ?? "").trim(), 10);
			return Number.isFinite(n) ? n : def;
		};
		const cleanArr = (v: string) => {
			if (!v || v.trim() === "") return [];
			return v
				.split("|")
				.map((s) => s.trim())
				.filter(Boolean);
		};

		const at = (field: string) => {
			const i = idx(field);
			return i >= 0 ? (rows[0]?.split(",")[i] || "").trim() : "";
		};

		let inserted = 0;
		let updated = 0;
		const errors: Array<{ line: number; error: string }> = [];

		for (let i = 0; i < rows.length; i++) {
			try {
				const id = at("id");
				const name = at("name");
				const categorySlug = at("category");
				const price_pence = toInt(at("price_pence"));
				const pack_label = at("pack_label") || null;
				const allergens = cleanArr(at("allergens"));
				const ingredients = at("ingredients") || null;
				const short_description = at("short_description") || null;
				const image_url = at("image_url") || null;
				const stock = toInt(at("stock"));
				const visible = toBool(at("visible"));

				if (!name || !categorySlug) {
					throw new Error("Missing name or category");
				}
				if (price_pence < 0 || stock < 0) {
					throw new Error("price_pence and stock must be non-negative");
				}

				// Get category_id from slug
				let category_id = null;
				if (categorySlug) {
					const { data: categoryData, error: catError } = await admin
						.from("categories")
						.select("id")
						.eq("slug", categorySlug)
						.single();

					if (catError || !categoryData) {
						throw new Error(
							`Category '${categorySlug}' not found. Please create it first.`
						);
					}
					category_id = categoryData.id;
				}

				const payload: any = {
					name,
					category_id,
					price_pence,
					pack_label,
					allergens,
					ingredients,
					short_description,
					image_url,
					stock,
					visible,
				};

				if (id) {
					// Update existing by id
					const { error: upErr } = await admin
						.from("products")
						.update(payload)
						.eq("id", id);
					if (upErr) throw new Error(upErr.message);
					updated++;
				} else {
					// Insert new product
					const { error: insErr } = await admin
						.from("products")
						.insert(payload);
					if (insErr) throw new Error(insErr.message);
					inserted++;
				}
			} catch (e: any) {
				errors.push({
					line: i + 2 /* account for header */,
					error: e?.message || "Invalid row",
				});
			}
		}

		return NextResponse.json(
			{
				ok: true,
				inserted,
				updated,
				errors,
			},
			{ status: 200 }
		);
	} catch (e: any) {
		return NextResponse.json(
			{ error: e?.message || "Import failed" },
			{ status: 500 }
		);
	}
}
