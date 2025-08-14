import React from "react";
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import PremiumNotification from "@/components/PremiumNotification";

describe("component smoke", () => {
	it("renders PremiumNotification", () => {
		const { getByText } = render(
			<PremiumNotification id="1" title="Hello" message="World" />
		);
		expect(getByText("Hello")).toBeTruthy();
	});
});
