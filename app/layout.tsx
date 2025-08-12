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
					<header className="border-b bg-white">
						<div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
							<Link href="/" className="text-xl font-semibold text-blue-500">
								TJ's Bake & Browse
							</Link>
							<nav className="flex items-center gap-4 text-sm">
								<Link href="/about">About us</Link>
								<Link href="/groceries">Groceries</Link>
								<Link href="/baked-goods">Baked Goods</Link>
								<NavBasket />
								<NavAuth />
							</nav>
						</div>
					</header>
					<main className="max-w-5xl mx-auto px-4 py-6">{children}</main>
					<Footer />
				</Providers>
			</body>
		</html>
	);
}
