"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
	const sp = useSearchParams();
	const callbackUrl = sp.get("callbackUrl") || "/";
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [busy, setBusy] = useState(false);
	const [err, setErr] = useState<string | null>(null);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setBusy(true);
		setErr(null);
		const res = await signIn("credentials", {
			redirect: false,
			email,
			password,
			callbackUrl,
		});
		setBusy(false);
		if (!res || res.error) {
			setErr(res?.error || "Invalid credentials");
			return;
		}
		router.push(callbackUrl);
	}

	return (
		<main className="mx-auto max-w-md p-6">
			<h1 className="mb-4 text-2xl font-semibold">Sign in</h1>
			<form onSubmit={onSubmit} className="space-y-3">
				<div>
					<label className="block text-sm text-gray-600">Email</label>
					<input
						className="mt-1 w-full rounded-xl border px-3 py-2"
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						autoComplete="email"
						required
					/>
				</div>
				<div>
					<label className="block text-sm text-gray-600">Password</label>
					<input
						className="mt-1 w-full rounded-xl border px-3 py-2"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						autoComplete="current-password"
						required
					/>
				</div>
				{err && <p className="text-sm text-red-600">{err}</p>}
				<button
					type="submit"
					disabled={busy}
					className="w-full rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60">
					{busy ? "Signing in…" : "Sign in"}
				</button>
			</form>
			<p className="mt-4 text-sm">
				No account?{" "}
				<Link className="text-blue-600 hover:underline" href="/register">
					Register
				</Link>
			</p>
		</main>
	);
}
