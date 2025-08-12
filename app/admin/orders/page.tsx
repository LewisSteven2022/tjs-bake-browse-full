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

const REFRESH_MS = 30_000;

export default function AdminOrdersPage() {
	const [rows, setRows] = useState<Order[]>([]);
	const [loading, setLoading] = useState(true);
	const [statusFilter, setStatusFilter] =
		useState<(typeof FILTERS)[number]>("all");
	const [fromDate, setFromDate] = useState("");
	const [toDate, setToDate] = useState("");
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

		const res = await fetch(`/api/admin/orders?${params.toString()}`, {
			cache: "no-store",
		});
		if (!res.ok) {
			const j = await res.json().catch(() => ({}));
			showErrorNotification(
				showNotification,
				"Load Failed",
				j?.error || `Failed to load orders (${res.status})`
			);
			setLoading(false);
			return;
		}
		const j = await res.json();
		const list: Order[] = j.orders ?? [];

		const newest = list[0]?.created_at || "";
		const seenNewest = lastSeenNewestRef.current;
		const prevCount = lastSeenCountRef.current;

		setRows(list);
		setLoading(false);
		setLastUpdated(new Date());

		// New order cue (not on first ever load)
		if (list.length > 0) {
			const hasNewByTime = newest && newest !== seenNewest;
			const hasNewByCount = list.length > prevCount;
			if ((hasNewByTime || hasNewByCount) && lastUpdated !== null) {
				playNewOrderChime();
			}
			lastSeenNewestRef.current = newest || seenNewest;
		}
		lastSeenCountRef.current = list.length;

		// Clear selection if selected rows not in current view
		setSelected((prev) => {
			if (prev.size === 0) return prev;
			const ids = new Set(list.map((r) => r.id));
			const next = new Set<string>();
			prev.forEach((id) => ids.has(id) && next.add(id));
			return next;
		});
	}

	// Initial load
	useEffect(() => {
		load();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleRefresh = () => load();

	// Auto-refresh loop with smart pause on hidden tab
	useEffect(() => {
		function clearTimer() {
			if (timerRef.current) {
				clearInterval(timerRef.current);
				timerRef.current = null;
			}
		}
		function schedule() {
			clearTimer();
			if (!autoRefresh) return;
			if (document.visibilityState === "hidden") return;
			timerRef.current = window.setInterval(() => {
				load();
			}, REFRESH_MS);
		}
		schedule();
		const onVis = () => schedule();
		document.addEventListener("visibilitychange", onVis);
		return () => {
			clearTimer();
			document.removeEventListener("visibilitychange", onVis);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [autoRefresh, statusFilter, fromDate, toDate]);

	// Selection helpers
	const allVisibleIds = rows.map((r) => r.id);
	const allSelectedOnPage =
		allVisibleIds.length > 0 && allVisibleIds.every((id) => selected.has(id));
	const someSelectedOnPage =
		allVisibleIds.some((id) => selected.has(id)) && !allSelectedOnPage;

	function toggleSelectAllVisible() {
		setSelected((prev) => {
			const next = new Set(prev);
			if (allSelectedOnPage) {
				// unselect all visible
				allVisibleIds.forEach((id) => next.delete(id));
			} else {
				// select all visible
				allVisibleIds.forEach((id) => next.add(id));
			}
			return next;
		});
	}

	function toggleRow(id: string) {
		setSelected((prev) => {
			const next = new Set(prev);
			if (next.has(id)) next.delete(id);
			else next.add(id);
			return next;
		});
	}

	function clearSelection() {
		setSelected(new Set());
	}

	async function bulkUpdateStatus(next: Status) {
		if (selected.size === 0) return;
		const ids = Array.from(selected);
		const label = next[0].toUpperCase() + next.slice(1);

		// Optimistic UI hint
		showInfoNotification(
			showNotification,
			`Updating ${ids.length} orders to ${label}…`,
			"Updating orders"
		);

		// Perform in parallel (bounded would be nicer; this is fine for small batches)
		const results = await Promise.allSettled(
			ids.map((id) =>
				fetch("/api/admin/orders", {
					method: "PATCH",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ id, status: next }),
				}).then(async (r) => {
					if (!r.ok) {
						const j = await r.json().catch(() => ({}));
						throw new Error(j?.error || `HTTP ${r.status}`);
					}
				})
			)
		);

		const failures = results.filter((r) => r.status === "rejected");
		if (failures.length) {
			showErrorNotification(
				showNotification,
				`Updated ${ids.length - failures.length}/${ids.length}. Some failed.`,
				"Some orders failed to update"
			);
		} else {
			showSuccessNotification(
				showNotification,
				`Updated ${ids.length} orders to ${label}`,
				"Orders updated"
			);
		}

		clearSelection();
		load();
	}

	return (
		<div className="mx-auto max-w-6xl space-y-4">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-semibold">Customer Orders</h1>
				<div className="text-xs text-gray-500">
					{lastUpdated
						? `Last updated ${lastUpdated.toLocaleTimeString()}`
						: "—"}
				</div>
			</div>

			{/* Filters / Controls */}
			<div className="flex flex-wrap items-end gap-3 rounded-lg border bg-white p-3">
				<div>
					<label className="block text-sm text-gray-600">Status</label>
					<select
						value={statusFilter}
						onChange={(e) => setStatusFilter(e.target.value as any)}
						className="rounded-lg border px-3 py-1">
						{FILTERS.map((s) => (
							<option key={s} value={s}>
								{s}
							</option>
						))}
					</select>
				</div>
				<div>
					<label className="block text-sm text-gray-600">From</label>
					<input
						type="date"
						value={fromDate}
						onChange={(e) => setFromDate(e.target.value)}
						className="rounded-lg border px-3 py-1"
					/>
				</div>
				<div>
					<label className="block text-sm text-gray-600">To</label>
					<input
						type="date"
						value={toDate}
						onChange={(e) => setToDate(e.target.value)}
						className="rounded-lg border px-3 py-1"
					/>
				</div>

				<div className="ml-auto flex items-center gap-2">
					<button
						onClick={handleRefresh}
						className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
						disabled={loading}>
						{loading ? "Refreshing…" : "Refresh"}
					</button>

					<label className="flex cursor-pointer select-none items-center gap-2 rounded-lg border px-3 py-2 hover:bg-gray-50">
						<input
							type="checkbox"
							checked={autoRefresh}
							onChange={(e) => setAutoRefresh(e.target.checked)}
						/>
						Auto-refresh every {Math.round(REFRESH_MS / 1000)}s
					</label>

					<label className="flex cursor-pointer select-none items-center gap-2 rounded-lg border px-3 py-2 hover:bg-gray-50">
						<input
							type="checkbox"
							checked={soundOn}
							onChange={(e) => setSoundOn(e.target.checked)}
						/>
						Play sound on new orders
					</label>
				</div>
			</div>

			{/* Bulk toolbar (only when selection exists) */}
			{selected.size > 0 && (
				<div className="flex flex-wrap items-center gap-2 rounded-lg border bg-white p-3 text-sm">
					<div className="font-medium">{selected.size} selected</div>
					<div className="h-5 w-px bg-gray-300" />
					<button
						className="rounded border border-blue-300 px-3 py-1 text-blue-700 hover:bg-blue-50"
						onClick={() => bulkUpdateStatus("preparing")}>
						Mark Preparing
					</button>
					<button
						className="rounded border border-blue-300 px-3 py-1 text-blue-700 hover:bg-blue-50"
						onClick={() => bulkUpdateStatus("ready")}>
						Mark Ready
					</button>
					<button
						className="rounded border border-blue-300 px-3 py-1 text-blue-700 hover:bg-blue-50"
						onClick={() => bulkUpdateStatus("collected")}>
						Mark Collected
					</button>
					<button
						className="rounded border border-amber-300 px-3 py-1 text-amber-700 hover:bg-amber-50"
						onClick={() => bulkUpdateStatus("cancelled")}>
						Cancel
					</button>
					<button
						className="rounded border border-red-300 px-3 py-1 text-red-700 hover:bg-red-50"
						onClick={() => bulkUpdateStatus("rejected")}>
						Reject
					</button>
					<button
						className="rounded border border-gray-300 px-3 py-1 text-gray-700 hover:bg-gray-50"
						onClick={() => bulkUpdateStatus("unpaid")}>
						Set Unpaid
					</button>
					<div className="h-5 w-px bg-gray-300" />
					<button
						className="rounded border px-3 py-1 hover:bg-gray-50"
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
					{rows.map((o) => (
						<tr key={o.id} className="border-t">
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
								{o.pickup_date} {o.pickup_time}
							</td>
							<td className="p-3">
								<div>{o.customer_name || "—"}</div>
								<div className="text-gray-500">
									{o.customer_email || o.customer_phone || "—"}
								</div>
							</td>
							<td className="p-3">{GBP(o.total_pence)}</td>
							<td className="p-3">{new Date(o.created_at).toLocaleString()}</td>
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
					))}
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
		</div>
	);
}
