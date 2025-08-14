import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
// Ensure React in scope for components using JSX (older transform behaviour)
// Some environments still require explicit React import
import NavBasket from "@/components/NavBasket";
import NavAuth from "@/components/NavAuth";

vi.mock("next-auth/react", async () => {
	const actual: any = await vi.importActual("next-auth/react");
	return {
		...actual,
		useSession: () => ({ data: null, status: "unauthenticated" }),
		signOut: vi.fn(),
	};
});

vi.mock("@/components/CartContext", () => ({
	useCart: () => ({ itemCount: 3, loading: false }),
}));

describe("Nav components", () => {
	it("NavBasket shows count", () => {
		const { getByLabelText } = render(<NavBasket />);
		expect(getByLabelText(/Basket with 3 items?/)).toBeTruthy();
	});

	it("NavAuth shows Sign In/Register when unauthenticated", () => {
		const { getByText } = render(<NavAuth />);
		expect(getByText("Sign In")).toBeTruthy();
		expect(getByText("Register")).toBeTruthy();
	});
});
