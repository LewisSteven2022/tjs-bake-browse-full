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
		<div className="min-h-screen bg-gray-50 py-12">
			<div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-4">
						Share Your Suggestions
					</h1>
					<p className="text-lg text-gray-600">
						We value your feedback! Help us improve our products and service.
					</p>
				</div>

				{/* Form Card */}
				<div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Category Selection */}
						<div>
							<label
								htmlFor="category"
								className="block text-sm font-medium text-gray-700 mb-2">
								Feedback Category
							</label>
							<select
								id="category"
								name="category"
								value={formData.category}
								onChange={handleChange}
								className="w-full rounded-full border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
								required>
								<option value="general">General Feedback</option>
								<option value="product">Product Suggestions</option>
								<option value="service">Service Improvements</option>
								<option value="website">Website Experience</option>
								<option value="ordering">Ordering Process</option>
								<option value="other">Other</option>
							</select>
						</div>

						{/* Subject */}
						<div>
							<label
								htmlFor="subject"
								className="block text-sm font-medium text-gray-700 mb-2">
								Subject *
							</label>
							<input
								type="text"
								id="subject"
								name="subject"
								value={formData.subject}
								onChange={handleChange}
								className="w-full rounded-full border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
								placeholder="Brief summary of your suggestion"
								required
								maxLength={100}
							/>
						</div>

						{/* Message */}
						<div>
							<label
								htmlFor="message"
								className="block text-sm font-medium text-gray-700 mb-2">
								Your Suggestion *
							</label>
							<textarea
								id="message"
								name="message"
								value={formData.message}
								onChange={handleChange}
								rows={6}
								className="w-full rounded-full border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
								placeholder="Please provide detailed feedback or suggestions..."
								required
								maxLength={1000}
							/>
							<p className="mt-1 text-sm text-gray-500">
								{formData.message.length}/1000 characters
							</p>
						</div>

						{/* Submit Button */}
						<div className="pt-4">
							<button
								type="submit"
								disabled={isSubmitting}
								className="w-full rounded-full bg-blue-800 px-6 py-3 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
								{isSubmitting ? (
									<div className="flex items-center justify-center">
										<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
										Submitting...
									</div>
								) : (
									"Submit Suggestion"
								)}
							</button>
						</div>
					</form>

					{/* Additional Info */}
					<div className="mt-8 pt-6 border-t border-gray-200">
						<div className="bg-blue-50 rounded-lg p-4">
							<h3 className="text-sm font-medium text-blue-800 mb-2">
								💡 Tips for Great Feedback
							</h3>
							<ul className="text-sm text-blue-700 space-y-1">
								<li>• Be specific about what you'd like to see improved</li>
								<li>• Include examples if possible</li>
								<li>• We read every suggestion and respond to all feedback</li>
								<li>
									• Your input helps shape our future products and services
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
