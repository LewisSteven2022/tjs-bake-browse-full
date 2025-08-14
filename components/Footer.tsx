// components/Footer.tsx
import Link from "next/link";
import { Instagram, Facebook } from "lucide-react";

export default function Footer() {
	return (
		<footer className="bg-gray-100 border-t border-gray-200 mt-12">
			<div className="max-w-6xl mx-auto px-4 py-8 flex flex-col items-center text-center gap-6">
				{/* Copyright */}
				<p className="text-gray-600 text-sm">
					&copy; {new Date().getFullYear()} TJ&apos;s Bake &amp; Browse. All
					rights reserved.
				</p>

				{/* Legal Links */}
				<nav className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm">
					<Link
						href="/disclaimer"
						className="text-gray-700 hover:text-blue-800 transition">
						Disclaimer
					</Link>
					<Link
						href="/legal"
						className="text-gray-700 hover:text-blue-800 transition">
						Legal
					</Link>
					<Link
						href="/legal/privacy"
						className="text-gray-700 hover:text-blue-800 transition">
						Privacy Policy
					</Link>
					<Link
						href="/legal/cookies"
						className="text-gray-700 hover:text-blue-800 transition">
						Cookie Policy
					</Link>
				</nav>

				{/* Social links */}
				<nav className="flex items-center gap-4 sm:gap-6">
					<a
						href="https://instagram.com/tjsbakeandbrowse"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="Instagram"
						className="text-[#395B86] hover:text-[#1E40AF] transition">
						<Instagram size={20} />
					</a>
					<a
						href="https://facebook.com/tjsbakeandbrowse"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="Facebook"
						className="text-[#395B86] hover:text-[#1E40AF] transition">
						<Facebook size={20} />
					</a>
				</nav>

				{/* Contact */}
				<p className="text-gray-600 text-sm">
					Contact:{" "}
					<a
						href="mailto:tjsbakeandbrowse@gmail.com"
						className="text-blue-800 hover:underline">
						tjsbakeandbrowse@gmail.com
					</a>
				</p>
			</div>
		</footer>
	);
}
