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
		<details className="mt-6 border border-neutral-200 p-4 bg-neutral-50">
			<summary className="cursor-pointer text-elegance-caption">
				Debug: basket_v1
			</summary>
			<pre className="mt-3 whitespace-pre-wrap break-words text-xs text-neutral-600">
				{raw}
			</pre>
			<div className="mt-3 flex gap-2">
				<button
					className="btn-elegance-ghost text-xs py-1 px-3"
					onClick={refresh}>
					Refresh
				</button>
				<button
					className="btn-elegance-ghost text-xs py-1 px-3"
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
