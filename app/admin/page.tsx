export default function AdminHome() {
	return (
		<div className="container-elegance section-elegance">
			<h1 className="text-3xl text-elegance-heading mb-8">Management</h1>
			<div className="grid sm:grid-cols-2 gap-8">
				<a
					href="/admin/orders"
					className="card-elegance border border-neutral-200 p-6 card-elegance-hover">
					<div className="text-elegance-heading text-lg mb-2">
						Customer Orders
					</div>
					<div className="text-elegance-body">View & update order status</div>
				</a>
				<a
					href="/admin/inventory"
					className="card-elegance border border-neutral-200 p-6 card-elegance-hover">
					<div className="text-elegance-heading text-lg mb-2">Inventory</div>
					<div className="text-elegance-body">Update stock / hide items</div>
				</a>
			</div>
		</div>
	);
}
