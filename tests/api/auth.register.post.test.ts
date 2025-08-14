import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/db", () => ({
	admin: {
		from: vi.fn().mockReturnValue({
			select: vi.fn().mockReturnThis(),
			eq: vi.fn().mockReturnThis(),
			maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
			insert: vi.fn().mockReturnThis(),
			single: vi.fn().mockResolvedValue({ data: { id: "uid" }, error: null }),
		}),
	},
}));

import { POST } from "@/app/api/auth/register/route";

const makeReq = (body: any) =>
	new Request("http://localhost/api/auth/register", {
		method: "POST",
		body: JSON.stringify(body),
		headers: { "Content-Type": "application/json" },
	});

describe("POST /api/auth/register", () => {
	it("validates inputs", async () => {
		const res = await POST(makeReq({ email: "bad", password: "short" }) as any);
		expect(res.status).toBe(400);
	});

	it("returns 201 on success", async () => {
		const res = await POST(
			makeReq({
				name: "Jane",
				email: "jane@example.com",
				password: "password123",
			}) as any
		);
		expect(res.status).toBe(201);
		const j = await res.json();
		expect(j.ok).toBe(true);
		expect(j.id).toBe("uid");
	});
});
