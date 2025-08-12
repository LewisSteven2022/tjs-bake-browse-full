"use client";
import { useEffect, useState } from "react";
import {
	useNotifications,
	showErrorNotification,
	showSuccessNotification,
	showInfoNotification,
} from "@/components/NotificationManager";

interface Product {
	id: string;
	name: string;
	sku: string;
	price_pence: number;
	stock: number;
	visible: boolean;
	created_at: string;
}

interface FormData {
	name: string;
	sku: string;
	price_pence: number;
	stock: number;
	visible: boolean;
}

export default function Page() {
	const [items, setItems] = useState<Product[]>([]);
	const [form, setForm] = useState<FormData>({
		name: "",
		sku: "",
		price_pence: 0,
		stock: 0,
		visible: true,
	});
	const [editingProduct, setEditingProduct] = useState<Product | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const { showNotification } = useNotifications();

	async function load() {
		const r = await fetch("/api/admin/products");
		const j = await r.json();
		setItems(j.products || []);
	}

	useEffect(() => {
		load();
	}, []);

	async function create() {
		if (!form.name || !form.sku || form.price_pence < 0) {
			showErrorNotification(
				showNotification,
				"Missing Information",
				"Please fill in all required fields with valid values."
			);
			return;
		}

		setIsLoading(true);
		try {
			const r = await fetch("/api/admin/products", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(form),
			});
			if (r.ok) {
				showSuccessNotification(
					showNotification,
					"Product Created",
					"New product has been created successfully."
				);
				setForm({ name: "", sku: "", price_pence: 0, stock: 0, visible: true });
				await load();
			}
		} catch (error) {
			showErrorNotification(
				showNotification,
				"Creation Failed",
				"Failed to create product. Please try again."
			);
		} finally {
			setIsLoading(false);
		}
	}

	function startEditing(product: Product) {
		setEditingProduct(product);
	}

	function cancelEditing() {
		setEditingProduct(null);
	}

	async function saveChanges() {
		if (!editingProduct) return;
		if (
			!editingProduct.name ||
			!editingProduct.sku ||
			editingProduct.price_pence < 0
		) {
			showErrorNotification(
				showNotification,
				"Missing Information",
				"Please fill in all required fields with valid values."
			);
			return;
		}

		setIsLoading(true);
		try {
			const r = await fetch(`/api/admin/products/${editingProduct.id}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(editingProduct),
			});
			if (r.ok) {
				showSuccessNotification(
					showNotification,
					"Product Updated",
					"Product has been saved successfully."
				);
				setEditingProduct(null);
				await load();
			}
		} catch (error) {
			showErrorNotification(
				showNotification,
				"Save Failed",
				"Failed to save product. Please try again."
			);
		} finally {
			setIsLoading(false);
		}
	}

	async function deleteProduct(productId: string) {
		if (!confirm("Are you sure you want to delete this product?")) return;

		setIsLoading(true);
		try {
			const r = await fetch(`/api/admin/products/${productId}`, {
				method: "DELETE",
			});
			if (r.ok) {
				showSuccessNotification(
					showNotification,
					"Product Deleted",
					"Product has been removed successfully."
				);
				await load();
			}
		} catch (error) {
			showErrorNotification(
				showNotification,
				"Deletion Failed",
				"Failed to delete product. Please try again."
			);
		} finally {
			setIsLoading(false);
		}
	}

	function formatPrice(pence: number): string {
		return `£${(pence / 100).toFixed(2)}`;
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

	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-semibold">Admin • Products</h1>

			{/* Create Product Form */}
			<div className="bg-gray-50 p-4 rounded-lg">
				<h2 className="text-lg font-medium mb-3">Create New Product</h2>
				<div className="grid md:grid-cols-5 gap-3">
					<input
						className="border rounded-lg p-2"
						placeholder="Name"
						value={form.name}
						onChange={(e) => setForm({ ...form, name: e.target.value })}
					/>
					<input
						className="border rounded-lg p-2"
						placeholder="SKU"
						value={form.sku}
						onChange={(e) => setForm({ ...form, sku: e.target.value })}
					/>
					<input
						className="border rounded-lg p-2"
						placeholder="Price (pence)"
						type="number"
						min="0"
						value={form.price_pence}
						onChange={(e) =>
							setForm({ ...form, price_pence: parseInt(e.target.value || "0") })
						}
					/>
					<input
						className="border rounded-lg p-2"
						placeholder="Stock"
						type="number"
						min="0"
						value={form.stock}
						onChange={(e) =>
							setForm({ ...form, stock: parseInt(e.target.value || "0") })
						}
					/>
					<button
						className="rounded-full py-2 px-4 bg-blue-800 text-white hover:bg-blue-700 disabled:opacity-50"
						onClick={create}
						disabled={isLoading || !form.name || !form.sku}>
						{isLoading ? "Creating..." : "Create Product"}
					</button>
				</div>
			</div>

			{/* Products Table */}
			<div className="bg-white rounded-lg shadow overflow-hidden">
				<table className="w-full text-sm">
					<thead className="bg-gray-50">
						<tr>
							<th className="text-left p-3 font-medium">Name</th>
							<th className="text-left p-3 font-medium">SKU</th>
							<th className="text-center p-3 font-medium">Price</th>
							<th className="text-center p-3 font-medium">Stock</th>
							<th className="text-center p-3 font-medium">Visible</th>
							<th className="text-center p-3 font-medium">Actions</th>
						</tr>
					</thead>
					<tbody>
						{items.map((product) => (
							<tr key={product.id} className="border-t hover:bg-gray-50">
								<td className="p-3">{product.name}</td>
								<td className="p-3 text-center">{product.sku}</td>
								<td className="p-3 text-center">
									{formatPrice(product.price_pence)}
								</td>
								<td className="p-3 text-center">{product.stock}</td>
								<td className="p-3 text-center">
									<span
										className={
											product.visible ? "text-green-600" : "text-red-600"
										}>
										{product.visible ? "Yes" : "No"}
									</span>
								</td>
								<td className="p-3 text-center">
									<div className="flex gap-2 justify-center">
										<button
											className="px-3 py-1 bg-blue-800 text-white rounded-full text-xs hover:bg-blue-700"
											onClick={() => startEditing(product)}>
											Edit
										</button>
										<button
											className="px-3 py-1 bg-red-600 text-white rounded-full text-xs hover:bg-red-700"
											onClick={() => deleteProduct(product.id)}
											disabled={isLoading}>
											Delete
										</button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Edit Product Modal */}
			{editingProduct && (
				<div className="fixed inset-0 z-50">
					<div
						className="absolute inset-0 bg-black/40"
						onClick={cancelEditing}
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
										className="w-full rounded-full border px-3 py-2"
										placeholder="Product name"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										SKU
									</label>
									<input
										type="text"
										value={editingProduct.sku}
										onChange={(e) =>
											setEditingProduct({
												...editingProduct,
												sku: e.target.value,
											})
										}
										className="w-full rounded-full border px-3 py-2"
										placeholder="Stock keeping unit"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Price
									</label>
									<div className="flex items-center gap-2">
										<input
											type="text"
											value={formatPrice(editingProduct.price_pence)}
											onChange={(e) => handlePriceChange(e.target.value)}
											onBlur={(e) => {
												// Validate and format on blur
												const priceMatch =
													e.target.value.match(/£?(\d+\.?\d*)/);
												if (priceMatch) {
													const pounds = parseFloat(priceMatch[1]);
													const pence = Math.round(pounds * 100);
													if (pence !== editingProduct.price_pence) {
														setEditingProduct({
															...editingProduct,
															price_pence: pence,
														});
													}
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
										min="0"
										step="1"
										value={editingProduct.stock}
										onChange={(e) => {
											const v = Math.max(
												0,
												parseInt(e.target.value || "0", 10)
											);
											setEditingProduct({ ...editingProduct, stock: v });
										}}
										className="w-full rounded-full border px-3 py-2"
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
									onClick={cancelEditing}
									disabled={isLoading}>
									Cancel
								</button>
								<button
									onClick={saveChanges}
									disabled={isLoading}
									className="rounded-full bg-blue-800 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50">
									{isLoading ? "Saving..." : "Save Changes"}
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
