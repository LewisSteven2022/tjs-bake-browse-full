"use client";

import { useEffect, useRef, useState } from "react";
import {
	useNotifications,
	showErrorNotification,
	showSuccessNotification,
	showInfoNotification,
} from "@/components/NotificationManager";

type Order = {
	id: string;
	order_number: number;
	status: string;
	pickup_date: string;
	pickup_time: string;
	total_pence: number;
	customer_name?: string | null;
	customer_email?: string | null;
	customer_phone?: string | null;
	created_at: string; // ISO
};

const GBP = (p: number) => `£${(p / 100).toFixed(2)}`;
const ALL_STATUSES = [
	"unpaid",
	"preparing",
	"ready",
	"collected",
	"cancelled",
	"rejected",
] as const;
type Status = (typeof ALL_STATUSES)[number];

const FILTERS = ["all", ...ALL_STATUSES] as const;

const TIME_FILTERS = [
	{ value: "all", label: "All Times" },
	{ value: "urgent", label: "🚨 Urgent (Next 2 hours)" },
	{ value: "today", label: "📅 Today" },
	{ value: "morning", label: "🌅 Morning (9AM-12PM)" },
	{ value: "afternoon", label: "☀️ Afternoon (12PM-5PM)" },
	{ value: "evening", label: "🌆 Evening (5PM-7PM)" },
] as const;

const REFRESH_MS = 30_000;

