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
		<main className="min-h-screen bg-elegance">
			<div className="container-elegance section-elegance">
				<div className="max-w-md mx-auto">
					<h1 className="text-3xl text-elegance-heading mb-8 text-center">
						Register
					</h1>
					<div className="card-elegance border border-neutral-200 p-8">
						<form onSubmit={onSubmit} className="space-y-6">
							<div>
								<label className="label-elegance">Full Name</label>
								<input
									className="input-elegance"
									value={name}
									onChange={(e) => setName(e.target.value)}
									required
								/>
							</div>
							<div>
								<label className="label-elegance">Email</label>
								<input
									className="input-elegance"
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									autoComplete="email"
									required
								/>
							</div>
							<div>
								<label className="label-elegance">Mobile</label>
								<input
									className="input-elegance"
									type="tel"
									value={mobile}
									onChange={(e) => setMobile(e.target.value)}
									placeholder="07700 900000"
								/>
							</div>
							<div>
								<label className="label-elegance">Password</label>
								<input
									className="input-elegance"
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
								className="btn-elegance-primary w-full disabled:opacity-50">
								{busy ? "Creating account..." : "Create Account"}
							</button>
						</form>
						<p className="mt-6 text-center text-elegance-body">
							Already have an account?{" "}
							<Link href="/login" className="nav-elegance-link">
								Sign in here
							</Link>
						</p>
					</div>
				</div>
			</div>
		</main>
	);
}
