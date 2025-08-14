import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/db", () => ({
	admin: {
		from: vi.fn().mockReturnValue({
			select: vi.fn().mockReturnThis(),
			order: vi.fn().mockReturnThis(),
			limit: vi.fn().mockReturnThis(),
			eq: vi.fn().mockReturnThis(),
			gte: vi.fn().mockReturnThis(),
			lte: vi.fn().mockReturnThis(),
			update: vi.fn().mockReturnThis(),
			single: vi
				.fn()
				.mockResolvedValue({
					data: { id: "id1", status: "ready" },
					error: null,
				}),
			then: (resolve: any) =>
				resolve({ data: [{ id: "id1", status: "ready" }], error: null }),
		}),
	},
}));

import { GET, PATCH } from "@/app/api/admin/orders/route";

describe("/api/admin/orders", () => {
	it("GET returns list", async () => {
		const req = new Request("http://localhost/api/admin/orders?status=ready");
		const res = await GET(req as any);
		expect(res.status).toBe(200);
		const j = await res.json();
		expect(Array.isArray(j.orders)).toBe(true);
	});

	it("PATCH updates status", async () => {
		const req = new Request("http://localhost/api/admin/orders", {
			method: "PATCH",
			body: JSON.stringify({ id: "id1", status: "ready" }),
		});
		const res = await PATCH(req as any);
		expect(res.status).toBe(200);
	});
});
