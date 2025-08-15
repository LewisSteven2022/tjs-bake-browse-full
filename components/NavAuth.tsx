"use client";

import React from "react";
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
			<div className="flex items-center gap-2">
				<Link href="/login" className="btn-secondary text-sm">
					Sign In
				</Link>
				<Link className="btn-primary text-sm" href="/register">
					Register
				</Link>
			</div>
		);
	}

	return (
		<div className="flex items-center gap-2">
			<button
				onClick={() => signOut({ callbackUrl: "/" })}
				className="btn-outline text-sm">
				Sign Out
			</button>
			<Link href="/suggestions" className="btn-outline text-sm">
				Suggestions
			</Link>
			{isAdmin && (
				<Link className="btn-secondary text-sm" href="/admin">
					Admin
				</Link>
			)}
		</div>
	);
}
