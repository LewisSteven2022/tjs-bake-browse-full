// app/api/orders/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
	countActiveOrdersAtSlot,
	insertOrder,
	insertOrderItems,
	updateOrderWithItemsJson,
} from "@/lib/repos/ordersRepo";
import { admin } from "@/lib/db";
import { getBagFeePence } from "@/lib/repos/feesRepo";

type CartItem = {
	product_id: string;
	name: string;
	price_pence: number;
	qty: number;
};

// Keep your chosen GST rate; change here if policy changes
const GST_RATE = 0.06;

function calcSubtotal(items: CartItem[]) {
	return items.reduce((sum, i) => sum + i.price_pence * i.qty, 0);
}

function calcGstPence(subtotal_pence: number, bag_fee_pence: number) {
	const base = subtotal_pence + bag_fee_pence;
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
		const dynamicBagFee = await getBagFeePence();
		const bag_fee_pence = bag_opt_in ? dynamicBagFee : 0;
		const gst_pence = calcGstPence(subtotal_pence, bag_fee_pence);
		const total_pence = subtotal_pence + bag_fee_pence + gst_pence;

		// --- Capacity check (exclude cancelled/rejected) ---
		const CAPACITY = Number(process.env.NEXT_PUBLIC_SLOT_CAPACITY || 5);
		const count = await countActiveOrdersAtSlot(pickup_date, pickup_time);
		if ((count ?? 0) >= CAPACITY) {
			return NextResponse.json(
				{ error: "That time slot is full. Please choose another." },
				{ status: 409 }
			);
		}

		// Insert order using repo
		const orderInserted = await insertOrder({
			status: "unpaid",
			pickup_date,
			pickup_time,
			subtotal_pence,
			tax_pence: gst_pence,
			total_pence,
			bag_fee_pence,
			bag_opt_in,
			customer_name,
			customer_email,
			customer_phone,
		});
		const order_id = orderInserted.id;

		// Fetch product SKUs for the order items
		const productIds = saneItems.map(item => item.product_id);
		const { data: products, error: productsError } = await admin
			.from("products")
			.select("id, sku")
			.in("id", productIds);

		if (productsError) {
			console.warn("Failed to fetch product SKUs:", productsError);
		}

		// Create a lookup map for SKUs
		const skuMap = new Map(
			products?.map(p => [p.id, p.sku || `UNKNOWN-${p.id.slice(0, 8)}`]) || []
		);

		// Check if order_items table exists before trying to insert
		try {
			// Try to insert order items into the new order_items table
			const orderItems = saneItems.map((item) => ({
				order_id,
				product_id: item.product_id,
				product_name: item.name,
				product_sku: skuMap.get(item.product_id) || `UNKNOWN-${item.product_id.slice(0, 8)}`,
				quantity: item.qty,
				unit_price_pence: item.price_pence,
				total_price_pence: item.price_pence * item.qty,
			}));

			/* inserting items */

			try {
				await insertOrderItems(orderItems);
			} catch {
				// Fallback: Try to store items JSON on order for legacy schema
				await updateOrderWithItemsJson(order_id, saneItems);
			}
		} catch (itemsTableError) {
			// If order_items table is missing, fallback to storing items on the order

			// Fallback: Try to store items in the orders table directly
			try {
				const { error: updateErr } = await admin
					.from("orders")
					.update({
						items: saneItems, // Store items as JSONB in orders table
						updated_at: new Date().toISOString(),
					})
					.eq("id", order_id);

				// Ignore updateErr; order is created regardless
			} catch {
				// Ignore fallback failures
			}
		}

		return NextResponse.json(
			{
				order_id,
				order_number: orderInserted.order_number,
				subtotal_pence,
				bag_pence: bag_fee_pence,
				gst_pence, // useful for UI display
				total_pence,
				status: "unpaid",
			},
			{ status: 201 }
		);
	} catch (err: any) {
		// silent
		return NextResponse.json(
			{ error: err?.message || "Unexpected error." },
			{ status: 500 }
		);
	}
}
