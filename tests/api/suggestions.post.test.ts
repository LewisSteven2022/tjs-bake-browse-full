import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock next-auth session for authenticated user
vi.mock("next-auth", () => ({
	getServerSession: vi.fn().mockResolvedValue({
		user: { id: "uid", name: "Jane", email: "jane@example.com" },
	}),
}));

// Mock sendEmail
vi.mock("@/lib/email", () => ({
	sendEmail: vi.fn().mockResolvedValue(undefined),
}));

// Mock DB admin client
vi.mock("@/lib/db", () => ({
	admin: {
		from: vi.fn().mockReturnValue({
			insert: vi.fn().mockReturnThis(),
			single: vi.fn().mockResolvedValue({ data: { id: "sid" }, error: null }),
		}),
	},
}));

import { POST } from "@/app/api/suggestions/route";

const makeReq = (body: any) =>
	new Request("http://localhost/api/suggestions", {
		method: "POST",
		body: JSON.stringify(body),
		headers: { "Content-Type": "application/json" },
	});

describe("POST /api/suggestions", () => {
	it("validates required fields", async () => {
		// Missing fields
		const res = await POST(makeReq({}) as any);
		expect(res.status).toBe(400);
		const j = await res.json();
		expect(j.error).toBeDefined();
	});

	it("creates a suggestion (happy path)", async () => {
		const res = await POST(
			makeReq({ subject: "Idea", message: "Do X", category: "general" }) as any
		);
		expect(res.status).toBe(200);
		const j = await res.json();
		expect(j.message).toMatch(/successfully/i);
		expect(j.suggestion_id).toBe("sid");
	});
});
