import { describe, it, expect } from "vitest";
import { generateSlots } from "@/lib/slots";

describe("lib/slots.generateSlots", () => {
	it("skips Sundays and applies midday cutoff", () => {
		const now = new Date("2025-06-06T13:00:00"); // Friday after 12:00
		const days = generateSlots(now, 3, "09:00", "10:00", 30);
		// First day should be Saturday (since after cutoff)
		expect(days[0].date).toBe("2025-06-07");
		// Next is Sunday and should be disabled
		expect(days[1].disabled).toBe(true);
		// Monday should exist
		expect(days[2].date).toBe("2025-06-09");
	});
});
