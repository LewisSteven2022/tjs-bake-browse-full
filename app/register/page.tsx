"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
// import { mergeGuestCart } from "@/lib/cart";
import {
	useNotifications,
	showErrorNotification,
	showSuccessNotification,
} from "@/components/NotificationManager";

export default function RegisterPage() {
	const router = useRouter();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [mobile, setMobile] = useState("");
	const [password, setPassword] = useState("");
	const [busy, setBusy] = useState(false);
	const { showNotification } = useNotifications();

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setBusy(true);

		const res = await fetch("/api/auth/register", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ name, email, mobile, password }),
		});
		const j = await res.json().catch(() => ({}));
		if (!res.ok) {
			setBusy(false);
			showErrorNotification(
				showNotification,
				"Registration Failed",
				j?.error || "Registration failed. Please try again."
			);
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
		if (si && !si.error) {
			// Merge guest cart after successful registration and sign-in
			// TODO: Implement guest cart merging functionality
			// try {
			// 	await mergeGuestCart();
			// } catch (error) {
			// 	console.error("Failed to merge guest cart:", error);
			// 	// Don't block registration if cart merge fails
			// }

			showSuccessNotification(
				showNotification,
				"Welcome to TJ's! 🎉",
				"Account created successfully! You're now signed in and ready to shop."
			);

			// Small delay to show the success notification
			setTimeout(() => {
				router.push("/");
			}, 1000);
		}
	}

	return (
		<main className="mx-auto max-w-md p-6">
			<h1 className="mb-4 text-2xl font-semibold">Register</h1>
			<form onSubmit={onSubmit} className="space-y-3">
				<div>
					<label className="block text-sm text-gray-600">Full name</label>
					<input
						className="mt-1 w-full rounded-full border px-3 py-2"
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
					/>
				</div>
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
					<label className="block text-sm text-gray-600">Mobile</label>
					<input
						className="mt-1 w-full rounded-full border px-3 py-2"
						type="tel"
						value={mobile}
						onChange={(e) => setMobile(e.target.value)}
						placeholder="07700 900000"
					/>
				</div>
				<div>
					<label className="block text-sm text-gray-600">Password</label>
					<input
						className="mt-1 w-full rounded-full border px-3 py-2"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						autoComplete="new-password"
						required
					/>
				</div>
				<button
					type="submit"
					disabled={busy}
					className="w-full rounded-full bg-blue-800 px-3 py-2 text-white hover:bg-blue-700 disabled:opacity-50">
					{busy ? "Creating account..." : "Create Account"}
				</button>
			</form>
			<p className="mt-4 text-center text-sm text-gray-600">
				Already have an account?{" "}
				<Link href="/login" className="text-primary hover:underline">
					Sign in here
				</Link>
			</p>
		</main>
	);
}
