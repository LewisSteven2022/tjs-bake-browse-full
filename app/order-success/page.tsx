import Link from 'next/link';

export default function OrderSuccessPage({
	searchParams,
}: {
	searchParams: { [key: string]: string | string[] | undefined };
}) {
	const orderId =
		typeof searchParams?.order_id === 'string'
			? searchParams.order_id
			: undefined;

	return (
		<main className='min-h-screen bg-elegance'>
			<div className='container-elegance section-elegance'>
				<div className='max-w-2xl mx-auto text-center'>
					<h1 className='text-4xl text-elegance-heading mb-8 text-green-700'>
						Thank you!
					</h1>
					<p className='text-elegance-body text-lg mb-8'>
						We have your order and it is currently waiting to be processed.
					</p>
					<p className='text-elegance-body text-lg mb-1'>
						We'll email you with updates along the way.
					</p>

					{orderId && (
						<div className='card-elegance border border-neutral-200 p-6 mb-8'>
							<div className='text-elegance-caption mb-2'>Order Reference</div>
							<div className='font-mono text-lg text-elegance-heading'>
								{orderId}
							</div>
						</div>
					)}

					<div className='flex flex-col sm:flex-row gap-4 justify-center mb-12'>
						<Link href='/' className='btn-elegance-secondary'>
							Continue Shopping
						</Link>
						<Link href='/basket' className='btn-elegance-primary'>
							View Basket
						</Link>
					</div>

					{/* Suggestions Section */}
					<div className='border-t border-neutral-200 pt-12'>
						<div className='text-center'>
							<h2 className='text-elegance-heading text-xl mb-8'>
								How was your ordering experience?
							</h2>
							<p className='text-elegance-body mb-6'>
								We'd love to hear your feedback and suggestions for improvement.
							</p>
							<Link href='/suggestions' className='btn-elegance-ghost'>
								Share Your Suggestions →
							</Link>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
