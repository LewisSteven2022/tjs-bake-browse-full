// lib/cart.ts
export type CartItem = {
	product_id: string;
	name: string;
	price_pence: number;
	qty: number;
};
const BASKET_KEY = "basket_v1";

function coerceItem(raw: any): CartItem | null {
	if (!raw) return null;
	const product_id = raw.product_id ?? raw.id ?? raw.productId;
	const name = raw.name ?? raw.title ?? "";
	const price_pence =
		Number(
			raw.price_pence ?? raw.pricePence ?? raw.price_pence_in_minor ?? raw.price
		) || 0;
	const qty = Number(raw.qty ?? raw.quantity ?? 1) || 1;
	if (!product_id || !name || price_pence <= 0 || qty <= 0) return null;
	return { product_id, name, price_pence, qty };
}

function collapse(items: CartItem[]): CartItem[] {
	const map = new Map<string, CartItem>();
	for (const i of items) {
		const ex = map.get(i.product_id);
		ex ? (ex.qty += i.qty) : map.set(i.product_id, { ...i });
	}
	return Array.from(map.values());
}

export function getCart(): CartItem[] {
	if (typeof window === "undefined") return [];
	const legacy = localStorage.getItem("basket"); // migrate once
	if (legacy) {
		try {
			const legacyItems = JSON.parse(legacy);
			const current = JSON.parse(localStorage.getItem(BASKET_KEY) || "[]");
			const merged = [...current, ...[].concat(legacyItems || [])]
				.map(coerceItem)
				.filter(Boolean) as CartItem[];
			localStorage.setItem(BASKET_KEY, JSON.stringify(collapse(merged)));
			localStorage.removeItem("basket");
		} catch {}
	}
	try {
		const raw = JSON.parse(localStorage.getItem(BASKET_KEY) || "[]");
		return collapse(
			(Array.isArray(raw) ? raw : [])
				.map(coerceItem)
				.filter(Boolean) as CartItem[]
		);
	} catch {
		return [];
	}
}

export function setCart(items: CartItem[]) {
	if (typeof window === "undefined") return;
	localStorage.setItem(BASKET_KEY, JSON.stringify(collapse(items)));
}

export function addItem(newItem: CartItem) {
	const item = coerceItem(newItem);
	if (!item) return;
	const cart = getCart();
	const existing = cart.find((i) => i.product_id === item.product_id);
	existing ? (existing.qty += item.qty) : cart.push(item);
	setCart(cart);
}

export function updateQty(product_id: string, qty: number) {
	const cart = getCart();
	const idx = cart.findIndex((i) => i.product_id === product_id);
	if (idx >= 0) {
		qty <= 0 ? cart.splice(idx, 1) : (cart[idx].qty = qty);
		setCart(cart);
	}
}

export function removeItem(product_id: string) {
	setCart(getCart().filter((i) => i.product_id !== product_id));
}
export function clearCart() {
	if (typeof window !== "undefined") localStorage.removeItem(BASKET_KEY);
}
export function subtotalPence(items: CartItem[]) {
	return items.reduce((sum, i) => sum + i.price_pence * i.qty, 0);
}
