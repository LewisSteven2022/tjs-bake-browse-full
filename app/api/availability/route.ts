import { NextRequest, NextResponse } from "next/server";
import { admin } from "@/lib/db";

const MAX_PER_SLOT = 1;

// 30-min slots 09:00–17:30
function buildSlots() {
	const out: string[] = [];
	for (let h = 9; h <= 17; h++) {
		for (const m of [0, 30]) {
			if (h === 17 && m === 30) break; // last is 17:00–17:30 inclusive start
			const hh = String(h).padStart(2, "0");
			const mm = String(m).padStart(2, "0");
			out.push(`${hh}:${mm}`);
		}
	}
	return out;
}

export async function GET(req: NextRequest) {
	const date = req.nextUrl.searchParams.get("date"); // YYYY-MM-DD
	if (!date)
		return NextResponse.json({ error: "date required" }, { status: 400 });

	// Count existing (exclude cancelled/rejected)
	const { data, error } = await admin
		.from("orders")
		.select("pickup_time, status")
		.eq("pickup_date", date)
		.not("status", "in", '("cancelled","rejected")');

	if (error)
		return NextResponse.json({ error: error.message }, { status: 500 });

	const counts = new Map<string, number>();
	for (const row of data ?? []) {
		const t = row.pickup_time as string;
		counts.set(t, (counts.get(t) ?? 0) + 1);
	}

	const slots = buildSlots().map((t) => {
		const used = counts.get(t) ?? 0;
		const remaining = Math.max(0, MAX_PER_SLOT - used);
		return { time: t, used, remaining, full: remaining === 0 };
	});

	return NextResponse.json({ date, maxPerSlot: MAX_PER_SLOT, slots });
}
