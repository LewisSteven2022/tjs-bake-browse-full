import { NextRequest, NextResponse } from "next/server";
import { admin } from "@/lib/db";

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const category = searchParams.get("category");
	let q = admin
		.from("products")
		.select("*")
		.gt("stock", 0)
		.eq("visible", true)
		.order("created_at", { ascending: false });
	if (category) q = q.eq("category", category);
	const { data, error } = await q;
	if (error)
		return NextResponse.json({ error: error.message }, { status: 500 });
	return NextResponse.json({ products: data || [] });
}
