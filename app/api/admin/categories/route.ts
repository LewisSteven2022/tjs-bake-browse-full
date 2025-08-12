import { NextRequest, NextResponse } from "next/server";
import { admin } from "@/lib/db";

// NOTE: Admin access is enforced by middleware.ts

/** GET /api/admin/categories
 *  Returns all categories for the management UI.
 */
export async function GET() {
	try {
		const { data, error } = await admin
			.from("categories")
			.select("id,name,slug,description,created_at")
			.order("name", { ascending: true });

		if (error) throw error;
		return NextResponse.json({ categories: data ?? [] }, { status: 200 });
	} catch (e: any) {
		return NextResponse.json(
			{ error: e?.message ?? "Failed to load categories" },
			{ status: 500 }
		);
	}
}

/** POST /api/admin/categories
 *  Creates a new category.
 */
export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const { name, slug, description } = body;

		if (!name || !slug) {
			return NextResponse.json(
				{ error: "Name and slug are required" },
				{ status: 400 }
			);
		}

		// Validate slug format (alphanumeric and underscores only)
		if (!/^[a-z0-9_]+$/.test(slug)) {
			return NextResponse.json(
				{
					error:
						"Slug must contain only lowercase letters, numbers, and underscores",
				},
				{ status: 400 }
			);
		}

		const { data, error } = await admin
			.from("categories")
			.insert({ name, slug, description })
			.select("id,name,slug,description,created_at")
			.single();

		if (error) {
			if (error.code === "23505") {
				return NextResponse.json(
					{ error: "A category with that name or slug already exists" },
					{ status: 409 }
				);
			}
			throw error;
		}

		return NextResponse.json({ category: data }, { status: 201 });
	} catch (e: any) {
		return NextResponse.json(
			{ error: e?.message ?? "Failed to create category" },
			{ status: 500 }
		);
	}
}

/** PATCH /api/admin/categories
 *  Updates an existing category.
 */
export async function PATCH(req: NextRequest) {
	try {
		const body = await req.json();
		const { id, name, slug, description } = body;

		if (!id) {
			return NextResponse.json(
				{ error: "Category ID is required" },
				{ status: 400 }
			);
		}

		const updates: any = {};
		if (name !== undefined) updates.name = name;
		if (slug !== undefined) {
			// Validate slug format
			if (!/^[a-z0-9_]+$/.test(slug)) {
				return NextResponse.json(
					{
						error:
							"Slug must contain only lowercase letters, numbers, and underscores",
					},
					{ status: 400 }
				);
			}
			updates.slug = slug;
		}
		if (description !== undefined) updates.description = description;

		if (Object.keys(updates).length === 0) {
			return NextResponse.json(
				{ error: "No fields to update" },
				{ status: 400 }
			);
		}

		updates.updated_at = new Date().toISOString();

		const { data, error } = await admin
			.from("categories")
			.update(updates)
			.eq("id", id)
			.select("id,name,slug,description,created_at,updated_at")
			.single();

		if (error) {
			if (error.code === "23505") {
				return NextResponse.json(
					{ error: "A category with that name or slug already exists" },
					{ status: 409 }
				);
			}
			throw error;
		}

		return NextResponse.json({ category: data }, { status: 200 });
	} catch (e: any) {
		return NextResponse.json(
			{ error: e?.message ?? "Failed to update category" },
			{ status: 500 }
		);
	}
}
