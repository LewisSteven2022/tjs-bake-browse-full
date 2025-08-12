"use client";

import {
	useNotifications,
	showBasketNotification,
	showSuccessNotification,
	showInfoNotification,
	showWarningNotification,
	showErrorNotification,
} from "@/components/NotificationManager";

export default function TestNotificationsPage() {
	const { showNotification } = useNotifications();

	const handleAddToBasket = () => {
		showBasketNotification(
			showNotification,
			"Chocolate Cake",
			() => {
				alert("View Basket clicked! This would navigate to the basket page.");
			},
			() => {
				alert(
					"Continue Shopping clicked! This would keep the user on the current page."
				);
			}
		);
	};

	const handleShowSuccess = () => {
		showSuccessNotification(
			showNotification,
			"Success!",
			"Your action was completed successfully. Everything is working perfectly!"
		);
	};

	const handleShowInfo = () => {
		showInfoNotification(
			showNotification,
			"Information",
			"Here's some useful information about what just happened."
		);
	};

	const handleShowWarning = () => {
		showWarningNotification(
			showNotification,
			"Warning",
			"This is a warning message that requires your attention."
		);
	};

	const handleShowError = () => {
		showErrorNotification(
			showNotification,
			"Error",
			"Something went wrong. Please try again or contact support."
		);
	};

	const handleShowCustom = () => {
		showNotification({
			title: "Custom Notification",
			message:
				"This is a custom notification with specific styling and behavior.",
			type: "info",
			showActions: false,
			autoHide: true,
			duration: 3000,
		});
	};

	const handleShowMultiple = () => {
		// Show multiple notifications in sequence
		setTimeout(() => {
			showBasketNotification(showNotification, "Item 1", undefined, undefined);
		}, 0);

		setTimeout(() => {
			showBasketNotification(showNotification, "Item 2", undefined, undefined);
		}, 300);

		setTimeout(() => {
			showBasketNotification(showNotification, "Item 3", undefined, undefined);
		}, 600);
	};

	return (
		<main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
			<div className="max-w-4xl mx-auto px-4">
				<div className="text-center mb-12">
					<h1 className="text-4xl font-bold text-gray-800 mb-4">
						🎉 Premium Notifications Test
					</h1>
					<p className="text-xl text-gray-600">
						Test the new premium notification system for basket additions
					</p>
				</div>

				{/* Product Card Simulation */}
				<div className="bg-white rounded-2xl shadow-xl p-8 mb-12 text-center">
					<div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-3xl font-bold">
						🍰
					</div>
					<h2 className="text-2xl font-bold text-gray-800 mb-2">
						Chocolate Cake
					</h2>
					<p className="text-3xl font-bold text-blue-600 mb-6">£12.99</p>
					<button
						onClick={handleAddToBasket}
						className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg active:translate-y-0">
						Add to Basket
					</button>
				</div>

				{/* Test Buttons */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					<div className="bg-white rounded-xl shadow-lg p-6">
						<h3 className="text-lg font-semibold text-gray-800 mb-4">
							Basket Notifications
						</h3>
						<button
							onClick={handleAddToBasket}
							className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-200 transform hover:-translate-y-1">
							Add to Basket
						</button>
					</div>

					<div className="bg-white rounded-xl shadow-lg p-6">
						<h3 className="text-lg font-semibold text-gray-800 mb-4">
							Success Notifications
						</h3>
						<button
							onClick={handleShowSuccess}
							className="w-full bg-blue-800 text-white px-4 py-3 rounded-full font-semibold hover:bg-blue-700 transition-all duration-200 transform hover:-translate-y-1">
							Show Success
						</button>
					</div>

					<div className="bg-white rounded-xl shadow-lg p-6">
						<h3 className="text-lg font-semibold text-gray-800 mb-4">
							Info Notifications
						</h3>
						<button
							onClick={handleShowInfo}
							className="w-full bg-blue-800 text-white px-4 py-3 rounded-full font-semibold hover:bg-blue-700 transition-all duration-200 transform hover:-translate-y-1">
							Show Info
						</button>
					</div>

					<div className="bg-white rounded-xl shadow-lg p-6">
						<h3 className="text-lg font-semibold text-gray-800 mb-4">
							Warning Notifications
						</h3>
						<button
							onClick={handleShowWarning}
							className="w-full bg-blue-800 text-white px-4 py-3 rounded-full font-semibold hover:bg-blue-700 transition-all duration-200 transform hover:-translate-y-1">
							Show Warning
						</button>
					</div>

					<div className="bg-white rounded-xl shadow-lg p-6">
						<h3 className="text-lg font-semibold text-gray-800 mb-4">
							Error Notifications
						</h3>
						<button
							onClick={handleShowError}
							className="w-full bg-blue-800 text-white px-4 py-3 rounded-full font-semibold hover:bg-blue-700 transition-all duration-200 transform hover:-translate-y-1">
							Show Error
						</button>
					</div>

					<div className="bg-white rounded-xl shadow-lg p-6">
						<h3 className="text-lg font-semibold text-gray-800 mb-4">
							Custom Notifications
						</h3>
						<button
							onClick={handleShowCustom}
							className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-700 transition-all duration-200 transform hover:-translate-y-1">
							Show Custom
						</button>
					</div>

					<div className="bg-white rounded-xl shadow-lg p-6">
						<h3 className="text-lg font-semibold text-gray-800 mb-4">
							Multiple Notifications
						</h3>
						<button
							onClick={handleShowMultiple}
							className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-3 rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 transform hover:-translate-y-1">
							Show Multiple
						</button>
					</div>
				</div>

				{/* Instructions */}
				<div className="mt-12 bg-blue-50 rounded-xl p-6 border border-blue-200">
					<h3 className="text-lg font-semibold text-blue-800 mb-3">
						How to Test
					</h3>
					<ul className="text-blue-700 space-y-2">
						<li>
							• Click "Add to Basket" to see the premium basket notification
						</li>
						<li>• Try different notification types to see various styles</li>
						<li>• Notifications will appear in the top-right corner</li>
						<li>
							• They auto-hide after a few seconds or can be manually closed
						</li>
						<li>
							• Basket notifications include action buttons for navigation
						</li>
					</ul>
				</div>
			</div>
		</main>
	);
}
