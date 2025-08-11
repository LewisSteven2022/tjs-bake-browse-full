"use client";
import { useEffect, useMemo, useState } from "react";
import { formatLongDate } from "@/lib/checkout";
type Time = { time: string; disabled?: boolean; remaining?: number };
type Day = { date: string; times: Time[]; disabled?: boolean };

export default function DateTimePicker({
	onChange,
}: {
	onChange: (date: string, time: string) => void;
}) {
	const [days, setDays] = useState<Day[]>([]);
	const [date, setDate] = useState("");
	const [time, setTime] = useState("");

	const refresh = async () => {
		try {
			const r = await fetch("/api/slots", { cache: "no-store" });
			const j = await r.json();
			setDays(Array.isArray(j.slots) ? j.slots : []);
		} catch {}
	};

	useEffect(() => {
		refresh();
	}, []);
	useEffect(() => {
		if (date && time) onChange(date, time);
	}, [date, time, onChange]);

	const timesForSelected = useMemo(() => {
		const d = days.find((d) => d.date === date);
		return Array.isArray(d?.times) ? d!.times : [];
	}, [days, date]);

	return (
		<div className="grid gap-3 md:grid-cols-2">
			<label>
				<span className="text-sm">Collection date</span>
				<select
					className="w-full border rounded-xl p-2"
					value={date}
					onChange={(e) => {
						setDate(e.target.value);
						setTime("");
					}}
					onFocus={refresh}
					onClick={refresh}>
					<option value="">Select date</option>
					{days.map((d) => {
						const label = formatLongDate(d.date);
						return (
							<option key={d.date} value={d.date} disabled={d.disabled}>
								{label}
								{d.disabled ? " (Closed)" : ""}
							</option>
						);
					})}
				</select>
			</label>
			<label>
				<span className="text-sm">Time</span>
				<select
					className="w-full border rounded-xl p-2"
					value={time}
					onChange={(e) => setTime(e.target.value)}
					onFocus={refresh}
					onClick={refresh}
					disabled={
						!date || (days.find((d) => d.date === date)?.disabled ?? false)
					}>
					<option value="">Select time</option>
					{timesForSelected.map((t) => (
						<option key={t.time} value={t.time} disabled={t.disabled}>
							{t.time}
							{typeof t.remaining === "number" ? ` (${t.remaining} left)` : ""}
						</option>
					))}
				</select>
			</label>
		</div>
	);
}
