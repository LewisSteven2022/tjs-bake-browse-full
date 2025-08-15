import Link from "next/link";
import { Instagram, Facebook } from "lucide-react";

export default function Footer() {
	return (
		<footer className="bg-neutral-50 border-t border-neutral-200 mt-12">
			<div className="container-elegance py-12 flex flex-col items-center text-center space-y-8">
				{/* Copyright */}
				<p className="text-elegance-caption">
					&copy; {new Date().getFullYear()} TJ&apos;s Bake &amp; Browse. All
					rights reserved.
				</p>

				{/* Legal Links */}
				<nav className="flex flex-wrap justify-center gap-6">
					<Link href="/disclaimer" className="nav-elegance-link">
						Disclaimer
					</Link>
					<Link href="/legal" className="nav-elegance-link">
						Legal
					</Link>
					<Link href="/legal/privacy" className="nav-elegance-link">
						Privacy Policy
					</Link>
					<Link href="/legal/cookies" className="nav-elegance-link">
						Cookie Policy
					</Link>
				</nav>

				{/* Social links */}
				<nav className="flex items-center gap-6">
					<a
						href="https://instagram.com/tjsbakeandbrowse"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="Instagram"
						className="text-neutral-600 hover:text-neutral-900 transition-colors">
						<Instagram size={20} strokeWidth={1.5} />
					</a>
					<a
						href="https://facebook.com/tjsbakeandbrowse"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="Facebook"
						className="text-neutral-600 hover:text-neutral-900 transition-colors">
						<Facebook size={20} strokeWidth={1.5} />
					</a>
				</nav>

				{/* Contact */}
				<p className="text-elegance-caption">
					Contact:{" "}
					<a
						href="mailto:tjsbakeandbrowse@gmail.com"
						className="nav-elegance-link">
						tjsbakeandbrowse@gmail.com
					</a>
				</p>
			</div>
		</footer>
	);
}
