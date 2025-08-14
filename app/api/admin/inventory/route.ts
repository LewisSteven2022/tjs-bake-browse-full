import { NextRequest, NextResponse } from "next/server";
import { admin } from "@/lib/db";

// NOTE: Admin access is enforced by middleware.ts (matcher: /api/:path* and /admin/:path*)

/** GET /api/admin/inventory
 *  Returns lightweight product list for the management UI.
 */
export async function GET() {
	try {
		// Use new schema with categories table
		const { data, error } = await admin
			.from("products")
			.select(
				`
				id,
				name,
				price_pence,
				stock_quantity,
				is_visible,
				image_url,
				category_id,
				allergens,
				categories:categories!products_category_id_fkey(id, name, slug)
			`
			)
			.order("name", { ascending: true });

		if (error) throw error;

		// Transform the data to flatten the category info and provide backward compatibility
		const products = (data ?? []).map((product) => {
			const cat = (product as any).categories;
			const catObj = Array.isArray(cat) ? cat[0] : cat;
			return {
				...product,
				// Backward compatibility mapping
				stock: (product as any).stock_quantity,
				visible: (product as any).is_visible,
				category: catObj
					? { id: catObj.id, name: catObj.name, slug: catObj.slug }
					: null,
			};
		});

		return NextResponse.json({ products }, { status: 200 });
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
		const { id, ...updates } = body;

		if (!id) {
			return NextResponse.json(
				{ error: "Product ID is required" },
				{ status: 400 }
			);
		}

		// Transform updates to new schema
		const updateData = {
			...updates,
			// Map old schema to new schema
			stock_quantity: updates.stock !== undefined ? updates.stock : undefined,
			is_visible: updates.visible !== undefined ? updates.visible : undefined,
			// Handle category updates - ensure category_id is passed through
			category_id:
				updates.category_id !== undefined ? updates.category_id : undefined,
			// Handle other fields that might be updated
			name: updates.name !== undefined ? updates.name : undefined,
			price_pence:
				updates.price_pence !== undefined ? updates.price_pence : undefined,
			pack_label:
				updates.pack_label !== undefined ? updates.pack_label : undefined,
			allergens:
				updates.allergens !== undefined ? updates.allergens : undefined,
			image_url:
				updates.image_url !== undefined ? updates.image_url : undefined,
			// Remove old schema fields
			stock: undefined,
			visible: undefined,
			category: undefined, // Remove old category field if present
		};

		// Remove undefined values to avoid overwriting with null
		Object.keys(updateData).forEach((key) => {
			if (updateData[key] === undefined) {
				delete updateData[key];
			}
		});

		// DEBUG: Log what we're about to update
		console.log("🔍 PATCH DEBUG - Product ID:", id);
		console.log("🔍 PATCH DEBUG - Updates received:", updates);
		console.log("🔍 PATCH DEBUG - Update data to send:", updateData);

		const { data, error } = await admin
			.from("products")
			.update(updateData)
			.eq("id", id)
			.select(
				`
				id,
				name,
				price_pence,
				stock_quantity,
				is_visible,
				image_url,
				category_id,
				allergens,
				categories:categories!products_category_id_fkey(id, name, slug)
			`
			)
			.single();

		if (error) {
			console.log("🚨 PATCH ERROR:", error);
			throw error;
		}

		// DEBUG: Log what the database returned
		console.log("✅ PATCH SUCCESS - Data returned from DB:", data);

		// Transform response for backward compatibility
		const cat = (data as any).categories;
		const catObj = Array.isArray(cat) ? cat[0] : cat;
		const product = {
			...data,
			stock: (data as any).stock_quantity,
			visible: (data as any).is_visible,
			category: catObj
				? { id: catObj.id, name: catObj.name, slug: catObj.slug }
				: null,
		};

		return NextResponse.json({ product }, { status: 200 });
	} catch (e: any) {
		// silent
		return NextResponse.json(
			{ error: e?.message ?? "Failed to update inventory" },
			{ status: 500 }
		);
	}
}

/** POST /api/admin/inventory
 *  Creates a new product.
 */
export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const {
			name,
			short_description,
			description,
			price_pence,
			pack_label,
			allergens,
			ingredients,
			image_url,
			stock,
			visible,
			category_id,
		} = body;

		// Validate required fields
		if (!name || !price_pence || stock === undefined) {
			return NextResponse.json(
				{ error: "Name, price, and stock are required" },
				{ status: 400 }
			);
		}

		// Validate price
		if (typeof price_pence !== "number" || price_pence < 0) {
			return NextResponse.json(
				{ error: "Price must be a non-negative number" },
				{ status: 400 }
			);
		}

		// Validate stock
		if (typeof stock !== "number" || stock < 0) {
			return NextResponse.json(
				{ error: "Stock must be a non-negative number" },
				{ status: 400 }
			);
		}

		// Normalise allergens to string array
		let normalizedAllergens: string[] = [];
		if (allergens) {
			if (Array.isArray(allergens)) {
				normalizedAllergens = allergens;
			} else if (typeof allergens === "string") {
				try {
					const parsed = JSON.parse(allergens);
					normalizedAllergens = Array.isArray(parsed) ? parsed : [allergens];
				} catch {
					normalizedAllergens = allergens
						.split(",")
						.map((s: string) => s.trim())
						.filter(Boolean);
				}
			}
		}

		// Check if new schema exists
		const { data: tableCheck, error: tableError } = await admin
			.from("information_schema.tables")
			.select("table_name")
			.eq("table_name", "categories")
			.single();

		const hasNewSchema = !tableError && tableCheck;

		// Prepare product data
		const productData: any = {
			name: name.trim(),
			short_description: short_description?.trim() || null,
			description: description?.trim() || null,
			price_pence: Math.round(price_pence),
			pack_label: pack_label?.trim() || null,
			allergens: normalizedAllergens,
			ingredients: ingredients?.trim() || null,
			image_url: image_url?.trim() || null,
			stock_quantity: Math.round(stock),
			is_visible: visible !== undefined ? visible : true,
		};

		// Add category_id if new schema exists and category is provided
		if (hasNewSchema && category_id) {
			productData.category_id = category_id;
		}

		// Debug logging
		// silent

		// Generate SKU if not provided
		if (!body.sku) {
			const timestamp = Date.now().toString(36);
			const nameSlug = name
				.toLowerCase()
				.replace(/[^a-z0-9]/g, "")
				.substring(0, 8);
			productData.sku = `${nameSlug}-${timestamp}`;
		} else {
			productData.sku = body.sku;
		}

		// Insert the product - always use new schema if categories table exists
		const result = await admin
			.from("products")
			.insert(productData)
			.select(
				"id, name, price_pence, stock_quantity, is_visible, image_url, allergens"
			)
			.single();

		const { data, error } = result;

		if (error) throw error;

		// Transform the response to match the expected format
		let product: any;
		if (data) {
			product = {
				id: data.id,
				name: data.name,
				price_pence: data.price_pence,
				stock: data.stock_quantity,
				visible: data.is_visible,
				image_url: data.image_url,
				allergens: data.allergens,
				category:
					hasNewSchema && productData.category_id
						? { id: productData.category_id, name: null, slug: null }
						: null,
			};
		}

		return NextResponse.json({ product }, { status: 201 });
	} catch (e: any) {
		return NextResponse.json(
			{ error: e?.message ?? "Failed to create product" },
			{ status: 500 }
		);
	}
}
