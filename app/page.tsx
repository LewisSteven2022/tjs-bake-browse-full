"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HomePage() {
	return (
		<main className="bg-elegance">
			{/* Hero Section */}
			<section className="bg-elegance-hero section-elegance">
				<div className="container-elegance">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
						<motion.div
							initial={{ opacity: 0, x: -50 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.8 }}
							className="space-elegance-content">
							<h1 className="text-5xl lg:text-6xl text-elegance-heading mb-6">
								TJ's Bake & Browse
							</h1>
							<p className="text-elegance-subheading mb-8">
								Freshly baked, allergen-conscious treats
							</p>
							<p className="text-elegance-body text-lg mb-12 leading-relaxed">
								Discover our handcrafted selection of gluten-free and
								allergen-conscious treats, made with premium ingredients and
								baked fresh daily. Every product is crafted with care to ensure
								everyone can enjoy the joy of great baking.
							</p>
							<div className="flex flex-col sm:flex-row gap-4">
								<Link href="/baked-goods" className="btn-elegance-primary">
									Browse Baked Goods
								</Link>
								<Link href="/groceries" className="btn-elegance-secondary">
									Shop Groceries
								</Link>
							</div>
						</motion.div>
						<motion.div
							initial={{ opacity: 0, x: 50 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.8, delay: 0.2 }}
							className="relative h-96 lg:h-[500px]">
							<Image
								src="/images/hero-bakery.jpg"
								alt="Fresh baked goods at TJ's Bake & Browse"
								fill
								className="img-elegance-hero"
								priority
							/>
						</motion.div>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="section-elegance">
				<div className="container-elegance">
					<motion.div
						initial={{ opacity: 0, y: 50 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.8 }}
						className="text-center mb-16">
						<h2 className="text-3xl text-elegance-heading mb-4">
							Why Choose TJ's
						</h2>
						<p className="text-elegance-body max-w-2xl mx-auto">
							Quality, care, and community are at the heart of everything we do
						</p>
					</motion.div>

					<div className="grid-elegance-features">
						<motion.div
							initial={{ opacity: 0, y: 50 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.8, delay: 0.1 }}
							className="text-center space-elegance-compact">
							<div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
								<svg
									className="w-8 h-8 text-neutral-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={1.5}
										d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							</div>
							<h3 className="text-elegance-subheading mb-3">
								Gluten-Free Excellence
							</h3>
							<p className="text-elegance-body">
								Every product is carefully crafted to be gluten-free, ensuring
								everyone can enjoy our delicious treats.
							</p>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 50 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.8, delay: 0.2 }}
							className="text-center space-elegance-compact">
							<div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
								<svg
									className="w-8 h-8 text-neutral-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={1.5}
										d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
									/>
								</svg>
							</div>
							<h3 className="text-elegance-subheading mb-3">
								Quality Ingredients
							</h3>
							<p className="text-elegance-body">
								We use only the finest, carefully selected ingredients to ensure
								every product meets our high standards for taste and quality.
							</p>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 50 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.8, delay: 0.3 }}
							className="text-center space-elegance-compact">
							<div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
								<svg
									className="w-8 h-8 text-neutral-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={1.5}
										d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
									/>
								</svg>
							</div>
							<h3 className="text-elegance-subheading mb-3">
								Community Focused
							</h3>
							<p className="text-elegance-body">
								Supporting our local community with friendly service and honest,
								quality food made with care.
							</p>
						</motion.div>
					</div>
				</div>
			</section>

			{/* About Preview Section */}
			<section className="bg-elegance-neutral section-elegance">
				<div className="container-elegance">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
						<motion.div
							initial={{ opacity: 0, x: -50 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.8 }}
							className="space-elegance-content">
							<h2 className="text-3xl text-elegance-heading mb-6">Our Story</h2>
							<p className="text-elegance-body text-lg leading-relaxed mb-6">
								TJ's Bake & Browse began with a simple mission: to create
								delicious, freshly baked goods that everyone can enjoy —
								including those with food intolerances and allergies.
							</p>
							<p className="text-elegance-body leading-relaxed mb-8">
								Operating from our fully licensed commercial kitchen, we
								prioritise safety, transparency, and taste. Every item we make
								is crafted with love, care, and the highest quality ingredients.
							</p>
							<Link href="/about" className="btn-elegance-ghost">
								Learn More About Us →
							</Link>
						</motion.div>
						<motion.div
							initial={{ opacity: 0, x: 50 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.8, delay: 0.2 }}
							className="relative h-80 lg:h-96">
							<Image
								src="/images/baking-team.jpg"
								alt="TJ's Bake & Browse kitchen"
								fill
								className="img-elegance-hero"
							/>
						</motion.div>
					</div>
				</div>
			</section>
		</main>
	);
}
