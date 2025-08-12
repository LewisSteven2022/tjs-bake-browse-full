import Link from "next/link";

export default function TestStylingPage() {
	return (
		<main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
			{/* Enhanced Hero Section */}
			<section className="bg-primaryLight/20 text-gray-800 py-20">
				<div className="max-w-6xl mx-auto px-6 text-center">
					<h1 className="text-5xl font-bold mb-6 text-primaryDark">
						Test Styling Pages
					</h1>
					<p className="text-xl text-gray-700 max-w-3xl mx-auto">
						These are test pages demonstrating the new consistent site styling
						with blue colour scheme, modern pastel look, and professional
						premium feel.
					</p>
				</div>
			</section>

			{/* Navigation Section */}
			<section className="max-w-6xl mx-auto px-6 py-20">
				<div className="text-center mb-16">
					<h2 className="text-3xl font-bold text-gray-800 mb-4">
						Available Test Pages
					</h2>
					<p className="text-lg text-gray-600 max-w-2xl mx-auto">
						Click on any of the pages below to see the new styling in action.
						These are test pages and do not affect the current live site.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{/* Homepage Test */}
					<Link href="/test-styling/homepage" className="group">
						<div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100 p-8 text-center hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2">
							<div className="w-20 h-20 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
								<svg
									className="w-10 h-10 text-white"
									fill="currentColor"
									viewBox="0 0 20 20">
									<path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
								</svg>
							</div>
							<h3 className="text-2xl font-bold text-gray-800 mb-3">
								Homepage
							</h3>
							<p className="text-gray-600 mb-4">
								Enhanced homepage with modern layout, feature cards, and
								improved call-to-action
							</p>
							<div className="inline-flex items-center gap-2 text-yellow-600 font-semibold group-hover:text-yellow-700 transition-colors">
								<span>View Page</span>
								<svg
									className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
									fill="currentColor"
									viewBox="0 0 20 20">
									<path
										fillRule="evenodd"
										d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
										clipRule="evenodd"
									/>
								</svg>
							</div>
						</div>
					</Link>

					{/* Modern Homepage Test */}
					<Link href="/test-styling/homepage" className="group">
						<div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100 p-8 text-center hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2">
							<div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
								<svg
									className="w-10 h-10 text-white"
									fill="currentColor"
									viewBox="0 0 20 20">
									<path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
								</svg>
							</div>
							<h3 className="text-2xl font-bold text-gray-800 mb-3">
								Clean Homepage
							</h3>
							<p className="text-gray-600 mb-4">
								Professional, clean design matching the About page aesthetic
								with subtle blue accents and elegant typography
							</p>
							<div className="inline-flex items-center gap-2 text-purple-600 font-semibold group-hover:text-purple-700 transition-colors">
								<span>View Page</span>
								<svg
									className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
									fill="currentColor"
									viewBox="0 0 20 20">
									<path
										fillRule="evenodd"
										d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
										clipRule="evenodd"
									/>
								</svg>
							</div>
						</div>
					</Link>

					{/* Baked Goods Test */}
					<Link href="/test-styling/baked-goods" className="group">
						<div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100 p-8 text-center hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2">
							<div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
								<svg
									className="w-10 h-10 text-white"
									fill="currentColor"
									viewBox="0 0 20 20">
									<path
										fillRule="evenodd"
										d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
										clipRule="evenodd"
									/>
								</svg>
							</div>
							<h3 className="text-2xl font-bold text-gray-800 mb-3">
								Baked Goods
							</h3>
							<p className="text-gray-600 mb-4">
								Enhanced product listing with new styling, gradients, and modern
								layout
							</p>
							<div className="inline-flex items-center gap-2 text-blue-600 font-semibold group-hover:text-blue-700 transition-colors">
								<span>View Page</span>
								<svg
									className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
									fill="currentColor"
									viewBox="0 0 20 20">
									<path
										fillRule="evenodd"
										d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
										clipRule="evenodd"
									/>
								</svg>
							</div>
						</div>
					</Link>

					{/* Disclaimers Test */}
					<Link href="/test-styling/disclaimers" className="group">
						<div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100 p-8 text-center hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2">
							<div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
								<svg
									className="w-10 h-10 text-white"
									fill="currentColor"
									viewBox="0 0 20 20">
									<path
										fillRule="evenodd"
										d="M8.257 3.099c.765-1.36 2.722-1.36 2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
										clipRule="evenodd"
									/>
								</svg>
							</div>
							<h3 className="text-2xl font-bold text-gray-800 mb-3">
								Disclaimers
							</h3>
							<p className="text-gray-600 mb-4">
								Important information with enhanced readability and visual
								hierarchy
							</p>
							<div className="inline-flex items-center gap-2 text-purple-600 font-semibold group-hover:text-purple-700 transition-colors">
								<span>View Page</span>
								<svg
									className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
									fill="currentColor"
									viewBox="0 0 20 20">
									<path
										fillRule="evenodd"
										d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
										clipRule="evenodd"
									/>
								</svg>
							</div>
						</div>
					</Link>
				</div>

				{/* Back to Main Site */}
				<div className="text-center mt-16">
					<Link
						href="/"
						className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors">
						<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
							<path
								fillRule="evenodd"
								d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
								clipRule="evenodd"
							/>
						</svg>
						<span>Back to Main Site</span>
					</Link>
				</div>
			</section>
		</main>
	);
}
