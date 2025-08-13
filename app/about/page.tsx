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
					<h2 className="text-3xl font-bold mb-4 text-primaryDark text-center md:text-left">
						Welcome to TJ’s Bake and Browse
					</h2>
					<div className="space-y-4 text-gray-700 leading-relaxed">
						<p>
							Welcome to TJ’s Bake and Browse – Jersey’s own gluten-free grocery
							store and home-baked treat haven!
						</p>
						<p>
							We’re Tom and Jess – the "T" and "J" behind the name. Our journey
							started nearly a decade ago when Tom was diagnosed with coeliac
							disease at 18. Not long after, we discovered Jess also had
							allergies to both gluten and dairy. From that moment on, our lives
							changed — and so did our kitchen.
						</p>
						<p>
							For the past nine years, we’ve lived a completely gluten-free
							lifestyle in a fully gluten-free home. We know firsthand how tough
							it can be to find safe, delicious food when you’re dealing with
							allergies, intolerances, autoimmune conditions, or even just
							making dietary choices. That’s why everything we stock or bake at
							TJ’s is created with care, passion, and a whole lot of
							understanding.
						</p>
						<p>
							Our signature home-baked goodies are made right in our kitchen
							with love and zero compromise on taste. We believe that just
							because you have dietary needs doesn’t mean you should miss out on
							the joy of your favourite treats.
						</p>
						<p>
							Over the years, we’ve found inspiration in gluten-free shops we
							visited on our travels. Each one left us dreaming about bringing
							something similar back to the little island we call home. And now,
							that dream is a reality.
						</p>
						<p>
							TJ’s Bake and Browse is more than a shop. It’s a safe space for
							the gluten-free community (and beyond) to enjoy food that’s
							inclusive, indulgent, and made with heart.
						</p>
						<p className="italic text-primaryDark">
							We’re so excited to share it with you.
						</p>
						<p className="font-semibold">– Tom & Jess</p>
					</div>
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
