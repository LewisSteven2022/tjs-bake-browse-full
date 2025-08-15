"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Heart, Zap, Crown, ArrowRight, Eye } from "lucide-react";

const designs = [
	{
		title: "Minimal Elegance",
		description:
			"Clean, sophisticated design inspired by high-end Scandinavian bakeries. Features neutral colors, spacious layouts, and premium typography.",
		path: "/test-styling/minimal-elegance",
		icon: <Sparkles className="w-6 h-6" />,
		theme: "Monochrome & Minimal",
		colors: ["#F5F5F5", "#2D2D2D", "#FFFFFF"],
		features: [
			"Ultra-clean layout",
			"Premium typography",
			"Subtle animations",
			"Focus on product photography",
		],
	},
	{
		title: "Scandinavian Minimal",
		description:
			"Ultra-clean design with soft curves and light typography. Emphasizes natural simplicity and organic materials.",
		path: "/test-styling/scandinavian-minimal",
		icon: <Sparkles className="w-6 h-6" />,
		theme: "Nordic Simplicity",
		colors: ["#F8F9FA", "#6C757D", "#FFFFFF"],
		features: [
			"Soft rounded corners",
			"Light typography",
			"Natural aesthetics",
			"Breathing space",
		],
	},
	{
		title: "Modern Clean",
		description:
			"Contemporary design with subtle gradients and clean lines. Perfect balance of modern and approachable.",
		path: "/test-styling/modern-clean",
		icon: <Zap className="w-6 h-6" />,
		theme: "Clean & Modern",
		colors: ["#F8FAFC", "#334155", "#0F172A"],
		features: [
			"Subtle gradients",
			"Clean typography",
			"Modern aesthetics",
			"Professional feel",
		],
	},
	{
		title: "Sophisticated Mono",
		description:
			"Bold monochrome design with dramatic contrast. Black and white elegance with premium positioning.",
		path: "/test-styling/sophisticated-mono",
		icon: <Crown className="w-6 h-6" />,
		theme: "Monochrome Luxury",
		colors: ["#000000", "#FFFFFF", "#6B7280"],
		features: [
			"High contrast",
			"Dramatic typography",
			"Luxury feel",
			"Sophisticated layout",
		],
	},
	{
		title: "Elegant Curves",
		description:
			"Organic shapes and flowing design elements. Celebrates natural beauty with soft, curved aesthetics.",
		path: "/test-styling/elegant-curves",
		icon: <Heart className="w-6 h-6" />,
		theme: "Organic & Flowing",
		colors: ["#FDF2F8", "#EC4899", "#8B5CF6"],
		features: [
			"Organic shapes",
			"Flowing elements",
			"Natural beauty",
			"Soft aesthetics",
		],
	},
	{
		title: "Premium Simple",
		description:
			"Refined simplicity with premium materials and typography. Clean elegance without unnecessary elements.",
		path: "/test-styling/premium-simple",
		icon: <Crown className="w-6 h-6" />,
		theme: "Premium Minimal",
		colors: ["#FAFAF9", "#78716C", "#1C1917"],
		features: [
			"Premium materials",
			"Refined typography",
			"Clean elegance",
			"Sophisticated simplicity",
		],
	},
	{
		title: "Soft Modern",
		description:
			"Gentle modern design with soft blues and cloud-like elements. Contemporary but approachable and calming.",
		path: "/test-styling/soft-modern",
		icon: <Sparkles className="w-6 h-6" />,
		theme: "Soft & Gentle",
		colors: ["#EFF6FF", "#3B82F6", "#1E40AF"],
		features: [
			"Soft colors",
			"Gentle curves",
			"Calming atmosphere",
			"Modern comfort",
		],
	},
	{
		title: "Timeless Classic",
		description:
			"Traditional bakery aesthetic with vintage charm. Heritage-focused design that emphasizes family traditions.",
		path: "/test-styling/timeless-classic",
		icon: <Heart className="w-6 h-6" />,
		theme: "Heritage & Classic",
		colors: ["#FEF3C7", "#D97706", "#92400E"],
		features: [
			"Traditional aesthetic",
			"Vintage charm",
			"Family heritage",
			"Classic typography",
		],
	},
	{
		title: "Contemporary Clean",
		description:
			"Sharp, clean contemporary design. Modern lines and professional presentation for urban clientele.",
		path: "/test-styling/contemporary-clean",
		icon: <Zap className="w-6 h-6" />,
		theme: "Urban & Professional",
		colors: ["#FFFFFF", "#6B7280", "#111827"],
		features: [
			"Sharp lines",
			"Professional feel",
			"Urban aesthetic",
			"Contemporary design",
		],
	},
	{
		title: "Refined Minimal",
		description:
			"Ultra-refined minimalism with subtle accents. Sophisticated restraint with carefully considered details.",
		path: "/test-styling/refined-minimal",
		icon: <Crown className="w-6 h-6" />,
		theme: "Refined & Sophisticated",
		colors: ["#FAFAFA", "#737373", "#262626"],
		features: [
			"Ultra-refined",
			"Subtle accents",
			"Sophisticated restraint",
			"Considered details",
		],
	},
	{
		title: "Boutique Simple",
		description:
			"Charming boutique aesthetic with rose accents. Sweet and simple design with feminine touches and warmth.",
		path: "/test-styling/boutique-simple",
		icon: <Heart className="w-6 h-6" />,
		theme: "Sweet & Charming",
		colors: ["#FDF2F8", "#EC4899", "#BE185D"],
		features: [
			"Charming aesthetic",
			"Rose accents",
			"Sweet simplicity",
			"Feminine touches",
		],
	},
];