export default function AdminOrdersEmailTestPage() {
	const [rows, setRows] = useState<Order[]>([]);
	const [loading, setLoading] = useState(true);
	const [statusFilter, setStatusFilter] =
		useState<(typeof FILTERS)[number]>("all");
	const [fromDate, setFromDate] = useState("");
	const [toDate, setToDate] = useState("");
	const [timeFilter, setTimeFilter] = useState<string>("all");
	const [autoRefresh, setAutoRefresh] = useState(true);
	const [soundOn, setSoundOn] = useState(true);
	const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

	// Bulk selection state
	const [selected, setSelected] = useState<Set<string>>(new Set());

	const timerRef = useRef<number | null>(null);
	const lastSeenCountRef = useRef<number>(0);
	const lastSeenNewestRef = useRef<string>("");
	const audioCtxRef = useRef<AudioContext | null>(null);
	const { showNotification } = useNotifications();

	function playNewOrderChime() {
		if (!soundOn) return;
		try {
			if (!audioCtxRef.current) {
				audioCtxRef.current = new (window.AudioContext ||
					(window as any).webkitAudioContext)();
			}
			const ctx = audioCtxRef.current!;
			const now = ctx.currentTime;
			const freqs = [523.25, 659.25, 783.99]; // C5-E5-G5
			freqs.forEach((f, i) => {
				const osc = ctx.createOscillator();
				const gain = ctx.createGain();
				osc.type = "sine";
				osc.frequency.value = f;
				gain.gain.setValueAtTime(0.0001, now);
				gain.gain.exponentialRampToValueAtTime(0.07, now + 0.01 + i * 0.02);
				gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2 + i * 0.02);
				osc.connect(gain).connect(ctx.destination);
				osc.start(now + i * 0.02);
				osc.stop(now + 0.25 + i * 0.02);
			});
		} catch {
			// ignore
		}
	}

	async function load() {
		setLoading(true);
		const params = new URLSearchParams();
		if (statusFilter && statusFilter !== "all")
			params.set("status", statusFilter);
		if (fromDate) params.set("from", fromDate);
		if (toDate) params.set("to", toDate);
		if (timeFilter && timeFilter !== "all") params.set("time", timeFilter);

		try {
			const res = await fetch(`/api/admin/orders?${params}`);
			if (!res.ok) throw new Error("Failed to load orders");
			const data = await res.json();
			setRows(data.orders || []);
		} catch (error) {
			// silent
			showErrorNotification(
				showNotification,
				"Load Failed",
				"Failed to load orders. Please refresh the page."
			);
		} finally {
			setLoading(false);
		}
	}

	// Auto-refresh logic
	useEffect(() => {
		if (!autoRefresh) return;

		const interval = setInterval(() => {
			load();
		}, REFRESH_MS);

		return () => clearInterval(interval);
	}, [autoRefresh]);

	// Check for new orders
	useEffect(() => {
		if (rows.length === 0) return;

		const currentCount = rows.length;
		const currentNewest = rows[0]?.created_at || "";

		if (
			lastSeenCountRef.current > 0 &&
			currentCount > lastSeenCountRef.current
		) {
			playNewOrderChime();
			showInfoNotification(
				showNotification,
				"New Order!",
				`${currentCount - lastSeenCountRef.current} new order${
					currentCount - lastSeenCountRef.current === 1 ? "" : "s"
				} received!`
			);
		}

		if (
			lastSeenNewestRef.current &&
			currentNewest > lastSeenNewestRef.current
		) {
			playNewOrderChime();
		}

		lastSeenCountRef.current = currentCount;
		lastSeenNewestRef.current = currentNewest;
	}, [rows]);

	useEffect(() => {
		load();
	}, [statusFilter, fromDate, toDate, timeFilter]);

	// Bulk operations
	function clearSelection() {
		setSelected(new Set());
	}

	function toggleRow(id: string) {
		const newSelected = new Set(selected);
		if (newSelected.has(id)) {
			newSelected.delete(id);
		} else {
			newSelected.add(id);
		}
		setSelected(newSelected);
	}

	function toggleSelectAllVisible() {
		if (allSelectedOnPage) {
			setSelected(new Set());
		} else {
			const newSelected = new Set(selected);
			rows.forEach((row) => newSelected.add(row.id));
			setSelected(newSelected);
		}
	}

	const allSelectedOnPage =
		rows.length > 0 && rows.every((r) => selected.has(r.id));
	const someSelectedOnPage =
		rows.some((r) => selected.has(r.id)) && !allSelectedOnPage;

	async function bulkUpdateStatus(status: Status) {
		if (selected.size === 0) return;

		const promises = Array.from(selected).map((id) =>
			fetch("/api/admin/orders", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id, status }),
			})
		);

		try {
			await Promise.all(promises);
			showSuccessNotification(
				showNotification,
				"Bulk Update Complete",
				`${selected.size} order${
					selected.size === 1 ? "" : "s"
				} marked as ${status}`
			);
			setSelected(new Set());
			load();
		} catch (error) {
			showErrorNotification(
				showNotification,
				"Bulk Update Failed",
				"Some updates failed. Please try again."
			);
		}
	}

	return (
		<div className="space-y-6 p-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">
						Admin Orders - Email Test Page
					</h1>
					<p className="text-gray-600">
						Test page for admin orders with email functionality
					</p>
				</div>
				<div className="flex items-center gap-4">
					<button
						onClick={load}
						disabled={loading}
						className="rounded-full bg-blue-800 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50">
						{loading ? "Loading..." : "Refresh"}
					</button>
					<div className="flex items-center gap-2">
						<input
							type="checkbox"
							id="autoRefresh"
							checked={autoRefresh}
							onChange={(e) => setAutoRefresh(e.target.checked)}
							className="rounded-full"
						/>
						<label htmlFor="autoRefresh" className="text-sm">
							Auto-refresh
						</label>
					</div>
					<div className="flex items-center gap-2">
						<input
							type="checkbox"
							id="soundOn"
							checked={soundOn}
							onChange={(e) => setSoundOn(e.target.checked)}
							className="rounded-full"
						/>
						<label htmlFor="soundOn" className="text-sm">
							Sound on
						</label>
					</div>
				</div>
			</div>

			{/* Filters */}
			<div className="rounded-lg border bg-white p-4">
				<div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-4">
					<div>
						<label className="mb-2 block text-sm font-medium text-gray-700">
							Status
						</label>
						<select
							value={statusFilter}
							onChange={(e) =>
								setStatusFilter(e.target.value as typeof statusFilter)
							}
							className="w-full rounded-full border border-gray-300 px-3 py-2">
							{FILTERS.map((f) => (
								<option key={f} value={f}>
									{f === "all" ? "All Statuses" : f}
								</option>
							))}
						</select>
					</div>
					<div>
						<label className="mb-2 block text-sm font-medium text-gray-700">
							Time Filter
						</label>
						<select
							value={timeFilter}
							onChange={(e) => setTimeFilter(e.target.value)}
							className="w-full rounded-full border border-gray-300 px-3 py-2">
							{TIME_FILTERS.map((tf) => (
								<option key={tf.value} value={tf.value}>
									{tf.label}
								</option>
							))}
						</select>
					</div>
					<div>
						<label className="mb-2 block text-sm font-medium text-gray-700">
							From Date
						</label>
						<input
							type="date"
							value={fromDate}
							onChange={(e) => setFromDate(e.target.value)}
							className="w-full rounded-full border border-gray-300 px-3 py-2"
						/>
					</div>
					<div>
						<label className="mb-2 block text-sm font-medium text-gray-700">
							To Date
						</label>
						<input
							type="date"
							value={toDate}
							onChange={(e) => setToDate(e.target.value)}
							className="w-full rounded-full border border-gray-300 px-3 py-2"
						/>
					</div>
				</div>
			</div>

			{/* Filter summary */}
			{(statusFilter !== "all" ||
				timeFilter !== "all" ||
				fromDate ||
				toDate) && (
				<div className="flex items-center justify-between rounded-lg border bg-green-50 p-3">
					<div className="flex items-center gap-4 text-sm">
						<span className="font-medium text-green-800">
							📊 {rows.length} order{rows.length !== 1 ? "s" : ""} found
						</span>
						{statusFilter !== "all" && (
							<span className="text-green-700">
								Status: <span className="font-medium">{statusFilter}</span>
							</span>
						)}
						{timeFilter !== "all" && (
							<span className="text-green-700">
								Time:{" "}
								<span className="font-medium">
									{TIME_FILTERS.find((tf) => tf.value === timeFilter)?.label}
								</span>
							</span>
						)}
						{(fromDate || toDate) && (
							<span className="text-green-700">
								Date: {fromDate || "Any"} to {toDate || "Any"}
							</span>
						)}
					</div>
					<button
						onClick={() => {
							setStatusFilter("all");
							setTimeFilter("all");
							setFromDate("");
							setToDate("");
						}}
						className="text-sm text-green-600 hover:text-green-800 underline">
						Clear Filters
					</button>
				</div>
			)}

			{/* Bulk toolbar (only when selection exists) */}
			{selected.size > 0 && (
				<div className="flex flex-wrap items-center gap-2 rounded-lg border bg-white p-3 text-sm">
					<div className="font-medium">{selected.size} selected</div>
					<div className="h-5 w-px bg-gray-300" />
					<button
						className="rounded-full border border-blue-300 px-3 py-1 text-blue-700 hover:bg-blue-50"
						onClick={() => bulkUpdateStatus("preparing")}>
						Mark Preparing
					</button>
					<button
						className="rounded-full border border-blue-300 px-3 py-1 text-blue-700 hover:bg-blue-50"
						onClick={() => bulkUpdateStatus("ready")}>
						Mark Ready
					</button>
					<button
						className="rounded-full border border-blue-300 px-3 py-1 text-blue-700 hover:bg-blue-50"
						onClick={() => bulkUpdateStatus("collected")}>
						Mark Collected
					</button>
					<button
						className="rounded-full border border-amber-300 px-3 py-1 text-amber-700 hover:bg-amber-50"
						onClick={() => bulkUpdateStatus("cancelled")}>
						Cancel
					</button>
					<button
						className="rounded-full border border-red-300 px-3 py-1 text-red-700 hover:bg-red-50"
						onClick={() => bulkUpdateStatus("rejected")}>
						Reject
					</button>
					<button
						className="rounded-full border border-gray-300 px-3 py-1 text-gray-700 hover:bg-gray-50"
						onClick={() => bulkUpdateStatus("unpaid")}>
						Set Unpaid
					</button>
					<div className="h-5 w-px bg-gray-300" />
					<button
						className="rounded-full border px-3 py-1 hover:bg-gray-50"
						onClick={clearSelection}
						title="Clear selection">
						Clear
					</button>
				</div>
			)}

			<OrdersTable
				rows={rows}
				selected={selected}
				allSelectedOnPage={allSelectedOnPage}
				someSelectedOnPage={someSelectedOnPage}
				onToggleSelectAll={toggleSelectAllVisible}
				onToggleRow={toggleRow}
				onStatusUpdated={load}
			/>
		</div>
	);
}

