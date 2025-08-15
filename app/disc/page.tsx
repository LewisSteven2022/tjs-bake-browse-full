"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Shield, Info, Mail } from "lucide-react";

export default function DisclaimerPrototypePage() {
	// Hide the global header on this test page
	useEffect(() => {
		const hdr = document.querySelector("header") as HTMLElement | null;
		const prevDisplay = hdr?.style.display;
		if (hdr) hdr.style.display = "none";
		return () => {
			if (hdr) hdr.style.display = prevDisplay || "";
		};
	}, []);

	return (
		<div className="min-h-screen bg-white">
			{/* Header */}
			<header className="border-b border-neutral-100">
				<div className="max-w-7xl mx-auto px-4 py-6">
					<div className="flex items-center justify-between">
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.6 }}>
							<h1 className="text-2xl font-light tracking-widest text-neutral-800">
								TJ'S BAKERY
							</h1>
							<p className="text-xs text-neutral-500 tracking-wider uppercase mt-1">
								Important Information
							</p>
						</motion.div>

						<nav className="flex items-center space-x-8 text-sm tracking-wider uppercase">
							<a
								href="/baked-goods"
								className="text-neutral-600 hover:text-neutral-800 transition-colors">
								Products
							</a>
							<a
								href="/about"
								className="text-neutral-600 hover:text-neutral-800 transition-colors">
								About
							</a>
							<a
								href="/suggestions"
								className="text-neutral-600 hover:text-neutral-800 transition-colors">
								Contact
							</a>
						</nav>
					</div>
				</div>
			</header>

			{/* Hero Section */}
			<section className="py-20 px-4">
				<div className="max-w-4xl mx-auto text-center">
					<motion.h2
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.2 }}
						className="text-5xl md:text-7xl font-extralight tracking-widest text-neutral-800 mb-6">
						IMPORTANT
					</motion.h2>
					<motion.h3
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.4 }}
						className="text-2xl md:text-3xl font-light tracking-wide text-neutral-600 mb-8">
						Safety & Quality Information
					</motion.h3>
					<motion.p
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.6 }}
						className="text-lg text-neutral-500 max-w-2xl mx-auto leading-relaxed">
						Your safety and satisfaction are our highest priorities. Please take a moment to read these important notices about our gluten-free products and services.
					</motion.p>
				</div>
			</section>

			{/* Allergen Information Section */}
			<section className="py-20 px-4 bg-neutral-50">
				<div className="max-w-4xl mx-auto text-center">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
					>
						<AlertTriangle className="w-16 h-16 mx-auto mb-6 text-neutral-600" />
						<h2 className="text-4xl font-light tracking-widest text-neutral-800 mb-6">
							ALLERGEN SAFETY
						</h2>
						<div className="w-24 h-px bg-neutral-300 mx-auto mb-8"></div>
						
						<p className="text-neutral-500 text-xl leading-relaxed mb-12 max-w-3xl mx-auto">
							Your safety is our absolute priority. While we maintain a dedicated gluten-free facility, please read this important information carefully.
						</p>

						<div className="bg-white border-2 border-neutral-200 p-10 mb-12 max-w-2xl mx-auto">
							<div className="flex items-center justify-center mb-6">
								<AlertTriangle className="w-8 h-8 text-neutral-600 mr-4" />
								<span className="text-lg font-light tracking-wide text-neutral-800">Critical Notice</span>
							</div>
							<p className="text-neutral-700 text-lg leading-relaxed">
								If you have severe allergies or coeliac disease, <strong>please contact us directly</strong> before ordering to discuss your specific requirements and our safety protocols.
							</p>
						</div>

						<div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
							<div className="text-center p-8 border border-neutral-200 bg-white">
								<div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center border-2 border-neutral-200 rounded-full">
									<span className="text-2xl text-neutral-600">✓</span>
								</div>
								<h4 className="text-xl font-light tracking-wide text-neutral-800 mb-4">
									Certified Gluten-Free
								</h4>
								<p className="text-neutral-500 leading-relaxed">
									Dedicated facility with strict contamination prevention protocols
								</p>
							</div>
							<div className="text-center p-8 border border-neutral-200 bg-white">
								<div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center border-2 border-neutral-200 rounded-full">
									<span className="text-2xl text-neutral-600">🥛</span>
								</div>
								<h4 className="text-xl font-light tracking-wide text-neutral-800 mb-4">
									Dairy-Free Available
								</h4>
								<p className="text-neutral-500 leading-relaxed">
									Alternative ingredients available for most products upon request
								</p>
							</div>
						</div>
					</motion.div>
				</div>
			</section>

			{/* Divider */}
			<section className="py-8">
				<div className="max-w-6xl mx-auto px-4">
					<div className="flex items-center justify-center">
						<div className="flex-1 h-px bg-neutral-200"></div>
						<div className="mx-8">
							<div className="w-3 h-3 bg-neutral-300 rounded-full"></div>
						</div>
						<div className="flex-1 h-px bg-neutral-200"></div>
					</div>
				</div>
			</section>

			{/* Quality Standards Section */}
			<section className="py-20 px-4">
				<div className="max-w-4xl mx-auto text-center">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, delay: 0.1 }}
					>
						<Shield className="w-16 h-16 mx-auto mb-6 text-neutral-600" />
						<h2 className="text-4xl font-light tracking-widest text-neutral-800 mb-6">
							QUALITY PROMISE
						</h2>
						<div className="w-24 h-px bg-neutral-300 mx-auto mb-12"></div>

						<p className="text-neutral-500 text-xl leading-relaxed mb-16 max-w-3xl mx-auto">
							Every product is crafted with care, using premium ingredients and traditional methods for exceptional quality.
						</p>

						<div className="grid md:grid-cols-2 gap-12 text-left max-w-3xl mx-auto">
							<div className="space-y-6">
								<h3 className="text-2xl font-light tracking-wide text-neutral-800 text-center mb-8">
									Daily Fresh
								</h3>
								<div className="space-y-4">
									<div className="flex items-start">
										<span className="w-6 h-6 flex items-center justify-center bg-neutral-100 rounded-full text-xs text-neutral-600 mr-4 mt-1 flex-shrink-0">1</span>
										<p className="text-neutral-600 leading-relaxed">Small batch baking every morning for maximum freshness</p>
									</div>
									<div className="flex items-start">
										<span className="w-6 h-6 flex items-center justify-center bg-neutral-100 rounded-full text-xs text-neutral-600 mr-4 mt-1 flex-shrink-0">2</span>
										<p className="text-neutral-600 leading-relaxed">Best consumed within 2-3 days of collection</p>
									</div>
									<div className="flex items-start">
										<span className="w-6 h-6 flex items-center justify-center bg-neutral-100 rounded-full text-xs text-neutral-600 mr-4 mt-1 flex-shrink-0">3</span>
										<p className="text-neutral-600 leading-relaxed">Storage instructions provided with every order</p>
									</div>
								</div>
							</div>
							<div className="space-y-6">
								<h3 className="text-2xl font-light tracking-wide text-neutral-800 text-center mb-8">
									Premium Standards
								</h3>
								<div className="space-y-4">
									<div className="flex items-start">
										<span className="w-6 h-6 flex items-center justify-center bg-neutral-100 rounded-full text-xs text-neutral-600 mr-4 mt-1 flex-shrink-0">1</span>
										<p className="text-neutral-600 leading-relaxed">Regular audits of all ingredient suppliers</p>
									</div>
									<div className="flex items-start">
										<span className="w-6 h-6 flex items-center justify-center bg-neutral-100 rounded-full text-xs text-neutral-600 mr-4 mt-1 flex-shrink-0">2</span>
										<p className="text-neutral-600 leading-relaxed">Temperature-controlled storage throughout</p>
									</div>
									<div className="flex items-start">
										<span className="w-6 h-6 flex items-center justify-center bg-neutral-100 rounded-full text-xs text-neutral-600 mr-4 mt-1 flex-shrink-0">3</span>
										<p className="text-neutral-600 leading-relaxed">Maintained hygiene and safety certifications</p>
									</div>
								</div>
							</div>
						</div>
					</motion.div>
				</div>
			</section>

			{/* Additional Information Links */}
			<section className="py-20 px-4 bg-neutral-50">
				<div className="max-w-4xl mx-auto text-center">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
					>
						<h2 className="text-4xl font-light tracking-widest text-neutral-800 mb-6">
							MORE INFORMATION
						</h2>
						<div className="w-24 h-px bg-neutral-300 mx-auto mb-12"></div>
						
						<p className="text-neutral-500 text-xl leading-relaxed mb-16 max-w-3xl mx-auto">
							Find detailed information about our ordering process and policies.
						</p>

						<div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
							<a
								href="/how-to-order"
								className="group bg-white border-2 border-neutral-200 p-10 hover:border-neutral-300 transition-colors"
							>
								<Info className="w-16 h-16 mx-auto mb-6 text-neutral-600 group-hover:text-neutral-800 transition-colors" />
								<h3 className="text-2xl font-light tracking-wide text-neutral-800 mb-4">
									How To Order
								</h3>
								<div className="w-16 h-px bg-neutral-300 mx-auto mb-6"></div>
								<p className="text-neutral-500 leading-relaxed group-hover:text-neutral-600 transition-colors">
									Step-by-step guide to placing your order, collection timing, and what to expect from our process.
								</p>
								<div className="mt-8">
									<span className="text-sm tracking-wider uppercase text-neutral-400 border-b border-neutral-300 pb-1 group-hover:border-neutral-600 transition-colors">
										Learn More →
									</span>
								</div>
							</a>

							<a
								href="/terms-policies"
								className="group bg-white border-2 border-neutral-200 p-10 hover:border-neutral-300 transition-colors"
							>
								<Shield className="w-16 h-16 mx-auto mb-6 text-neutral-600 group-hover:text-neutral-800 transition-colors" />
								<h3 className="text-2xl font-light tracking-wide text-neutral-800 mb-4">
									Terms & Policies
								</h3>
								<div className="w-16 h-px bg-neutral-300 mx-auto mb-6"></div>
								<p className="text-neutral-500 leading-relaxed group-hover:text-neutral-600 transition-colors">
									Detailed policies covering product responsibility, order changes, cancellations, and privacy protection.
								</p>
								<div className="mt-8">
									<span className="text-sm tracking-wider uppercase text-neutral-400 border-b border-neutral-300 pb-1 group-hover:border-neutral-600 transition-colors">
										Read Policies →
									</span>
								</div>
							</a>
						</div>
					</motion.div>
				</div>
			</section>

			{/* Contact Section */}
			<section className="py-16 px-4">
				<div className="max-w-4xl mx-auto text-center">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
					>
						<Mail className="w-12 h-12 mx-auto mb-4 text-neutral-600" />
						<h2 className="text-3xl font-light tracking-widest text-neutral-800 mb-4">
							QUESTIONS?
						</h2>
						<div className="w-16 h-px bg-neutral-300 mx-auto mb-8"></div>
						<p className="text-lg text-neutral-500 mb-8 max-w-2xl mx-auto leading-relaxed">
							If you have any questions about our products, ingredients, or policies, we're here to help.
						</p>
						<div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
							<a
								href="mailto:tjsbakeandbrowse@gmail.com"
								className="text-neutral-600 text-sm tracking-wider uppercase border-b border-neutral-300 pb-1 hover:border-neutral-600 transition-colors"
							>
								tjsbakeandbrowse@gmail.com
							</a>
							<span className="text-neutral-300">|</span>
							<a
								href="/suggestions"
								className="text-neutral-600 text-sm tracking-wider uppercase border-b border-neutral-300 pb-1 hover:border-neutral-600 transition-colors"
							>
								Contact Form
							</a>
						</div>
					</motion.div>
				</div>
			</section>

			{/* Footer */}
			<footer className="bg-neutral-900 text-white py-16 px-4">
				<div className="max-w-6xl mx-auto text-center">
					<h3 className="text-2xl font-light tracking-widest mb-4">
						TJ'S BAKERY
					</h3>
					<p className="text-neutral-400 text-sm tracking-wide uppercase mb-8">
						Artisan Gluten-Free Goods
					</p>
					<div className="flex justify-center space-x-8 text-sm tracking-wider uppercase mb-8">
						<a
							href="/legal/terms"
							className="text-neutral-400 hover:text-white transition-colors">
							Terms
						</a>
						<a
							href="/legal/privacy"
							className="text-neutral-400 hover:text-white transition-colors">
							Privacy
						</a>
						<a
							href="/suggestions"
							className="text-neutral-400 hover:text-white transition-colors">
							Contact
						</a>
						<a
							href="/disclaimer"
							className="text-neutral-400 hover:text-white transition-colors">
							Disclaimers
						</a>
					</div>
					<div className="text-xs text-neutral-500 tracking-wide">
						Last updated: {new Date().toLocaleDateString('en-GB')} | © {new Date().getFullYear()} TJ's Bakery. All rights reserved.
					</div>
				</div>
			</footer>
		</div>
	);
}