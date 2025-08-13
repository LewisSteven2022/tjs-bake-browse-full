"use client";

import Head from "next/head";
import { useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import TestNavbar from "@/components/test/TestNavbar";
import brownies from "@/app/test-styling/images/brownies.webp";
import choccookie from "@/app/test-styling/images/choccookie.webp";
import fudgeJpg from "@/app/test-styling/images/fudge.jpg";
import oreoBrownie from "@/app/test-styling/images/oreoBrownie.jpg";

export default function AboutModernTestPage() {
	// Hide the global header only on this test page
	useEffect(() => {
		const hdr = document.querySelector("header") as HTMLElement | null;
		const prevDisplay = hdr?.style.display;
		if (hdr) hdr.style.display = "none";
		return () => {
			if (hdr) hdr.style.display = prevDisplay || "";
		};
	}, []);
	return (
		<main className="min-h-screen bg-gradient-to-br from-[#F0F3FA] via-white to-[#D5DEEF] text-gray-800">
			<Head>
				<title>About (Modern Test) | TJ's Bake & Browse</title>
			</Head>

			<TestNavbar />

			{/* Compact hero with blended overlay to save vertical space */}
			<section className="relative w-full h-[280px] md:h-[320px] overflow-hidden rounded-none md:rounded-2xl md:w-[min(1100px,95%)] md:mx-auto md:mt-4">
				<Image
					src="/images/hero-bakery.jpg"
					alt="Hero"
					fill
					className="object-cover"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-[#395B86]/70 via-[#638ECB]/20 to-transparent" />
				<div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
					<h1 className="text-3xl md:text-4xl font-extrabold drop-shadow">
						About TJ's Bake & Browse
					</h1>
					<p className="mt-2 max-w-2xl text-sm md:text-base opacity-95">
						Freshly baked, allergen-conscious treats and gluten-free groceries.
					</p>
				</div>
			</section>

			{/* Content with reduced whitespace and balanced media */}
			<section className="md:w-[min(1100px,95%)] md:mx-auto px-4 pt-10 pb-12 grid lg:grid-cols-2 gap-10 items-start lg:items-center">
				<div className="space-y-4 flex flex-col justify-center">
					<h1 className="text-2xl md:text-3xl font-bold text-[#395B86]">
						Welcome to TJ’s Bake and Browse
					</h1>{" "}
					<br></br>
					<p>
						Welcome to TJ’s Bake and Browse – Jersey’s own gluten-free grocery
						store and home-baked treat haven!
					</p>
					<p>
						We’re Tom and Jess – the "T" and "J" behind the name. Our journey
						started nearly a decade ago when Tom was diagnosed with coeliac
						disease at 18. Not long after, we discovered Jess also had allergies
						to both gluten and dairy. From that moment on, our lives changed —
						and so did our kitchen.
					</p>
					<p>
						For the past nine years, we’ve lived a completely gluten-free
						lifestyle in a fully gluten-free home. We know firsthand how tough
						it can be to find safe, delicious food when you’re dealing with
						allergies, intolerances, autoimmune conditions, or even just making
						dietary choices. That’s why everything we stock or bake at TJ’s is
						created with care, passion, and a whole lot of understanding.
					</p>
					<p>
						Our signature home-baked goodies are made right in our kitchen with
						love and zero compromise on taste. We believe that just because you
						have dietary needs doesn’t mean you should miss out on the joy of
						your favourite treats.
					</p>
					<p>
						Over the years, we’ve found inspiration in gluten-free shops we
						visited on our travels. Each one left us dreaming about bringing
						something similar back to the little island we call home. And now,
						that dream is a reality.
					</p>
					<p>
						TJ’s Bake and Browse is more than a shop. It’s a safe space for the
						gluten-free community (and beyond) to enjoy food that’s inclusive,
						indulgent, and made with heart.
					</p>
					{/* (moved mini gallery to right column) */}
					<p className="italic text-primaryDark">
						We’re so excited to share it with you.
					</p>
					<p className="font-semibold">– Tom & Jess</p>
				</div>
				<div className="grid gap-6">
					<div className="relative w-full h-[300px] md:h-[380px] rounded-xl overflow-hidden shadow">
						<Image
							src="/images/baking-team.jpg"
							alt="Kitchen"
							fill
							className="object-cover"
						/>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div className="relative w-full h-[220px] md:h-[260px] rounded-xl overflow-hidden shadow">
							<Image src={fudgeJpg} alt="Fudge" fill className="object-cover" />
						</div>
						<div className="relative w-full h-[220px] md:h-[260px] rounded-xl overflow-hidden shadow">
							<Image
								src={oreoBrownie}
								alt="Oreo Brownie"
								fill
								className="object-cover"
							/>
						</div>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div className="relative w-full h-[220px] md:h-[260px] rounded-xl overflow-hidden shadow">
							<Image
								src={brownies}
								alt="Brownies"
								fill
								className="object-cover"
							/>
						</div>
						<div className="relative w-full h-[220px] md:h-[260px] rounded-xl overflow-hidden shadow">
							<Image
								src={choccookie}
								alt="Cookies"
								fill
								className="object-cover"
							/>
						</div>
					</div>
				</div>
			</section>

			{/* Values in tighter cards */}
			<section id="values" className="pt-0 pb-12">
				<div className="md:w-[min(1100px,95%)] md:mx-auto px-4">
					<h3 className="text-center text-2xl font-bold text-[#395B86] mb-4">
						Our Values
					</h3>
					<div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
						{[
							{
								title: "Freshness",
								text: "Every bake is made fresh in our kitchen, using quality ingredients.",
							},
							{
								title: "Allergen Conscious",
								text: "We avoid cross-contamination and clearly label all ingredients.",
							},
							{
								title: "Community",
								text: "Supporting our local community with friendly service and honest food.",
							},
							{
								title: "Sustainability",
								text: "Minimising waste and sourcing responsibly wherever possible.",
							},
						].map((v, i) => (
							<motion.div
								key={i}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.3, delay: i * 0.05 }}
								className="bg-white border border-[#D5DEEF] rounded-xl p-5 shadow-sm">
								<h4 className="font-semibold text-[#395B86] mb-1">{v.title}</h4>
								<p className="text-sm text-gray-600">{v.text}</p>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* CTA with compact spacing */}
			<section id="contact" className="pt-0 pb-12">
				<div className="md:w-[min(1100px,95%)] md:mx-auto px-4 text-center">
					<h3 className="text-2xl font-bold text-[#395B86] mb-1">
						Visit Us or Order Online
					</h3>
					<p className="text-gray-600 mb-3">
						Whether you’re popping by our kitchen or placing a Click & Collect
						order, we’d love to see you.
					</p>
					<div className="flex flex-col sm:flex-row items-center justify-center gap-2">
						<a
							href="/groceries"
							className="px-5 py-2 rounded-lg font-semibold text-white bg-[#638ECB] hover:bg-[#395B86]">
							Groceries
						</a>
						<a
							href="/baked-goods"
							className="px-5 py-2 rounded-lg font-semibold border border-[#D5DEEF] text-[#395B86] hover:bg-[#F0F3FA]">
							Baked Goods
						</a>
					</div>
				</div>
			</section>
		</main>
	);
}
