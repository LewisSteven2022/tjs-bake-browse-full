"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

const ADMIN_EMAILS = (
	process.env.NEXT_PUBLIC_ADMIN_EMAILS || "admin@example.com"
)
	.split(",")
	.map((s) => s.trim().toLowerCase());

function isAdmin(session: any) {
	const email = (session?.user?.email || "").toLowerCase();
	const role = (session?.user as any)?.role;
	return role === "admin" || ADMIN_EMAILS.includes(email);
}

export default function NavAuth() {
	const { data: session, status } = useSession();
	const [admin, setAdmin] = useState(false);

	useEffect(() => setAdmin(isAdmin(session)), [session]);

	if (status === "loading") return <span className="opacity-50">…</span>;

	if (!session) {
		return (
			<button
				onClick={() => signIn(undefined, { callbackUrl: "/" })}
				className="rounded-lg border px-3 py-1 hover:bg-gray-50">
				Sign in
			</button>
		);
	}

	return (
		<div className="flex items-center gap-3">
			{admin && (
				<Link
					href="/admin"
					className="rounded-lg bg-blue-500 text-white px-3 py-1 hover:bg-blue-600">
					Management
				</Link>
			)}
			<button
				onClick={() => signOut({ callbackUrl: "/" })}
				className="rounded-lg border px-3 py-1 hover:bg-gray-50">
				Sign out
			</button>
		</div>
	);
}
