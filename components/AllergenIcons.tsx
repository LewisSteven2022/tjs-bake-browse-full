"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";

// Clean Scandinavian-style SVG allergen icons
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
		"cereals containing gluten": (
			<svg
				className="w-full h-full"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5">
				<path d="M8 2l8 0c2 0 4 1 4 3v14c0 2-2 3-4 3l-8 0c-2 0-4-1-4-3V5c0-2 2-3 4-3z" />
				<path d="M8 7h8M8 12h8M8 17h6" />
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
		"tree nuts": (
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

	const normalizedAllergen = allergen.toLowerCase();
	return allergenIconMap[normalizedAllergen] || allergenIconMap.gluten;
}

// Canonical allergen keys → label mapping for backward compatibility
export const ALLERGENS: Record<string, { label: string; icon: string }> = {
	celery: { label: "Celery", icon: "/icons/allergens/celery.svg" },
	eggs: { label: "Eggs", icon: "/icons/allergens/eggs.svg" },
	milk: { label: "Milk", icon: "/icons/allergens/milk.svg" },
	mustard: { label: "Mustard", icon: "/icons/allergens/mustard.svg" },
	peanuts: { label: "Peanuts", icon: "/icons/allergens/peanuts.svg" },
	sesame: { label: "Sesame", icon: "/icons/allergens/sesame.svg" },
	soya: { label: "Soya", icon: "/icons/allergens/soya.svg" },
	sulphur_dioxide: {
		label: "Sulphur dioxide",
		icon: "/icons/allergens/sulphur_dioxide.svg",
	},
	nuts: { label: "Nuts", icon: "/icons/allergens/tree_nuts.svg" },
	gluten: { label: "Gluten", icon: "/icons/allergens/gluten.svg" },
	fish: { label: "Fish", icon: "/icons/allergens/fish.svg" },
	crustaceans: {
		label: "Crustaceans",
		icon: "/icons/allergens/crustaceans.svg",
	},
	molluscs: { label: "Molluscs", icon: "/icons/allergens/molluscs.svg" },
	lupin: { label: "Lupin", icon: "/icons/allergens/lupin.svg" },
};

export type AllergenKey = keyof typeof ALLERGENS;

// Parse allergens from various input formats
function parseAllergens(input: unknown): string[] {
	if (!input) return [];
	if (Array.isArray(input)) {
		return input
			.map((x) => (typeof x === "string" ? x.trim() : ""))
			.filter(Boolean);
	}
	if (typeof input === "string") {
		try {
			const arr = JSON.parse(input);
			if (Array.isArray(arr)) return parseAllergens(arr);
		} catch {
			// allow comma-separated as a fallback
			const arr = input.split(",").map((s) => s.trim());
			return parseAllergens(arr);
		}
	}
	return [];
}

// Modern click-to-reveal allergen icons component
export default function AllergenIcons({
	allergens,
	variant = "default", // "default" | "minimal"
}: {
	allergens: unknown; // string[] | string (JSON) | null
	variant?: "default" | "minimal";
}) {
	const [selectedAllergen, setSelectedAllergen] = useState<string | null>(null);
	const parsedAllergens = parseAllergens(allergens);

	if (!parsedAllergens.length) return null;

	const handleAllergenClick = (allergen: string) => {
		setSelectedAllergen(selectedAllergen === allergen ? null : allergen);
	};

	// Minimal variant for sophisticated designs
	if (variant === "minimal") {
		return (
			<div className="mt-4">
				<p className="text-xs text-neutral-400 uppercase tracking-widest mb-2">
					Contains
				</p>

				{/* Icons Row */}
				<div className="flex flex-wrap gap-2 mb-3">
					{parsedAllergens.slice(0, 6).map((allergen) => {
						const isSelected = selectedAllergen === allergen;

						return (
							<button
								key={allergen}
								onClick={() => handleAllergenClick(allergen)}
								className={`w-6 h-6 transition-colors cursor-pointer ${
									isSelected
										? "text-neutral-700"
										: "text-neutral-400 hover:text-neutral-600"
								}`}
								aria-label={`Click to reveal allergen: ${allergen}`}>
								<AllergenIconSVG allergen={allergen} />
							</button>
						);
					})}
					{parsedAllergens.length > 6 && (
						<button
							onClick={() => handleAllergenClick("more")}
							className="w-6 h-6 flex items-center justify-center cursor-pointer"
							aria-label="Click to see more allergens">
							<span className="text-xs text-neutral-400 font-light hover:text-neutral-600 transition-colors">
								+{parsedAllergens.length - 6}
							</span>
						</button>
					)}
				</div>

				{/* Selected Allergen Display */}
				{selectedAllergen && selectedAllergen !== "more" && (
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						className="text-xs text-neutral-600 bg-neutral-100 px-3 py-2 rounded tracking-wide">
						Contains: {selectedAllergen}
					</motion.div>
				)}

				{/* Show all allergens when "more" is clicked */}
				{selectedAllergen === "more" && parsedAllergens.length > 6 && (
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						className="text-xs text-neutral-600 bg-neutral-100 px-3 py-2 rounded tracking-wide">
						Contains: {parsedAllergens.join(", ")}
					</motion.div>
				)}
			</div>
		);
	}

	// Default variant for production cards
	return (
		<div className="mt-2">
			<p className="text-xs text-blue-600 font-medium mb-2">
				Contains allergens
			</p>

			{/* Icons Row */}
			<div className="flex flex-wrap gap-2 mb-3">
				{parsedAllergens.slice(0, 6).map((allergen) => {
					const isSelected = selectedAllergen === allergen;

					return (
						<button
							key={allergen}
							onClick={() => handleAllergenClick(allergen)}
							className={`w-6 h-6 transition-colors cursor-pointer ${
								isSelected
									? "text-blue-700"
									: "text-blue-500 hover:text-blue-600"
							}`}
							aria-label={`Click to reveal allergen: ${allergen}`}>
							<AllergenIconSVG allergen={allergen} />
						</button>
					);
				})}
				{parsedAllergens.length > 6 && (
					<button
						onClick={() => handleAllergenClick("more")}
						className="w-6 h-6 flex items-center justify-center cursor-pointer"
						aria-label="Click to see more allergens">
						<span className="text-xs text-blue-500 font-medium hover:text-blue-600 transition-colors">
							+{parsedAllergens.length - 6}
						</span>
					</button>
				)}
			</div>

			{/* Selected Allergen Display */}
			{selectedAllergen && selectedAllergen !== "more" && (
				<motion.div
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -10 }}
					className="text-xs text-blue-700 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
					Contains: <span className="font-medium">{selectedAllergen}</span>
				</motion.div>
			)}

			{/* Show all allergens when "more" is clicked */}
			{selectedAllergen === "more" && parsedAllergens.length > 6 && (
				<motion.div
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -10 }}
					className="text-xs text-blue-700 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
					Contains:{" "}
					<span className="font-medium">{parsedAllergens.join(", ")}</span>
				</motion.div>
			)}
		</div>
	);
}
