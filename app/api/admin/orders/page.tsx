"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/ToastContext";

type Order = {
	id: string;
	created_at: string;
	status: string;
	total_pence: number | null;
	customer_name: string | null;
	customer_email: string | null;
	pickup_date: string | null;
	pickup_slot: string | null;
};

const STATUSES = [
	"pending",
	"preparing",
	"ready",
	"collected",
	"cancelled",
	"rejected",
];

export default function AdminOrdersPage() {
	const [orders, setOrders] = useState<Order[]>([]);
	const [loading, setLoading] = useState(true);
	const { showToast } = useToast();

	async function load() {
		setLoading(true);
		const res = await fetch("/api/admin/orders", { cache: "no-store" });
		if (!res.ok) {
			showToast("Failed to load orders", "error");
			setLoading(false);
			return;
		}
		const json = await res.json();
		setOrders(json.orders || []);
		setLoading(false);
	}

	useEffect(() => {
		load();
	}, []);

	async function updateStatus(id: string, status: string) {
		const res = await fetch(`/api/admin/orders/${id}`, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ status }),
		});
		if (!res.ok) {
			showToast("Failed to update order", "error");
			return;
		}
		showToast("Order updated", "success");
		await load();
	}

	return (
		<div className="space-y-4">
			<h1 className="text-2xl font-semibold">Orders</h1>

			{loading ? (
				<p>Loading…</p>
			) : (
				<div className="overflow-x-auto">
					<table className="min-w-full text-sm">
						<thead>
							<tr className="text-left border-b">
								<th className="py-2 pr-4">Created</th>
								<th className="py-2 pr-4">Customer</th>
								<th className="py-2 pr-4">Pickup</th>
								<th className="py-2 pr-4">Total</th>
								<th className="py-2 pr-4">Status</th>
							</tr>
						</thead>
						<tbody>
							{orders.map((o) => (
								<tr key={o.id} className="border-b last:border-0">
									<td className="py-2 pr-4">
										{new Date(o.created_at).toLocaleString("en-GB", {
											dateStyle: "medium",
											timeStyle: "short",
										})}
									</td>
									<td className="py-2 pr-4">
										<div>{o.customer_name || "—"}</div>
										<div className="text-xs text-gray-500">
											{o.customer_email || ""}
										</div>
									</td>
									<td className="py-2 pr-4">
										<div>
											{o.pickup_date
												? new Date(o.pickup_date).toLocaleDateString("en-GB", {
														weekday: "long",
														day: "2-digit",
														month: "long",
														year: "numeric",
												  })
												: "—"}
										</div>
										<div className="text-xs text-gray-500">
											{o.pickup_slot || ""}
										</div>
									</td>
									<td className="py-2 pr-4">
										£{((o.total_pence || 0) / 100).toFixed(2)}
									</td>
									<td className="py-2 pr-4">
										<select
											value={o.status}
											onChange={(e) => updateStatus(o.id, e.target.value)}
											className="border rounded px-2 py-1">
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
			)}
		</div>
	);
}
