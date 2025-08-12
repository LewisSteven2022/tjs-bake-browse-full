// app/admin/layout.tsx
import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const ADMIN_EMAILS = (
	process.env.NEXT_PUBLIC_ADMIN_EMAILS || "admin@example.com"
)
	.split(",")
	.map((s) => s.trim().toLowerCase());

export default async function AdminLayout({
	children,
}: {
	children: ReactNode;
}) {
	const session = await getServerSession(authOptions);
	const email = (session?.user?.email || "").toLowerCase();
	const role = (session?.user as any)?.role;
	const isAdmin = role === "admin" || ADMIN_EMAILS.includes(email);

	if (!isAdmin) {
		// Not authorised → bounce to home (or sign-in)
		redirect("/");
	}

	return <>{children}</>;
}
