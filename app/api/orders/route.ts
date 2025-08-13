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
		const bag_fee_pence = bag_opt_in ? BAG_PENCE : 0;
		const gst_pence = calcGstPence(subtotal_pence, bag_fee_pence);
		const total_pence = subtotal_pence + bag_fee_pence + gst_pence;

		// --- Capacity check (exclude cancelled) ---
		const CAPACITY = Number(process.env.NEXT_PUBLIC_SLOT_CAPACITY || 5);
		const { count, error: cErr } = await admin
			.from("orders")
			.select("id", { count: "exact", head: true })
			.eq("pickup_date", pickup_date)
			.eq("pickup_time", pickup_time)
			.not("status", "in", '("cancelled")');

		if (cErr) {
			return NextResponse.json({ error: cErr.message }, { status: 500 });
		}
		if ((count ?? 0) >= CAPACITY) {
			return NextResponse.json(
				{ error: "That time slot is full. Please choose another." },
				{ status: 409 }
			);
		}

		// Insert order using new schema with CORRECT status value
		const { data: orderRow, error: orderErr } = await admin
			.from("orders")
			.insert({
				status: "pending", // Changed from "unpaid" to "pending" to match DB constraint
				pickup_date,
				pickup_time,
				subtotal_pence,
				tax_pence: gst_pence, // Map GST to tax_pence in new schema
				total_pence,
				bag_fee_pence, // Use calculated bag fee directly
				customer_name,
				customer_email,
				customer_phone,
				// Note: bag_opt_in column not available in new schema
			})
			.select("id, order_number")
			.single();

		if (orderErr || !orderRow) {
			console.error("Failed to create order:", orderErr);
			return NextResponse.json(
				{ error: orderErr?.message || "Failed to create order." },
				{ status: 500 }
			);
		}

		const order_id = orderRow.id as string;
		console.log("Order created successfully:", {
			order_id,
			order_number: orderRow.order_number,
		});

		// Check if order_items table exists before trying to insert
		try {
			// Try to insert order items into the new order_items table
			const orderItems = saneItems.map((item) => ({
				order_id,
				product_id: item.product_id,
				product_name: item.name,
				product_sku: "SKU", // TODO: Get actual SKU from product
				quantity: item.qty,
				unit_price_pence: item.price_pence,
				total_price_pence: item.price_pence * item.qty,
			}));

			console.log("Attempting to insert order items:", orderItems);

			const { error: itemsErr } = await admin
				.from("order_items")
				.insert(orderItems);

			if (itemsErr) {
				console.error("Failed to insert order items:", itemsErr);

				// Fallback: Try to store items in the orders table directly (for old schema)
				try {
					console.log("Attempting fallback: storing items in orders table");
					const { error: updateErr } = await admin
						.from("orders")
						.update({
							items: saneItems, // Store items as JSONB in orders table
							updated_at: new Date().toISOString(),
						})
						.eq("id", order_id);

					if (updateErr) {
						console.error("Fallback also failed:", updateErr);
						console.warn(
							"Order created but items failed to save. Order ID:",
							order_id
						);
					} else {
						console.log("Items stored in orders table as fallback");
					}
				} catch (fallbackError) {
					console.error("Fallback storage failed:", fallbackError);
					console.warn(
						"Order created but items failed to save. Order ID:",
						order_id
					);
				}
			} else {
				console.log("Order items inserted successfully");
			}
		} catch (itemsTableError) {
			console.error(
				"Error with order_items table (table may not exist):",
				itemsTableError
			);

			// Fallback: Try to store items in the orders table directly
			try {
				console.log("Attempting fallback: storing items in orders table");
				const { error: updateErr } = await admin
					.from("orders")
					.update({
						items: saneItems, // Store items as JSONB in orders table
						updated_at: new Date().toISOString(),
					})
					.eq("id", order_id);

				if (updateErr) {
					console.error("Fallback also failed:", updateErr);
					console.warn(
						"Order created but items failed to save. Order ID:",
						order_id
					);
				} else {
					console.log("Items stored in orders table as fallback");
				}
			} catch (fallbackError) {
				console.error("Fallback storage failed:", fallbackError);
				console.warn(
					"Order created but items failed to save. Order ID:",
					order_id
				);
			}
		}

		return NextResponse.json(
			{
				order_id,
				order_number: orderRow.order_number,
				subtotal_pence,
				bag_pence: bag_fee_pence,
				gst_pence, // useful for UI display
				total_pence,
				status: "pending", // Changed from "unpaid" to "pending"
			},
			{ status: 201 }
		);
	} catch (err: any) {
		console.error("Unexpected error in orders API:", err);
		return NextResponse.json(
			{ error: err?.message || "Unexpected error." },
			{ status: 500 }
		);
	}
}
