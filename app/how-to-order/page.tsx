"use client";

import { motion } from "framer-motion";
import { Clock, Award, ShoppingCart, Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function HowToOrderPage() {
	return (
		<div className="min-h-screen bg-white">
			{/* Navigation breadcrumb */}
			<section className="py-4 px-4 border-b border-neutral-100">
				<div className="max-w-4xl mx-auto">
					<Link
						href="/disclaimer"
						className="inline-flex items-center space-x-2 text-neutral-600 hover:text-neutral-800 transition-colors text-sm tracking-wider uppercase">
						<ArrowLeft className="w-4 h-4" />
						<span>Back to Disclaimers</span>
					</Link>
				</div>
			</section>

			{/* Hero Section */}
			<section className="py-20 px-4">
				<div className="max-w-4xl mx-auto text-center">
					<motion.h2
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.2 }}
						className="text-5xl md:text-7xl font-extralight tracking-widest text-neutral-800 mb-6">
						HOW
					</motion.h2>
					<motion.h3
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.4 }}
						className="text-2xl md:text-3xl font-light tracking-wide text-neutral-600 mb-8">
						To Order
					</motion.h3>
					<motion.p
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.6 }}
						className="text-lg text-neutral-500 max-w-2xl mx-auto leading-relaxed">
						Simple ordering process designed for freshness and convenience. Everything you need to know about placing your order.
					</motion.p>
				</div>
			</section>

			{/* Ordering Process Steps */}
			<section className="py-16 px-4 bg-neutral-50">
				<div className="max-w-5xl mx-auto">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className="text-center mb-16">
						<h2 className="text-4xl font-light tracking-widest text-neutral-800 mb-6">
							ORDERING PROCESS
						</h2>
						<div className="w-24 h-px bg-neutral-300 mx-auto mb-8"></div>
						<p className="text-xl text-neutral-500 max-w-3xl mx-auto leading-relaxed">
							Follow these simple steps to place your order and ensure you get the freshest products.
						</p>
					</motion.div>

					<div className="grid md:grid-cols-3 gap-8 mb-16">
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6 }}
							className="text-center bg-white border border-neutral-200 p-10"
						>
							<div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center border-2 border-neutral-200 rounded-full">
								<span className="text-2xl font-light text-neutral-600">1</span>
							</div>
							<h4 className="text-xl font-light tracking-wide text-neutral-800 mb-4">
								Browse & Select
							</h4>
							<div className="w-12 h-px bg-neutral-300 mx-auto mb-6"></div>
							<p className="text-neutral-500 leading-relaxed mb-6">
								Explore our range of fresh baked goods and select your favorites from our online catalog.
							</p>
							<div className="space-y-3 text-sm text-neutral-600">
								<div className="flex items-center justify-center">
									<a
										href="/baked-goods"
										className="text-neutral-600 border-b border-neutral-300 pb-1 hover:border-neutral-600 transition-colors">
										View Baked Goods
									</a>
								</div>
								<div className="flex items-center justify-center">
									<a
										href="/groceries"
										className="text-neutral-600 border-b border-neutral-300 pb-1 hover:border-neutral-600 transition-colors">
										View Groceries
									</a>
								</div>
							</div>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.1 }}
							className="text-center bg-white border border-neutral-200 p-10"
						>
							<div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center border-2 border-neutral-200 rounded-full">
								<span className="text-2xl font-light text-neutral-600">2</span>
							</div>
							<h4 className="text-xl font-light tracking-wide text-neutral-800 mb-4">
								Add to Basket
							</h4>
							<div className="w-12 h-px bg-neutral-300 mx-auto mb-6"></div>
							<p className="text-neutral-500 leading-relaxed mb-6">
								Add your chosen items to your basket and review your selection before checkout.
							</p>
							<div className="space-y-3 text-sm text-neutral-600">
								<div className="flex items-start">
									<span className="text-neutral-400 mr-2">•</span>
									<span>Check quantities and options</span>
								</div>
								<div className="flex items-start">
									<span className="text-neutral-400 mr-2">•</span>
									<span>Review allergen information</span>
								</div>
								<div className="flex items-start">
									<span className="text-neutral-400 mr-2">•</span>
									<span>Modify items if needed</span>
								</div>
							</div>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.2 }}
							className="text-center bg-white border border-neutral-200 p-10"
						>
							<div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center border-2 border-neutral-200 rounded-full">
								<span className="text-2xl font-light text-neutral-600">3</span>
							</div>
							<h4 className="text-xl font-light tracking-wide text-neutral-800 mb-4">
								Checkout & Collect
							</h4>
							<div className="w-12 h-px bg-neutral-300 mx-auto mb-6"></div>
							<p className="text-neutral-500 leading-relaxed mb-6">
								Complete your order with collection details and receive confirmation via email.
							</p>
							<div className="space-y-3 text-sm text-neutral-600">
								<div className="flex items-start">
									<span className="text-neutral-400 mr-2">•</span>
									<span>Choose collection time</span>
								</div>
								<div className="flex items-start">
									<span className="text-neutral-400 mr-2">•</span>
									<span>Provide contact details</span>
								</div>
								<div className="flex items-start">
									<span className="text-neutral-400 mr-2">•</span>
									<span>Receive email confirmation</span>
								</div>
							</div>
						</motion.div>
					</div>
				</div>
			</section>

			{/* Timing Information */}
			<section className="py-16 px-4">
				<div className="max-w-4xl mx-auto">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className="text-center mb-12">
						<h2 className="text-4xl font-light tracking-widest text-neutral-800 mb-6">
							COLLECTION TIMING
						</h2>
						<div className="w-24 h-px bg-neutral-300 mx-auto mb-8"></div>
						<p className="text-xl text-neutral-500 max-w-3xl mx-auto leading-relaxed">
							Our collection times are designed to ensure you receive the freshest products possible.
						</p>
					</motion.div>

					<div className="grid md:grid-cols-3 gap-8">
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6 }}
							className="text-center bg-neutral-50 border border-neutral-200 p-8"
						>
							<Clock className="w-12 h-12 mx-auto mb-6 text-neutral-600" />
							<h4 className="text-xl font-light tracking-wide text-neutral-800 mb-4">
								Same Day
							</h4>
							<div className="w-12 h-px bg-neutral-300 mx-auto mb-6"></div>
							<p className="text-neutral-500 leading-relaxed mb-4">
								Order before 12 PM for same-day collection during our business hours.
							</p>
							<div className="bg-white p-4 border border-neutral-200">
								<p className="text-sm text-neutral-600">
									<span className="tracking-wider uppercase text-xs text-neutral-400">Available:</span><br />
									Orders placed before 12:00 PM
								</p>
							</div>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.1 }}
							className="text-center bg-neutral-50 border border-neutral-200 p-8"
						>
							<div className="w-12 h-12 mx-auto mb-6 flex items-center justify-center border-2 border-neutral-200 text-neutral-600 rounded-full">
								<span className="text-lg">📦</span>
							</div>
							<h4 className="text-xl font-light tracking-wide text-neutral-800 mb-4">
								Standard Orders
							</h4>
							<div className="w-12 h-px bg-neutral-300 mx-auto mb-6"></div>
							<p className="text-neutral-500 leading-relaxed mb-4">
								Standard orders are ready within 24-48 hours during business days for optimal freshness.
							</p>
							<div className="bg-white p-4 border border-neutral-200">
								<p className="text-sm text-neutral-600">
									<span className="tracking-wider uppercase text-xs text-neutral-400">Timeline:</span><br />
									24-48 hours from order
								</p>
							</div>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.2 }}
							className="text-center bg-neutral-50 border border-neutral-200 p-8"
						>
							<Award className="w-12 h-12 mx-auto mb-6 text-neutral-600" />
							<h4 className="text-xl font-light tracking-wide text-neutral-800 mb-4">
								Confirmation
							</h4>
							<div className="w-12 h-px bg-neutral-300 mx-auto mb-6"></div>
							<p className="text-neutral-500 leading-relaxed mb-4">
								Email confirmation sent with collection details and preparation timeline.
							</p>
							<div className="bg-white p-4 border border-neutral-200">
								<p className="text-sm text-neutral-600">
									<span className="tracking-wider uppercase text-xs text-neutral-400">Includes:</span><br />
									Order details & collection time
								</p>
							</div>
						</motion.div>
					</div>
				</div>
			</section>

			{/* Important Notice */}
			<section className="py-16 px-4 bg-neutral-50">
				<div className="max-w-4xl mx-auto text-center">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
					>
						<div className="bg-white border-2 border-neutral-200 p-10 max-w-2xl mx-auto">
							<h3 className="text-lg font-light tracking-wide text-neutral-800 mb-4">
								Important Notice
							</h3>
							<div className="w-16 h-px bg-neutral-300 mx-auto mb-6"></div>
							<p className="text-neutral-600 text-lg leading-relaxed">
								Orders placed after 2 PM may be processed the following business day to ensure optimal freshness and maintain our quality standards.
							</p>
						</div>
					</motion.div>
				</div>
			</section>

			{/* Call to Action */}
			<section className="py-16 px-4">
				<div className="max-w-4xl mx-auto text-center">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
					>
						<h2 className="text-4xl font-light tracking-widest text-neutral-800 mb-6">
							READY TO ORDER?
						</h2>
						<div className="w-24 h-px bg-neutral-300 mx-auto mb-8"></div>
						<p className="text-lg text-neutral-500 mb-12 max-w-2xl mx-auto leading-relaxed">
							Start browsing our fresh products and place your order for collection.
						</p>
						<div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
							<a
								href="/baked-goods"
								className="inline-flex items-center gap-3 bg-neutral-900 text-white px-8 py-4 text-sm font-medium tracking-wider uppercase hover:bg-neutral-800 transition-colors"
							>
								<ShoppingCart className="w-5 h-5" />
								<span>Browse Products</span>
							</a>
							<a
								href="/basket"
								className="text-neutral-600 text-sm tracking-wider uppercase border-b border-neutral-300 pb-1 hover:border-neutral-600 transition-colors"
							>
								View Basket
							</a>
						</div>
					</motion.div>
				</div>
			</section>

			{/* Contact Section */}
			<section className="py-16 px-4 bg-neutral-50">
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
							Need help with ordering? We're here to guide you through the process.
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
		</div>
	);
}