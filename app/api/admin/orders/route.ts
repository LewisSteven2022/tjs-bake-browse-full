// app/api/admin/orders/route.ts
import { NextRequest, NextResponse } from "next/server";
import { admin } from "@/lib/db";

const ALLOWED_STATUSES = [
	"unpaid",
	"preparing",
	"ready",
	"collected",
	"cancelled",
	"rejected",
] as const;
type OrderStatus = (typeof ALLOWED_STATUSES)[number];

// GET /api/admin/orders?status=...&from=YYYY-MM-DD&to=YYYY-MM-DD&limit=500
// (Admin access enforced by middleware)
export async function GET(req: NextRequest) {
	try {
		const url = req.nextUrl;
		const status = url.searchParams.get("status"); // one of ALLOWED_STATUSES | "all" | null
		const from = url.searchParams.get("from"); // YYYY-MM-DD
		const to = url.searchParams.get("to"); // YYYY-MM-DD
		const limitParam = url.searchParams.get("limit");
		const limit = Math.min(Math.max(Number(limitParam || 500), 1), 2000);

		let q = admin
			.from("orders")
			.select(
				"id, order_number, status, pickup_date, pickup_time, subtotal_pence, total_pence, bag_opt_in, bag_fee_pence, customer_name, customer_email, customer_phone, created_at"
			)
			.order("created_at", { ascending: false })
			.limit(limit);

		if (status && status !== "all") {
			if (!ALLOWED_STATUSES.includes(status as OrderStatus)) {
				return NextResponse.json(
					{
						error: `Invalid status. Allowed: ${ALLOWED_STATUSES.join(
							", "
						)}, or 'all'`,
					},
					{ status: 400 }
				);
			}
			q = q.eq("status", status);
		}
		if (from) q = q.gte("pickup_date", from);
		if (to) q = q.lte("pickup_date", to);

		const { data, error } = await q;
		if (error) throw error;

		return NextResponse.json({ orders: data ?? [] }, { status: 200 });
	} catch (e: any) {
		return NextResponse.json(
			{ error: e?.message ?? "Failed to load orders" },
			{ status: 500 }
		);
	}
}

// PATCH /api/admin/orders  body: { id: string, status: OrderStatus }
// (Admin access enforced by middleware)
export async function PATCH(req: NextRequest) {
	try {
		const body = await req.json().catch(() => null);
		const { id, status } = body || {};

		if (!id || !status) {
			return NextResponse.json(
				{ error: "Both 'id' and 'status' are required" },
				{ status: 400 }
			);
		}
		if (!ALLOWED_STATUSES.includes(status as OrderStatus)) {
			return NextResponse.json(
				{ error: `Invalid status. Allowed: ${ALLOWED_STATUSES.join(", ")}` },
				{ status: 400 }
			);
		}

		const { data, error } = await admin
			.from("orders")
			.update({ status })
			.eq("id", id)
			.select("*")
			.single();

		if (error) throw error;
		if (!data) {
			return NextResponse.json(
				{ error: `Order with ID ${id} not found` },
				{ status: 404 }
			);
		}

		return NextResponse.json({ order: data }, { status: 200 });
	} catch (e: any) {
		return NextResponse.json(
			{ error: e?.message ?? "Failed to update order" },
			{ status: 500 }
		);
	}
}
