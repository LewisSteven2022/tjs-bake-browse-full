// app/legal/page.tsx
import React from "react";

export const metadata = {
	title: "Legal Information & Terms | TJ's Bake & Browse",
	description:
		"Legal terms and compliance information for TJ's Bake & Browse, a Jersey-based baking and food business.",
};

export default function LegalPage() {
	return (
		<main className="max-w-4xl mx-auto px-4 py-12 text-gray-800">
			<h1 className="text-3xl font-bold mb-6">Legal Information & Terms</h1>
			<p className="text-sm text-gray-500 mb-8">
				Last updated: {new Date().toLocaleDateString("en-GB")}
			</p>

			<section className="mb-8">
				<h2 className="text-xl font-semibold mb-2">1. About Us</h2>
				<p>
					TJ’s Bake & Browse (“we”, “our”, “us”) is a UK-based business
					operating from a commercial food preparation unit. We specialise in
					baked goods and allergen-conscious food products.
				</p>
				<p className="mt-2">
					<strong>Contact:</strong> Email: tjsbakeandbrowse@gmail.com | Address:
					[Insert Address]
				</p>
			</section>

			<section className="mb-8">
				<h2 className="text-xl font-semibold mb-2">
					2. Licensing & Compliance
				</h2>
				<p>
					We are registered with our local authority as a food business under UK
					Food Safety Law and comply with The Food Safety Act 1990, Regulation
					(EC) 852/2004, and UK Hygiene Regulations. Our premises are inspected
					regularly by Environmental Health.
				</p>
			</section>

			<section className="mb-8">
				<h2 className="text-xl font-semibold mb-2">
					3. Allergen & Dietary Information
				</h2>
				<p>
					While we take care to avoid cross-contamination, we cannot guarantee
					products are 100% allergen-free. Customers must inform us of allergies
					before ordering. Full allergen details are available on request.
				</p>
			</section>

			<section className="mb-8">
				<h2 className="text-xl font-semibold mb-2">4. Ordering & Collection</h2>
				<ul className="list-disc ml-6 space-y-1">
					<li>Click & Collect only – no delivery service.</li>
					<li>Orders can be placed up to 7 days in advance.</li>
					<li>No Sunday collections.</li>
					<li>Payment taken in-store on collection.</li>
				</ul>
			</section>

			<section className="mb-8">
				<h2 className="text-xl font-semibold mb-2">
					5. Food Handling & Storage
				</h2>
				<p>
					Customers should consume baked goods within the recommended time frame
					and follow provided storage instructions. Responsibility passes to the
					customer after collection.
				</p>
			</section>

			<section className="mb-8">
				<h2 className="text-xl font-semibold mb-2">6. Liability</h2>
				<p>
					We are not liable for illness, injury, or loss caused by undisclosed
					allergens, incorrect storage, or consumption beyond recommended dates.
				</p>
			</section>

			<section className="mb-8">
				<h2 className="text-xl font-semibold mb-2">
					7. Refund & Cancellation Policy
				</h2>
				<p>
					Cancellations must be made at least 24 hours in advance. No refunds
					for uncollected orders unless due to our error.
				</p>
			</section>

			<section className="mb-8">
				<h2 className="text-xl font-semibold mb-2">
					8. Privacy & Data Protection
				</h2>
				<p>
					We collect customer data solely for order processing. Data is stored
					securely in compliance with UK GDPR and the Data Protection Act 2018.
				</p>
			</section>

			<section>
				<h2 className="text-xl font-semibold mb-2">
					9. Changes to These Terms
				</h2>
				<p>
					We may update these terms at any time, with changes effective upon
					posting to this page.
				</p>
			</section>
		</main>
	);
}
