export default function AdminHome() {
	return (
		<div className="max-w-4xl mx-auto space-y-4">
			<h1 className="text-2xl font-semibold">Management</h1>
			<div className="grid sm:grid-cols-2 gap-4">
				<a
					href="/admin/orders"
					className="block rounded-xl border p-4 hover:shadow">
					<div className="font-medium">Customer Orders</div>
					<div className="text-sm text-gray-600">
						View & update order status
					</div>
				</a>
				<a
					href="/admin/inventory"
					className="block rounded-xl border p-4 hover:shadow">
					<div className="font-medium">Inventory</div>
					<div className="text-sm text-gray-600">Update stock / hide items</div>
				</a>
			</div>
		</div>
	);
}
