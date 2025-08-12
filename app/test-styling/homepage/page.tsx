import Link from "next/link";
import Image from "next/image";
import ParallaxHero from "@/components/ParallaxHero";

export default function TestHomepagePage() {
	return (
		<main className="min-h-screen bg-white">
			{/* Clean Hero Section */}
			<section className="relative h-96 flex items-center justify-center overflow-hidden">
				{/* Background Image */}
				<div className="absolute inset-0 z-0">
					<Image
						src="/images/hero-bakery.jpg"
						alt="TJ's Bake & Browse Kitchen"
						fill
						style={{ objectFit: "cover" }}
						priority
					/>
				</div>

				{/* Hero Content */}
				<div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
					<h1 className="text-5xl font-bold text-white mb-4">
						Welcome to TJ's Bake & Browse
					</h1>
					<p className="text-xl text-white max-w-2xl mx-auto">
						Freshly baked, allergen-conscious treats made with love in our
						artisan kitchen
					</p>
				</div>
			</section>

			{/* Welcome Section */}
			<section className="py-20 bg-white">
				<div className="max-w-6xl mx-auto px-6">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold text-blue-800 mb-6">
							Quality Bakery Excellence
						</h2>
						<p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
							Discover our handcrafted selection of gluten-free and
							allergen-conscious treats, made with premium ingredients and baked
							fresh daily. Every product is crafted with care to ensure everyone
							can enjoy the joy of great baking.
						</p>
					</div>

					{/* Feature Cards */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
						<div className="bg-blue-50 rounded-lg p-8 text-center border border-blue-100">
							<div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-6">
								<svg
									className="w-8 h-8 text-white"
									fill="currentColor"
									viewBox="0 0 20 20">
									<path
										fillRule="evenodd"
										d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
										clipRule="evenodd"
									/>
								</svg>
							</div>
							<h3 className="text-2xl font-bold text-gray-900 mb-4">
								Gluten-Free Excellence
							</h3>
							<p className="text-gray-700">
								Every product is carefully crafted to be gluten-free, ensuring
								everyone can enjoy our delicious treats.
							</p>
						</div>

						<div className="bg-blue-50 rounded-lg p-8 text-center border border-blue-100">
							<div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-6">
								<svg
									className="w-8 h-8 text-white"
									fill="currentColor"
									viewBox="0 0 20 20">
									<path
										fillRule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
										clipRule="evenodd"
									/>
								</svg>
							</div>
							<h3 className="text-2xl font-bold text-gray-900 mb-4">
								Quality Ingredients
							</h3>
							<p className="text-gray-700">
								We use only the finest, carefully selected ingredients to ensure
								every product meets our high standards for taste and quality.
							</p>
						</div>

						<div className="bg-blue-50 rounded-lg p-8 text-center border border-blue-100">
							<div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-6">
								<svg
									className="w-8 h-8 text-white"
									fill="currentColor"
									viewBox="0 0 20 20">
									<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
							</div>
							<h3 className="text-2xl font-bold text-gray-900 mb-4">
								Community Focused
							</h3>
							<p className="text-gray-700">
								Supporting our local community with friendly service and honest,
								quality food made with care.
							</p>
						</div>
					</div>

					{/* Call to Action */}
					<div className="text-center">
						<h3 className="text-3xl font-bold text-blue-800 mb-6">
							Visit Us or Order Online
						</h3>
						<p className="text-xl text-gray-600 mb-8">
							Whether you're popping by our kitchen or placing a Click & Collect
							order, we can't wait to share our bakes with you.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Link href="/baked-goods">
								<div className="bg-blue-800 text-white px-8 py-4 rounded-full hover:bg-blue-700 transition-colors font-semibold">
									Browse Baked Goods
								</div>
							</Link>
							<Link href="/groceries">
								<div className="bg-white text-blue-800 border-2 border-blue-800 px-8 py-4 rounded-full hover:bg-blue-50 transition-colors font-semibold">
									Shop Groceries
								</div>
							</Link>
						</div>
					</div>
				</div>
			</section>

			{/* About Preview Section */}
			<section className="py-20 bg-blue-50">
				<div className="max-w-6xl mx-auto px-6">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
						<div>
							<h2 className="text-4xl font-bold text-blue-800 mb-6">
								Our Story
							</h2>
							<div className="space-y-4 text-lg text-gray-700 leading-relaxed">
								<p>
									TJ's Bake & Browse began with a simple mission: to create
									delicious, freshly baked goods that everyone can enjoy —
									including those with food intolerances and allergies.
								</p>
								<p>
									Operating from our fully licensed commercial kitchen, we
									prioritise safety, transparency, and taste. Every item we make
									is crafted with love, care, and the highest quality
									ingredients.
								</p>
							</div>
							<Link href="/about" className="inline-block mt-8">
								<div className="bg-blue-800 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors font-semibold">
									Learn More About Us
								</div>
							</Link>
						</div>
						<div className="relative">
							<div className="w-full h-80 rounded-lg overflow-hidden shadow-lg">
								<Image
									src="/images/baking-team.jpg"
									alt="TJ's Bake & Browse kitchen team"
									fill
									style={{ objectFit: "cover" }}
								/>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Back to Test Styling */}
			<section className="py-12 bg-gray-50">
				<div className="max-w-6xl mx-auto px-6 text-center">
					<Link
						href="/test-styling"
						className="inline-flex items-center gap-2 text-blue-800 hover:text-blue-700 transition-colors font-medium">
						<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
							<path
								fillRule="evenodd"
								d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
								clipRule="evenodd"
							/>
						</svg>
						<span>Back to Test Styling</span>
					</Link>
				</div>
			</section>
		</main>
	);
}
