// app/api/orders/route.ts
import { NextRequest, NextResponse } from "next/server";
import { admin } from "@/lib/db";

type CartItem = {
	product_id: string;
	name: string;
	price_pence: number;
	qty: number;
};

const BAG_PENCE = 70;
// Keep your chosen GST rate; change here if policy changes
const GST_RATE = 0.06;

function calcSubtotal(items: CartItem[]) {
	return items.reduce((sum, i) => sum + i.price_pence * i.qty, 0);
}

function calcGstPence(subtotal_pence: number, bag_opt_in: boolean) {
	const base = subtotal_pence + (bag_opt_in ? BAG_PENCE : 0);
	return Math.round(base * GST_RATE);
}

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();

		// Accept both the new shape and older fallback keys
		const items: CartItem[] = Array.isArray(body?.items) ? body.items : [];
		const bag_opt_in: boolean = !!body?.bag_opt_in;
		const pickup_date: string | null = body?.pickup_date ?? null; // "YYYY-MM-DD"
		const pickup_time: string | null = body?.pickup_time ?? null; // "HH:mm"
		const customer_name: string | null =
			body?.customer_name ?? body?.name ?? null;
		const customer_email: string | null =
			body?.customer_email ?? body?.email ?? null;
		const customer_phone: string | null =
			body?.customer_phone ?? body?.mobile ?? null;

		// Basic validations
		if (!items.length) {
			return NextResponse.json(
				{ error: "No items in order." },
				{ status: 400 }
			);
		}
		if (!pickup_date || !pickup_time) {
			return NextResponse.json(
				{ error: "Missing pickup_date or pickup_time." },
				{ status: 400 }
			);
		}
		if (!customer_name || !customer_email) {
			return NextResponse.json(
				{ error: "Missing customer_name or customer_email." },
				{ status: 400 }
			);
		}

		// Sanitize items (defensive)
		const saneItems: CartItem[] = items
			.map((i: any): CartItem | null => {
				const product_id = i?.product_id ?? i?.id ?? i?.productId;
				const name = i?.name ?? i?.title ?? "";
				const price_pence =
					Number(
						i?.price_pence ??
							i?.pricePence ??
							i?.price_pence_in_minor ??
							i?.price
					) || 0;
				const qty = Number(i?.qty ?? i?.quantity ?? 1) || 1;
				if (!product_id || !name || price_pence <= 0 || qty <= 0) return null;
				return { product_id, name, price_pence, qty };
			})
			.filter(Boolean) as CartItem[];

		if (!saneItems.length) {
			return NextResponse.json(
				{ error: "Order items were invalid." },
				{ status: 400 }
			);
		}

		// Compute money server-side (authoritative)
		const subtotal_pence = calcSubtotal(saneItems);
		const gst_pence = calcGstPence(subtotal_pence, bag_opt_in);
		const total_pence =
			subtotal_pence + (bag_opt_in ? BAG_PENCE : 0) + gst_pence;

		// --- Capacity check: max 4 per slot (exclude cancelled/rejected) ---
		const { count, error: cErr } = await admin
			.from("orders")
			.select("id", { count: "exact", head: true })
			.eq("pickup_date", pickup_date)
			.eq("pickup_time", pickup_time)
			.not("status", "in", '("cancelled","rejected")');

		if (cErr) {
			return NextResponse.json({ error: cErr.message }, { status: 500 });
		}
		if ((count ?? 0) >= 4) {
			return NextResponse.json(
				{ error: "That time slot is full. Please choose another." },
				{ status: 409 }
			);
		}

		// Insert order (order_number is bigint identity in DB)
		const { data: orderRow, error: orderErr } = await admin
			.from("orders")
			.insert({
				status: "unpaid",
				pickup_date,
				pickup_time,
				subtotal_pence,
				total_pence,
				bag: bag_opt_in,
				customer_name,
				customer_email,
				customer_phone,
			})
			.select("id, order_number")
			.single();

		if (orderErr || !orderRow) {
			return NextResponse.json(
				{ error: orderErr?.message || "Failed to create order." },
				{ status: 500 }
			);
		}

		const order_id = orderRow.id as string;

		// Insert items
		const itemsPayload = saneItems.map((i) => ({
			order_id,
			product_id: i.product_id,
			name: i.name,
			price_pence: i.price_pence,
			quantity: i.qty,
		}));

		const { error: itemsErr } = await admin
			.from("order_items")
			.insert(itemsPayload);

		if (itemsErr) {
			// Best-effort rollback
			await admin.from("orders").delete().eq("id", order_id);
			return NextResponse.json(
				{ error: itemsErr.message || "Failed to insert order items." },
				{ status: 500 }
			);
		}

		return NextResponse.json(
			{
				order_id,
				order_number: orderRow.order_number,
				subtotal_pence,
				bag_pence: bag_opt_in ? BAG_PENCE : 0,
				gst_pence, // useful for UI display
				total_pence,
				status: "unpaid",
			},
			{ status: 201 }
		);
	} catch (err: any) {
		return NextResponse.json(
			{ error: err?.message || "Unexpected error." },
			{ status: 500 }
		);
	}
}
