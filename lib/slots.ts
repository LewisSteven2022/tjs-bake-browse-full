import {
	addMinutes,
	isSunday as isSundayFn,
	format,
	isBefore,
	setHours,
	setMinutes,
} from "date-fns";

export type GeneratedDay = {
	date: string;
	times: string[];
	disabled?: boolean;
};

export function generateSlots(
	now: Date,
	days = 7,
	open = "09:00",
	close = "17:00",
	stepMinutes = 30
): GeneratedDay[] {
	const [oh, om] = open.split(":").map(Number);
	const [ch, cm] = close.split(":").map(Number);

	// Determine the first day in the window considering the midday cutoff
	const startDay = new Date(now);
	const cutoff = setMinutes(setHours(new Date(now), 12), 0);
	if (isBefore(cutoff, now)) {
		// After 12:00 → start from next day
		startDay.setDate(startDay.getDate() + 1);
	}

	const out: GeneratedDay[] = [];

	for (let i = 0; i < days; i++) {
		const day = new Date(startDay);
		day.setDate(startDay.getDate() + i);

		const isSunday = isSundayFn(day);
		const dateStr = format(day, "yyyy-MM-dd");

		if (isSunday) {
			out.push({ date: dateStr, times: [], disabled: true });
			continue;
		}

		const start = setMinutes(setHours(new Date(day), oh), om);
		const end = setMinutes(setHours(new Date(day), ch), cm);
		const times: string[] = [];
		for (let t = start; t < end; t = addMinutes(t, stepMinutes)) {
			times.push(format(t, "HH:mm"));
		}
		out.push({ date: dateStr, times });
	}

	return out;
}
