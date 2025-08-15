export default function TestDisclaimersPage() {
	return (
		<main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
			{/* Enhanced Header Section */}
			<section className="bg-primaryLight/20 text-gray-800 py-20">
				<div className="max-w-6xl mx-auto px-6 text-center">
					<h1 className="text-5xl font-bold mb-6 text-primaryDark">
						Important Information
					</h1>
					<p className="text-xl text-gray-700 max-w-3xl mx-auto">
						Please read these disclaimers carefully to ensure you have all the
						information you need about our products and services.
					</p>
				</div>
			</section>

			{/* Enhanced Content Section */}
			<section className="max-w-6xl mx-auto px-6 py-20">
				{/* Allergen Disclaimer */}
				<div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-blue-100 p-8 mb-12">
					<div className="text-center mb-6">
						<h2 className="text-3xl font-bold text-gray-800 mb-3">
							Allergen Information
						</h2>
						<p className="text-lg text-gray-600 leading-relaxed">
							Whilst we take every care to ensure our products are
							allergen-free, our kitchen handles various ingredients including
							nuts, dairy, and gluten. Cross-contamination may occur despite our
							best efforts.
						</p>
					</div>
					<div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
						<p className="text-red-800 font-medium">
							⚠️ If you have severe allergies, please contact us directly before
							ordering to discuss your specific requirements.
						</p>
					</div>
				</div>

				{/* Dietary Disclaimer */}
				<div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-blue-100 p-8 mb-12">
					<div className="text-center mb-6">
						<h2 className="text-3xl font-bold text-gray-800 mb-3">
							Dietary Requirements
						</h2>
						<p className="text-lg text-gray-600 leading-relaxed">
							Our products are designed to be gluten-free and suitable for
							various dietary restrictions. We carefully select ingredients and
							maintain strict protocols to ensure our products meet your dietary
							needs.
						</p>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
							<h4 className="font-semibold text-green-800 mb-2">
								✅ Gluten-Free
							</h4>
							<p className="text-green-700 text-sm">
								All products are certified gluten-free and prepared in a
								dedicated facility.
							</p>
						</div>
						<div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
							<h4 className="font-semibold text-blue-800 mb-2">
								✅ Dairy-Free Options
							</h4>
							<p className="text-blue-700 text-sm">
								Many products available without dairy ingredients.
							</p>
						</div>
					</div>
				</div>

				{/* Order Disclaimer */}
				<div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-blue-100 p-8 mb-12">
					<div className="text-center mb-6">
						<h2 className="text-3xl font-bold text-gray-800 mb-3">
							Ordering & Collection
						</h2>
						<p className="text-lg text-gray-600 leading-relaxed">
							We control our daily stock availability to ensure fresh products.
							Same-day collection is available for orders placed before 12 PM.
							Orders placed after 2 PM may be processed the following business
							day.
						</p>
					</div>
					<div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
						<p className="text-blue-800 font-medium">
							📅 Orders placed after 2 PM may be processed the following
							business day.
						</p>
					</div>
				</div>

				{/* Contact Information */}
				<div className="bg-primaryLight/20 border border-blue-200 rounded-3xl shadow-xl p-8 text-center">
					<h2 className="text-3xl font-bold mb-4 text-primaryDark">
						Questions or Concerns?
					</h2>
					<p className="text-xl text-gray-700 mb-6">
						If you have any questions about our products or need clarification
						on any of these disclaimers, please don't hesitate to contact us via
						email.
					</p>
					<div className="flex justify-center">
						<div className="inline-flex items-center gap-2 bg-white px-4 sm:px-6 py-3 rounded-full text-center shadow-md">
							<svg
								className="w-5 h-5 flex-shrink-0 text-primary"
								fill="currentColor"
								viewBox="0 0 20 20">
								<path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
								<path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
							</svg>
							<span className="text-sm sm:text-base text-primary">
								tjsbakeandbrowse@gmail.com
							</span>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
