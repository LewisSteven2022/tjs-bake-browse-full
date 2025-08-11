"use client";
import React from "react";

// Canonical allergen keys → label and icon path under /public/icons/allergens
export const ALLERGENS: Record<string, { label: string; icon: string }> = {
	celery: { label: "Celery", icon: "/icons/allergens/celery.svg" },
	cereals_containing_gluten: {
		label: "Cereals containing gluten",
		icon: "/icons/allergens/cereals_containing_gluten.svg",
	},
	crustaceans: {
		label: "Crustaceans",
		icon: "/icons/allergens/crustaceans.svg",
	},
	eggs: { label: "Eggs", icon: "/icons/allergens/eggs.svg" },
	fish: { label: "Fish", icon: "/icons/allergens/fish.svg" },
	lupin: { label: "Lupin", icon: "/icons/allergens/lupin.svg" },
	milk: { label: "Milk", icon: "/icons/allergens/milk.svg" },
	molluscs: { label: "Molluscs", icon: "/icons/allergens/molluscs.svg" },
	mustard: { label: "Mustard", icon: "/icons/allergens/mustard.svg" },
	peanuts: { label: "Peanuts", icon: "/icons/allergens/peanuts.svg" },
	sesame: { label: "Sesame", icon: "/icons/allergens/sesame.svg" },
	soya: { label: "Soya", icon: "/icons/allergens/soya.svg" },
	sulphur_dioxide: {
		label: "Sulphur dioxide",
		icon: "/icons/allergens/sulphur_dioxide.svg",
	},
	tree_nuts: { label: "Tree nuts", icon: "/icons/allergens/tree_nuts.svg" },
};

export type AllergenKey = keyof typeof ALLERGENS;

function parseAllergens(input: unknown): AllergenKey[] {
	if (!input) return [];
	if (Array.isArray(input)) {
		return input
			.map((x) => (typeof x === "string" ? x.trim() : ""))
			.filter((k): k is AllergenKey => Boolean(ALLERGENS[k]));
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

export default function AllergenIcons({
	allergens,
	size = 16,
	showLabels = true,
}: {
	allergens: unknown; // string[] | string (JSON) | null
	size?: number;
	showLabels?: boolean;
}) {
	const keys = parseAllergens(allergens);
	if (!keys.length) return null;
	return (
		<div className="mt-2 flex flex-wrap gap-2" aria-label="Allergens">
			{keys.map((k) => (
				<span
					key={k}
					className="inline-flex items-center gap-2 rounded-full border bg-white px-2.5 py-1 text-xs text-gray-700 shadow-sm">
					<img
						src={ALLERGENS[k].icon}
						alt={ALLERGENS[k].label}
						title={ALLERGENS[k].label}
						width={size}
						height={size}
						loading="lazy"
						className="opacity-90"
						style={{ filter: "grayscale(100%) contrast(1.1) brightness(0.9)" }}
					/>
					{showLabels && <span>{ALLERGENS[k].label}</span>}
				</span>
			))}
		</div>
	);
}
