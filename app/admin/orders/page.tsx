"use client";
import { useEffect, useState } from "react";

const STATUSES = [
	"unpaid",
	"preparing",
	"ready",
	"collected",
	"cancelled",
	"rejected",
] as const;

export default function AdminOrdersPage() {
	const [rows, setRows] = useState<any[]>([]);
	const [busy, setBusy] = useState<string>("");

	async function load() {
		const r = await fetch("/api/admin/orders");
		const j = await r.json();
		setRows(j.orders || []);
	}
	useEffect(() => {
		load();
	}, []);

	async function updateStatus(id: string, status: string) {
		setBusy(id);
		const r = await fetch("/api/admin/orders", {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ id, status }),
		});
		setBusy("");
		if (r.ok) load();
	}

	return (
		<div className="space-y-4">
			<h1 className="text-2xl font-semibold">Admin • Orders</h1>
			<table className="w-full text-sm">
				<thead>
					<tr>
						<th className="text-left">Order #</th>
						<th>Pickup</th>
						<th>Total</th>
						<th>Status</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{rows.map((o) => (
						<tr key={o.id} className="border-t">
							<td className="py-2 font-mono">
								{String(o.order_number).padStart(3, "0")}
							</td>
							<td className="text-center">
								{o.pickup_date} {o.pickup_time}
							</td>
							<td className="text-center">
								£{(o.total_pence / 100).toFixed(2)}
							</td>
							<td className="text-center">{o.status}</td>
							<td className="text-center">
								<select
									className="border rounded-xl p-1"
									value={o.status}
									onChange={(e) => updateStatus(o.id, e.target.value)}
									disabled={busy === o.id}>
									{STATUSES.map((s) => (
										<option key={s} value={s}>
											{s}
										</option>
									))}
								</select>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
