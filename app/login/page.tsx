// app/login/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "react-hot-toast";
import Link from "next/link";

function mapNextAuthError(code?: string | null): string {
	switch (code) {
		case "CredentialsSignin":
			return "Email or password is incorrect.";
		case "AccessDenied":
			return "Access denied. Please contact the shop if this persists.";
		case "Callback":
			return "Sign-in was cancelled. Please try again.";
		case "Configuration":
			return "There is a configuration problem. Please try again later.";
		default:
			return "Unable to sign in. Please try again.";
	}
}

export default function LoginPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [busy, setBusy] = useState(false);

	const callbackUrl = searchParams.get("callbackUrl") || "/";

	// If NextAuth redirected here with ?error=..., show a friendly toast
	useEffect(() => {
		const err = searchParams.get("error");
		if (err) {
			toast.error(mapNextAuthError(err));
		}
	}, [searchParams]);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!email || !password) {
			toast.error("Please enter your email and password.");
			return;
		}
		setBusy(true);
		try {
			const res = await signIn("credentials", {
				redirect: false,
				email,
				password,
				callbackUrl,
			});

			if (res?.error) {
				toast.error(mapNextAuthError(res.error));
				setBusy(false);
				return;
			}

			toast.success("Signed in. Welcome back!");
			router.push(callbackUrl);
			router.refresh();
		} catch (err: any) {
			toast.error("Unable to sign in. Please try again.");
			setBusy(false);
		}
	}

	return (
		<main className="mx-auto max-w-md p-4">
			<h1 className="mb-4 text-2xl font-semibold">Sign in</h1>
			<form
				onSubmit={onSubmit}
				className="space-y-3 rounded-2xl border bg-white p-4">
				<div>
					<label className="block text-sm text-gray-600">Email</label>
					<input
						type="email"
						className="mt-1 w-full rounded-xl border px-3 py-2"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="you@example.com"
						autoComplete="email"
						required
					/>
				</div>

				<div>
					<label className="block text-sm text-gray-600">Password</label>
					<input
						type="password"
						className="mt-1 w-full rounded-xl border px-3 py-2"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder="••••••••"
						autoComplete="current-password"
						required
					/>
				</div>

				<button
					type="submit"
					disabled={busy}
					className="w-full rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60">
					{busy ? "Signing in…" : "Sign in"}
				</button>

				<p className="text-sm text-gray-600">
					Don’t have an account?{" "}
					<Link className="text-blue-600 hover:underline" href="/register">
						Register
					</Link>
				</p>
			</form>
		</main>
	);
}
