import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/db", () => ({
	admin: {
		from: vi.fn().mockReturnValue({
			select: vi.fn().mockReturnThis(),
			eq: vi.fn().mockReturnThis(),
			not: vi.fn().mockReturnThis(),
			then: (resolve: any) =>
				resolve({
					data: [{ pickup_time: "09:00", status: "unpaid" }],
					error: null,
				}),
		}),
	},
}));

import { GET } from "@/app/api/availability/route";

describe("GET /api/availability", () => {
	it("requires date", async () => {
		const req = new Request("http://localhost/api/availability");
		const res = await GET(req as any);
		expect(res.status).toBe(400);
	});

	it("returns per-slot usage for a date", async () => {
		const req = new Request(
			"http://localhost/api/availability?date=2025-06-01"
		);
		const res = await GET(req as any);
		expect(res.status).toBe(200);
		const j = await res.json();
		expect(j.date).toBe("2025-06-01");
		expect(Array.isArray(j.slots)).toBe(true);
	});
});
