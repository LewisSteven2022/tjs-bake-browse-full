import Link from "next/link";

export default function OrderSuccessPage({
	searchParams,
}: {
	searchParams: { [key: string]: string | string[] | undefined };
}) {
	const orderId =
		typeof searchParams?.order_id === "string"
			? searchParams.order_id
			: undefined;

	return (
		<main className="mx-auto max-w-3xl p-6">
			<h1 className="mb-2 text-2xl font-semibold text-green-700">Thank you!</h1>
			<p className="mb-4 text-gray-700">
				Your order has been received and is currently{" "}
				<span className="font-medium">unpaid</span>. We’ll email you with
				updates.
			</p>

			{orderId && (
				<div className="mb-6 rounded-2xl border p-4">
					<div className="text-sm text-gray-600">Order reference</div>
					<div className="font-mono text-lg">{orderId}</div>
				</div>
			)}

			<div className="flex gap-3">
				<Link href="/" className="rounded-xl border px-4 py-2 hover:bg-gray-50">
					Back to home
				</Link>
				<Link
					href="/baked-goods"
					className="rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
					Continue shopping
				</Link>
			</div>
		</main>
	);
}
