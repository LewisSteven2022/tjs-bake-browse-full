// app/api/debug/route.ts
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const supabase = createClient(
			process.env.NEXT_PUBLIC_SUPABASE_URL!,
			process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
			{ auth: { persistSession: false } }
		);

		// Check if products table exists and has data
		const { data: products, error: productsError } = await supabase
			.from("products")
			.select("*");

		// Check if categories table exists and has data
		const { data: categories, error: categoriesError } = await supabase
			.from("categories")
			.select("*");

		// Check table structure
		const { data: tableInfo, error: tableError } = await supabase
			.from("information_schema.columns")
			.select("table_name, column_name, data_type")
			.eq("table_schema", "public")
			.in("table_name", ["products", "categories"]);

		return NextResponse.json({
			products: {
				count: products?.length || 0,
				sample: products?.slice(0, 3) || [],
				error: productsError?.message || null,
			},
			categories: {
				count: categories?.length || 0,
				sample: categories?.slice(0, 3) || [],
				error: categoriesError?.message || null,
			},
			tableStructure: {
				info: tableInfo || [],
				error: tableError?.message || null,
			},
		});
	} catch (error) {
		// silent
		return NextResponse.json(
			{ error: "Debug endpoint failed", details: error?.message },
			{ status: 500 }
		);
	}
}
