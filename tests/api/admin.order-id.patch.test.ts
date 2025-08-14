import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/db", () => ({
	admin: {
		from: vi.fn().mockReturnValue({
			update: vi.fn().mockReturnThis(),
			eq: vi.fn().mockReturnThis(),
			select: vi.fn().mockReturnThis(),
			single: vi
				.fn()
				.mockResolvedValue({
					data: { id: "id1", status: "ready" },
					error: null,
				}),
		}),
	},
}));

import { PATCH } from "@/app/api/admin/orders/[id]/route";

describe("PATCH /api/admin/orders/[id]", () => {
	it("updates a single order", async () => {
		const req = new Request("http://localhost/api/admin/orders/id1", {
			method: "PATCH",
			body: JSON.stringify({ status: "ready" }),
		});
		const res = await PATCH(req as any, { params: { id: "id1" } });
		expect(res.status).toBe(200);
		const j = await res.json();
		expect(j.order.status).toBe("ready");
	});
});
