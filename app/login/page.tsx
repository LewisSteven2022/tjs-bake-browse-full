// app/login/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
// import { mergeGuestCart } from "@/lib/cart";
import {
	useNotifications,
	showErrorNotification,
	showSuccessNotification,
} from "@/components/NotificationManager";

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
	const { showNotification } = useNotifications();

	const callbackUrl = searchParams.get("callbackUrl") || "/";

	// If NextAuth redirected here with ?error=..., show a friendly notification
	useEffect(() => {
		const err = searchParams.get("error");
		if (err) {
			showErrorNotification(
				showNotification,
				"Sign In Error",
				mapNextAuthError(err)
			);
		}
	}, [searchParams, showNotification]);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!email || !password) {
			showErrorNotification(
				showNotification,
				"Missing Information",
				"Please enter your email and password."
			);
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
				showErrorNotification(
					showNotification,
					"Sign In Failed",
					mapNextAuthError(res.error)
				);
				setBusy(false);
				return;
			}

			// Merge guest cart after successful login
			// TODO: Implement guest cart merging functionality
			// try {
			// 	await mergeGuestCart();
			// } catch (error) {
			// 	console.error("Failed to merge guest cart:", error);
			// 	// Don't block login if cart merge fails
			// }

			showSuccessNotification(
				showNotification,
				"Welcome Back! 🎉",
				"Successfully signed in. Welcome back to TJ's Bake & Browse!"
			);

			// Small delay to show the success notification
			setTimeout(() => {
				router.push(callbackUrl);
				router.refresh();
			}, 1000);
		} catch (err: any) {
			showErrorNotification(
				showNotification,
				"Sign In Error",
				"Unable to sign in. Please try again."
			);
			setBusy(false);
		}
	}

	return (
		<main className="mx-auto max-w-md p-6">
			<h1 className="mb-4 text-2xl font-semibold">Sign In</h1>
			<form onSubmit={onSubmit} className="space-y-3">
				<div>
					<label className="block text-sm text-gray-600">Email</label>
					<input
						className="mt-1 w-full rounded-full border px-3 py-2"
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
						className="mt-1 w-full rounded-full border px-3 py-2"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						autoComplete="current-password"
						required
					/>
				</div>
				<button
					type="submit"
					disabled={busy}
					className="w-full rounded-full bg-blue-800 px-3 py-2 text-white hover:bg-blue-700 disabled:opacity-50">
					{busy ? "Signing in..." : "Sign In"}
				</button>
			</form>
			<p className="mt-4 text-center text-sm text-gray-600">
				Don't have an account?{" "}
				<Link href="/register" className="text-primary hover:underline">
					Register here
				</Link>
			</p>
		</main>
	);
}
