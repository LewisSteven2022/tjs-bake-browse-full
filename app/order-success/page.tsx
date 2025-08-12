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

			<div className="flex gap-4 justify-center">
				<Link
					href="/"
					className="rounded-full border px-4 py-2 hover:bg-gray-50">
					Continue shopping
				</Link>
				<Link
					href="/basket"
					className="rounded-full bg-blue-800 px-4 py-2 text-white hover:bg-blue-700">
					View basket
				</Link>
			</div>

			{/* Suggestions Section */}
			<div className="mt-8 pt-6 border-t border-gray-200">
				<div className="text-center">
					<h2 className="text-lg font-medium text-gray-900 mb-2">
						How was your ordering experience?
					</h2>
					<p className="text-gray-600 mb-4">
						We'd love to hear your feedback and suggestions for improvement.
					</p>
					<Link
						href="/suggestions"
						className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-blue-800 hover:bg-blue-100 transition-colors duration-200">
						💡 Share Your Suggestions
					</Link>
				</div>
			</div>
		</main>
	);
}
