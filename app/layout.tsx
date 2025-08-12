import "./globals.css";
import Link from "next/link";
import Providers from "./providers";
import NavAuth from "@/components/NavAuth";
import NavBasket from "@/components/NavBasket";
import Footer from "@/components/Footer";

export const metadata = {
	title: "TJ's Bake & Browse",
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
					<header className="border-b border-blue-200 bg-white shadow-sm">
						<div className="max-w-5xl mx-auto px-4 py-4">
							<div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4">
								<Link
									href="/"
									className="text-xl font-semibold text-blue-800 hover:text-blue-600 transition-colors">
									TJ's Bake & Browse
								</Link>
								<nav className="flex flex-wrap items-center justify-center gap-4 text-sm">
									<Link
										href="/about"
										className="text-gray-700 hover:text-blue-800 transition-colors">
										About us
									</Link>
									<Link
										href="/groceries"
										className="text-gray-700 hover:text-blue-800 transition-colors">
										Groceries
									</Link>
									<Link
										href="/baked-goods"
										className="text-gray-700 hover:text-blue-800 transition-colors">
										Baked Goods
									</Link>
									<NavBasket />
									<NavAuth />
								</nav>
							</div>
						</div>
					</header>
					<main className="max-w-5xl mx-auto px-4 py-6">{children}</main>
					<Footer />
				</Providers>
			</body>
		</html>
	);
}
