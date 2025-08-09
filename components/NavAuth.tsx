"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

const ADMIN_EMAILS = (
	process.env.NEXT_PUBLIC_ADMIN_EMAILS || "admin@example.com"
)
	.split(",")
	.map((s) => s.trim().toLowerCase());

export default function NavAuth() {
	const { data: session, status } = useSession();
	const user = session?.user;
	const email = (user?.email || "").toLowerCase();
	const role = (user as any)?.role;
	const isAdmin = role === "admin" || ADMIN_EMAILS.includes(email);

	if (status === "loading") {
		return <span className="opacity-60">…</span>;
	}

	if (status === "authenticated" && user) {
		return (
			<div className="flex items-center gap-3">
				{isAdmin && (
					<Link href="/admin/orders" className="text-blue-600 hover:underline">
						Management
					</Link>
				)}
				<button
					className="text-blue-600 hover:underline"
					onClick={() => signOut({ callbackUrl: "/" })}>
					Sign out
				</button>
			</div>
		);
	}

	return (
		<button className="text-blue-600 hover:underline" onClick={() => signIn()}>
			Sign in
		</button>
	);
}
