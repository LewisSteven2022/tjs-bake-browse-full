// lib/cart.ts — localStorage cart implementation with server API structure ready

export type CartItem = {
	product_id: string;
	name: string;
	price_pence: number;
	image_url?: string | null;
	qty: number;
};

// --- localStorage Cart Implementation ---
const CART_KEY = "tjs-cart";

function getCartFromStorage(): CartItem[] {
	if (typeof window === "undefined") return [];
	try {
		const stored = localStorage.getItem(CART_KEY);
		return stored ? JSON.parse(stored) : [];
	} catch {
		return [];
	}
}

function saveCartToStorage(items: CartItem[]): void {
	if (typeof window === "undefined") return;
	try {
		localStorage.setItem(CART_KEY, JSON.stringify(items));
	} catch {
		// silent
	}
}

function findCartItem(
	items: CartItem[],
	product_id: string
): CartItem | undefined {
	return items.find((item) => item.product_id === product_id);
}

// --- Core Cart Functions (localStorage-based) ---
export async function getCart(): Promise<CartItem[]> {
	return getCartFromStorage();
}

export async function addItem(newItem: CartItem): Promise<void> {
	const items = getCartFromStorage();
	const existingItem = findCartItem(items, newItem.product_id);

	if (existingItem) {
		// Update quantity if item already exists
		existingItem.qty += newItem.qty;
	} else {
		// Add new item
		items.push(newItem);
	}

	saveCartToStorage(items);

	// Dispatch cart change event
	if (typeof window !== "undefined") {
		window.dispatchEvent(
			new CustomEvent("cart:changed", { detail: { delta: newItem.qty || 1 } })
		);
	}
}

export async function setQty(product_id: string, qty: number): Promise<void> {
	const items = getCartFromStorage();
	const item = findCartItem(items, product_id);

	if (item) {
		if (qty <= 0) {
			// Remove item if quantity is 0 or negative
			await removeItem(product_id);
		} else {
			item.qty = qty;
			saveCartToStorage(items);
		}
	}

	// Dispatch cart change event
	if (typeof window !== "undefined") {
		window.dispatchEvent(
			new CustomEvent("cart:changed", { detail: { recalc: true } })
		);
	}
}

export async function removeItem(product_id: string): Promise<void> {
	const items = getCartFromStorage();
	const filteredItems = items.filter((item) => item.product_id !== product_id);
	saveCartToStorage(filteredItems);

	// Dispatch cart change event
	if (typeof window !== "undefined") {
		window.dispatchEvent(
			new CustomEvent("cart:changed", { detail: { recalc: true } })
		);
	}
}

export async function clearCart(): Promise<void> {
	saveCartToStorage([]);

	// Dispatch cart change event
	if (typeof window !== "undefined") {
		window.dispatchEvent(
			new CustomEvent("cart:changed", { detail: { reset: true } })
		);
	}
}

// --- Utility Functions ---
export function getCartItemCount(): number {
	const items = getCartFromStorage();
	return items.reduce((total, item) => total + item.qty, 0);
}

export function getCartTotal(): number {
	const items = getCartFromStorage();
	return items.reduce((total, item) => total + item.price_pence * item.qty, 0);
}

// --- Legacy shims (keep existing imports working) ---
export const updateQty = setQty;

/**
 * setCart(items): naive replace. Clears current cart then re-adds the provided items.
 * Use sparingly (e.g., merging a local cart after sign-in).
 */
export async function setCart(items: CartItem[]): Promise<void> {
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

// --- Future Database Migration Support ---
// These functions are ready for when we implement database-backed cart
export async function syncCartWithServer(): Promise<void> {
	// TODO: Implement when database cart is ready
	// This will sync localStorage cart with server cart
}

export async function migrateToDatabaseCart(): Promise<void> {
	// TODO: Implement when database cart is ready
	// This will migrate localStorage cart to database
}
