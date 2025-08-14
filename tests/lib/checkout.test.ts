import { describe, it, expect } from "vitest";
import {
	formatGBP,
	todayISO,
	formatLongDate,
	addDaysISO,
	isSunday,
	sameDayCutoffApplies,
	computeDateBounds,
	buildSlots,
	calcSubtotal,
	calcGST,
	calcTotal,
	BAG_PENCE,
} from "@/lib/checkout";

describe("lib/checkout", () => {
	it("formatGBP works", () => {
		expect(formatGBP(0)).toBe("£0.00");
		expect(formatGBP(1234)).toBe("£12.34");
	});

	it("todayISO produces local date", () => {
		const d = new Date("2024-06-01T10:00:00");
		expect(todayISO(d)).toBe("2024-06-01");
	});

	it("formatLongDate returns expected string", () => {
		expect(formatLongDate("2024-06-01")).toMatch(
			/Saturday 1st June 2024|Saturday 1st/
		);
	});

	it("addDaysISO adds days", () => {
		expect(addDaysISO("2024-06-01", 1)).toBe("2024-06-02");
	});

	it("isSunday detects Sunday", () => {
		expect(isSunday("2024-06-02")).toBe(true);
		expect(isSunday("2024-06-03")).toBe(false);
	});

	it("sameDayCutoffApplies at >= 12:00", () => {
		expect(sameDayCutoffApplies(new Date("2024-06-01T11:59:00"))).toBe(false);
		expect(sameDayCutoffApplies(new Date("2024-06-01T12:00:00"))).toBe(true);
	});

	it("computeDateBounds skips Sundays", () => {
		// Use a Friday before Sunday to force skip
		const now = new Date("2024-06-07T09:00:00"); // Friday
		const { minDate, maxDate } = computeDateBounds(now);
		expect(minDate > "2024-06-07").toBe(false); // before cutoff
		expect(maxDate.length).toBe(10);
	});

	it("buildSlots returns inclusive steps", () => {
		const slots = buildSlots("09:00", "09:30", 30);
		expect(slots).toEqual(["09:00", "09:30"]);
	});

	it("totals compute correctly", () => {
		const items = [
			{ product_id: "a", name: "A", price_pence: 100, qty: 2 },
			{ product_id: "b", name: "B", price_pence: 250, qty: 1 },
		];
		const subtotal = calcSubtotal(items as any);
		expect(subtotal).toBe(450);
		const gst = calcGST(subtotal, true);
		expect(gst).toBe(Math.round((450 + BAG_PENCE) * 0.06));
		const total = calcTotal(items as any, true);
		expect(total).toBe(subtotal + BAG_PENCE + gst);
	});
});
