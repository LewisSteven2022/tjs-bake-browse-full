// app/api/admin/orders/route.ts
import { NextRequest, NextResponse } from "next/server";
import { admin } from "@/lib/db";

const ALLOWED_STATUSES = [
	// Expanded to align with UI while keeping backwards compatibility
	"unpaid",
	"pending",
	"confirmed",
	"preparing",
	"ready",
	"collected",
	"cancelled",
	"rejected",
] as const;
type OrderStatus = (typeof ALLOWED_STATUSES)[number];

// GET /api/admin/orders?status=...&from=YYYY-MM-DD&to=YYYY-MM-DD&time=...&limit=500
// (Admin access enforced by middleware)
export async function GET(req: NextRequest | Request) {
	try {
		const url: any = (req as any)?.nextUrl ?? new URL((req as Request).url);
		const status = url.searchParams.get("status"); // one of ALLOWED_STATUSES | "all" | null
		const from = url.searchParams.get("from"); // YYYY-MM-DD
		const to = url.searchParams.get("to"); // YYYY-MM-DD
		const time = url.searchParams.get("time"); // time filter
		const limitParam = url.searchParams.get("limit");
		const limit = Math.min(Math.max(Number(limitParam || 500), 1), 2000);

		let q = admin
			.from("orders")
			.select(
				"id, order_number, status, pickup_date, pickup_time, subtotal_pence, total_pence, bag_fee_pence, customer_name, customer_email, customer_phone, created_at"
			)
			.order("pickup_date", { ascending: true })
			.order("pickup_time", { ascending: true })
			.limit(limit);

		if (status && status !== "all") {
			if (!ALLOWED_STATUSES.includes(status as OrderStatus)) {
				return NextResponse.json(
					{
						error: `Invalid status. Allowed: ${ALLOWED_STATUSES.join(", ")}`,
					},
					{ status: 400 }
				);
			}
			q = q.eq("status", status);
		}
		if (from) q = q.gte("pickup_date", from);
		if (to) q = q.lte("pickup_date", to);

		// Apply time filtering
		if (time && time !== "all") {
			try {
				const now = new Date();
				const today = now.toISOString().split("T")[0];

				switch (time) {
					case "urgent":
						// Show orders in next 2 hours that are ready
						const twoHoursFromNow = new Date(
							now.getTime() + 2 * 60 * 60 * 1000
						);
						const currentTimeStr = now.toTimeString().slice(0, 5);
						const twoHoursTimeStr = twoHoursFromNow.toTimeString().slice(0, 5);

						q = q
							.eq("pickup_date", today)
							.lte("pickup_time", twoHoursTimeStr)
							.gte("pickup_time", currentTimeStr);
						break;
					case "today":
						q = q.eq("pickup_date", today);
						break;
					case "morning":
						q = q
							.eq("pickup_date", today)
							.gte("pickup_time", "09:00")
							.lt("pickup_time", "12:00");
						break;
					case "afternoon":
						q = q
							.eq("pickup_date", today)
							.gte("pickup_time", "12:00")
							.lt("pickup_time", "17:00");
						break;
					case "evening":
						q = q
							.eq("pickup_date", today)
							.gte("pickup_time", "17:00")
							.lte("pickup_time", "19:00");
						break;
				}
			} catch (error) {
				// silent
				// Continue without time filtering if there's an error
			}
		}

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
		const body = await req.json();
		const { id, status } = body;

		if (!id || !status) {
			return NextResponse.json(
				{ error: "id and status are required" },
				{ status: 400 }
			);
		}

		if (!ALLOWED_STATUSES.includes(status as OrderStatus)) {
			return NextResponse.json(
				{
					error: `Invalid status. Allowed: ${ALLOWED_STATUSES.join(", ")}`,
				},
				{ status: 400 }
			);
		}

		const { data, error } = await admin
			.from("orders")
			.update({ status })
			.eq("id", id)
			.select("id, status, updated_at")
			.single();

		if (error) throw error;

		return NextResponse.json({ order: data }, { status: 200 });
	} catch (e: any) {
		return NextResponse.json(
			{ error: e?.message ?? "Failed to update order" },
			{ status: 500 }
		);
	}
}
