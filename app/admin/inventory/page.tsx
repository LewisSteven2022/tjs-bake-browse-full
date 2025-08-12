// app/admin/inventory/page.tsx
"use client";

import { useEffect, useState } from "react";
import { ALLERGENS } from "@/components/AllergenIcons";
import {
	useNotifications,
	showErrorNotification,
	showSuccessNotification,
	showInfoNotification,
} from "@/components/NotificationManager";

type Category = {
	id: string;
	name: string;
	slug: string;
	description?: string | null;
};

type Product = {
	id: string;
	name: string;
	price_pence: number;
	stock: number;
	visible: boolean;
	image_url?: string | null;
	category?: Category | null;
	allergens?: string | string[] | null;
	_tempPrice?: string; // Temporary field for price input
};

const GBP = (p: number) => `£${(p / 100).toFixed(2)}`;

export default function AdminInventoryPage() {
	const [rows, setRows] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const [savingId, setSavingId] = useState<string | null>(null);
	const [editing, setEditing] = useState<{
		id: string;
		values: string[];
	} | null>(null);
	const [editingCategory, setEditingCategory] = useState<{
		id: string;
		categoryId: string | null;
	} | null>(null);
	const [editingProduct, setEditingProduct] = useState<Product | null>(null);
	const [categories, setCategories] = useState<Category[]>([]);
	const [showNewCategory, setShowNewCategory] = useState(false);
	const [showAddProduct, setShowAddProduct] = useState(false);
	const [newCategory, setNewCategory] = useState({
		name: "",
		slug: "",
		description: "",
	});
	const [newProduct, setNewProduct] = useState({
		name: "",
		short_description: "",
		description: "",
		price_pence: 0,
		pack_label: "",
		allergens: [] as string[],
		ingredients: "",
		image_url: "",
		stock: 0,
		visible: true,
		category_id: "",
	});
	const [hasNewSchema, setHasNewSchema] = useState(false);
	const { showNotification } = useNotifications();

	async function load() {
		try {
			setLoading(true);
			const [res, catRes] = await Promise.all([
				fetch(`/api/admin/inventory?t=${Date.now()}`, { cache: "no-store" }),
				fetch(`/api/admin/categories?t=${Date.now()}`, {
					cache: "no-store",
				}).catch(() => null),
			]);

			if (!res.ok) {
				const j = await res.json().catch(() => ({}));
				throw new Error(j?.error || `Failed to load inventory (${res.status})`);
			}

			const j = await res.json();
			setRows(j.products ?? []);

			// Check if categories API is available (indicates new schema)
			if (catRes && catRes.ok) {
				const catJ = await catRes.json();
				setCategories(catJ.categories ?? []);
				setHasNewSchema(true);
			} else {
				setHasNewSchema(false);
				// Create mock categories from existing product categories
				const existingCategories = new Set<string>();
				j.products?.forEach((p: any) => {
					if (p.category?.name) {
						existingCategories.add(p.category.name);
					}
				});
				const mockCategories: Category[] = Array.from(existingCategories).map(
					(name) => ({
						id: name,
						name,
						slug: name.toLowerCase().replace(/\s+/g, "_"),
						description: `Category: ${name}`,
					})
				);
				setCategories(mockCategories);
			}
		} catch (e: any) {
			showErrorNotification(
				showNotification,
				"Load Failed",
				e?.message || "Failed to load data"
			);
		} finally {
			setLoading(false);
		}
	}

	async function saveRow(p: Product) {
		try {
			setSavingId(p.id);
			const payload = {
				id: p.id,
				name: p.name,
				stock: p.stock,
				visible: p.visible,
				price_pence: p.price_pence,
				allergens: p.allergens,
				...(hasNewSchema && { category_id: p.category?.id || null }),
			};
			console.log("Saving product with payload:", payload);
			console.log(
				"Price in pence:",
				p.price_pence,
				"Price in pounds:",
				(p.price_pence / 100).toFixed(2)
			);

			const res = await fetch("/api/admin/inventory", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});
			if (!res.ok) {
				const j = await res.json().catch(() => ({}));
				throw new Error(j?.error || `Update failed (${res.status})`);
			}
			showSuccessNotification(
				showNotification,
				"Saved",
				"Product has been saved successfully."
			);

			// Update local state immediately for better UX
			setRows((prevRows) =>
				prevRows.map((row) => (row.id === p.id ? { ...row, ...payload } : row))
			);
		} catch (e: any) {
			showErrorNotification(
				showNotification,
				"Save Failed",
				e?.message || "Save failed"
			);
		} finally {
			setSavingId(null);
		}
	}

	async function createCategory() {
		if (!hasNewSchema) {
			showErrorNotification(
				showNotification,
				"Category Management Required",
				"Category management requires database migration. Please contact support."
			);
			return;
		}

		if (!newCategory.name.trim() || !newCategory.slug.trim()) {
			showErrorNotification(
				showNotification,
				"Missing Information",
				"Name and slug are required"
			);
			return;
		}

		try {
			const res = await fetch("/api/admin/categories", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(newCategory),
			});

			if (!res.ok) {
				const j = await res.json().catch(() => ({}));
				throw new Error(
					j?.error || `Failed to create category (${res.status})`
				);
			}

			showSuccessNotification(
				showNotification,
				"Category Created",
				"New category has been created successfully."
			);
			setNewCategory({ name: "", slug: "", description: "" });
			setShowNewCategory(false);
			load(); // Reload to get the new category
		} catch (e: any) {
			showErrorNotification(
				showNotification,
				"Creation Failed",
				e?.message || "Failed to create category"
			);
		}
	}

	async function createProduct() {
		if (
			!newProduct.name.trim() ||
			newProduct.price_pence <= 0 ||
			newProduct.stock < 0
		) {
			showErrorNotification(
				showNotification,
				"Missing Information",
				"Name, price, and stock are required. Price must be greater than 0."
			);
			return;
		}

		try {
			const res = await fetch("/api/admin/inventory", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(newProduct),
			});

			if (!res.ok) {
				const j = await res.json().catch(() => ({}));
				throw new Error(j?.error || `Failed to create product (${res.status})`);
			}

			showSuccessNotification(
				showNotification,
				"Product Created",
				"New product has been created successfully."
			);

			// Reset form
			setNewProduct({
				name: "",
				short_description: "",
				description: "",
				price_pence: 0,
				pack_label: "",
				allergens: [],
				ingredients: "",
				image_url: "",
				stock: 0,
				visible: true,
				category_id: "",
			});
			setShowAddProduct(false);
			load(); // Reload to get the new product
		} catch (e: any) {
			showErrorNotification(
				showNotification,
				"Creation Failed",
				e?.message || "Failed to create product"
			);
		}
	}

	// Handle price input changes in the modal
	const handlePriceChange = (newPrice: string) => {
		if (!editingProduct) return;

		// Convert price string to pence (e.g., "2.99" -> 299)
		const priceMatch = newPrice.match(/£?(\d+\.?\d*)/);
		if (priceMatch) {
			const pounds = parseFloat(priceMatch[1]);
			const pence = Math.round(pounds * 100);
			setEditingProduct({ ...editingProduct, price_pence: pence });
		}
	};

	// Convert pounds to pence for storage
	const convertPoundsToPence = (pounds: string): number => {
		const cleanPrice = pounds.replace(/[£,\s]/g, "");
		const numericPrice = parseFloat(cleanPrice);
		if (isNaN(numericPrice) || numericPrice < 0) return 0;
		const pence = Math.round(numericPrice * 100);
		console.log(
			`Converting ${pounds} -> ${cleanPrice} -> ${numericPrice} -> ${pence} pence`
		);
		return pence;
	};

	// Format price for display (pence to £ format)
	const formatPriceForDisplay = (pence: number) => {
		return `£${(pence / 100).toFixed(2)}`;
	};

	function startEditingProduct(product: Product) {
		setEditingProduct(product);
	}

	function cancelEditingProduct() {
		setEditingProduct(null);
	}

	async function saveProductChanges() {
		if (!editingProduct) return;

		try {
			await saveRow(editingProduct);
			setEditingProduct(null);
			await load(); // Refresh the data
		} catch (e: any) {
			// Error already handled in saveRow
		}
	}

	useEffect(() => {
		load();
	}, []);

	return (
		<div className="max-w-6xl mx-auto">
			<h1 className="mb-4 text-2xl font-semibold">Inventory</h1>

			{/* Toolbar: Add Product, Export / Import */}
			<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-3">
				<div className="flex flex-col gap-2 sm:flex-row sm:items-center">
					<button
						onClick={() => setShowAddProduct(true)}
						className="rounded border px-3 py-2 bg-blue-600 text-white hover:bg-blue-700 w-full sm:w-auto text-center">
						+ Add Product
					</button>
					<a
						href="/api/admin/inventory/export"
						className="rounded border px-3 py-2 hover:bg-gray-50 w-full sm:w-auto text-center">
						Export CSV
					</a>
				</div>

				<form
					onSubmit={async (e) => {
						e.preventDefault();
						const fd = new FormData(e.currentTarget as HTMLFormElement);
						const res = await fetch("/api/admin/inventory/import", {
							method: "POST",
							body: fd,
						});
						if (res.ok) {
							showSuccessNotification(
								showNotification,
								"Import Complete",
								"Products have been imported successfully."
							);
							(e.currentTarget as HTMLFormElement).reset();
							load();
						} else {
							const j = await res.json().catch(() => ({}));
							showErrorNotification(
								showNotification,
								"Import Failed",
								j?.error || "Import failed"
							);
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
								<th className="p-3 text-left">Allergens</th>
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
									<td className="p-3 min-w-[180px]">
										<div className="flex items-center gap-2">
											<span className="truncate max-w-[12ch] text-gray-700">
												{p.category?.name || "—"}
											</span>
											{hasNewSchema && (
												<button
													className="rounded-lg border px-2 py-1 hover:bg-gray-50"
													onClick={() =>
														setEditingCategory({
															id: p.id,
															categoryId: p.category?.id || null,
														})
													}>
													Edit
												</button>
											)}
										</div>
									</td>
									<td className="p-3 min-w-[120px]">
										<span className="font-mono text-sm">
											{formatPriceForDisplay(p.price_pence)}
										</span>
									</td>
									<td className="p-3">
										<span className="font-mono text-sm">{p.stock}</span>
									</td>
									<td className="p-3">
										<span
											className={`text-sm ${
												p.visible ? "text-green-600" : "text-red-600"
											}`}>
											{p.visible ? "Yes" : "No"}
										</span>
									</td>
									<td className="p-3 min-w-[220px]">
										{(() => {
											const norm = Array.isArray(p.allergens)
												? (p.allergens as string[])
												: typeof p.allergens === "string" &&
												  p.allergens.trim() !== ""
												? (() => {
														try {
															const j = JSON.parse(p.allergens as string);
															return Array.isArray(j)
																? (j as string[])
																: String(p.allergens)
																		.split(",")
																		.map((s) => s.trim())
																		.filter(Boolean);
														} catch {
															return String(p.allergens)
																.split(",")
																.map((s) => s.trim())
																.filter(Boolean);
														}
												  })()
												: [];
											const summary =
												norm.length === 0
													? "None"
													: norm
															.map(
																(k) =>
																	ALLERGENS[k as keyof typeof ALLERGENS]
																		?.label || k
															)
															.slice(0, 3)
															.join(", ") +
													  (norm.length > 3 ? ` +${norm.length - 3}` : "");
											return (
												<div className="flex items-center gap-2">
													<span
														className="truncate max-w-[14ch] text-gray-700"
														title={summary}>
														{summary}
													</span>
													<button
														className="rounded-lg border px-2 py-1 hover:bg-gray-50"
														onClick={() =>
															setEditing({ id: p.id, values: norm as string[] })
														}>
														Edit
													</button>
												</div>
											);
										})()}
									</td>
									<td className="p-3">
										<button
											onClick={() => startEditingProduct(p)}
											className="rounded-lg border px-3 py-1 hover:bg-gray-50">
											Edit Product
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}

			{/* Edit Product Modal */}
			{editingProduct && (
				<div className="fixed inset-0 z-50">
					<div
						className="absolute inset-0 bg-black/40"
						onClick={cancelEditingProduct}
					/>
					<div className="absolute inset-0 grid place-items-center p-4">
						<div className="w-full max-w-lg rounded-xl border bg-white p-6 shadow-xl">
							<h2 className="mb-4 text-lg font-semibold">Edit Product</h2>
							<div className="space-y-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Product Name
									</label>
									<input
										type="text"
										value={editingProduct.name}
										onChange={(e) =>
											setEditingProduct({
												...editingProduct,
												name: e.target.value,
											})
										}
										className="w-full rounded-lg border px-3 py-2"
										placeholder="Product name"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Price
									</label>
									<div className="flex items-center gap-2">
										<input
											type="text"
											value={
												editingProduct._tempPrice !== undefined
													? editingProduct._tempPrice
													: formatPriceForDisplay(editingProduct.price_pence)
											}
											onChange={(e) => {
												// Update the input value but don't convert yet
												const newValue = e.target.value;
												// Only update if it's a valid price format
												if (
													/^£?\d*\.?\d*$/.test(newValue.replace(/[£,\s]/g, ""))
												) {
													// Store the raw input temporarily
													setEditingProduct({
														...editingProduct,
														_tempPrice: newValue,
													});
												}
											}}
											onBlur={(e) => {
												// Convert and validate on blur
												const pence = convertPoundsToPence(e.target.value);
												if (pence !== editingProduct.price_pence) {
													setEditingProduct({
														...editingProduct,
														price_pence: pence,
														_tempPrice: undefined,
													});
												}
											}}
											className="w-32 rounded-lg border px-3 py-2 text-right font-mono"
											placeholder="£0.00"
										/>
										<span className="text-xs text-gray-500">
											({editingProduct.price_pence} pence)
										</span>
									</div>
									<p className="text-xs text-gray-500 mt-1">
										Enter price in pounds (e.g., 2.99 for £2.99)
									</p>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Stock Level
									</label>
									<input
										type="number"
										min={0}
										step={1}
										value={editingProduct.stock}
										onChange={(e) => {
											const v = Math.max(
												0,
												parseInt(e.target.value || "0", 10)
											);
											setEditingProduct({ ...editingProduct, stock: v });
										}}
										className="w-full rounded-lg border px-3 py-2"
										placeholder="0"
									/>
								</div>
								<div>
									<label className="inline-flex items-center gap-2 cursor-pointer select-none">
										<input
											type="checkbox"
											checked={editingProduct.visible}
											onChange={(e) =>
												setEditingProduct({
													...editingProduct,
													visible: e.target.checked,
												})
											}
										/>
										<span className="text-gray-700">
											Product visible to customers
										</span>
									</label>
								</div>
							</div>
							<div className="mt-6 flex justify-end gap-3">
								<button
									className="rounded-lg border px-4 py-2 hover:bg-gray-50"
									onClick={cancelEditingProduct}>
									Cancel
								</button>
								<button
									className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
									onClick={saveProductChanges}>
									Save Changes
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Allergens Modal */}
			{editing && (
				<div className="fixed inset-0 z-50">
					<div
						className="absolute inset-0 bg-black/40"
						onClick={() => setEditing(null)}
					/>
					<div className="absolute inset-0 grid place-items-center p-4">
						<div className="w-full max-w-lg rounded-xl border bg-white p-4 shadow-xl">
							<h2 className="mb-3 text-lg font-semibold">Edit allergens</h2>
							<div className="grid grid-cols-2 gap-2 max-h-64 overflow-auto">
								{Object.entries(ALLERGENS)
									.sort((a, b) => a[1].label.localeCompare(b[1].label))
									.map(([key, meta]) => {
										const checked = editing.values.includes(key);
										return (
											<label
												key={key}
												className="inline-flex items-center gap-2 cursor-pointer select-none">
												<input
													type="checkbox"
													checked={checked}
													onChange={(e) => {
														const next = e.target.checked
															? [...editing.values, key]
															: editing.values.filter((k) => k !== key);
														setEditing({ ...editing, values: next });
													}}
												/>
												<span>{meta.label}</span>
											</label>
										);
									})}
							</div>
							<div className="mt-4 flex justify-end gap-2">
								<button
									className="rounded-lg border px-3 py-1 hover:bg-gray-50"
									onClick={() => setEditing(null)}>
									Cancel
								</button>
								<button
									className="rounded-lg bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
									onClick={async () => {
										const newRows = rows.map((r) =>
											r.id === editing.id
												? { ...r, allergens: editing.values }
												: r
										);
										setRows(newRows);
										const updated = newRows.find((r) => r.id === editing.id);
										if (updated) await saveRow(updated);
										setEditing(null);
									}}>
									Save
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Category Modal - Only show if new schema is available */}
			{editingCategory && hasNewSchema && (
				<div className="fixed inset-0 z-50">
					<div
						className="absolute inset-0 bg-black/40"
						onClick={() => setEditingCategory(null)}
					/>
					<div className="absolute inset-0 grid place-items-center p-4">
						<div className="w-full max-w-lg rounded-xl border bg-white p-4 shadow-xl">
							<h2 className="mb-3 text-lg font-semibold">Edit category</h2>
							<div className="space-y-3">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Select Category
									</label>
									<select
										value={editingCategory.categoryId || ""}
										onChange={(e) =>
											setEditingCategory({
												...editingCategory,
												categoryId: e.target.value || null,
											})
										}
										className="w-full rounded-lg border px-3 py-2">
										<option value="">No category</option>
										{categories.map((cat) => (
											<option key={cat.id} value={cat.id}>
												{cat.name}
											</option>
										))}
									</select>
								</div>
								<div className="pt-2">
									<button
										className="text-blue-600 hover:text-blue-700 text-sm"
										onClick={() => setShowNewCategory(true)}>
										+ Add new category
									</button>
								</div>
							</div>
							<div className="mt-4 flex justify-end gap-2">
								<button
									className="rounded-lg border px-3 py-1 hover:bg-gray-50"
									onClick={() => setEditingCategory(null)}>
									Cancel
								</button>
								<button
									className="rounded-lg bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
									onClick={async () => {
										const newRows = rows.map((r) =>
											r.id === editingCategory.id
												? {
														...r,
														category:
															categories.find(
																(c) => c.id === editingCategory.categoryId
															) || null,
												  }
												: r
										);
										setRows(newRows);
										const updated = newRows.find(
											(r) => r.id === editingCategory.id
										);
										if (updated) await saveRow(updated);
										setEditingCategory(null);
									}}>
									Save
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* New Category Modal - Only show if new schema is available */}
			{showNewCategory && hasNewSchema && (
				<div className="fixed inset-0 z-50">
					<div
						className="absolute inset-0 bg-black/40"
						onClick={() => setShowNewCategory(false)}
					/>
					<div className="absolute inset-0 grid place-items-center p-4">
						<div className="w-full max-w-lg rounded-xl border bg-white p-4 shadow-xl">
							<h2 className="mb-3 text-lg font-semibold">Add new category</h2>
							<div className="space-y-3">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Name
									</label>
									<input
										type="text"
										value={newCategory.name}
										onChange={(e) =>
											setNewCategory({ ...newCategory, name: e.target.value })
										}
										placeholder="e.g., Beverages"
										className="w-full rounded-lg border px-3 py-2"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Slug
									</label>
									<input
										type="text"
										value={newCategory.slug}
										onChange={(e) =>
											setNewCategory({ ...newCategory, slug: e.target.value })
										}
										placeholder="e.g., beverages"
										className="w-full rounded-lg border px-3 py-2"
									/>
									<p className="text-xs text-gray-500 mt-1">
										Lowercase letters, numbers, and underscores only
									</p>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Description (optional)
									</label>
									<textarea
										value={newCategory.description}
										onChange={(e) =>
											setNewCategory({
												...newCategory,
												description: e.target.value,
											})
										}
										placeholder="Brief description of this category"
										rows={3}
										className="w-full rounded-lg border px-3 py-2"
									/>
								</div>
							</div>
							<div className="mt-4 flex justify-end gap-2">
								<button
									className="rounded-lg border px-3 py-2 hover:bg-gray-50"
									onClick={() => setShowNewCategory(false)}>
									Cancel
								</button>
								<button
									className="rounded-lg bg-blue-600 px-3 py-2 hover:bg-blue-700"
									onClick={createCategory}>
									Create Category
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Add Product Modal */}
			{showAddProduct && (
				<div className="fixed inset-0 z-50">
					<div
						className="absolute inset-0 bg-black/40"
						onClick={() => setShowAddProduct(false)}
					/>
					<div className="absolute inset-0 grid place-items-center p-4">
						<div className="w-full max-w-2xl rounded-xl border bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
							<h2 className="mb-4 text-lg font-semibold">Add New Product</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{/* Basic Information */}
								<div className="md:col-span-2">
									<h3 className="text-md font-medium text-gray-700 mb-2">
										Basic Information
									</h3>
								</div>

								<div className="md:col-span-2">
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Product Name *
									</label>
									<input
										type="text"
										value={newProduct.name}
										onChange={(e) =>
											setNewProduct({ ...newProduct, name: e.target.value })
										}
										className="w-full rounded-lg border px-3 py-2"
										placeholder="e.g., Gluten-Free Sourdough Bread"
										required
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Price (£) *
									</label>
									<input
										type="number"
										step="0.01"
										min="0"
										value={newProduct.price_pence / 100}
										onChange={(e) => {
											const pounds = parseFloat(e.target.value) || 0;
											const pence = Math.round(pounds * 100);
											setNewProduct({ ...newProduct, price_pence: pence });
										}}
										className="w-full rounded-lg border px-3 py-2"
										placeholder="0.00"
										required
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Stock Level *
									</label>
									<input
										type="number"
										min="0"
										step="1"
										value={newProduct.stock}
										onChange={(e) => {
											const stock = Math.max(
												0,
												parseInt(e.target.value || "0", 10)
											);
											setNewProduct({ ...newProduct, stock });
										}}
										className="w-full rounded-lg border px-3 py-2"
										placeholder="0"
										required
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Category
									</label>
									<select
										value={newProduct.category_id}
										onChange={(e) =>
											setNewProduct({
												...newProduct,
												category_id: e.target.value,
											})
										}
										className="w-full rounded-lg border px-3 py-2">
										<option value="">Select a category</option>
										{categories.map((cat) => (
											<option key={cat.id} value={cat.id}>
												{cat.name}
											</option>
										))}
									</select>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Pack Label
									</label>
									<input
										type="text"
										value={newProduct.pack_label}
										onChange={(e) =>
											setNewProduct({
												...newProduct,
												pack_label: e.target.value,
											})
										}
										className="w-full rounded-lg border px-3 py-2"
										placeholder="e.g., 500g, 6-pack"
									/>
								</div>

								{/* Allergens */}
								<div className="md:col-span-2">
									<h3 className="text-md font-medium text-gray-700 mb-2">
										Allergens
									</h3>
									<div className="grid grid-cols-2 gap-2 max-h-32 overflow-auto border rounded-lg p-3">
										{Object.entries(ALLERGENS)
											.sort((a, b) => a[1].label.localeCompare(b[1].label))
											.map(([key, meta]) => {
												const checked = newProduct.allergens.includes(key);
												return (
													<label
														key={key}
														className="inline-flex items-center gap-2 cursor-pointer select-none text-sm">
														<input
															type="checkbox"
															checked={checked}
															onChange={(e) => {
																const next = e.target.checked
																	? [...newProduct.allergens, key]
																	: newProduct.allergens.filter(
																			(k) => k !== key
																	  );
																setNewProduct({
																	...newProduct,
																	allergens: next,
																});
															}}
														/>
														<span>{meta.label}</span>
													</label>
												);
											})}
									</div>
								</div>

								{/* Additional Details */}
								<div className="md:col-span-2">
									<h3 className="text-md font-medium text-gray-700 mb-2">
										Additional Details
									</h3>
								</div>

								<div className="md:col-span-2">
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Short Description
									</label>
									<input
										type="text"
										value={newProduct.short_description}
										onChange={(e) =>
											setNewProduct({
												...newProduct,
												short_description: e.target.value,
											})
										}
										className="w-full rounded-lg border px-3 py-2"
										placeholder="Brief description for product listings"
									/>
								</div>

								<div className="md:col-span-2">
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Full Description
									</label>
									<textarea
										value={newProduct.description}
										onChange={(e) =>
											setNewProduct({
												...newProduct,
												description: e.target.value,
											})
										}
										rows={3}
										className="w-full rounded-lg border px-3 py-2"
										placeholder="Detailed product description"
									/>
								</div>

								<div className="md:col-span-2">
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Ingredients
									</label>
									<textarea
										value={newProduct.ingredients}
										onChange={(e) =>
											setNewProduct({
												...newProduct,
												ingredients: e.target.value,
											})
										}
										rows={2}
										className="w-full rounded-lg border px-3 py-2"
										placeholder="List of ingredients"
									/>
								</div>

								<div className="md:col-span-2">
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Image URL
									</label>
									<input
										type="url"
										value={newProduct.image_url}
										onChange={(e) =>
											setNewProduct({
												...newProduct,
												image_url: e.target.value,
											})
										}
										className="w-full rounded-lg border px-3 py-2"
										placeholder="https://example.com/image.jpg"
									/>
								</div>

								<div className="md:col-span-2">
									<label className="inline-flex items-center gap-2 cursor-pointer select-none">
										<input
											type="checkbox"
											checked={newProduct.visible}
											onChange={(e) =>
												setNewProduct({
													...newProduct,
													visible: e.target.checked,
												})
											}
										/>
										<span className="text-gray-700">
											Product visible to customers
										</span>
									</label>
								</div>
							</div>
							<div className="mt-6 flex justify-end gap-3">
								<button
									className="rounded-lg border px-4 py-2 hover:bg-gray-50"
									onClick={() => setShowAddProduct(false)}>
									Cancel
								</button>
								<button
									className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
									onClick={createProduct}>
									Create Product
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
