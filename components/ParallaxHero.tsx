"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

interface ParallaxHeroProps {
	title: string;
	subtitle?: string;
	image: string;
	height?: string; // e.g. "300px" or "400px"
}

export default function ParallaxHero({
	title,
	subtitle,
	image,
	height = "400px",
}: ParallaxHeroProps) {
	const heroRef = useRef(null);

	const { scrollYProgress } = useScroll({
		target: heroRef,
		offset: ["start start", "end start"],
	});
	const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

	return (
		<section
			ref={heroRef}
			className="relative flex items-center justify-center overflow-hidden"
			style={{ height }}>
			<motion.div style={{ y }} className="absolute inset-0 w-full h-full">
				<Image
					src={image}
					alt={title}
					fill
					priority
					style={{ objectFit: "cover" }}
				/>
				<div className="absolute inset-0 bg-primaryDark/40" />
			</motion.div>

			<motion.div
				initial={{ opacity: 0, y: -30 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.6 }}
				className="relative z-10 text-center px-4">
				<h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
					{title}
				</h1>
				{subtitle && (
					<p className="mt-4 text-lg text-white max-w-2xl mx-auto drop-shadow">
						{subtitle}
					</p>
				)}
			</motion.div>
		</section>
	);
}
