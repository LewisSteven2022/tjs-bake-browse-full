import { NextResponse } from "next/server";
import { generateSlots, type GeneratedDay } from "@/lib/slots";
import { admin } from "@/lib/db";
const SLOT_CAPACITY = Number(process.env.NEXT_PUBLIC_SLOT_CAPACITY || 5);

export async function GET() {
	const now = new Date();
	const days = generateSlots(now, 7, "09:00", "17:00", 30);

	// Fetch counts per (date,time)
	const dates = days.map((d) => d.date);
	if (dates.length === 0) return NextResponse.json({ slots: days });

	const { data, error } = await admin
		.from("orders")
		.select("pickup_date,pickup_time,status")
		.in("pickup_date", dates)
		.not("status", "in", '("cancelled","rejected")');

	if (error)
		return NextResponse.json({ error: error.message }, { status: 500 });

	const taken: Record<string, number> = {};
	for (const row of data || []) {
		const t =
			typeof row.pickup_time === "string"
				? row.pickup_time.slice(0, 5)
				: String(row.pickup_time).slice(0, 5);
		const key = `${row.pickup_date}|${t}`;
		taken[key] = (taken[key] || 0) + 1;
	}

	const withCapacity: GeneratedDay[] = days.map((d) => ({
		...d,
		times: d.times.map((t) => {
			const key = `${d.date}|${t.time}`;
			const used = taken[key] || 0;
			const remaining = Math.max(SLOT_CAPACITY - used, 0);
			return { ...t, disabled: remaining <= 0, remaining };
		}),
	}));

	return NextResponse.json({ slots: withCapacity });
}
