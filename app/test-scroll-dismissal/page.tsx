"use client";

import {
	useNotifications,
	showBasketNotification,
} from "@/components/NotificationManager";

export default function TestScrollDismissalPage() {
	const { showNotification } = useNotifications();

	const testBasketNotification = () => {
		showBasketNotification(
			showNotification,
			"Test Product",
			() => alert("View Basket clicked!"),
			() => alert("Continue Shopping clicked!")
		);
	};

	const testSuccessNotification = () => {
		showNotification({
			title: "Success! 🎉",
			message:
				"This is a test success notification. Try scrolling down to see it auto-dismiss!",
			type: "success",
			autoHide: true,
			duration: 10000,
			dismissOnScroll: true,
		});
	};

	const testInfoNotification = () => {
		showNotification({
			title: "Info 📋",
			message:
				"This notification will automatically disappear when you scroll down. Scroll down to test it!",
			type: "info",
			autoHide: true,
			duration: 10000,
			dismissOnScroll: true,
		});
	};

	const testWarningNotification = () => {
		showNotification({
			title: "Warning ⚠️",
			message:
				"This is a test warning notification. Try scrolling down to see it auto-dismiss!",
			type: "warning",
			autoHide: true,
			duration: 10000,
			dismissOnScroll: true,
		});
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
					Scroll-Based Notification Dismissal Test
				</h1>

				<div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
					<h2 className="text-2xl font-semibold text-gray-800 mb-6">
						Test Notifications
					</h2>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
						<button
							onClick={testBasketNotification}
							className="bg-blue-800 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition-all duration-200 transform hover:-translate-y-1">
							Test Basket Notification
						</button>

						<button
							onClick={testSuccessNotification}
							className="bg-blue-800 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition-all duration-200 transform hover:-translate-y-1">
							Test Success Notification
						</button>
						<button
							onClick={testInfoNotification}
							className="bg-blue-800 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition-all duration-200 transform hover:-translate-y-1">
							Test Info Notification
						</button>
						<button
							onClick={testWarningNotification}
							className="bg-blue-800 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition-all duration-200 transform hover:-translate-y-1">
							Test Warning Notification
						</button>
					</div>

					<div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
						<h3 className="font-semibold text-blue-800 mb-2">How to Test:</h3>
						<ol className="text-blue-700 space-y-1 text-sm">
							<li>1. Click any of the test buttons above</li>
							<li>2. A notification will appear in the bottom-right corner</li>
							<li>3. Scroll down on this page (or anywhere on the page)</li>
							<li>
								4. The notification will automatically dismiss when you scroll
								down
							</li>
							<li>5. Try scrolling up and down to see the effect</li>
						</ol>
					</div>
				</div>

				{/* Scrollable content to test dismissal */}
				<div className="space-y-8">
					{Array.from({ length: 20 }, (_, i) => (
						<div key={i} className="bg-white rounded-xl shadow-lg p-6">
							<h3 className="text-xl font-semibold text-gray-800 mb-3">
								Scroll Section {i + 1}
							</h3>
							<p className="text-gray-600 leading-relaxed">
								This is scrollable content to test the notification dismissal.
								When you scroll down, any active notifications will
								automatically fade out. This provides a better user experience
								by not blocking content when users want to read.
							</p>
							<div className="mt-4 p-4 bg-gray-50 rounded-lg">
								<p className="text-sm text-gray-500">
									<strong>Tip:</strong> Try scrolling down from here to see
									notifications dismiss automatically!
								</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
