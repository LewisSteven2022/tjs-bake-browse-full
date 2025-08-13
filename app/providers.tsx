"use client";
import { SessionProvider } from "next-auth/react";
import { NotificationProvider } from "@/components/NotificationManager";
import { CartProvider } from "@/components/CartContext";

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<SessionProvider>
			<NotificationProvider>
				<CartProvider>{children}</CartProvider>
			</NotificationProvider>
		</SessionProvider>
	);
}
