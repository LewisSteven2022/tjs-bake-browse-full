"use client";

import { motion } from "framer-motion";
import { FileText, Shield, RotateCcw, Eye, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TermsPoliciesPage() {
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
						TERMS
					</motion.h2>
					<motion.h3
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.4 }}
						className="text-2xl md:text-3xl font-light tracking-wide text-neutral-600 mb-8">
						& Policies
					</motion.h3>
					<motion.p
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.6 }}
						className="text-lg text-neutral-500 max-w-2xl mx-auto leading-relaxed">
						Clear, transparent policies designed to ensure the best experience for all our customers.
					</motion.p>
				</div>
			</section>

			{/* Policy Cards Section */}
			<section className="py-16 px-4 bg-neutral-50">
				<div className="max-w-5xl mx-auto">
					<div className="grid md:grid-cols-2 gap-8">
						
						{/* Product Responsibility */}
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6 }}
							className="bg-white border border-neutral-200 p-10"
						>
							<div className="text-center mb-8">
								<Shield className="w-16 h-16 mx-auto mb-4 text-neutral-600" />
								<h3 className="text-2xl font-light tracking-wide text-neutral-800 mb-4">
									Product Responsibility
								</h3>
								<div className="w-16 h-px bg-neutral-300 mx-auto"></div>
							</div>
							<div className="space-y-6">
								<p className="text-neutral-600 leading-relaxed">
									We maintain the highest safety and quality standards in our dedicated gluten-free facility. Every product is crafted with care and attention to detail.
								</p>
								<div className="bg-neutral-50 p-6 border border-neutral-200">
									<h4 className="text-sm tracking-wider uppercase text-neutral-400 mb-3">Important Notice</h4>
									<p className="text-neutral-700 leading-relaxed">
										While we take every precaution to ensure product safety, customers with severe allergies or coeliac disease should always consult with us directly before ordering to discuss specific requirements and safety protocols.
									</p>
								</div>
								<div className="space-y-4">
									<div className="flex items-start">
										<span className="w-6 h-6 flex items-center justify-center bg-neutral-100 rounded-full text-xs text-neutral-600 mr-4 mt-1 flex-shrink-0">✓</span>
										<p className="text-neutral-600 leading-relaxed">Dedicated gluten-free facility with strict contamination prevention</p>
									</div>
									<div className="flex items-start">
										<span className="w-6 h-6 flex items-center justify-center bg-neutral-100 rounded-full text-xs text-neutral-600 mr-4 mt-1 flex-shrink-0">✓</span>
										<p className="text-neutral-600 leading-relaxed">Regular ingredient supplier audits and quality checks</p>
									</div>
									<div className="flex items-start">
										<span className="w-6 h-6 flex items-center justify-center bg-neutral-100 rounded-full text-xs text-neutral-600 mr-4 mt-1 flex-shrink-0">✓</span>
										<p className="text-neutral-600 leading-relaxed">Clear allergen labeling and ingredient transparency</p>
									</div>
								</div>
							</div>
						</motion.div>

						{/* Order Changes */}
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.1 }}
							className="bg-white border border-neutral-200 p-10"
						>
							<div className="text-center mb-8">
								<FileText className="w-16 h-16 mx-auto mb-4 text-neutral-600" />
								<h3 className="text-2xl font-light tracking-wide text-neutral-800 mb-4">
									Order Changes
								</h3>
								<div className="w-16 h-px bg-neutral-300 mx-auto"></div>
							</div>
							<div className="space-y-6">
								<p className="text-neutral-600 leading-relaxed">
									We strive for complete accuracy in every order. Please check your items carefully upon collection to ensure everything meets your expectations.
								</p>
								<div className="bg-neutral-50 p-6 border border-neutral-200">
									<h4 className="text-sm tracking-wider uppercase text-neutral-400 mb-3">Collection Process</h4>
									<p className="text-neutral-700 leading-relaxed">
										Please check your order immediately at collection. Any discrepancies should be reported right away for quick resolution during business hours.
									</p>
								</div>
								<div className="space-y-4">
									<div className="flex items-start">
										<span className="w-6 h-6 flex items-center justify-center bg-neutral-100 rounded-full text-xs text-neutral-600 mr-4 mt-1 flex-shrink-0">1</span>
										<p className="text-neutral-600 leading-relaxed">Verify all items match your order confirmation</p>
									</div>
									<div className="flex items-start">
										<span className="w-6 h-6 flex items-center justify-center bg-neutral-100 rounded-full text-xs text-neutral-600 mr-4 mt-1 flex-shrink-0">2</span>
										<p className="text-neutral-600 leading-relaxed">Report any issues immediately to staff</p>
									</div>
									<div className="flex items-start">
										<span className="w-6 h-6 flex items-center justify-center bg-neutral-100 rounded-full text-xs text-neutral-600 mr-4 mt-1 flex-shrink-0">3</span>
										<p className="text-neutral-600 leading-relaxed">We'll resolve problems quickly and fairly</p>
									</div>
								</div>
							</div>
						</motion.div>

						{/* Cancellation Policy */}
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.2 }}
							className="bg-white border border-neutral-200 p-10"
						>
							<div className="text-center mb-8">
								<RotateCcw className="w-16 h-16 mx-auto mb-4 text-neutral-600" />
								<h3 className="text-2xl font-light tracking-wide text-neutral-800 mb-4">
									Cancellations
								</h3>
								<div className="w-16 h-px bg-neutral-300 mx-auto"></div>
							</div>
							<div className="space-y-6">
								<p className="text-neutral-600 leading-relaxed">
									We understand plans can change. Our flexible cancellation policy is designed to accommodate your needs while respecting our production schedule.
								</p>
								<div className="bg-neutral-50 p-6 border border-neutral-200">
									<h4 className="text-sm tracking-wider uppercase text-neutral-400 mb-3">Cancellation Timeline</h4>
									<p className="text-neutral-700 leading-relaxed">
										Standard orders can be cancelled up to 4 hours before your scheduled collection time. Custom or special orders may require longer notice periods.
									</p>
								</div>
								<div className="space-y-4">
									<div className="flex items-start">
										<span className="w-6 h-6 flex items-center justify-center bg-neutral-100 rounded-full text-xs text-neutral-600 mr-4 mt-1 flex-shrink-0">4h</span>
										<p className="text-neutral-600 leading-relaxed">Standard orders - 4 hours notice required</p>
									</div>
									<div className="flex items-start">
										<span className="w-6 h-6 flex items-center justify-center bg-neutral-100 rounded-full text-xs text-neutral-600 mr-4 mt-1 flex-shrink-0">24h</span>
										<p className="text-neutral-600 leading-relaxed">Custom orders - 24 hours notice preferred</p>
									</div>
									<div className="flex items-start">
										<span className="w-6 h-6 flex items-center justify-center bg-neutral-100 rounded-full text-xs text-neutral-600 mr-4 mt-1 flex-shrink-0">48h</span>
										<p className="text-neutral-600 leading-relaxed">Special occasion orders - 48 hours notice required</p>
									</div>
								</div>
							</div>
						</motion.div>

						{/* Privacy Policy */}
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.3 }}
							className="bg-white border border-neutral-200 p-10"
						>
							<div className="text-center mb-8">
								<Eye className="w-16 h-16 mx-auto mb-4 text-neutral-600" />
								<h3 className="text-2xl font-light tracking-wide text-neutral-800 mb-4">
									Your Privacy
								</h3>
								<div className="w-16 h-px bg-neutral-300 mx-auto"></div>
							</div>
							<div className="space-y-6">
								<p className="text-neutral-600 leading-relaxed">
									Your personal information is important to us. We collect only what's necessary to process your orders and provide excellent customer service.
								</p>
								<div className="bg-neutral-50 p-6 border border-neutral-200">
									<h4 className="text-sm tracking-wider uppercase text-neutral-400 mb-3">Data Protection</h4>
									<p className="text-neutral-700 leading-relaxed">
										Information collected is used solely for order processing and customer communication. We never share personal details with external parties.
									</p>
								</div>
								<div className="space-y-4">
									<div className="flex items-start">
										<span className="w-6 h-6 flex items-center justify-center bg-neutral-100 rounded-full text-xs text-neutral-600 mr-4 mt-1 flex-shrink-0">✓</span>
										<p className="text-neutral-600 leading-relaxed">Order processing and collection coordination only</p>
									</div>
									<div className="flex items-start">
										<span className="w-6 h-6 flex items-center justify-center bg-neutral-100 rounded-full text-xs text-neutral-600 mr-4 mt-1 flex-shrink-0">✓</span>
										<p className="text-neutral-600 leading-relaxed">No sharing with third parties or marketing companies</p>
									</div>
									<div className="flex items-start">
										<span className="w-6 h-6 flex items-center justify-center bg-neutral-100 rounded-full text-xs text-neutral-600 mr-4 mt-1 flex-shrink-0">✓</span>
										<p className="text-neutral-600 leading-relaxed">Secure storage and handling of all customer data</p>
									</div>
								</div>
							</div>
						</motion.div>

					</div>
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
						<h2 className="text-3xl font-light tracking-widest text-neutral-800 mb-4">
							QUESTIONS ABOUT OUR POLICIES?
						</h2>
						<div className="w-24 h-px bg-neutral-300 mx-auto mb-8"></div>
						<p className="text-lg text-neutral-500 mb-8 max-w-2xl mx-auto leading-relaxed">
							If you need clarification on any of our terms and policies, we're here to help explain everything clearly.
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