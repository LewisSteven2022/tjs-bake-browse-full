"use client";

import { motion } from "framer-motion";
import { ALLERGENS } from "./AllergenIcons";

// SVG icon component for each allergen
function AllergenIconSVG({ allergen }: { allergen: string }) {
	const allergenIconMap: { [key: string]: React.ReactElement } = {
		gluten: (
			<svg
				className="w-full h-full"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5">
				<path d="M12 2v20M2 12h20M6 6l12 12M18 6L6 18" />
			</svg>
		),
		milk: (
			<svg
				className="w-full h-full"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5">
				<path d="M8 2h8v4l-2 2v14H10V8l-2-2V2z" />
				<circle cx="12" cy="15" r="3" fill="currentColor" fillOpacity="0.2" />
			</svg>
		),
		eggs: (
			<svg
				className="w-full h-full"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5">
				<path d="M12 22c4 0 6-3 6-7 0-4-2-8-6-13-4 5-6 9-6 13 0 4 2 7 6 7z" />
			</svg>
		),
		nuts: (
			<svg
				className="w-full h-full"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5">
				<path d="M12 3c3 0 6 2 6 5v8c0 3-3 5-6 5s-6-2-6-5V8c0-3 3-5 6-5z" />
				<circle cx="12" cy="12" r="2" fill="currentColor" fillOpacity="0.3" />
			</svg>
		),
		soya: (
			<svg
				className="w-full h-full"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5">
				<circle cx="8" cy="8" r="4" />
				<circle cx="16" cy="16" r="4" />
				<path d="M12 8l4 8" />
			</svg>
		),
		sesame: (
			<svg
				className="w-full h-full"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5">
				<ellipse cx="12" cy="12" rx="8" ry="5" />
				<circle cx="10" cy="10" r="1" fill="currentColor" />
				<circle cx="14" cy="14" r="1" fill="currentColor" />
				<circle cx="12" cy="8" r="1" fill="currentColor" />
				<circle cx="8" cy="12" r="1" fill="currentColor" />
				<circle cx="16" cy="12" r="1" fill="currentColor" />
			</svg>
		),
		fish: (
			<svg
				className="w-full h-full"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5">
				<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
				<path d="M12 5v14" />
				<path d="M8 8l8 8" />
			</svg>
		),
		peanuts: (
			<svg
				className="w-full h-full"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5">
				<path d="M8 4c-2 0-4 2-4 4s2 4 4 4c0 2 2 4 4 4s4-2 4-4c2 0 4-2 4-4s-2-4-4-4c0-2-2-4-4-4s-4 2-4 4z" />
			</svg>
		),
		crustaceans: (
			<svg
				className="w-full h-full"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5">
				<path d="M4 12c0-4 4-8 8-8s8 4 8 8-4 8-8 8-8-4-8-8z" />
				<path d="M8 10l8 4M16 10l-8 4" />
			</svg>
		),
		molluscs: (
			<svg
				className="w-full h-full"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5">
				<path d="M12 2c-5 0-9 4-9 9s4 9 9 9 9-4 9-9-4-9-9-9z" />
				<path d="M8 12h8" />
			</svg>
		),
		"sulphur dioxide": (
			<svg
				className="w-full h-full"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5">
				<circle cx="12" cy="12" r="9" />
				<path d="M8 8l8 8M16 8l-8 8" />
			</svg>
		),
		sulphur_dioxide: (
			<svg
				className="w-full h-full"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5">
				<circle cx="12" cy="12" r="9" />
				<path d="M8 8l8 8M16 8l-8 8" />
			</svg>
		),
		lupin: (
			<svg
				className="w-full h-full"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5">
				<path d="M12 2l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6z" />
			</svg>
		),
		mustard: (
			<svg
				className="w-full h-full"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5">
				<circle cx="12" cy="12" r="8" />
				<circle cx="12" cy="8" r="2" fill="currentColor" fillOpacity="0.3" />
				<circle cx="8" cy="14" r="1.5" fill="currentColor" fillOpacity="0.3" />
				<circle cx="16" cy="14" r="1.5" fill="currentColor" fillOpacity="0.3" />
			</svg>
		),
		celery: (
			<svg
				className="w-full h-full"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5">
				<path d="M6 20V4l6 6 6-6v16" />
				<path d="M6 8h12M6 12h12M6 16h12" />
			</svg>
		),
	};

	const normalizedAllergen = allergen.toLowerCase().replace(/\s+/g, '_');
	return allergenIconMap[normalizedAllergen] || allergenIconMap.gluten;
}

