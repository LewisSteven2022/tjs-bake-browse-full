"use client";

import { useState } from "react";

export default function SuggestionsTestPage() {
	const [formData, setFormData] = useState({
		subject: "",
		message: "",
		category: "general",
	});
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		// Simulate submission
		setTimeout(() => {
			setIsSubmitting(false);
			alert("Test form submitted successfully!");
			setFormData({ subject: "", message: "", category: "general" });
		}, 1000);
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

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="max-w-2xl mx-auto px-4">
				<div className="bg-white rounded-lg shadow-lg p-8">
					<div className="text-center mb-8">
						<h1 className="text-3xl font-bold text-gray-900 mb-2">
							💡 Share Your Suggestions
						</h1>
						<p className="text-gray-600">
							Help us improve TJ's Bake & Browse with your feedback and ideas
						</p>
					</div>

					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Category */}
						<div>
							<label
								htmlFor="category"
								className="block text-sm font-medium text-gray-700 mb-2">
								Category *
							</label>
							<select
								id="category"
								name="category"
								value={formData.category}
								onChange={handleChange}
								className="w-full rounded-full border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
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
								className="w-full rounded-full border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
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
								className="w-full rounded-full border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
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

					{/* Test Info */}
					<div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
						<p className="text-sm text-yellow-800">
							<strong>Test Mode:</strong> This is a test page without
							authentication. The form will show a success message but won't
							actually send emails.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
