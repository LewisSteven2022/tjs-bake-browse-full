// lib/cart.ts — server-backed cart helpers with legacy shims

export type CartItem = {
	product_id: string;
	name: string;
	price_pence: number;
	qty: number;
};

// --- Core API (server-backed) ---
export async function getCart(): Promise<CartItem[]> {
	try {
		const res = await fetch("/api/cart", { cache: "no-store" });
		if (!res.ok) return [];
		const j = await res.json();
		return Array.isArray(j.items) ? j.items : [];
	} catch {
		return [];
	}
}

export async function addItem(i: CartItem) {
	const res = await fetch("/api/cart", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(i),
	});
	if (!res.ok) {
		const j = await res.json().catch(() => ({}));
		throw new Error(j?.error || "Add failed");
	}
	if (typeof window !== "undefined") {
		window.dispatchEvent(
			new CustomEvent("cart:changed", { detail: { delta: i.qty || 1 } })
		);
	}
}

export async function setQty(product_id: string, qty: number) {
	const res = await fetch("/api/cart", {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ product_id, qty }),
	});
	if (!res.ok) {
		const j = await res.json().catch(() => ({}));
		throw new Error(j?.error || "Update failed");
	}
	if (typeof window !== "undefined") {
		window.dispatchEvent(
			new CustomEvent("cart:changed", { detail: { recalc: true } })
		);
	}
}

export async function removeItem(product_id: string) {
	const res = await fetch("/api/cart", {
		method: "DELETE",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ product_id }),
	});
	if (!res.ok) {
		const j = await res.json().catch(() => ({}));
		throw new Error(j?.error || "Remove failed");
	}
	if (typeof window !== "undefined") {
		window.dispatchEvent(
			new CustomEvent("cart:changed", { detail: { recalc: true } })
		);
	}
}

export async function clearCart() {
	await fetch("/api/cart", {
		method: "DELETE",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ all: true }),
	});
	if (typeof window !== "undefined") {
		window.dispatchEvent(
			new CustomEvent("cart:changed", { detail: { reset: true } })
		);
	}
}

// --- Legacy shims (keep existing imports working) ---
// Some pages still import these names; map them to the new API.

export const updateQty = setQty;

/**
 * setCart(items): naive replace. Clears current cart then re-adds the provided items.
 * Use sparingly (e.g., merging a local cart after sign-in).
 */
export async function setCart(items: CartItem[]) {
	// Clear first
	await clearCart();
	// Re-add in parallel (preserves quantities)
	await Promise.all(
		(items || []).map((i) =>
			addItem({
				product_id: i.product_id,
				name: i.name,
				price_pence: i.price_pence,
				qty: i.qty,
			})
		)
	);
}
