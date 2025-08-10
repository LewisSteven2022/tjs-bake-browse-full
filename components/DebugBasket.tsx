"use client";
import { useEffect, useState } from "react";

export default function DebugBasket() {
	const [raw, setRaw] = useState<string>("");

	function refresh() {
		try {
			setRaw(localStorage.getItem("basket_v1") || "(null)");
		} catch {
			setRaw("(error reading localStorage)");
		}
	}

	useEffect(() => {
		refresh();
		const onStorage = (e: StorageEvent) => {
			if (e.key === "basket_v1") refresh();
		};
		window.addEventListener("storage", onStorage);
		return () => window.removeEventListener("storage", onStorage);
	}, []);

	return (
		<details className="mt-6 rounded-lg border p-3 bg-yellow-50 text-xs">
			<summary className="cursor-pointer font-medium">Debug: basket_v1</summary>
			<pre className="mt-2 whitespace-pre-wrap break-words">{raw}</pre>
			<div className="mt-2 flex gap-2">
				<button className="border px-2 py-1 rounded" onClick={refresh}>
					Refresh
				</button>
				<button
					className="border px-2 py-1 rounded"
					onClick={() => {
						localStorage.removeItem("basket_v1");
						refresh();
					}}>
					Clear basket_v1
				</button>
			</div>
		</details>
	);
}
