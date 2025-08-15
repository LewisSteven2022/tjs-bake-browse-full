export default function DisclaimerFixPage() {
	return (
		<main className="min-h-screen bg-elegance">
			{/* Header Section */}
			<section className="bg-black pt-20 pb-10">
				<div className="max-w-6xl mx-auto px-6 text-center">
					<h1 className="text-5xl font-bold text-elegance-heading-white mb-4">
						Important Information
					</h1>
					<p className="text-xl text-white max-w-3xl mx-auto">
						Please read these disclaimers carefully to ensure you have all the
						information you need about our products and services.
					</p>
				</div>
			</section>

			{/* Content Section */}
			<section className="container-elegance section-elegance space-y-0">
				{/* Allergen Disclaimer */}
				<div className="card-elegance border border-neutral-200 p-8 text-center">
					<div className="flex items-start gap-4 mb-4">
						<div className="flex-1">
							<h2 className="text-2xl text-elegance-heading mb-10">
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
						<p className="text-red-800 text-center text-elegance-body">
							If you have severe allergies, please contact us directly before
							ordering to discuss your specific requirements.
						</p>
					</div>
				</div>

				{/* Dietary Disclaimer */}
				<div className="card-elegance border border-neutral-200 p-8 mb-10">
					<div className="flex items-start gap-4 mb-4 text-center">
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
							<h4 className="text-elegance-heading text-green-800 mb-2 text-center">
								Gluten-Free
							</h4>
							<p className="text-green-700 text-elegance-body text-sm text-center">
								All products are certified gluten-free and prepared in a
								dedicated facility.
							</p>
						</div>
						<div className="bg-neutral-50 border border-neutral-200 p-4">
							<h4 className="text-elegance-heading text-neutral-800 mb-2 text-center">
								Dairy-Free Options
							</h4>
							<p className="text-neutral-700 text-elegance-body text-sm text-center">
								Many products available without dairy ingredients.
							</p>
						</div>
					</div>
				</div>

				{/* Order Disclaimer */}
				<div className="card-elegance border border-neutral-200 p-8 text-center mb-10">
					<div className="flex items-start gap-4 mb-4">
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
					<div className="bg-neutral-50 border border-neutral-200 p-1 mb-10">
						<p className="text-neutral-800 text-elegance-body text-center">
							Same-day collection available for orders placed before 12 PM.
							Orders after 2 PM may be processed the following day.
						</p>
					</div>
				</div>

				{/* Contact Information */}
				<div className="bg-neutral-900 text-neutral-200 text-center py-10">
					<h2 className="text-elegance-heading-white mb-6">
						Questions or Concerns?
					</h2>
					<p className="text-lg text-neutral-200 mb-6">
						If you have any questions about our products or need clarification
						on any of these disclaimers, please don't hesitate to contact us.
					</p>
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
