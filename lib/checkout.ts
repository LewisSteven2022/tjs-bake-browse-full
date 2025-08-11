// lib/checkout.ts
// Shared helpers for basket + checkout + orders

import { setCart, getCart, type CartItem } from "@/lib/cart";

export type BasketItem = CartItem; // keep one canonical shape
export const BAG_PENCE = 70;

// Money
export function formatGBP(pence: number) {
	return `£${(pence / 100).toFixed(2)}`;
}

// Date/time helpers
export function todayISO(now: Date = new Date()) {
	// Return YYYY-MM-DD in local time without UTC conversion
	const year = now.getFullYear();
	const month = String(now.getMonth() + 1).padStart(2, "0");
	const day = String(now.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
}

export function formatLongDate(iso?: string | null) {
	if (!iso) return "";
	const d = new Date(`${iso}T00:00:00`);
	if (isNaN(d.getTime())) return "";

	const weekday = d.toLocaleDateString("en-GB", { weekday: "long" });
	const day = d.getDate();
	const month = d.toLocaleDateString("en-GB", { month: "long" });
	const year = d.getFullYear();

	// ordinal suffix (1st, 2nd, 3rd, 4th…)
	const j = day % 10;
	const k = day % 100;
	let suffix = "th";
	if (j === 1 && k !== 11) suffix = "st";
	else if (j === 2 && k !== 12) suffix = "nd";
	else if (j === 3 && k !== 13) suffix = "rd";

	return `${weekday} ${day}${suffix} ${month} ${year}`;
}

export function addDaysISO(iso: string, days: number) {
	const d = new Date(`${iso}T00:00:00`);
	d.setDate(d.getDate() + days);
	const year = d.getFullYear();
	const month = String(d.getMonth() + 1).padStart(2, "0");
	const day = String(d.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
}

export function isSunday(iso: string) {
	const d = new Date(`${iso}T00:00:00`);
	return d.getDay() === 0;
}

// Same-day cutoff at 12:00 local time
export function sameDayCutoffApplies(now = new Date()) {
	const h = now.getHours();
	const m = now.getMinutes();
	return h > 12 || (h === 12 && m >= 0);
}

export function computeDateBounds(now = new Date()) {
	// Start with today or tomorrow depending on the 11:59 cutoff
	const base = todayISO(now);
	let earliest = sameDayCutoffApplies(now) ? addDaysISO(base, 1) : base;
	// Skip Sundays entirely
	while (isSunday(earliest)) {
		earliest = addDaysISO(earliest, 1);
	}
	const max = addDaysISO(earliest, 7);
	return { minDate: earliest, maxDate: max };
}

// Time slots (default 30-minute windows 09:00–17:30)
export function buildSlots(start = "09:00", end = "17:30", stepMins = 30) {
	const [sh, sm] = start.split(":").map(Number);
	const [eh, em] = end.split(":").map(Number);
	const out: string[] = [];
	let h = sh;
	let m = sm;
	while (h < eh || (h === eh && m <= em)) {
		out.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
		m += stepMins;
		if (m >= 60) {
			h += 1;
			m -= 60;
		}
	}
	return out;
}

// ---- Basket storage ----

function normalizeToCartItem(raw: any): CartItem | null {
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

/** Always return an array (never null/undefined) */
export function readBasketFromStorage(): BasketItem[] {
	const cart = getCart();
	return Array.isArray(cart) ? cart : [];
}

/** Write the entire basket atomically, normalized & collapsed. */
export function writeBasketToStorage(items: BasketItem[]) {
	const normalized = (Array.isArray(items) ? items : [])
		.map(normalizeToCartItem)
		.filter(Boolean) as CartItem[];
	setCart(normalized);
}

export function clearBasketStorage() {
	if (typeof window !== "undefined") {
		localStorage.removeItem("basket_v1");
		localStorage.removeItem("basket"); // legacy
	}
}

// Totals
export function calcSubtotal(items: BasketItem[]) {
	return (Array.isArray(items) ? items : []).reduce(
		(s, it) => s + it.price_pence * it.qty,
		0
	);
}

export function calcGST(subtotalPence: number, bag: boolean) {
	const base = subtotalPence + (bag ? BAG_PENCE : 0);
	return Math.round(base * 0.06); // 6%
}

export function calcTotal(items: BasketItem[], bag: boolean) {
	const subtotal = calcSubtotal(items);
	const gst = calcGST(subtotal, bag);
	return subtotal + (bag ? BAG_PENCE : 0) + gst;
}
