"use client";

import React from "react";
import Head from "next/head";
import Image from "next/image";
import { motion } from "framer-motion";
import ParallaxHero from "@/components/ParallaxHero";

export default function AboutPage() {
	return (
		<main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 text-gray-800">
			<Head>
				<title>About Us | TJ&apos;s Bake &amp; Browse</title>
				<meta
					name="description"
					content="Learn more about TJ's Bake & Browse – our story, values, and commitment to allergen-friendly baked goods."
				/>
			</Head>

			<ParallaxHero
				title="About TJ's Bake & Browse"
				subtitle="Bringing freshly baked, allergen-conscious treats to our community, crafted with care in our commercial kitchen."
				image="/images/hero-bakery.jpg"
				height="400px"
			/>

			{/* Story Section */}
			<section className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-12 items-center">
				<motion.div
					initial={{ opacity: 0, x: -50 }}
					whileInView={{ opacity: 1, x: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}>
					<h2 className="text-3xl font-bold mb-4 text-primaryDark">
						Our Story
					</h2>
					<p className="mb-4 text-gray-700 leading-relaxed">
						TJ&apos;s Bake &amp; Browse began with a simple mission: to create
						delicious, freshly baked goods that everyone can enjoy — including
						those with food intolerances and allergies. From gluten-free cakes
						to dairy-free muffins, we believe no one should miss out on the joy
						of a good bake.
					</p>
					<p className="text-gray-700 leading-relaxed">
						Operating from our fully licensed commercial kitchen, we prioritise
						safety, transparency, and taste. Every item we make is crafted with
						love, care, and the highest quality ingredients.
					</p>
				</motion.div>
				<motion.div
					initial={{ opacity: 0, x: 50 }}
					whileInView={{ opacity: 1, x: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className="relative w-full h-80 rounded-lg overflow-hidden shadow-lg">
					<Image
						src="/images/baking-team.jpg"
						alt="TJ's Bake & Browse kitchen"
						fill
						style={{ objectFit: "cover" }}
					/>
				</motion.div>
			</section>

			{/* Values Section */}
			<section className="bg-primaryLight/20 py-12">
				<div className="max-w-6xl mx-auto px-4 text-center">
					<motion.h2
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className="text-3xl font-bold text-primaryDark mb-8">
						Our Values
					</motion.h2>
					<div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
						{[
							{
								title: "Freshness",
								text: "Every bake is made fresh in our kitchen, using quality ingredients.",
							},
							{
								title: "Allergen Conscious",
								text: "We take care to avoid cross-contamination and clearly label all ingredients.",
							},
							{
								title: "Community",
								text: "Supporting our local community with friendly service and honest food.",
							},
							{
								title: "Sustainability",
								text: "Minimising waste and sourcing ingredients responsibly wherever possible.",
							},
						].map((value, i) => (
							<motion.div
								key={i}
								initial={{ opacity: 0, scale: 0.9 }}
								whileInView={{ opacity: 1, scale: 1 }}
								viewport={{ once: true }}
								transition={{ duration: 0.4, delay: i * 0.1 }}
								className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
								<h3 className="font-semibold text-lg text-primaryDark mb-2">
									{value.title}
								</h3>
								<p className="text-gray-600 text-sm">{value.text}</p>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Call to Action */}
			<section className="max-w-6xl mx-auto px-4 py-16 text-center">
				<motion.h2
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className="text-3xl font-bold text-primaryDark mb-4">
					Visit Us or Order Online
				</motion.h2>
				<motion.p
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6, delay: 0.2 }}
					className="text-gray-600 mb-6">
					Whether you’re popping by our kitchen or placing a Click &amp; Collect
					order, we can’t wait to share our bakes with you.
				</motion.p>
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6, delay: 0.4 }}
					className="flex flex-col sm:flex-row items-center justify-center gap-3">
					<a
						href="/groceries"
						className="btn-primary px-6 py-3 rounded-lg font-semibold w-full sm:w-auto text-center">
						Groceries
					</a>
					<a
						href="/baked-goods"
						className="btn-outline px-6 py-3 rounded-lg font-semibold w-full sm:w-auto text-center">
						Baked Goods
					</a>
				</motion.div>
			</section>
		</main>
	);
}
