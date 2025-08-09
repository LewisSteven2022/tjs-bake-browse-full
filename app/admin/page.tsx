// app/admin/page.tsx
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { admin } from "@/lib/db";

export default async function AdminHome() {
	const session = await getServerSession(authOptions as any);
	const role = (session?.user as any)?.role;
	if (role !== "admin") return null;

	// lightweight counts (non-blocking if they fail)
	const [{ data: prod }, { data: ord }] = await Promise.all([
		admin.from("products").select("id", { count: "exact", head: true }),
		admin.from("orders").select("id", { count: "exact", head: true }),
	]);

	return (
		<section className="space-y-6">
			<h1 className="text-2xl font-semibold">Management</h1>
			<div className="grid gap-4 sm:grid-cols-2">
				<Link
					href="/admin/products"
					className="block rounded-2xl border p-4 hover:bg-blue-50">
					<div className="text-lg font-medium">Products</div>
					<div className="text-sm text-gray-600">
						Create, edit, stock, visibility
					</div>
					<div className="mt-2 text-sm">Total: {prod ?? 0}</div>
				</Link>
				<Link
					href="/admin/orders"
					className="block rounded-2xl border p-4 hover:bg-blue-50">
					<div className="text-lg font-medium">Orders</div>
					<div className="text-sm text-gray-600">
						Update status & view queue
					</div>
					<div className="mt-2 text-sm">Total: {ord ?? 0}</div>
				</Link>
			</div>
		</section>
	);
}
