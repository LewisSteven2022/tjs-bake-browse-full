"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useSession, signOut } from "next-auth/react";

export default function NavAuth() {
	const { data: session, status } = useSession();

	const email = (session?.user?.email || "").toLowerCase();
	const role = (session?.user as any)?.role;
	const adminEmails = (
		process.env.NEXT_PUBLIC_ADMIN_EMAILS || "admin@example.com"
	)
		.split(",")
		.map((s) => s.trim().toLowerCase());

	const isAdmin = useMemo(
		() => role === "admin" || adminEmails.includes(email),
		[role, email, adminEmails]
	);

	if (status === "loading") return <span className="opacity-60">…</span>;

	if (!session) {
		return (
			<div className="flex items-center gap-3">
				<Link className="hover:underline" href="/login">
					Sign in
				</Link>
				<Link
					className="rounded-lg bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
					href="/register">
					Register
				</Link>
			</div>
		);
	}

	return (
		<div className="flex items-center gap-3">
			{isAdmin && (
				<Link
					className="rounded-lg border px-3 py-1 hover:bg-gray-50"
					href="/admin">
					Management
				</Link>
			)}
			<span className="hidden sm:inline text-sm text-gray-600">
				{session.user?.name || session.user?.email}
			</span>
			<button
				className="rounded-lg border px-3 py-1 hover:bg-gray-50"
				onClick={() => signOut({ callbackUrl: "/" })}>
				Sign out
			</button>
		</div>
	);
}
