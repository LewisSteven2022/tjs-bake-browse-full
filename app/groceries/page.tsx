"use client";
import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";

export default function Page() {
	const [items, setItems] = useState<any[]>([]);
	useEffect(() => {
		fetch("/api/products?category=groceries")
			.then((r) => r.json())
			.then((j) => setItems(j.products || []));
	}, []);
	return (
		<section className="space-y-4">
			<h1 className="text-2xl font-semibold">Groceries</h1>
			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
				{items.map((p: any) => (
					<ProductCard key={p.id} p={p} />
				))}
			</div>
		</section>
	);
}
