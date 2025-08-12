import React from "react";
import Image from "next/image";
import Link from "next/link";
import ParallaxHero from "@/components/ParallaxHero";

export default function HomePage() {
	return (
		<main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
			{/* Enhanced Hero Section */}
			<ParallaxHero
				title="Welcome to TJ's Bake & Browse"
				subtitle="Freshly baked, allergen-conscious treats made with love in our artisan kitchen"
				image="/images/hero-bakery.jpg"
				height="500px"
			/>

			{/* Enhanced Welcome Section */}
			<section className="max-w-7xl mx-auto px-6 py-20">
				<div className="text-center mb-16">
					<h1 className="text-5xl font-bold bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600 bg-clip-text text-transparent mb-6">
						Quality Bakery Excellence
					</h1>
					<p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
						Discover our handcrafted selection of gluten-free and
						allergen-conscious treats, made with premium ingredients and baked
						fresh daily. Every product is crafted with care to ensure everyone
						can enjoy the joy of great baking.
					</p>
				</div>

				{/* Enhanced Feature Cards */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
					<div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100 p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
						<div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
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
						<h3 className="text-2xl font-bold text-gray-800 mb-4">
							Gluten-Free Excellence
						</h3>
						<p className="text-gray-600">
							Every product is carefully crafted to be gluten-free, ensuring
							everyone can enjoy our delicious treats.
						</p>
					</div>

					<div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100 p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
						<div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
							<svg
								className="w-10 h-10 text-white"
								fill="currentColor"
								viewBox="0 0 20 20">
								<path
									fillRule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
									clipRule="evenodd"
								/>
							</svg>
						</div>
						<h3 className="text-2xl font-bold text-gray-800 mb-4">
							Quality Ingredients
						</h3>
						<p className="text-gray-600">
							We use only the finest, carefully selected ingredients to ensure
							every product meets our high standards for taste and quality.
						</p>
					</div>

					<div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100 p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
						<div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
							<svg
								className="w-10 h-10 text-white"
								fill="currentColor"
								viewBox="0 0 20 20">
								<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
						</div>
						<h3 className="text-2xl font-bold text-gray-800 mb-4">
							Community Focused
						</h3>
						<p className="text-gray-600">
							Supporting our local community with friendly service and honest,
							quality food made with care.
						</p>
					</div>
				</div>

				{/* Enhanced Call to Action */}
				<div className="text-center">
					<h2 className="text-3xl font-bold text-gray-800 mb-6">
						Ready to Experience Our Bakes?
					</h2>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Link href="/baked-goods" className="group">
							<div className="inline-flex items-center gap-3 bg-blue-800 text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1">
								<svg
									className="w-6 h-6"
									fill="currentColor"
									viewBox="0 0 20 20">
									<path
										fillRule="evenodd"
										d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
										clipRule="evenodd"
									/>
								</svg>
								<span className="font-semibold text-lg">
									Browse Baked Goods
								</span>
							</div>
						</Link>
						<Link href="/groceries" className="group">
							<div className="inline-flex items-center gap-3 bg-white text-blue-800 border-2 border-blue-800 px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1">
								<svg
									className="w-6 h-6"
									fill="currentColor"
									viewBox="0 0 20 20">
									<path
										fillRule="evenodd"
										d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
										clipRule="evenodd"
									/>
								</svg>
								<span className="font-semibold text-lg">Shop Groceries</span>
							</div>
						</Link>
					</div>
				</div>
			</section>

			{/* Enhanced About Preview Section */}
			<section className="bg-primaryLight/20 text-gray-800 py-20">
				<div className="max-w-6xl mx-auto px-6">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
						<div>
							<h2 className="text-4xl font-bold mb-6 text-primaryDark">
								Our Story
							</h2>
							<p className="text-xl text-gray-700 leading-relaxed mb-6">
								TJ's Bake & Browse began with a simple mission: to create
								delicious, freshly baked goods that everyone can enjoy —
								including those with food intolerances and allergies.
							</p>
							<p className="text-lg text-gray-700 leading-relaxed mb-8">
								Operating from our fully licensed commercial kitchen, we
								prioritise safety, transparency, and taste. Every item we make
								is crafted with love, care, and the highest quality ingredients.
							</p>
							<Link
								href="/about"
								className="inline-flex items-center gap-2 bg-blue-800 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors font-semibold shadow-lg">
								<span>Learn More About Us</span>
								<svg
									className="w-4 h-4"
									fill="currentColor"
									viewBox="0 0 20 20">
									<path
										fillRule="evenodd"
										d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
										clipRule="evenodd"
									/>
								</svg>
							</Link>
						</div>
						<div className="relative w-full h-80 rounded-lg overflow-hidden shadow-lg">
							<Image
								src="/images/baking-team.jpg"
								alt="TJ's Bake & Browse kitchen"
								fill
								style={{ objectFit: "cover" }}
							/>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
