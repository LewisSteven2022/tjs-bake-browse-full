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
				<Link
					href="/login"
					className="rounded-full bg-blue-800 px-3 py-1 text-white hover:bg-blue-700">
					Sign In
				</Link>
				<Link
					className="rounded-full bg-blue-800 px-3 py-1 text-white hover:bg-blue-700"
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
					className="rounded-full border px-3 py-1 hover:bg-gray-50"
					href="/admin">
					Admin
				</Link>
			)}
			<Link
				href="/suggestions"
				className="rounded-full border px-3 py-1 hover:bg-gray-50 text-sm">
				💡 Suggestions
			</Link>
			<span className="hidden sm:inline text-sm text-gray-600">
				{session.user?.name || session.user?.email}
			</span>
			<button
				onClick={() => signOut({ callbackUrl: "/" })}
				className="rounded-full border px-3 py-1 hover:bg-gray-50">
				Sign Out
			</button>
		</div>
	);
}