function OrdersTable({
	rows,
	selected,
	allSelectedOnPage,
	someSelectedOnPage,
	onToggleSelectAll,
	onToggleRow,
	onStatusUpdated,
}: {
	rows: Order[];
	selected: Set<string>;
	allSelectedOnPage: boolean;
	someSelectedOnPage: boolean;
	onToggleSelectAll: () => void;
	onToggleRow: (id: string) => void;
	onStatusUpdated: () => void;
}) {
	// Function to check if an order is urgent (within next 2 hours)
	const isUrgent = (pickupDate: string, pickupTime: string) => {
		try {
			const now = new Date();
			const today = now.toISOString().split("T")[0];

			if (pickupDate !== today) return false;

			// Parse time more safely
			const timeParts = pickupTime.split(":");
			if (timeParts.length !== 2) return false;

			const hours = parseInt(timeParts[0], 10);
			const minutes = parseInt(timeParts[1], 10);

			if (isNaN(hours) || isNaN(minutes)) return false;

			const pickupDateTime = new Date();
			pickupDateTime.setHours(hours, minutes, 0, 0);

			const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);
			return pickupDateTime <= twoHoursFromNow && pickupDateTime >= now;
		} catch (error) {
			// If anything goes wrong, don't mark as urgent
			// silent
			return false;
		}
	};

	return rows.length === 0 ? (
		<div className="rounded-xl border bg-white p-4">
			No orders match the current filters.
		</div>
	) : (
		<div className="overflow-x-auto rounded-xl border bg-white">
			<table className="min-w-full text-sm">
				<thead className="bg-gray-50">
					<tr>
						{/* Master checkbox */}
						<th className="p-3">
							<input
								type="checkbox"
								aria-label="Select all on page"
								checked={allSelectedOnPage}
								ref={(el) => {
									if (el) (el as any).indeterminate = someSelectedOnPage;
								}}
								onChange={onToggleSelectAll}
							/>
						</th>
						<th className="p-3 text-left">#</th>
						<th className="p-3 text-left">Status</th>
						<th className="p-3 text-left">Pickup</th>
						<th className="p-3 text-left">Customer</th>
						<th className="p-3 text-left">Total</th>
						<th className="p-3 text-left">Placed</th>
						<th className="p-3 text-left">Actions</th>
					</tr>
				</thead>
				<tbody>
					{rows.map((o) => {
						const urgent = isUrgent(o.pickup_date, o.pickup_time);
						return (
							<tr
								key={o.id}
								className={`border-t ${urgent ? "bg-red-50" : ""}`}>
								<td className="p-3">
									<input
										type="checkbox"
										aria-label={`Select order ${o.order_number}`}
										checked={selected.has(o.id)}
										onChange={() => onToggleRow(o.id)}
									/>
								</td>
								<td className="p-3 font-mono">
									{String(o.order_number).padStart(3, "0")}
								</td>
								<td className="p-3 capitalize">{o.status}</td>
								<td className="p-3">
									<div
										className={`flex items-center gap-2 ${
											urgent ? "text-red-700 font-semibold" : ""
										}`}>
										{o.pickup_date} {o.pickup_time}
										{urgent && (
											<span className="inline-flex items-center gap-1 bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
												🚨 Urgent
											</span>
										)}
									</div>
								</td>
								<td className="p-3">
									<div>{o.customer_name || "—"}</div>
									<div className="text-gray-500">
										{o.customer_email || o.customer_phone || "—"}
									</div>
								</td>
								<td className="p-3">{GBP(o.total_pence)}</td>
								<td className="p-3">
									{new Date(o.created_at).toLocaleString()}
								</td>
								<td className="p-3">
									<div className="flex flex-wrap items-center gap-2">
										<StatusSelect
											id={o.id}
											value={o.status}
											onUpdated={onStatusUpdated}
										/>
										<QuickActions
											id={o.id}
											status={o.status}
											onUpdated={onStatusUpdated}
										/>
									</div>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}

function StatusSelect({
	id,
	value,
	onUpdated,
}: {
	id: string;
	value: string;
	onUpdated: () => void;
}) {
	const [saving, setSaving] = useState(false);
	const { showNotification } = useNotifications();

	async function save(next: Status) {
		if (next === value) return;
		setSaving(true);
		const res = await fetch("/api/admin/orders", {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ id, status: next }),
		});
		const j = await res.json().catch(() => ({}));
		setSaving(false);
		if (!res.ok) {
			showErrorNotification(
				showNotification,
				"Update Failed",
				j?.error || "Update failed"
			);
			return;
		}
		showSuccessNotification(
			showNotification,
			"Status Updated",
			"Order status has been updated successfully."
		);
		onUpdated();
	}
	return (
		<select
			defaultValue={value}
			onChange={(e) => save(e.target.value as Status)}
			className="rounded-lg border px-2 py-1"
			disabled={saving}
			title="Change status">
			{ALL_STATUSES.map((s) => (
				<option key={s} value={s}>
					{s}
				</option>
			))}
		</select>
	);
}

function QuickActions({
	id,
	status,
	onUpdated,
}: {
	id: string;
	status: Status | string;
	onUpdated: () => void;
}) {
	const [busy, setBusy] = useState<string | null>(null);
	const { showNotification } = useNotifications();

	async function setStatus(next: Status) {
		setBusy(next);
		const res = await fetch("/api/admin/orders", {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ id, status: next }),
		});
		const j = await res.json().catch(() => ({}));
		setBusy(null);
		if (!res.ok) {
			showErrorNotification(
				showNotification,
				"Update Failed",
				j?.error || "Update failed"
			);
			return;
		}
		showSuccessNotification(
			showNotification,
			`Marked ${next}`,
			`Order marked as ${next}`
		);
		onUpdated();
	}

	async function sendReadyEmail(orderId: string) {
		setBusy("email");
		try {
			const res = await fetch("/api/admin/orders/resend", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ orderId, emailType: "ready" }),
			});

			if (!res.ok) {
				const error = await res.json().catch(() => ({}));
				throw new Error(error.error || "Failed to send email");
			}

			showSuccessNotification(
				showNotification,
				"Email Sent",
				"Ready to collect email sent to customer successfully."
			);
		} catch (error) {
			showErrorNotification(
				showNotification,
				"Email Failed",
				error instanceof Error ? error.message : "Failed to send email"
			);
		} finally {
			setBusy(null);
		}
	}

	const buttons: { label: string; next: Status; kind?: "warn" | "danger" }[] =
		[];
	if (status === "unpaid")
		buttons.push({ label: "Preparing", next: "preparing" });
	if (status === "preparing") buttons.push({ label: "Ready", next: "ready" });
	if (status === "ready")
		buttons.push({ label: "Collected", next: "collected" });

	buttons.push({ label: "Cancel", next: "cancelled", kind: "warn" });
	buttons.push({ label: "Reject", next: "rejected", kind: "danger" });

	return (
		<div className="flex flex-wrap gap-2">
			{buttons.map((b) => (
				<button
					key={b.label}
					onClick={() => setStatus(b.next)}
					disabled={!!busy}
					className={[
						"rounded-lg px-3 py-1 text-sm border",
						b.kind === "danger"
							? "border-red-300 text-red-700 hover:bg-red-50"
							: b.kind === "warn"
							? "border-amber-300 text-amber-700 hover:bg-amber-50"
							: "border-blue-300 text-blue-700 hover:bg-blue-50",
						busy ? "opacity-60" : "",
					].join(" ")}
					title={b.label}>
					{busy === b.next ? "…" : b.label}
				</button>
			))}

			{/* Email Customer Button - Only show for ready orders */}
			{status === "ready" && (
				<button
					onClick={() => sendReadyEmail(id)}
					disabled={!!busy}
					className="rounded-lg px-3 py-1 text-sm border border-green-300 text-green-700 hover:bg-green-50 disabled:opacity-60"
					title="Send ready to collect email">
					{busy === "email" ? "…" : "📧 Email Customer"}
				</button>
			)}
		</div>
	);
}
