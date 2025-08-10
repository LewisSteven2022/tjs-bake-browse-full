"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

export default function ClientLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<SessionProvider>
			{/* Single toast container, top-right only */}
			<Toaster position="top-right" toastOptions={{ duration: 3500 }} />
			{children}
		</SessionProvider>
	);
}
