import { admin } from "@/lib/db";

export type NewOrderParams = {
	pickup_date: string;
	pickup_time: string;
	subtotal_pence: number;
	tax_pence: number;
	total_pence: number;
	bag_fee_pence: number;
	bag_opt_in?: boolean;
	customer_name: string;
	customer_email: string;
	customer_phone?: string | null;
	status: string; // 'unpaid' etc.
};

export async function countActiveOrdersAtSlot(
	pickup_date: string,
	pickup_time: string
): Promise<number> {
	const { count, error } = await admin
		.from("orders")
		.select("id", { count: "exact", head: true })
		.eq("pickup_date", pickup_date)
		.eq("pickup_time", pickup_time)
		.not("status", "in", '("cancelled","rejected")');
	if (error) throw error;
	return count ?? 0;
}

export async function insertOrder(params: NewOrderParams): Promise<{
	id: string;
	order_number: number;
}> {
	const { data, error } = await admin
		.from("orders")
		.insert({
			status: params.status,
			pickup_date: params.pickup_date,
			pickup_time: params.pickup_time,
			subtotal_pence: params.subtotal_pence,
			tax_pence: params.tax_pence,
			total_pence: params.total_pence,
			bag_fee_pence: params.bag_fee_pence,
			bag_opt_in: params.bag_opt_in ?? params.bag_fee_pence > 0,
			customer_name: params.customer_name,
			customer_email: params.customer_email,
			customer_phone: params.customer_phone ?? null,
		})
		.select("id, order_number")
		.single();
	if (error || !data) throw new Error(error?.message || "Insert failed");
	return { id: data.id as string, order_number: data.order_number as number };
}

export type NewOrderItem = {
	order_id: string;
	product_id: string;
	product_name: string;
	product_sku: string;
	quantity: number;
	unit_price_pence: number;
	total_price_pence: number;
};

export async function insertOrderItems(items: NewOrderItem[]): Promise<void> {
	const { error } = await admin.from("order_items").insert(items);
	if (error) throw error;
}

export async function updateOrderWithItemsJson(
	order_id: string,
	items: any
): Promise<void> {
	try {
		await admin
			.from("orders")
			.update({ items, updated_at: new Date().toISOString() })
			.eq("id", order_id);
	} catch {
		// best-effort; ignore
	}
}
