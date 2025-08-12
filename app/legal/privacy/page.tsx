// app/privacy/page.tsx
import React from "react";

export const metadata = {
	title: "Privacy Policy | TJ's Bake & Browse",
	description:
		"Our Privacy Policy explaining how TJ's Bake & Browse handles your personal data in compliance with UK GDPR and the Data Protection Act 2018.",
};

export default function PrivacyPolicyPage() {
	return (
		<main className="max-w-4xl mx-auto px-4 py-12 text-gray-800">
			<h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
			<p className="text-sm text-gray-500 mb-8">
				Last updated: {new Date().toLocaleDateString("en-GB")}
			</p>

			<section className="mb-8">
				<h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
				<p>
					TJ’s Bake & Browse (“we”, “our”, “us”) values your privacy. This
					Privacy Policy explains how we collect, use, and protect your personal
					data in compliance with the{" "}
					<strong>UK General Data Protection Regulation (UK GDPR)</strong> and
					the <strong>Data Protection Act 2018</strong>.
				</p>
			</section>

			<section className="mb-8">
				<h2 className="text-xl font-semibold mb-2">
					2. Information We Collect
				</h2>
				<ul className="list-disc ml-6 space-y-1">
					<li>
						Personal details such as name, phone number, and email address when
						placing an order.
					</li>
					<li>
						Order information, including product selections, collection date,
						and payment status.
					</li>
					<li>
						Website usage data (e.g., pages visited) collected via cookies and
						analytics tools.
					</li>
				</ul>
			</section>

			<section className="mb-8">
				<h2 className="text-xl font-semibold mb-2">3. How We Use Your Data</h2>
				<ul className="list-disc ml-6 space-y-1">
					<li>To process and manage your orders.</li>
					<li>To contact you about your order if necessary.</li>
					<li>To improve our services and website performance.</li>
					<li>
						To comply with legal obligations, such as food safety record
						keeping.
					</li>
				</ul>
			</section>

			<section className="mb-8">
				<h2 className="text-xl font-semibold mb-2">
					4. Legal Basis for Processing
				</h2>
				<p>We process your personal data based on:</p>
				<ul className="list-disc ml-6 space-y-1">
					<li>Contract – to fulfil your order.</li>
					<li>Consent – for marketing communications (if opted-in).</li>
					<li>Legal obligation – where required by UK law.</li>
					<li>Legitimate interest – to improve customer service.</li>
				</ul>
			</section>

			<section className="mb-8">
				<h2 className="text-xl font-semibold mb-2">
					5. Data Storage & Security
				</h2>
				<p>
					We store your data securely using Supabase-hosted databases and
					encrypted connections. Access is restricted to authorised personnel
					only. We take appropriate technical and organisational measures to
					protect your data against loss, misuse, or unauthorised access.
				</p>
			</section>

			<section className="mb-8">
				<h2 className="text-xl font-semibold mb-2">6. Data Sharing</h2>
				<p>We do not sell or rent your data. We may share information with:</p>
				<ul className="list-disc ml-6 space-y-1">
					<li>
						Service providers (e.g., Supabase, email providers) to enable order
						processing.
					</li>
					<li>Regulatory authorities if required by law.</li>
				</ul>
			</section>

			<section className="mb-8">
				<h2 className="text-xl font-semibold mb-2">7. Data Retention</h2>
				<p>
					We keep personal data only as long as necessary to fulfil the purposes
					we collected it for, including satisfying legal, accounting, or
					reporting requirements.
				</p>
			</section>

			<section className="mb-8">
				<h2 className="text-xl font-semibold mb-2">8. Your Rights</h2>
				<p>Under UK GDPR, you have the right to:</p>
				<ul className="list-disc ml-6 space-y-1">
					<li>Access the personal data we hold about you.</li>
					<li>Request correction of inaccurate data.</li>
					<li>Request deletion of your personal data.</li>
					<li>Object to processing or request restriction.</li>
					<li>Withdraw consent where processing is based on consent.</li>
				</ul>
				<p className="mt-2">
					To exercise your rights, please contact us at:{" "}
					<a
						href="mailto:tjsbakeandbrowse@gmail.com"
						className="text-blue-600 underline">
						tjsbakeandbrowse@gmail.com
					</a>
				</p>
			</section>

			<section>
				<h2 className="text-xl font-semibold mb-2">
					9. Changes to This Policy
				</h2>
				<p>
					We may update this Privacy Policy from time to time. Updates will be
					posted on this page with a new “Last Updated” date.
				</p>
			</section>
		</main>
	);
}
