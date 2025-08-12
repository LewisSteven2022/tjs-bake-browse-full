import { NextRequest, NextResponse } from "next/server";
import { admin } from "@/lib/db";

// NOTE: Admin access is enforced by middleware.ts (matcher: /api/:path* and /admin/:path*)

/** GET /api/admin/inventory
 *  Returns lightweight product list for the management UI.
 */
export async function GET() {
	try {
		// First, check if the new categories table exists
		const { data: tableCheck, error: tableError } = await admin
			.from("information_schema.tables")
			.select("table_name")
			.eq("table_name", "categories")
			.eq("table_schema", "public")
			.single();

		const hasNewSchema = !tableError && tableCheck;

		if (hasNewSchema) {
			// Use new schema with categories table
			const { data, error } = await admin
				.from("products")
				.select(
					`
					id,
					name,
					price_pence,
					stock,
					visible,
					image_url,
					category_id,
					allergens,
					categories(id, name, slug)
				`
				)
				.order("name", { ascending: true });

			if (error) throw error;

			// Transform the data to flatten the category info
			const products = (data ?? []).map((product) => ({
				...product,
				category:
					product.categories &&
					Array.isArray(product.categories) &&
					product.categories.length > 0
						? {
								id: product.categories[0].id,
								name: product.categories[0].name,
								slug: product.categories[0].slug,
						  }
						: null,
			}));

			return NextResponse.json({ products }, { status: 200 });
		} else {
			// Fall back to old schema with category string
			const { data, error } = await admin
				.from("products")
				.select(
					"id,name,price_pence,stock,visible,image_url,category,allergens"
				)
				.order("name", { ascending: true });

			if (error) throw error;

			// Transform old category string to new format for compatibility
			const products = (data ?? []).map((product) => ({
				...product,
				category: product.category
					? {
							id: null,
							name: product.category,
							slug: product.category,
					  }
					: null,
			}));

			return NextResponse.json({ products }, { status: 200 });
		}
	} catch (e: any) {
		return NextResponse.json(
			{ error: e?.message ?? "Failed to load inventory" },
			{ status: 500 }
		);
	}
}

/** PATCH /api/admin/inventory
 *  Updates a product's stock, visibility, allergens, price, or category.
 */
export async function PATCH(req: NextRequest) {
	try {
		const body = await req.json();
		const { id, name, stock, visible, allergens, price_pence, category_id } =
			body;

		if (!id) {
			return NextResponse.json(
				{ error: "Product ID is required" },
				{ status: 400 }
			);
		}

		// Check if new schema exists
		const { data: tableCheck, error: tableError } = await admin
			.from("information_schema.tables")
			.select("table_name")
			.eq("table_name", "categories")
			.eq("table_schema", "public")
			.single();

		const hasNewSchema = !tableError && tableCheck;

		const updates: any = {};

		// Handle stock updates
		if (stock !== undefined) {
			if (typeof stock !== "number" || stock < 0) {
				return NextResponse.json(
					{ error: "Stock must be a non-negative number" },
					{ status: 400 }
				);
			}
			updates.stock = stock;
		}

		// Handle visibility updates
		if (visible !== undefined) {
			if (typeof visible !== "boolean") {
				return NextResponse.json(
					{ error: "Visible must be a boolean value" },
					{ status: 400 }
				);
			}
			updates.visible = visible;
		}

		// Handle price updates
		if (price_pence !== undefined) {
			if (typeof price_pence !== "number" || price_pence < 0) {
				return NextResponse.json(
					{ error: "Price must be a non-negative number" },
					{ status: 400 }
				);
			}
			// Ensure price is stored as pence (whole number)
			updates.price_pence = Math.round(price_pence);
		}

		// Handle allergen updates
		if (allergens !== undefined) {
			// Normalise allergens to string array
			if (Array.isArray(allergens)) {
				updates.allergens = allergens;
			} else if (typeof allergens === "string") {
				try {
					const parsed = JSON.parse(allergens);
					updates.allergens = Array.isArray(parsed) ? parsed : [allergens];
				} catch {
					updates.allergens = allergens
						.split(",")
						.map((s: string) => s.trim())
						.filter(Boolean);
				}
			} else {
				updates.allergens = [];
			}
		}

		// Handle category updates (only if new schema exists)
		if (hasNewSchema && category_id !== undefined) {
			updates.category_id = category_id;
		}

		// Handle name updates
		if (name !== undefined) {
			if (typeof name !== "string" || name.trim().length === 0) {
				return NextResponse.json(
					{ error: "Name must be a non-empty string" },
					{ status: 400 }
				);
			}
			updates.name = name.trim();
		}

		if (Object.keys(updates).length === 0) {
			return NextResponse.json(
				{ error: "No fields to update" },
				{ status: 400 }
			);
		}

		updates.updated_at = new Date().toISOString();

		if (hasNewSchema) {
			// Use new schema
			const { data, error } = await admin
				.from("products")
				.update(updates)
				.eq("id", id)
				.select(
					`
					id,
					name,
					price_pence,
					stock,
					visible,
					image_url,
					category_id,
					allergens,
					categories(id, name, slug)
				`
				)
				.single();

			if (error) throw error;

			// Transform the response to flatten category info
			const product = {
				...data,
				category:
					data.categories &&
					Array.isArray(data.categories) &&
					data.categories.length > 0
						? {
								id: data.categories[0].id,
								name: data.categories[0].name,
								slug: data.categories[0].slug,
						  }
						: null,
			};

			return NextResponse.json({ product }, { status: 200 });
		} else {
			// Use old schema
			const { data, error } = await admin
				.from("products")
				.update(updates)
				.eq("id", id)
				.select(
					"id,name,price_pence,stock,visible,image_url,category,allergens"
				)
				.single();

			if (error) throw error;

			// Transform old category string to new format
			const product = {
				...data,
				category: data.category
					? {
							id: null,
							name: data.category,
							slug: data.category,
					  }
					: null,
			};

			return NextResponse.json({ product }, { status: 200 });
		}
	} catch (e: any) {
		return NextResponse.json(
			{ error: e?.message ?? "Failed to update product" },
			{ status: 500 }
		);
	}
}