interface AllergenLegendProps {
	title?: string;
	variant?: "default" | "compact" | "full";
	showTitle?: boolean;
}

export default function AllergenLegend({ 
	title = "Allergen Guide", 
	variant = "default",
	showTitle = true 
}: AllergenLegendProps) {
	const allergenList = Object.entries(ALLERGENS);

	if (variant === "compact") {
		return (
			<div className="bg-white border border-neutral-200 p-6">
				{showTitle && (
					<>
						<h3 className="text-lg font-light tracking-wide text-neutral-800 text-center mb-4">
							{title}
						</h3>
						<div className="w-16 h-px bg-neutral-300 mx-auto mb-6"></div>
					</>
				)}
				<div className="grid grid-cols-4 md:grid-cols-7 gap-4">
					{allergenList.slice(0, 7).map(([key, allergen]) => (
						<motion.div
							key={key}
							initial={{ opacity: 0, y: 10 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.3, delay: allergenList.indexOf([key, allergen]) * 0.05 }}
							className="text-center group"
						>
							<div className="w-8 h-8 mx-auto mb-2 text-neutral-500 group-hover:text-neutral-700 transition-colors">
								<AllergenIconSVG allergen={key} />
							</div>
							<p className="text-xs text-neutral-600 tracking-wide font-light">
								{allergen.label}
							</p>
						</motion.div>
					))}
				</div>
				<p className="text-xs text-neutral-400 text-center mt-4 tracking-wide">
					Hover over icons for allergen names
				</p>
			</div>
		);
	}

	if (variant === "full") {
		return (
			<div className="bg-white border border-neutral-200 p-8">
				{showTitle && (
					<>
						<h3 className="text-2xl font-light tracking-wide text-neutral-800 text-center mb-6">
							{title}
						</h3>
						<div className="w-24 h-px bg-neutral-300 mx-auto mb-8"></div>
						<p className="text-neutral-500 text-center leading-relaxed mb-8 max-w-2xl mx-auto">
							We use clear, simple icons to help you identify allergens at a glance. All products are clearly labeled with relevant allergen information.
						</p>
					</>
				)}
				
				<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6 mb-8">
					{allergenList.map(([key, allergen], index) => (
						<motion.div
							key={key}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.4, delay: index * 0.05 }}
							className="text-center group cursor-pointer p-4 border border-neutral-100 hover:border-neutral-200 transition-colors"
						>
							<div className="w-12 h-12 mx-auto mb-4 text-neutral-500 group-hover:text-neutral-700 transition-colors">
								<AllergenIconSVG allergen={key} />
							</div>
							<h4 className="text-sm font-light tracking-wide text-neutral-800 mb-2">
								{allergen.label}
							</h4>
							<div className="w-8 h-px bg-neutral-300 mx-auto group-hover:bg-neutral-400 transition-colors"></div>
						</motion.div>
					))}
				</div>

				<div className="bg-neutral-50 border border-neutral-200 p-6 text-center">
					<p className="text-sm text-neutral-600 leading-relaxed">
						<strong>Important:</strong> While we maintain a dedicated gluten-free facility, please contact us directly if you have severe allergies or specific dietary requirements.
					</p>
				</div>
			</div>
		);
	}

	// Default variant
	return (
		<div className="bg-white border border-neutral-200 p-6">
			{showTitle && (
				<>
					<h3 className="text-xl font-light tracking-wide text-neutral-800 text-center mb-4">
						{title}
					</h3>
					<div className="w-16 h-px bg-neutral-300 mx-auto mb-6"></div>
				</>
			)}
			
			<div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4 mb-6">
				{allergenList.map(([key, allergen], index) => (
					<motion.div
						key={key}
						initial={{ opacity: 0, y: 15 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.3, delay: index * 0.04 }}
						className="text-center group"
						title={allergen.label}
					>
						<div className="w-10 h-10 mx-auto mb-3 text-neutral-500 group-hover:text-neutral-700 transition-colors">
							<AllergenIconSVG allergen={key} />
						</div>
						<p className="text-xs text-neutral-600 tracking-wide font-light">
							{allergen.label}
						</p>
					</motion.div>
				))}
			</div>

			<p className="text-xs text-neutral-400 text-center tracking-wide">
				All allergen information is clearly displayed on each product
			</p>
		</div>
	);
}

// Usage examples:
// <AllergenLegend /> - Default layout
// <AllergenLegend variant="compact" /> - Compact for sidebars
// <AllergenLegend variant="full" title="Complete Allergen Information" /> - Full detail page
// <AllergenLegend showTitle={false} /> - Without title