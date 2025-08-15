'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function SuggestionsPage() {
	const { data: session, status } = useSession();
	const router = useRouter();

	const [formData, setFormData] = useState({
		subject: '',
		message: '',
		category: 'general',
	});
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Debug logging
	// silent

	// Redirect if not logged in
	if (status === 'loading') {
		// silent
		return (
			<div className='min-h-screen bg-elegance flex items-center justify-center'>
				<div className='text-center'>
					<div className='animate-spin rounded-full h-8 w-8 border-b border-neutral-400 mx-auto mb-4'></div>
					<p className='text-elegance-body'>Loading...</p>
				</div>
			</div>
		);
	}

	if (status === 'unauthenticated') {
		// silent
		router.push('/login?callbackUrl=/suggestions');
		return (
			<div className='min-h-screen bg-elegance flex items-center justify-center'>
				<div className='text-center'>
					<p className='text-elegance-body'>Redirecting to login...</p>
				</div>
			</div>
		);
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			const response = await fetch('/api/suggestions', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					...formData,
					userEmail: session?.user?.email,
					userName: session?.user?.name,
				}),
			});

			if (response.ok) {
				alert('Thank you! Your suggestion has been submitted successfully.');
				setFormData({ subject: '', message: '', category: 'general' });
			} else {
				const error = await response.json();
				throw new Error(error.message || 'Failed to submit suggestion');
			}
		} catch (error) {
			alert(
				`Submission Failed: ${
					error instanceof Error
						? error.message
						: 'Something went wrong. Please try again.'
				}`
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) => {
		setFormData((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	// silent

	return (
		<main className='min-h-screen bg-elegance'>
			<div className='container-elegance section-elegance'>
				{/* Header */}
				<div className='text-center mb-12'>
					<div className='inline-flex items-center justify-center w-16 h-16 bg-neutral-900 mb-6'>
						<svg
							className='w-8 h-8 text-white'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={1.5}
								d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
							/>
						</svg>
					</div>
					<h1 className='text-4xl text-elegance-heading mb-6'>
						Share Your Ideas
					</h1>
					<p className='text-lg text-elegance-body max-w-2xl mx-auto'>
						Your feedback shapes our future. Help us create the perfect bakery
						experience for our community.
					</p>
				</div>

				{/* Form Card */}
				<div className='card-elegance border border-neutral-200 p-8 md:p-12 relative'>
					{/* Decorative background elements removed for minimal elegance */}

					<div className='relative z-10'>
						<form onSubmit={handleSubmit} className='space-y-8'>
							{/* Category Selection */}
							<div className='space-y-3'>
								<label htmlFor='category' className='label-elegance'>
									Feedback Category
								</label>
								<select
									id='category'
									name='category'
									value={formData.category}
									onChange={handleChange}
									className='input-elegance'
									required>
									<option value='general'>General Feedback</option>
									<option value='general'>New Product Requests</option>
									<option value='product'>Product Suggestions</option>
									<option value='service'>Service Improvements</option>
									<option value='website'>Website Experience</option>
									<option value='ordering'>Ordering Process</option>
									<option value='other'>Other</option>
								</select>
							</div>

							{/* Subject */}
							<div className='space-y-3'>
								<label htmlFor='subject' className='label-elegance'>
									Subject *
								</label>
								<input
									type='text'
									id='subject'
									name='subject'
									value={formData.subject}
									onChange={handleChange}
									className='input-elegance'
									placeholder="What's your idea about?"
									required
									maxLength={100}
								/>
							</div>

							{/* Message */}
							<div className='space-y-3'>
								<label htmlFor='message' className='label-elegance'>
									Your Suggestion *
								</label>
								<textarea
									id='message'
									name='message'
									value={formData.message}
									onChange={handleChange}
									rows={8}
									className='input-elegance resize-none'
									placeholder='Tell us your ideas, suggestions, or feedback in detail. Every word counts towards making our bakery better!'
									required
									maxLength={1000}
								/>
								<div className='flex justify-between items-center'>
									<p className='text-elegance-caption'>
										{formData.message.length}/1000 characters
									</p>
									<div className='flex items-center text-elegance-caption'>
										<svg
											className='w-4 h-4 mr-1'
											fill='currentColor'
											viewBox='0 0 20 20'>
											<path
												fillRule='evenodd'
												d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
												clipRule='evenodd'
											/>
										</svg>
										Be specific for best results
									</div>
								</div>
							</div>

							{/* Submit Button */}
							<div className='pt-6'>
								<button
									type='submit'
									disabled={isSubmitting}
									className='btn-elegance-primary w-full disabled:opacity-50 disabled:cursor-not-allowed'>
									{isSubmitting ? (
										<div className='flex items-center justify-center'>
											<div className='animate-spin rounded-full h-5 w-5 border border-white border-t-transparent mr-3'></div>
											<span>Submitting...</span>
										</div>
									) : (
										<span>Submit Your Suggestion</span>
									)}
								</button>
							</div>
						</form>

						{/* Additional Info */}
						<div className='mt-12 pt-8 border-t border-neutral-200'>
							<div className='bg-neutral-50 p-8 border border-neutral-200'>
								<div className='flex items-start space-x-4'>
									{/* <div className='flex-shrink-0'>
										<div className='w-12 h-12 bg-neutral-900 flex items-center justify-center'>
											<svg
												className='w-6 h-6 text-white'
												fill='none'
												stroke='currentColor'
												viewBox='0 0 24 24'>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth={1.5}
													d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
												/>
											</svg>
										</div>
									</div> */}
									<div className='flex-1'>
										<h3 className='text-xl text-elegance-heading mb-4 text-center'>
											Leave you're honest feedback for a chance to win some
											goodies!
										</h3>
										<div className='grid md:grid-cols-2 gap-4'>
											<ul className='space-y-3'>
												<li className='flex items-start space-x-3'>
													<span className='text-neutral-500'>—</span>
													<span className='text-elegance-body'>
														Be specific about improvements you'd like to see
													</span>
												</li>
												<li className='flex items-start space-x-3'>
													<span className='text-neutral-500'>—</span>
													<span className='text-elegance-body'>
														Include real examples from your experience
													</span>
												</li>
											</ul>
											<ul className='space-y-3'>
												<li className='flex items-start space-x-3'>
													<span className='text-neutral-500'>—</span>
													<span className='text-elegance-body'>
														We personally read and respond to every suggestion
													</span>
												</li>
												<li className='flex items-start space-x-3'>
													<span className='text-neutral-500'>—</span>
													<span className='text-elegance-body'>
														Your ideas directly shape our future offerings
													</span>
												</li>
											</ul>
										</div>
										<div className='mt-6 p-4 bg-neutral-100 border border-neutral-200'>
											<p className='text-elegance-body text-center'>
												"Every great bakery innovation started with a customer's
												brilliant idea!"
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
