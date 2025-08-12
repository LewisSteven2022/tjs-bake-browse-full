export default function DisclaimerPage() {
	return (
		<main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
			{/* Enhanced Header Section */}
			<section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
				<div className="max-w-6xl mx-auto px-6 text-center">
					<h1 className="text-5xl font-bold mb-6">Important Information</h1>
					<p className="text-xl text-blue-100 max-w-3xl mx-auto">
						Please read these disclaimers carefully to ensure you have all the
						information you need about our products and services.
					</p>
				</div>
			</section>

			{/* Enhanced Content Section */}
			<section className="max-w-6xl mx-auto px-6 py-20">
				{/* Allergen Disclaimer */}
				<div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-blue-100 p-8 mb-12">
					<div className="flex items-start gap-4 mb-6">
						<div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
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
						<div>
							<h2 className="text-3xl font-bold text-gray-800 mb-3">
								Allergen Information
							</h2>
							<p className="text-lg text-gray-600 leading-relaxed">
								Whilst we take every care to ensure our products are
								allergen-free, our kitchen handles various ingredients including
								nuts, dairy, and gluten. Cross-contamination may occur despite
								our best efforts.
							</p>
						</div>
					</div>
					<div className="bg-red-50 border border-red-200 rounded-xl p-4">
						<p className="text-red-800 font-medium">
							⚠️ If you have severe allergies, please contact us directly before
							ordering to discuss your specific requirements.
						</p>
					</div>
				</div>

				{/* Dietary Disclaimer - Updated as requested */}
				<div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-blue-100 p-8 mb-12">
					<div className="flex items-start gap-4 mb-6">
						<div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
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
						<div>
							<h2 className="text-3xl font-bold text-gray-800 mb-3">
								Dietary Requirements
							</h2>
							<p className="text-lg text-gray-600 leading-relaxed">
								Our products are designed to be gluten-free and suitable for
								various dietary restrictions. We carefully select ingredients
								and maintain strict protocols to ensure our products meet your
								dietary needs.
							</p>
						</div>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="bg-green-50 border border-green-200 rounded-xl p-4">
							<h4 className="font-semibold text-green-800 mb-2">
								✅ Gluten-Free
							</h4>
							<p className="text-green-700 text-sm">
								All products are certified gluten-free and prepared in a
								dedicated facility.
							</p>
						</div>
						<div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
							<h4 className="font-semibold text-blue-800 mb-2">
								✅ Dairy-Free Options
							</h4>
							<p className="text-blue-700 text-sm">
								Many products available without dairy ingredients.
							</p>
						</div>
					</div>
				</div>

				{/* Order Disclaimer - Updated as requested */}
				<div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-blue-100 p-8 mb-12">
					<div className="flex items-start gap-4 mb-6">
						<div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
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
						<div>
							<h2 className="text-3xl font-bold text-gray-800 mb-3">
								Ordering & Collection
							</h2>
							<p className="text-lg text-gray-600 leading-relaxed">
								We control our daily stock availability to ensure fresh
								products. Same-day collection is available for orders placed
								before 12 PM. Orders placed after 2 PM may be processed the
								following business day.
							</p>
						</div>
					</div>
					<div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
						<p className="text-blue-800 font-medium">
							📅 Same-day collection available for orders placed before 12 PM.
							Orders after 2 PM may be processed the following day.
						</p>
					</div>
				</div>

				{/* Contact Information */}
				<div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-3xl shadow-xl p-8 text-center">
					<h2 className="text-3xl font-bold mb-4">Questions or Concerns?</h2>
					<p className="text-xl text-blue-100 mb-6">
						If you have any questions about our products or need clarification
						on any of these disclaimers, please don't hesitate to contact us.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<div className="inline-flex items-center gap-2 bg-white/20 px-6 py-3 rounded-full">
							<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
								<path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
								<path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
							</svg>
							<span>tjsbakeandbrowse@gmail.com</span>
						</div>
						<div className="inline-flex items-center gap-2 bg-white/20 px-6 py-3 rounded-full">
							<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
								<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							<span>Contact us for phone number</span>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
