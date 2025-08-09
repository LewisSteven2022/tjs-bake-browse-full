"use client";

import { ReactNode } from "react";
import Providers from "./providers";
import { ToastProvider } from "@/components/ui/ToastContext";

export default function ClientLayout({ children }: { children: ReactNode }) {
	return (
		<Providers>
			<ToastProvider>{children}</ToastProvider>
		</Providers>
	);
}
