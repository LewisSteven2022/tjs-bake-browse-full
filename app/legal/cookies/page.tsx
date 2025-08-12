// app/cookies/page.tsx
import React from "react";

export const metadata = {
	title: "Cookie Policy | TJ's Bake & Browse",
	description:
		"Cookie Policy for TJ's Bake & Browse, explaining how cookies and local storage are used on our website in compliance with UK law.",
};

export default function CookiePolicyPage() {
	return (
		<main className="max-w-4xl mx-auto px-4 py-12 text-gray-800">
			<h1 className="text-3xl font-bold mb-6">Cookie Policy</h1>
			<p className="text-sm text-gray-500 mb-8">
				Last updated: {new Date().toLocaleDateString("en-GB")}
			</p>

			<section className="mb-8">
				<h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
				<p>
					This Cookie Policy explains how TJ’s Bake & Browse (“we”, “our”, “us”)
					uses cookies and similar technologies on our website in accordance
					with the{" "}
					<strong>
						Privacy and Electronic Communications Regulations (PECR)
					</strong>{" "}
					and the <strong>UK GDPR</strong>.
				</p>
				<p className="mt-2">
					By continuing to use our website, you consent to our use of cookies as
					described in this policy.
				</p>
			</section>

			<section className="mb-8">
				<h2 className="text-xl font-semibold mb-2">2. What Are Cookies?</h2>
				<p>
					Cookies are small text files placed on your device when you visit a
					website. They are widely used to make websites work, improve
					functionality, and provide information to site owners.
				</p>
			</section>

			<section className="mb-8">
				<h2 className="text-xl font-semibold mb-2">
					3. Types of Cookies We Use
				</h2>
				<ul className="list-disc ml-6 space-y-2">
					<li>
						<strong>Strictly Necessary Cookies</strong> – Required for the site
						to function (e.g., Supabase authentication cookies for login
						sessions).
					</li>
					<li>
						<strong>Functionality Cookies</strong> – Used to remember your
						preferences, such as items in your basket stored via localStorage.
					</li>
					<li>
						<strong>Performance & Analytics Cookies</strong> – If enabled, these
						help us understand how visitors use our website and improve user
						experience (e.g., Google Analytics or similar tools).
					</li>
				</ul>
			</section>

			<section className="mb-8">
				<h2 className="text-xl font-semibold mb-2">4. Local Storage Usage</h2>
				<p>
					In addition to cookies, we use your browser’s{" "}
					<strong>localStorage</strong> to store your shopping basket. This
					ensures that your basket contents persist between visits. This data is
					stored only on your device and is not transmitted to us until you
					place an order.
				</p>
			</section>

			<section className="mb-8">
				<h2 className="text-xl font-semibold mb-2">5. Third-Party Cookies</h2>
				<p>
					Some cookies may be set by third-party services we use, such as
					Supabase (for authentication) or analytics providers. These providers
					have their own privacy and cookie policies.
				</p>
			</section>

			<section className="mb-8">
				<h2 className="text-xl font-semibold mb-2">6. Managing Cookies</h2>
				<p>
					You can control cookies through your browser settings. You may choose
					to block or delete cookies, but this may impact the functionality of
					our website, including login and basket persistence.
				</p>
				<p className="mt-2">
					Instructions for managing cookies can be found at:
				</p>
				<ul className="list-disc ml-6 space-y-1">
					<li>
						Chrome:{" "}
						<a
							href="https://support.google.com/chrome/answer/95647"
							target="_blank"
							rel="noopener noreferrer"
							className="text-blue-600 underline">
							Manage cookies in Chrome
						</a>
					</li>
					<li>
						Firefox:{" "}
						<a
							href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences"
							target="_blank"
							rel="noopener noreferrer"
							className="text-blue-600 underline">
							Manage cookies in Firefox
						</a>
					</li>
					<li>
						Edge:{" "}
						<a
							href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
							target="_blank"
							rel="noopener noreferrer"
							className="text-blue-600 underline">
							Manage cookies in Edge
						</a>
					</li>
				</ul>
			</section>

			<section>
				<h2 className="text-xl font-semibold mb-2">
					7. Changes to This Policy
				</h2>
				<p>
					We may update this Cookie Policy from time to time. Updates will be
					posted on this page with a new “Last Updated” date.
				</p>
			</section>
		</main>
	);
}
