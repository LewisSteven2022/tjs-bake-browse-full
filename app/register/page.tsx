"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
	const router = useRouter();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [mobile, setMobile] = useState("");
	const [password, setPassword] = useState("");
	const [busy, setBusy] = useState(false);
	const [err, setErr] = useState<string | null>(null);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setBusy(true);
		setErr(null);
		const res = await fetch("/api/auth/register", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ name, email, mobile, password }),
		});
		const j = await res.json().catch(() => ({}));
		if (!res.ok) {
			setBusy(false);
			setErr(j?.error || "Registration failed");
			return;
		}
		// Auto sign-in after register
		const si = await signIn("credentials", {
			redirect: false,
			email,
			password,
			callbackUrl: "/",
		});
		setBusy(false);
		if (si && !si.error) router.push("/");
	}

	return (
		<main className="mx-auto max-w-md p-6">
			<h1 className="mb-4 text-2xl font-semibold">Register</h1>
			<form onSubmit={onSubmit} className="space-y-3">
				<div>
					<label className="block text-sm text-gray-600">Full name</label>
					<input
						className="mt-1 w-full rounded-xl border px-3 py-2"
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
					/>
				</div>
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
					<label className="block text-sm text-gray-600">Mobile</label>
					<input
						className="mt-1 w-full rounded-xl border px-3 py-2"
						type="tel"
						value={mobile}
						onChange={(e) => setMobile(e.target.value)}
						placeholder="07700 900000"
					/>
				</div>
				<div>
					<label className="block text-sm text-gray-600">Password</label>
					<input
						className="mt-1 w-full rounded-xl border px-3 py-2"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						autoComplete="new-password"
						required
					/>
				</div>
				{err && <p className="text-sm text-red-600">{err}</p>}
				<button
					type="submit"
					disabled={busy}
					className="w-full rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60">
					{busy ? "Creating account…" : "Create account"}
				</button>
			</form>
			<p className="mt-4 text-sm">
				Already have an account?{" "}
				<Link className="text-blue-600 hover:underline" href="/login">
					Sign in
				</Link>
			</p>
		</main>
	);
}
