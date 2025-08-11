"use client";
import { useEffect, useMemo, useState } from "react";
import { formatLongDate } from "@/lib/checkout";
type Day = { date: string; times: string[]; disabled?: boolean };

export default function DateTimePicker({
	onChange,
}: {
	onChange: (date: string, time: string) => void;
}) {
	const [days, setDays] = useState<Day[]>([]);
	const [date, setDate] = useState("");
	const [time, setTime] = useState("");

	useEffect(() => {
		fetch("/api/slots")
			.then((r) => r.json())
			.then((j) => setDays(j.slots));
	}, []);
	useEffect(() => {
		if (date && time) onChange(date, time);
	}, [date, time, onChange]);

	const timesForSelected = useMemo(
		() => days.find((d) => d.date === date)?.times ?? [],
		[days, date]
	);

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
					}}>
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
					disabled={
						!date || (days.find((d) => d.date === date)?.disabled ?? false)
					}>
					<option value="">Select time</option>
					{timesForSelected.map((t) => (
						<option key={t} value={t}>
							{t}
						</option>
					))}
				</select>
			</label>
		</div>
	);
}
