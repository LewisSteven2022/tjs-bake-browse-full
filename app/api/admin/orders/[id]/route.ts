import { NextResponse } from "next/server";
import { admin } from "@/lib/db";

const ALLOWED = [
	// Expanded to align with UI while keeping backwards compatibility
	"unpaid",
	"pending",
	"preparing",
	"ready",
	"collected",
	"cancelled",
	"rejected",
];

export async function PATCH(
	req: Request,
	{ params }: { params: { id: string } }
) {
	try {
		const { status } = await req.json();
		if (!ALLOWED.includes(status)) {
			return NextResponse.json({ error: "Invalid status" }, { status: 400 });
		}
		const { data, error } = await admin
			.from("orders")
			.update({ status })
			.eq("id", params.id)
			.select(
				"id, order_number, status, pickup_date, pickup_time, subtotal_pence, total_pence, bag_fee_pence, customer_name, customer_email, customer_phone, created_at, updated_at"
			)
			.single();
		if (error) throw error;
		return NextResponse.json({ order: data });
	} catch (e: any) {
		return NextResponse.json({ error: e.message }, { status: 500 });
	}
}
