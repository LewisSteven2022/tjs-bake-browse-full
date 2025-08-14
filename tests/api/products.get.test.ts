import { describe, it, expect, vi } from "vitest";

// Mock supabase-js createClient
vi.mock("@supabase/supabase-js", () => {
	const chain = () => ({
		select: vi.fn().mockReturnThis(),
		eq: vi.fn().mockReturnThis(),
		order: vi.fn().mockReturnThis(),
		then: (resolve: any) =>
			resolve({
				data: [
					{
						id: "p1",
						name: "Prod 1",
						sku: "SKU1",
						short_description: "Short",
						price_pence: 100,
						pack_label: null,
						allergens: [],
						ingredients: "",
						image_url: null,
						stock_quantity: 5,
						is_visible: true,
						category_id: null,
						created_at: "",
						updated_at: "",
						categories: { id: "c1", name: "Cat", slug: "cat", description: "" },
					},
				],
				error: null,
			}),
	});
	return {
		createClient: vi
			.fn()
			.mockReturnValue({ from: vi.fn().mockReturnValue(chain()) }),
	};
});

import { GET } from "@/app/api/products/route";

describe("GET /api/products", () => {
	it("returns normalized products", async () => {
		const res = await GET();
		expect(res.status).toBe(200);
		const j = await res.json();
		expect(Array.isArray(j.products)).toBe(true);
		const p = j.products[0];
		expect(p.visible).toBe(true);
		expect(p.stock).toBe(5);
		expect(Array.isArray(p.categories)).toBe(true);
	});
});
