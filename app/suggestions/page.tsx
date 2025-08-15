"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SuggestionsPage() {
	const { data: session, status } = useSession();
	const router = useRouter();

	const [formData, setFormData] = useState({
		subject: "",
		message: "",
		category: "general",
	});
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Debug logging
	// silent

	// Redirect if not logged in
	if (status === "loading") {
		// silent
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800 mx-auto"></div>
					<p className="mt-4 text-gray-600">Loading...</p>
				</div>
			</div>
		);
	}

	if (status === "unauthenticated") {
		// silent
		router.push("/login?callbackUrl=/suggestions");
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<p className="text-gray-600">Redirecting to login...</p>
				</div>
			</div>
		);
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			const response = await fetch("/api/suggestions", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					...formData,
					userEmail: session?.user?.email,
					userName: session?.user?.name,
				}),
			});

			if (response.ok) {
				alert("Thank you! Your suggestion has been submitted successfully.");
				setFormData({ subject: "", message: "", category: "general" });
			} else {
				const error = await response.json();
				throw new Error(error.message || "Failed to submit suggestion");
			}
		} catch (error) {
			alert(
				`Submission Failed: ${
					error instanceof Error
						? error.message
						: "Something went wrong. Please try again."
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
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="text-center mb-12">
					<div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-6">
						<svg
							className="w-8 h-8 text-white"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
							/>
						</svg>
					</div>
					<h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
						Share Your Ideas
					</h1>
					<p className="text-xl text-blue-700 max-w-2xl mx-auto leading-relaxed">
						Your feedback shapes our future. Help us create the perfect bakery
						experience for our community.
					</p>
				</div>

				{/* Form Card */}
				<div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-blue-100 p-8 md:p-12 relative overflow-hidden">
					{/* Decorative background elements */}
					<div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-l from-blue-100 to-transparent rounded-full -translate-y-32 translate-x-32 opacity-50"></div>
					<div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-r from-indigo-100 to-transparent rounded-full translate-y-24 -translate-x-24 opacity-50"></div>

					<div className="relative z-10">
						<form onSubmit={handleSubmit} className="space-y-8">
							{/* Category Selection */}
							<div className="space-y-3">
								<label
									htmlFor="category"
									className="block text-lg font-semibold text-blue-900 mb-3">
									💡 Feedback Category
								</label>
								<select
									id="category"
									name="category"
									value={formData.category}
									onChange={handleChange}
									className="w-full rounded-2xl border-2 border-blue-200 bg-blue-50/50 px-6 py-4 text-blue-900 font-medium focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-200 transition-all duration-200 shadow-sm hover:shadow-md"
									required>
									<option value="general">🌟 General Feedback</option>
									<option value="product">🥖 Product Suggestions</option>
									<option value="service">⭐ Service Improvements</option>
									<option value="website">💻 Website Experience</option>
									<option value="ordering">🛒 Ordering Process</option>
									<option value="other">💭 Other</option>
								</select>
							</div>

							{/* Subject */}
							<div className="space-y-3">
								<label
									htmlFor="subject"
									className="block text-lg font-semibold text-blue-900 mb-3">
									📝 Subject *
								</label>
								<input
									type="text"
									id="subject"
									name="subject"
									value={formData.subject}
									onChange={handleChange}
									className="w-full rounded-2xl border-2 border-blue-200 bg-blue-50/50 px-6 py-4 text-blue-900 font-medium focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-200 transition-all duration-200 shadow-sm hover:shadow-md placeholder:text-blue-400"
									placeholder="What's your brilliant idea about?"
									required
									maxLength={100}
								/>
							</div>

							{/* Message */}
							<div className="space-y-3">
								<label
									htmlFor="message"
									className="block text-lg font-semibold text-blue-900 mb-3">
									💬 Your Suggestion *
								</label>
								<textarea
									id="message"
									name="message"
									value={formData.message}
									onChange={handleChange}
									rows={8}
									className="w-full rounded-2xl border-2 border-blue-200 bg-blue-50/50 px-6 py-4 text-blue-900 font-medium focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-200 transition-all duration-200 shadow-sm hover:shadow-md placeholder:text-blue-400 resize-none"
									placeholder="Tell us your ideas, suggestions, or feedback in detail. Every word counts towards making our bakery better!"
									required
									maxLength={1000}
								/>
								<div className="flex justify-between items-center">
									<p className="text-sm text-blue-600 font-medium">
										{formData.message.length}/1000 characters
									</p>
									<div className="flex items-center text-blue-600 text-sm">
										<svg
											className="w-4 h-4 mr-1"
											fill="currentColor"
											viewBox="0 0 20 20">
											<path
												fillRule="evenodd"
												d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
												clipRule="evenodd"
											/>
										</svg>
										Be specific for best results
									</div>
								</div>
							</div>

							{/* Submit Button */}
							<div className="pt-6">
								<button
									type="submit"
									disabled={isSubmitting}
									className="w-full rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-8 py-5 text-white text-lg font-bold hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0">
									{isSubmitting ? (
										<div className="flex items-center justify-center">
											<div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent mr-3"></div>
											<span>Submitting Your Brilliant Ideas...</span>
										</div>
									) : (
										<div className="flex items-center justify-center">
											<svg
												className="w-6 h-6 mr-3"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24">
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
												/>
											</svg>
											<span>Submit Your Suggestion</span>
										</div>
									)}
								</button>
							</div>
						</form>

						{/* Additional Info */}
						<div className="mt-12 pt-8 border-t border-blue-200/50">
							<div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200">
								<div className="flex items-start space-x-4">
									<div className="flex-shrink-0">
										<div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
											<svg
												className="w-6 h-6 text-white"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24">
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
												/>
											</svg>
										</div>
									</div>
									<div className="flex-1">
										<h3 className="text-xl font-bold text-blue-900 mb-4">
											💡 Tips for Outstanding Feedback
										</h3>
										<div className="grid md:grid-cols-2 gap-4">
											<ul className="space-y-3">
												<li className="flex items-start space-x-3">
													<span className="text-blue-500 font-bold">✓</span>
													<span className="text-blue-800 font-medium">
														Be specific about improvements you'd like to see
													</span>
												</li>
												<li className="flex items-start space-x-3">
													<span className="text-blue-500 font-bold">✓</span>
													<span className="text-blue-800 font-medium">
														Include real examples from your experience
													</span>
												</li>
											</ul>
											<ul className="space-y-3">
												<li className="flex items-start space-x-3">
													<span className="text-blue-500 font-bold">✓</span>
													<span className="text-blue-800 font-medium">
														We personally read and respond to every suggestion
													</span>
												</li>
												<li className="flex items-start space-x-3">
													<span className="text-blue-500 font-bold">✓</span>
													<span className="text-blue-800 font-medium">
														Your ideas directly shape our future offerings
													</span>
												</li>
											</ul>
										</div>
										<div className="mt-6 p-4 bg-white/60 rounded-xl border border-blue-200">
											<p className="text-blue-700 font-medium text-center">
												<span className="text-2xl mr-2">🎯</span>
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
		</div>
	);
}
