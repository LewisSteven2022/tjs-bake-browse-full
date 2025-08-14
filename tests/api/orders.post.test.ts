import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/db", () => {
	const ordersChain = () => {
		const obj: any = {
			// capacity count path
			select: vi.fn().mockReturnThis(),
			eq: vi.fn().mockReturnThis(),
			not: vi.fn().mockReturnThis(),
			// insert path
			insert: vi.fn().mockReturnThis(),
			// select after insert
			single: vi.fn().mockResolvedValue({
				data: { id: "oid", order_number: 123 },
				error: null,
			}),
		};
		obj.then = (resolve: any) => resolve({ count: 0, error: null });
		return obj;
	};

	const orderItemsChain = () => {
		return {
			insert: vi.fn().mockResolvedValue({ error: null }),
		} as any;
	};

	return {
		admin: {
			from: vi
				.fn()
				.mockImplementation((table: string) =>
					table === "order_items" ? orderItemsChain() : ordersChain()
				),
		},
	};
});
vi.mock("@/lib/repos/ordersRepo", () => ({
	countActiveOrdersAtSlot: vi.fn().mockResolvedValue(0),
	insertOrder: vi.fn().mockResolvedValue({ id: "oid", order_number: 123 }),
	insertOrderItems: vi.fn().mockResolvedValue(undefined),
	updateOrderWithItemsJson: vi.fn().mockResolvedValue(undefined),
}));
vi.mock("@/lib/repos/feesRepo", () => ({
	getBagFeePence: vi.fn().mockResolvedValue(70),
}));

import { POST } from "@/app/api/orders/route";

const makeReq = (body: any) =>
	new Request("http://localhost/api/orders", {
		method: "POST",
		body: JSON.stringify(body),
		headers: { "Content-Type": "application/json" },
	});

describe("POST /api/orders", () => {
	it("validates required fields", async () => {
		const res = await POST(makeReq({} as any));
		const j = await res.json();
		expect(res.status).toBe(400);
		expect(j.error).toBeDefined();
	});

	it("creates an order (happy path)", async () => {
		const body = {
			items: [{ product_id: "p1", name: "Prod", price_pence: 200, qty: 1 }],
			bag_opt_in: false,
			pickup_date: "2025-06-01",
			pickup_time: "10:00",
			customer_name: "Jane",
			customer_email: "jane@example.com",
		};

		const res = await POST(makeReq(body));
		if (res.status !== 201) {
			const j = await res.json();
			console.log("/api/orders fail payload:", j);
		}
		expect(res.status).toBe(201);
		const j = await res.json();
		expect(j.order_id).toBe("oid");
	});
});
