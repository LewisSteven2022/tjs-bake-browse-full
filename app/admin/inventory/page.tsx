// app/admin/inventory/page.tsx
"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

type Product = {
	id: string;
	name: string;
	price_pence: number;
	stock: number;
	visible: boolean;
	image_url?: string | null;
	category?: string | null;
	allergens?: string | string[] | null;
};

const GBP = (p: number) => `£${(p / 100).toFixed(2)}`;

export default function AdminInventoryPage() {
	const [rows, setRows] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const [savingId, setSavingId] = useState<string | null>(null);

	async function load() {
		try {
			setLoading(true);
			const res = await fetch("/api/admin/inventory", { cache: "no-store" });
			if (!res.ok) {
				const j = await res.json().catch(() => ({}));
				throw new Error(j?.error || `Failed to load inventory (${res.status})`);
			}
			const j = await res.json();
			setRows(j.products ?? []);
		} catch (e: any) {
			toast.error(e?.message || "Failed to load inventory");
		} finally {
			setLoading(false);
		}
	}

	async function saveRow(p: Product) {
		try {
			setSavingId(p.id);
			const res = await fetch("/api/admin/inventory", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					id: p.id,
					stock: p.stock,
					visible: p.visible,
					allergens: p.allergens,
				}),
			});
			if (!res.ok) {
				const j = await res.json().catch(() => ({}));
				throw new Error(j?.error || `Update failed (${res.status})`);
			}
			toast.success("Saved");
		} catch (e: any) {
			toast.error(e?.message || "Save failed");
		} finally {
			setSavingId(null);
		}
	}

	useEffect(() => {
		load();
	}, []);

	return (
		<div className="max-w-6xl mx-auto">
			<h1 className="mb-4 text-2xl font-semibold">Inventory</h1>

			{/* Toolbar: Export / Import */}
			<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-3">
				<a
					href="/api/admin/inventory/export"
					className="rounded border px-3 py-2 hover:bg-gray-50 w-full sm:w-auto text-center">
					Export CSV
				</a>

				<form
					onSubmit={async (e) => {
						e.preventDefault();
						const fd = new FormData(e.currentTarget as HTMLFormElement);
						const res = await fetch("/api/admin/inventory/import", {
							method: "POST",
							body: fd,
						});
						if (res.ok) {
							toast.success("Import complete");
							(e.currentTarget as HTMLFormElement).reset();
							load();
						} else {
							const j = await res.json().catch(() => ({}));
							toast.error(j?.error || "Import failed");
						}
					}}
					className="flex items-center gap-2">
					<input
						name="file"
						type="file"
						accept=".csv"
						className="border rounded px-2 py-1"
						required
					/>
					<button
						className="rounded border px-3 py-2 hover:bg-gray-50"
						type="submit">
						Import CSV
					</button>
				</form>
			</div>

			{/* Table */}
			{loading ? (
				<div className="rounded-xl border p-4 bg-white">Loading…</div>
			) : rows.length === 0 ? (
				<div className="rounded-xl border p-4 bg-white">No products found.</div>
			) : (
				<div className="overflow-x-auto rounded-xl border bg-white">
					<table className="min-w-full text-sm">
						<thead className="bg-gray-50">
							<tr>
								<th className="p-3 text-left">Product</th>
								<th className="p-3 text-left">Category</th>
								<th className="p-3 text-left">Price</th>
								<th className="p-3 text-left">Stock</th>
								<th className="p-3 text-left">Visible</th>
								<th className="p-3 text-left">Allergens (JSON)</th>
								<th className="p-3 text-left">Actions</th>
							</tr>
						</thead>
						<tbody>
							{rows.map((p, idx) => (
								<tr key={p.id} className="border-t">
									<td className="p-3">
										<div className="flex items-center gap-3">
											<div className="h-10 w-10 overflow-hidden rounded bg-gray-100 shrink-0">
												{/* eslint-disable-next-line @next/next/no-img-element */}
												<img
													src={p.image_url || "/images/placeholder.svg"}
													alt={p.name}
													className="h-full w-full object-cover"
													onError={(e) => {
														const img = e.currentTarget as HTMLImageElement;
														img.onerror = null;
														img.src = "/images/placeholder.svg";
													}}
												/>
											</div>
											<div className="min-w-0">
												<div className="font-medium truncate max-w-[28ch]">
													{p.name}
												</div>
												<div className="text-gray-500">
													ID: {p.id.slice(0, 8)}…
												</div>
											</div>
										</div>
									</td>
									<td className="p-3">{p.category || "—"}</td>
									<td className="p-3">{GBP(p.price_pence)}</td>
									<td className="p-3">
										<input
											type="number"
											min={0}
											step={1}
											value={p.stock}
											onChange={(e) => {
												const v = Math.max(
													0,
													parseInt(e.target.value || "0", 10)
												);
												setRows((prev) => {
													const next = [...prev];
													next[idx] = { ...p, stock: v };
													return next;
												});
											}}
											className="w-24 rounded-lg border px-2 py-1"
										/>
									</td>
									<td className="p-3">
										<label className="inline-flex items-center gap-2 cursor-pointer select-none">
											<input
												type="checkbox"
												checked={p.visible}
												onChange={(e) => {
													const v = e.target.checked;
													setRows((prev) => {
														const next = [...prev];
														next[idx] = { ...p, visible: v };
														return next;
													});
												}}
											/>
											<span className="text-gray-700">Show</span>
										</label>
									</td>
									<td className="p-3">
										<input
											type="text"
											value={
												Array.isArray(p.allergens)
													? JSON.stringify(p.allergens)
													: p.allergens || ""
											}
											onChange={(e) => {
												const v = e.target.value;
												setRows((prev) => {
													const next = [...prev];
													next[idx] = { ...p, allergens: v };
													return next;
												});
											}}
											placeholder='["tree_nuts","eggs","milk"]'
											className="w-64 rounded-lg border px-2 py-1 font-mono text-xs"
										/>
									</td>
									<td className="p-3">
										<button
											onClick={() => saveRow(p)}
											disabled={savingId === p.id}
											className="rounded-lg border px-3 py-1 hover:bg-gray-50 disabled:opacity-60">
											{savingId === p.id ? "Saving…" : "Save"}
										</button>
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
