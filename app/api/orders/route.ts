import { NextRequest, NextResponse } from "next/server";
import { admin } from "@/lib/db";

// Helper to get timestamped log messages
function log(message: string, data?: any) {
	const timestamp = new Date().toISOString();
	if (data !== undefined) {
		console.log(`[${timestamp}] ${message}`, data);
	} else {
		console.log(`[${timestamp}] ${message}`);
	}
}

// Save logs into Supabase
async function saveLog(
	endpoint: string,
	method: string,
	message: string,
	details?: any
) {
	try {
		await admin.from("api_logs").insert({
			endpoint,
			method,
			message,
			details: details ? JSON.stringify(details) : null,
		});
	} catch (err) {
		console.error("Failed to save API log to Supabase:", err);
	}
}

// Shared helper for consistent error responses
async function errorResponse(
	endpoint: string,
	method: string,
	message: string,
	status: number = 500,
	details?: any
) {
	log(`ORDERS API ERROR - ${message}`, details);
	await saveLog(endpoint, method, `ERROR - ${message}`, details);
	return NextResponse.json({ error: message }, { status });
}

// GET /api/orders - List orders
export async function GET() {
	const endpoint = "/api/orders";
	const method = "GET";
	log("ORDERS API - GET request received");
	await saveLog(endpoint, method, "Request received");

	try {
		const { data, error } = await admin
			.from("orders")
			.select(
				"id, order_number, status, pickup_date, pickup_time, total_pence, created_at"
			)
			.order("created_at", { ascending: false });

		if (error)
			return errorResponse(endpoint, method, error.message, 500, error);

		log(`ORDERS API - Returned ${data?.length || 0} orders`);
		await saveLog(endpoint, method, `Returned ${data?.length || 0} orders`);
		return NextResponse.json({ orders: data ?? [] }, { status: 200 });
	} catch (err) {
		return errorResponse(
			endpoint,
			method,
			"Unexpected server error while fetching orders",
			500,
			err
		);
	}
}

// PATCH /api/orders - Update order status
export async function PATCH(req: NextRequest) {
	const endpoint = "/api/orders";
	const method = "PATCH";
	log("ORDERS API - PATCH request received");
	await saveLog(endpoint, method, "Request received");

	try {
		const body = await req.json().catch(() => null);
		log("ORDERS API - Request body received", body);
		await saveLog(endpoint, method, "Request body received", body);

		const { id, status } = body || {};

		if (!id || !status) {
			return errorResponse(
				endpoint,
				method,
				"Both 'id' and 'status' are required",
				400
			);
		}

		const { data, error } = await admin
			.from("orders")
			.update({ status })
			.eq("id", id)
			.select("*")
			.single();

		if (error)
			return errorResponse(endpoint, method, error.message, 500, error);
		if (!data)
			return errorResponse(
				endpoint,
				method,
				`Order with ID ${id} not found`,
				404
			);

		log(`ORDERS API - Updated order ${id} to status: ${status}`);
		await saveLog(
			endpoint,
			method,
			`Updated order ${id} to status: ${status}`,
			data
		);
		return NextResponse.json({ order: data }, { status: 200 });
	} catch (err) {
		return errorResponse(
			endpoint,
			method,
			"Unexpected server error while updating order",
			500,
			err
		);
	}
}
