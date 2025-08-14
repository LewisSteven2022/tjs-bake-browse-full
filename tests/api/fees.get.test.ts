import { describe, it, expect, vi } from "vitest";

vi.mock("@supabase/supabase-js", () => ({
	createClient: vi.fn().mockReturnValue({
		from: vi.fn().mockReturnValue({
			select: vi.fn().mockReturnThis(),
			eq: vi.fn().mockReturnThis(),
			then: (resolve: any) =>
				resolve({ data: [{ name: "Bag Fee", amount_pence: 50 }], error: null }),
		}),
	}),
}));

import { GET } from "@/app/api/fees/route";

describe("GET /api/fees", () => {
	it("returns active fees", async () => {
		const res = await GET();
		expect(res.status).toBe(200);
		const j = await res.json();
		expect(Array.isArray(j.fees)).toBe(true);
		expect(j.fees[0].name).toBe("Bag Fee");
	});
});
