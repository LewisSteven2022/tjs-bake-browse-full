// lib/checkout.ts
export type BasketItem = {
	product_id: string;
	name: string;
	price_pence: number;
	qty: number;
};
export type CheckoutPayload = {
	pickup_date: string; // ISO date, e.g. "2025-01-12"
	pickup_time: string; // "HH:mm"
	bag: boolean;
};

const BAG_SURCHARGE_PENCE = 70;

export function readBasket(): BasketItem[] {
	try {
		return JSON.parse(localStorage.getItem("basket_v1") || "[]");
	} catch {
		return [];
	}
}

export function calcTotalPence(items: BasketItem[], bag: boolean) {
	const sum = items.reduce((acc, it) => acc + it.price_pence * it.qty, 0);
	return sum + (bag ? BAG_SURCHARGE_PENCE : 0);
}

// Jersey time helpers
function nowInJersey() {
	// crude but sufficient for client-side: rely on local time (you’re in Jersey)
	return new Date();
}

export function validatePickup(dateISO: string, timeHHmm: string) {
	if (!dateISO || !timeHHmm) return "Please choose a collection date and time.";
	const d = new Date(`${dateISO}T${timeHHmm}:00`);
	const now = nowInJersey();

	// Block Sundays
	if (d.getDay() === 0) return "No Sunday collections.";

	// Limit to <= 7 days ahead (inclusive)
	const max = new Date(now);
	max.setDate(max.getDate() + 7);
	const onlyDate = new Date(dateISO + "T00:00:00");
	const today = new Date(now.toISOString().slice(0, 10) + "T00:00:00");
	if (onlyDate < today) return "Collection date cannot be in the past.";
	if (onlyDate > max) return "Collection date must be within 7 days.";

	// Same-day cut-off 12:00 Jersey
	const sameDay = onlyDate.getTime() === today.getTime();
	if (sameDay) {
		const cutoff = new Date(today);
		cutoff.setHours(12, 0, 0, 0); // 12:00
		if (now > cutoff) return "Same-day orders must be placed before 12:00.";
	}

	// 30-min slot sanity (basic check)
	const [hh, mm] = timeHHmm.split(":").map(Number);
	if (!(mm === 0 || mm === 30)) return "Please choose a 30-minute time slot.";

	return null; // valid
}

export async function submitOrder(payload: CheckoutPayload) {
	const items = readBasket();
	if (!items.length) throw new Error("Your basket is empty.");

	const total_pence = calcTotalPence(items, payload.bag);

	// Minimal, safe order number for now (server can generate later)
	const order_number = `WEB-${Date.now()}`;

	const res = await fetch("/api/orders", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		// Your existing POST expects: order_number, status, pickup_date, pickup_time, total_pence
		body: JSON.stringify({
			order_number,
			status: "pending",
			pickup_date: payload.pickup_date,
			pickup_time: payload.pickup_time,
			total_pence,
			// OPTIONAL: if/when your API accepts items, include them:
			// items,
			bag: payload.bag,
		}),
	});

	if (!res.ok) {
		const { error } = await res
			.json()
			.catch(() => ({ error: "Failed to place order." }));
		throw new Error(error || "Failed to place order.");
	}
	const json = await res.json();
	return json.order as { id: string; order_number: string };
}
