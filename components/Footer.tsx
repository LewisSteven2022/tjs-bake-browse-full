// components/Footer.tsx
import Link from "next/link";

export default function Footer() {
	return (
		<footer className="bg-gray-100 border-t border-gray-200 mt-12">
			<div className="max-w-6xl mx-auto px-4 py-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				{/* Left side - Copyright */}
				<p className="text-gray-600 text-sm">
					&copy; {new Date().getFullYear()} TJ&apos;s Bake &amp; Browse. All
					rights reserved.
				</p>

				{/* Middle - Legal Links */}
				<nav className="flex gap-6 text-sm">
					<Link
						href="/legal"
						className="text-gray-700 hover:text-green-600 transition">
						Legal
					</Link>
					<Link
						href="/legal/privacy"
						className="text-gray-700 hover:text-green-600 transition">
						Privacy Policy
					</Link>
					<Link
						href="/legal/cookies"
						className="text-gray-700 hover:text-green-600 transition">
						Cookie Policy
					</Link>
				</nav>

				{/* Right side - Contact */}
				<p className="text-gray-600 text-sm">
					Contact:{" "}
					<a
						href="mailto:tjsbakeandbrowse@gmail.com"
						className="text-green-600 hover:underline">
						tjsbakeandbrowse@gmail.com
					</a>
				</p>
			</div>
		</footer>
	);
}
