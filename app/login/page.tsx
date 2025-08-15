// app/login/page.tsx
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
// import { mergeGuestCart } from "@/lib/cart";
import {
	useNotifications,
	showErrorNotification,
	showSuccessNotification,
} from '@/components/NotificationManager';

function mapNextAuthError(code?: string | null): string {
	switch (code) {
		case 'CredentialsSignin':
			return 'Email or password is incorrect.';
		case 'AccessDenied':
			return "Access denied. Please contact us via the email on the 'Contact Us' page if this persists.";
		case 'Callback':
			return 'Sign-in was cancelled. Please try again.';
		case 'Configuration':
			return 'There is a configuration problem. Please try again later.';
		default:
			return 'Unable to sign in. Please try again.';
	}
}

function LoginForm() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [busy, setBusy] = useState(false);
	const { showNotification } = useNotifications();

	const callbackUrl = searchParams.get('callbackUrl') || '/';

	// If NextAuth redirected here with ?error=..., show a friendly notification
	useEffect(() => {
		const err = searchParams.get('error');
		if (err) {
			showErrorNotification(
				showNotification,
				'Sign In Error',
				mapNextAuthError(err)
			);
		}
	}, [searchParams, showNotification]);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!email || !password) {
			showErrorNotification(
				showNotification,
				'Missing Information',
				'Please enter your email and password.'
			);
			return;
		}
		setBusy(true);
		try {
			const res = await signIn('credentials', {
				redirect: false,
				email,
				password,
				callbackUrl,
			});

			if (res?.error) {
				showErrorNotification(
					showNotification,
					'Sign In Failed',
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
				'Welcome Back!',
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
				'Sign In Error',
				'Unable to sign in. Please try again.'
			);
			setBusy(false);
		}
	}

	return (
		<main className='min-h-screen bg-elegance'>
			<div className='container-elegance section-elegance'>
				<div className='max-w-md mx-auto'>
					<h1 className='text-3xl text-elegance-heading mb-8 text-center'>
						Sign In
					</h1>
					<div className='card-elegance border border-neutral-200 p-8'>
						<form onSubmit={onSubmit} className='space-y-6'>
							<div>
								<label className='label-elegance'>Email</label>
								<input
									className='input-elegance'
									type='email'
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									autoComplete='email'
									required
								/>
							</div>
							<div>
								<label className='label-elegance'>Password</label>
								<input
									className='input-elegance'
									type='password'
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									autoComplete='current-password'
									required
								/>
							</div>
							<button
								type='submit'
								disabled={busy}
								className='btn-elegance-primary w-full disabled:opacity-50'>
								{busy ? 'Signing in...' : 'Sign In'}
							</button>
						</form>
						<p className='mt-6 text-center text-elegance-body'>
							Don't have an account? You're missing out!{' '}
							<Link href='/register' className='nav-elegance-link'>
								Register here
							</Link>
						</p>
					</div>
				</div>
			</div>
		</main>
	);
}

export default function LoginPage() {
	return (
		<Suspense
			fallback={
				<div className='min-h-screen bg-elegance'>
					<div className='container-elegance section-elegance'>
						<div className='text-center'>
							<div className='animate-spin rounded-full h-8 w-8 border-b border-neutral-400 mx-auto mb-4'></div>
							<p className='text-elegance-body'>Loading...</p>
						</div>
					</div>
				</div>
			}>
			<LoginForm />
		</Suspense>
	);
}
