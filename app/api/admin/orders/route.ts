import { NextRequest, NextResponse } from "next/server";
import { admin } from "@/lib/db";

export async function GET() {
	const { data, error } = await admin
		.from("orders")
		.select(
			"id, order_number, status, pickup_date, pickup_time, total_pence, created_at"
		)
		.order("created_at", { ascending: false });
	if (error)
		return NextResponse.json({ error: error.message }, { status: 500 });
	return NextResponse.json({ orders: data ?? [] });
}

export async function PATCH(req: NextRequest) {
	const body = await req.json().catch(() => null);
	const { id, status } = body || {};
	if (!id || !status)
		return NextResponse.json(
			{ error: "id and status required" },
			{ status: 400 }
		);
	const { data, error } = await admin
		.from("orders")
		.update({ status })
		.eq("id", id)
		.select("*")
		.single();
	if (error)
		return NextResponse.json({ error: error.message }, { status: 500 });
	return NextResponse.json({ order: data });
}
export async function POST(req: NextRequest) {
	const body = await req.json().catch(() => null);

	// Validate required fields
	const { order_number, status, pickup_date, pickup_time, total_pence } =
		body || {};
	if (
		!order_number ||
		!status ||
		!pickup_date ||
		!pickup_time ||
		total_pence == null
	) {
		return NextResponse.json(
			{
				error:
					"order_number, status, pickup_date, pickup_time, and total_pence are required",
			},
			{ status: 400 }
		);
	}

	// Insert into DB
	const { data, error } = await admin
		.from("orders")
		.insert([
			{
				order_number,
				status,
				pickup_date,
				pickup_time,
				total_pence,
			},
		])
		.select("*")
		.single();

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	return NextResponse.json({ order: data }, { status: 201 });
}
