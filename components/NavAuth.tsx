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
			<div className="flex items-center space-x-4">
				<Link href="/login" className="nav-elegance-link">
					Sign In
				</Link>
				<Link className="btn-elegance-primary" href="/register">
					Register
				</Link>
			</div>
		);
	}

	return (
		<div className="flex items-center space-x-4">
			<button
				onClick={() => signOut({ callbackUrl: "/" })}
				className="nav-elegance-link">
				Sign Out
			</button>
			<Link href="/suggestions" className="nav-elegance-link">
				Suggestions
			</Link>
			{isAdmin && (
				<Link className="btn-elegance-secondary" href="/admin">
					Admin
				</Link>
			)}
		</div>
	);
}
