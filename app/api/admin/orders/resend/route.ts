import { NextRequest, NextResponse } from "next/server";
import { admin } from "@/lib/db";

// Admin access is enforced by middleware.ts for /api/admin/:path*
type Kind = "confirmation" | "ready" | "cancelled";

function subjectFor(kind: Kind, orderNo: number) {
	switch (kind) {
		case "ready":
			return `Order #${orderNo} ready to collect`;
		case "cancelled":
			return `Order #${orderNo} cancelled`;
		default:
			return `Order #${orderNo} confirmation`;
	}
}

export async function POST(req: NextRequest) {
	try {
		const body = await req.json().catch(() => ({}));
		const id = body?.id as string | undefined;
		const kind = (body?.kind as Kind | undefined) ?? "confirmation";

		if (!id) {
			return NextResponse.json(
				{ error: "Field 'id' is required" },
				{ status: 400 }
			);
		}
		if (!["confirmation", "ready", "cancelled"].includes(kind)) {
			return NextResponse.json(
				{
					error: "Invalid 'kind'. Use one of: confirmation | ready | cancelled",
				},
				{ status: 400 }
			);
		}

		// Fetch order essentials
		const { data: order, error } = await admin
			.from("orders")
			.select(
				"id, order_number, status, customer_email, customer_name, pickup_date, pickup_time, total_pence"
			)
			.eq("id", id)
			.single();

		if (error || !order) {
			return NextResponse.json(
				{ error: error?.message || "Order not found" },
				{ status: 404 }
			);
		}

		if (!order.customer_email) {
			return NextResponse.json(
				{ error: "Order has no customer_email to send to" },
				{ status: 422 }
			);
		}

		const RESEND_API_KEY = process.env.RESEND_API_KEY;
		if (!RESEND_API_KEY) {
			return NextResponse.json(
				{ error: "Email not configured (RESEND_API_KEY missing)" },
				{ status: 501 }
			);
		}

		const from = process.env.EMAIL_FROM || "orders@example.com";

		const subject = subjectFor(kind, order.order_number as number);
		const total = `£${((order.total_pence || 0) / 100).toFixed(2)}`;
		const html = `
      <p>Hi ${order.customer_name || "there"},</p>
      <p>This is a <strong>${kind}</strong> for your order <strong>#${
			order.order_number
		}</strong>.</p>
      <p>Pickup: <strong>${order.pickup_date} ${order.pickup_time}</strong></p>
      <p>Total: <strong>${total}</strong></p>
      <p>Thank you for shopping with TJ’s Bake & Browse.</p>
    `;

		// Send via Resend
		const res = await fetch("https://api.resend.com/emails", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${RESEND_API_KEY}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				from,
				to: [order.customer_email],
				subject,
				html,
			}),
		});

		if (!res.ok) {
			let detail = "";
			try {
				detail = await res.text();
			} catch {}
			return NextResponse.json(
				{
					error: `Resend failed (${res.status})${detail ? `: ${detail}` : ""}`,
				},
				{ status: 502 }
			);
		}

		return NextResponse.json({ ok: true }, { status: 200 });
	} catch (e: any) {
		return NextResponse.json(
			{ error: e?.message || "Email send failed" },
			{ status: 500 }
		);
	}
}
