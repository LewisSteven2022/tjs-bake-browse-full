import "./globals.css";
import Providers from "./providers";
import ModernNavbar from "@/components/ModernNavbar";
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
					<ModernNavbar />
					<main className="container-modern py-6 min-h-[calc(100vh-200px)]">{children}</main>
					<Footer />
				</Providers>
			</body>
		</html>
	);
}
