"use client";
import { useState } from "react";

type Product = {
	id: string;
	name: string;
	price_pence: number;
	pack_label?: string | null;
	short_description?: string | null;
	image_url?: string | null;
	allergens?: string[] | null;
};

function writeBasket(p: Product) {
	const key = "basket_v1";
	const current = JSON.parse(localStorage.getItem(key) || "[]");
	const idx = current.findIndex((x: any) => x.product_id === p.id);
	if (idx >= 0) current[idx].qty += 1;
	else
		current.push({
			product_id: p.id,
			name: p.name,
			price_pence: p.price_pence,
			qty: 1,
		});
	localStorage.setItem(key, JSON.stringify(current));
}

function badgeLabel(code: string) {
	// Map DB allergen keys -> label letter(s)
	const map: Record<string, string> = {
		cereals_containing_gluten: "G",
		milk: "D",
		tree_nuts: "N",
		eggs: "E",
		soya: "S",
		peanuts: "P",
		sesame: "SE",
		fish: "F",
		crustaceans: "CR",
		molluscs: "MO",
		celery: "CE",
		mustard: "MU",
		lupin: "L",
		sulphur_dioxide: "SO2",
	};
	return map[code] ?? code.toUpperCase().slice(0, 2);
}

function AllergenBadges({ list }: { list: string[] }) {
	if (!list?.length) return null;
	return (
		<div className="flex flex-wrap gap-1 mt-1" aria-label="Allergens">
			{list.map((a) => (
				<span
					key={a}
					title={a.replaceAll("_", " ")}
					className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-[10px] font-semibold"
					aria-label={a.replaceAll("_", " ")}>
					{badgeLabel(a)}
				</span>
			))}
		</div>
	);
}

export default function ProductCard({ p }: { p: Product }) {
	const [justAdded, setJustAdded] = useState(false);
	const price = `£${(p.price_pence / 100).toFixed(2)}`;
	const allergens = p.allergens || [];

	async function onAdd() {
		writeBasket(p);
		setJustAdded(true);
		setTimeout(() => setJustAdded(false), 1200);
	}

	return (
		<div className="rounded-2xl border bg-white overflow-hidden flex flex-col shadow-sm">
			<img
				src={p.image_url || "/images/placeholder.svg"}
				alt={p.name}
				className="w-full h-48 object-cover"
				loading="lazy"
				decoding="async"
				onError={(e) => {
					const img = e.currentTarget as HTMLImageElement;
					img.onerror = null; // prevent loops
					img.src = "/images/placeholder.svg";
				}}
			/>

			<div className="p-3 flex-1 flex flex-col gap-2">
				<div className="font-medium">{p.name}</div>
				{p.pack_label && (
					<div className="text-xs text-gray-500">{p.pack_label}</div>
				)}
				<div className="text-sm text-gray-600 line-clamp-2">
					{p.short_description}
				</div>
				<AllergenBadges list={allergens} />
				<div className="flex items-center justify-between mt-auto">
					<span className="font-semibold">{price}</span>
					<button
						className={`rounded-xl px-3 py-1 text-white transition ${
							justAdded ? "bg-green-500" : "bg-blue-400 hover:bg-blue-500"
						}`}
						onClick={onAdd}
						disabled={justAdded}
						aria-live="polite">
						{justAdded ? "Added ✓" : "Add to basket"}
					</button>
				</div>
			</div>
		</div>
	);
}
