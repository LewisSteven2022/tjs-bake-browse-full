"use client";

import React from "react";
import Head from "next/head";
import Image from "next/image";
import { motion } from "framer-motion";

export default function AboutPage() {
	return (
		<main className="min-h-screen bg-elegance">
			<Head>
				<title>About Us | TJ&apos;s Bake &amp; Browse</title>
				<meta
					name="description"
					content="Learn more about TJ's Bake & Browse – our story, values, and commitment to allergen-friendly baked goods."
				/>
			</Head>

			{/* Hero Section */}
			<section className="bg-elegance-hero section-elegance">
				<div className="container-elegance">
					<div className="text-center mb-16">
						<motion.h1
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8 }}
							className="text-5xl text-elegance-heading mb-6">
							About TJ's Bake & Browse
						</motion.h1>
						<motion.p
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, delay: 0.2 }}
							className="text-elegance-body text-lg max-w-2xl mx-auto">
							Bringing freshly baked, allergen-conscious treats to our
							community, crafted with care in our commercial kitchen.
						</motion.p>
					</div>
				</div>
			</section>

			{/* Story Section */}
			<section className="section-elegance">
				<div className="container-elegance">
					<div className="grid lg:grid-cols-2 gap-16 items-center">
						<motion.div
							initial={{ opacity: 0, x: -50 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.8 }}
							className="space-elegance-content">
							<h2 className="text-3xl text-elegance-heading mb-8">
								Welcome to TJ's Bake and Browse
							</h2>
							<div className="space-y-6 text-elegance-body leading-relaxed">
								<p>
									Welcome to TJ's Bake and Browse – Jersey's own gluten-free
									grocery store and home-baked treat haven!
								</p>
								<p>
									We're Tom and Jess – the "T" and "J" behind the name. Our
									journey started nearly a decade ago when Tom was diagnosed
									with coeliac disease at 18. Not long after, we discovered Jess
									also had allergies to both gluten and dairy. From that moment
									on, our lives changed — and so did our kitchen.
								</p>
								<p>
									For the past nine years, we've lived a completely gluten-free
									lifestyle in a fully gluten-free home. We know firsthand how
									tough it can be to find safe, delicious food when you're
									dealing with allergies, intolerances, autoimmune conditions,
									or even just making dietary choices. That's why everything we
									stock or bake at TJ's is created with care, passion, and a
									whole lot of understanding.
								</p>
								<p>
									Our signature home-baked goodies are made right in our kitchen
									with love and zero compromise on taste. We believe that just
									because you have dietary needs doesn't mean you should miss
									out on the joy of your favourite treats.
								</p>
								<p>
									Over the years, we've found inspiration in gluten-free shops
									we visited on our travels. Each one left us dreaming about
									bringing something similar back to the little island we call
									home. And now, that dream is a reality.
								</p>
								<p>
									TJ's Bake and Browse is more than a shop. It's a safe space
									for the gluten-free community (and beyond) to enjoy food
									that's inclusive, indulgent, and made with heart.
								</p>
								<p className="text-neutral-500 italic">
									We're so excited to share it with you.
								</p>
								<p className="text-elegance-heading font-light">– Tom & Jess</p>
							</div>
						</motion.div>
						<motion.div
							initial={{ opacity: 0, x: 50 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.8, delay: 0.2 }}
							className="relative w-full h-96">
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

			{/* Values Section */}
			<section className="bg-elegance-neutral section-elegance">
				<div className="container-elegance">
					<motion.h2
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.8 }}
						className="text-3xl text-elegance-heading text-center mb-16">
						Our Values
					</motion.h2>
					<div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
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
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.6, delay: i * 0.1 }}
								className="card-elegance text-center p-8 hover-lift-elegance">
								<h3 className="text-elegance-subheading mb-4">{value.title}</h3>
								<p className="text-elegance-body">{value.text}</p>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Call to Action */}
			<section className="section-elegance">
				<div className="container-elegance text-center">
					<motion.h2
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.8 }}
						className="text-3xl text-elegance-heading mb-6">
						Visit Us or Order Online
					</motion.h2>
					<motion.p
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.8, delay: 0.2 }}
						className="text-elegance-body text-lg mb-12 max-w-2xl mx-auto">
						Whether you're popping by our kitchen or placing a Click & Collect
						order, we can't wait to share our bakes with you.
					</motion.p>
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.8, delay: 0.4 }}
						className="flex flex-col sm:flex-row items-center justify-center gap-4">
						<a href="/groceries" className="btn-elegance-primary">
							Groceries
						</a>
						<a href="/baked-goods" className="btn-elegance-secondary">
							Baked Goods
						</a>
					</motion.div>
				</div>
			</section>
		</main>
	);
}
