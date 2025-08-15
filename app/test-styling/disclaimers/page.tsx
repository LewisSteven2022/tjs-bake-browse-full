export default function DisclaimerFixPage() {
	return (
		<main className="min-h-screen bg-elegance">
			{/* Header Section - FIXED: Reduced spacing from mb-6 to mb-4 */}
			<section className="bg-neutral-900 text-white">
				<div className="container-elegance section-elegance text-center">
					<h1 className="text-4xl text-elegance-heading text-white mb-4">
						Important Information
					</h1>
					<p className="text-lg text-neutral-200 max-w-3xl mx-auto">
						Please read these disclaimers carefully to ensure you have all the
						information you need about our products and services.
					</p>
				</div>
			</section>

			{/* Content Section - FIXED: Reduced spacing from space-y-12 to space-y-8 */}
			<section className="container-elegance section-elegance space-y-8">
				{/* Allergen Disclaimer - FIXED: Reduced mb-6 to mb-4, added flex-1 for better text flow */}
				<div className="card-elegance border border-neutral-200 p-8">
					<div className="flex items-start gap-4 mb-4">
						<div className="w-12 h-12 bg-red-600 flex items-center justify-center flex-shrink-0">
							<svg
								className="w-6 h-6 text-white"
								fill="currentColor"
								viewBox="0 0 20 20">
								<path
									fillRule="evenodd"
									d="M8.257 3.099c.765-1.36 2.722-1.36 2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
									clipRule="evenodd"
								/>
							</svg>
						</div>
						<div className="flex-1">
							<h2 className="text-2xl text-elegance-heading mb-3">
								Allergen Information
							</h2>
							<p className="text-elegance-body">
								Whilst we take every care to ensure our products are
								allergen-free, our kitchen handles various ingredients including
								nuts, dairy, and gluten. Cross-contamination may occur despite
								our best efforts.
							</p>
						</div>
					</div>
					<div className="bg-red-50 border border-red-200 p-4">
						<p className="text-red-800 text-elegance-body">
							If you have severe allergies, please contact us directly before
							ordering to discuss your specific requirements.
						</p>
					</div>
				</div>

				{/* Dietary Disclaimer - FIXED: Reduced mb-6 to mb-4, added flex-1 for better text flow */}
				<div className="card-elegance border border-neutral-200 p-8">
					<div className="flex items-start gap-4 mb-4">
						<div className="w-12 h-12 bg-green-600 flex items-center justify-center flex-shrink-0">
							<svg
								className="w-6 h-6 text-white"
								fill="currentColor"
								viewBox="0 0 20 20">
								<path
									fillRule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
									clipRule="evenodd"
								/>
							</svg>
						</div>
						<div className="flex-1">
							<h2 className="text-2xl text-elegance-heading mb-3">
								Dietary Requirements
							</h2>
							<p className="text-elegance-body">
								Our products are designed to be gluten-free and suitable for
								various dietary restrictions. We carefully select ingredients
								and maintain strict protocols to ensure our products meet your
								dietary needs.
							</p>
						</div>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="bg-green-50 border border-green-200 p-4">
							<h4 className="text-elegance-heading text-green-800 mb-2">
								Gluten-Free
							</h4>
							<p className="text-green-700 text-elegance-body text-sm">
								All products are certified gluten-free and prepared in a
								dedicated facility.
							</p>
						</div>
						<div className="bg-neutral-50 border border-neutral-200 p-4">
							<h4 className="text-elegance-heading text-neutral-800 mb-2">
								Dairy-Free Options
							</h4>
							<p className="text-neutral-700 text-elegance-body text-sm">
								Many products available without dairy ingredients.
							</p>
						</div>
					</div>
				</div>

				{/* Order Disclaimer - FIXED: Reduced mb-6 to mb-4, added flex-1 for better text flow */}
				<div className="card-elegance border border-neutral-200 p-8">
					<div className="flex items-start gap-4 mb-4">
						<div className="w-12 h-12 bg-neutral-900 flex items-center justify-center flex-shrink-0">
							<svg
								className="w-6 h-6 text-white"
								fill="currentColor"
								viewBox="0 0 20 20">
								<path
									fillRule="evenodd"
									d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
									clipRule="evenodd"
								/>
							</svg>
						</div>
						<div className="flex-1">
							<h2 className="text-2xl text-elegance-heading mb-3">
								Ordering & Collection
							</h2>
							<p className="text-elegance-body">
								We control our daily stock availability to ensure fresh
								products. Same-day collection is available for orders placed
								before 12 PM. Orders placed after 2 PM may be processed the
								following business day.
							</p>
						</div>
					</div>
					<div className="bg-neutral-50 border border-neutral-200 p-4">
						<p className="text-neutral-800 text-elegance-body">
							Same-day collection available for orders placed before 12 PM.
							Orders after 2 PM may be processed the following day.
						</p>
					</div>
				</div>

				{/* Contact Information - FIXED: Removed phone button, centered email button only */}
				<div className="bg-neutral-900 text-white p-8 text-center">
					<h2 className="text-2xl text-elegance-heading text-white mb-4">
						Questions or Concerns?
					</h2>
					<p className="text-lg text-neutral-200 mb-6">
						If you have any questions about our products or need clarification
						on any of these disclaimers, please don't hesitate to contact us.
					</p>
					{/* FIXED: Single centered email button instead of two buttons */}
					<div className="flex justify-center">
						<div className="inline-flex items-center gap-2 bg-white/10 px-6 py-3 rounded-lg hover:bg-white/20 transition-colors duration-300">
							<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
								<path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
								<path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
							</svg>
							<span>tjsbakeandbrowse@gmail.com</span>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