export default function TestStylingIndexPage() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
			{/* Header */}
			<header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
				<div className="max-w-7xl mx-auto px-4 py-6">
					<div className="flex items-center justify-between">
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.6 }}>
							<h1 className="text-3xl font-bold text-gray-900">
								TJ's Design Gallery
							</h1>
							<p className="text-sm text-gray-600 mt-1">
								Explore different UI/UX concepts for our bakery
							</p>
						</motion.div>

						<Link
							href="/"
							className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-medium transition-colors">
							← Back to Main Site
						</Link>
					</div>
				</div>
			</header>

			{/* Hero Section */}
			<section className="py-16 px-4">
				<div className="max-w-6xl mx-auto text-center">
					<motion.h2
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.2 }}
						className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
						Design
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
							{" "}
							Showcase
						</span>
					</motion.h2>
					<motion.p
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.4 }}
						className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
						Explore four distinct design approaches for TJ's Bakery, each
						targeting different customer personas and business positioning
						strategies. All designs work with our current product data and
						ordering system.
					</motion.p>
				</div>
			</section>

			{/* Design Cards */}
			<section className="py-12 px-4">
				<div className="max-w-7xl mx-auto">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{designs.map((design, index) => (
							<motion.div
								key={design.title}
								initial={{ opacity: 0, y: 50 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.6, delay: index * 0.1 }}
								className="group">
								<div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-gray-300">
									{/* Header */}
									<div className="bg-gradient-to-r from-gray-900 to-gray-700 text-white p-6">
										<div className="flex items-center gap-3 mb-3">
											<div className="p-2 bg-white/20 rounded-lg">
												{design.icon}
											</div>
											<div>
												<h3 className="text-xl font-bold">{design.title}</h3>
												<p className="text-sm text-gray-300">{design.theme}</p>
											</div>
										</div>

										{/* Color Palette */}
										<div className="flex items-center gap-2">
											<span className="text-xs text-gray-300">Colors:</span>
											{design.colors.map((color, i) => (
												<div
													key={i}
													className="w-4 h-4 rounded-full border-2 border-white/30"
													style={{ backgroundColor: color }}></div>
											))}
										</div>
									</div>

									{/* Content */}
									<div className="p-6">
										<p className="text-gray-600 leading-relaxed mb-6">
											{design.description}
										</p>

										{/* Features */}
										<div className="mb-6">
											<h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
												Key Features
											</h4>
											<div className="grid grid-cols-2 gap-2">
												{design.features.map((feature, i) => (
													<div
														key={i}
														className="flex items-center gap-2 text-sm text-gray-600">
														<div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
														{feature}
													</div>
												))}
											</div>
										</div>

										{/* Actions */}
										<div className="flex gap-3">
											<Link
												href={design.path}
												className="flex-1 bg-gray-900 hover:bg-gray-800 text-white px-4 py-3 rounded-lg font-medium text-center transition-all duration-300 flex items-center justify-center gap-2 group">
												<Eye className="w-4 h-4" />
												View Design
												<ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
											</Link>
											<button className="px-4 py-3 border border-gray-300 hover:border-gray-400 text-gray-700 rounded-lg font-medium transition-colors">
												Info
											</button>
										</div>
									</div>
								</div>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Technical Note */}
			<section className="py-16 px-4 bg-white/60 backdrop-blur-sm">
				<div className="max-w-4xl mx-auto">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className="text-center">
						<h3 className="text-2xl font-bold text-gray-900 mb-4">
							Technical Implementation
						</h3>
						<p className="text-lg text-gray-600 leading-relaxed mb-8">
							All designs are fully functional and integrate seamlessly with our
							existing:
						</p>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
								<h4 className="font-bold text-gray-900 mb-2">Product API</h4>
								<p className="text-sm text-gray-600">
									Live product data from{" "}
									<code className="bg-gray-100 px-2 py-1 rounded">
										/api/products
									</code>
								</p>
							</div>
							<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
								<h4 className="font-bold text-gray-900 mb-2">Cart System</h4>
								<p className="text-sm text-gray-600">
									Full shopping cart integration with{" "}
									<code className="bg-gray-100 px-2 py-1 rounded">
										addItem()
									</code>
								</p>
							</div>
							<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
								<h4 className="font-bold text-gray-900 mb-2">Responsive</h4>
								<p className="text-sm text-gray-600">
									Mobile-first design with Tailwind CSS and Framer Motion
								</p>
							</div>
						</div>

						<div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
							<p className="text-sm text-blue-700">
								<strong>Note:</strong> These are test pages that mirror real
								functionality without affecting the production site. All
								add-to-cart operations work with the live cart system.
							</p>
						</div>
					</motion.div>
				</div>
			</section>

			{/* Footer */}
			<footer className="bg-gray-900 text-white py-12 px-4">
				<div className="max-w-6xl mx-auto text-center">
					<h3 className="text-xl font-bold mb-2">TJ's Bakery Design Gallery</h3>
					<p className="text-gray-400 mb-6">
						Showcasing the future of our online bakery experience
					</p>
					<div className="flex justify-center gap-6 text-sm">
						<Link
							href="/"
							className="text-gray-300 hover:text-white transition-colors">
							Main Site
						</Link>
						<Link
							href="/about"
							className="text-gray-300 hover:text-white transition-colors">
							About
						</Link>
						<Link
							href="/baked-goods"
							className="text-gray-300 hover:text-white transition-colors">
							Products
						</Link>
						<Link
							href="/basket"
							className="text-gray-300 hover:text-white transition-colors">
							Cart
						</Link>
					</div>
					<div className="mt-8 text-xs text-gray-500">
						© 2024 TJ's Bakery. Design showcase for internal review.
					</div>
				</div>
			</footer>
		</div>
	);
}
