import { describe, it, expect, vi, beforeAll } from "vitest";

vi.mock("@/lib/db", () => {
	return {
		admin: {
			from: vi.fn().mockReturnValue({
				select: vi.fn().mockReturnThis(),
				in: vi.fn().mockReturnThis(),
				not: vi.fn().mockReturnThis(),
				then: (resolve: any) =>
					resolve({
						data: [
							{
								pickup_date: "2025-06-01",
								pickup_time: "10:00",
								status: "unpaid",
							},
							{
								pickup_date: "2025-06-01",
								pickup_time: "10:00",
								status: "preparing",
							},
						],
						error: null,
					}),
			}),
		},
	};
});

import { GET } from "@/app/api/slots/route";

describe("GET /api/slots", () => {
	beforeAll(() => {
		(process as any).env.NEXT_PUBLIC_SLOT_CAPACITY = "2";
	});

	it("marks slots full when capacity reached", async () => {
		const res = await GET();
		expect(res.status).toBe(200);
		const j = await res.json();
		const days = j.slots as any[];
		const day = days.find((d) => d.date === "2025-06-01");
		if (day) {
			const slot = day.times.find((t: any) => t.time === "10:00");
			expect(slot.remaining).toBe(0);
			expect(slot.disabled).toBe(true);
		}
	});
});
