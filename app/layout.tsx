import "./globals.css";
import Link from "next/link";
import Providers from "./providers";
import { Toaster } from "react-hot-toast"; // ✅ add

export const metadata = {
	title: "TJ’s Bake & Browse",
	description: "Click & collect storefront for Jersey",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body>
				<Providers>
					{/* Global toast portal */}
					<Toaster position="top-center" toastOptions={{ duration: 4000 }} />

					<header className="border-b bg-white">
						<div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
							<Link href="/" className="text-xl font-semibold text-blue-500">
								TJ’s Bake & Browse
							</Link>
							<nav className="flex items-center gap-4 text-sm">
								<Link href="/about">About us</Link>
								<Link href="/groceries">Groceries</Link>
								<Link href="/baked-goods">Baked Goods</Link>
								<Link href="/basket">Basket</Link>
								{/* <NavAuth /> stays as-is */}
							</nav>
						</div>
					</header>

					<main className="max-w-5xl mx-auto px-4 py-6">{children}</main>

					<footer className="border-t text-sm text-gray-500 py-6 mt-12">
						<div className="max-w-5xl mx-auto px-4">
							© {new Date().getFullYear()} TJ’s Bake & Browse • Jersey •{" "}
							<Link href="/disclaimer">Disclaimer</Link>
						</div>
					</footer>
				</Providers>
			</body>
		</html>
	);
}
