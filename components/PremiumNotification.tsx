"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, X, ShoppingCart, Info, AlertCircle } from "lucide-react";

export interface NotificationProps {
	id: string;
	title: string;
	message: string;
	type?: "success" | "info" | "warning" | "error" | "basket";
	showActions?: boolean;
	onViewBasket?: () => void;
	onContinueShopping?: () => void;
	onClose?: () => void;
	autoHide?: boolean;
	duration?: number;
	dismissOnScroll?: boolean;
}

export interface NotificationAction {
	label: string;
	onClick: () => void;
	variant?: "primary" | "secondary";
}

const PremiumNotification: React.FC<NotificationProps> = ({
	id,
	title,
	message,
	type = "success",
	showActions = false,
	onViewBasket,
	onContinueShopping,
	onClose,
	autoHide = true,
	duration = 5000,
	dismissOnScroll = true,
}) => {
	const [isVisible, setIsVisible] = useState(true);

	useEffect(() => {
		if (autoHide) {
			const timer = setTimeout(() => {
				handleClose();
			}, duration);

			return () => clearTimeout(timer);
		}
	}, [autoHide, duration]);

	// Scroll detection for auto-dismiss
	useEffect(() => {
		if (!dismissOnScroll) return;

		let lastScrollY = window.scrollY;
		let scrollTimeout: NodeJS.Timeout;

		const handleScroll = () => {
			const currentScrollY = window.scrollY;

			// If scrolling down more than 50px, dismiss notification
			if (currentScrollY > lastScrollY + 50) {
				handleClose();
			}

			lastScrollY = currentScrollY;
		};

		// Throttle scroll events for better performance
		const throttledScroll = () => {
			clearTimeout(scrollTimeout);
			scrollTimeout = setTimeout(handleScroll, 100);
		};

		window.addEventListener("scroll", throttledScroll, { passive: true });

		return () => {
			window.removeEventListener("scroll", throttledScroll);
			clearTimeout(scrollTimeout);
		};
	}, [dismissOnScroll]);

	const handleClose = () => {
		setIsVisible(false);
		setTimeout(() => {
			onClose?.();
		}, 300);
	};

	const getIcon = () => {
		switch (type) {
			case "basket":
				return <ShoppingCart size={15} />;
			case "success":
				return <CheckCircle size={15} />;
			case "info":
				return <Info size={15} />;
			case "warning":
			case "error":
				return <AlertCircle size={15} />;
			default:
				return <CheckCircle size={15} />;
		}
	};

	const getIconBg = () => {
		switch (type) {
			case "basket":
				return "bg-gradient-to-br from-blue-500 to-purple-600";
			case "success":
				return "bg-gradient-to-br from-green-500 to-emerald-600";
			case "info":
				return "bg-gradient-to-br from-blue-500 to-cyan-600";
			case "warning":
				return "bg-gradient-to-br from-yellow-500 to-orange-600";
			case "error":
				return "bg-gradient-to-br from-red-500 to-pink-600";
			default:
				return "bg-gradient-to-br from-blue-500 to-purple-600";
		}
	};

	const getBorderColor = () => {
		switch (type) {
			case "basket":
				return "border-l-blue-500";
			case "success":
				return "border-l-green-500";
			case "info":
				return "border-l-blue-500";
			case "warning":
				return "border-l-yellow-500";
			case "error":
				return "border-l-red-500";
			default:
				return "border-l-blue-500";
		}
	};

	const getShimmerColors = () => {
		switch (type) {
			case "basket":
				return "from-blue-500 via-purple-600 to-pink-500";
			case "success":
				return "from-green-500 via-emerald-600 to-teal-500";
			case "info":
				return "from-blue-500 via-cyan-600 to-indigo-500";
			case "warning":
				return "from-yellow-500 via-orange-600 to-red-500";
			case "error":
				return "from-red-500 via-pink-600 to-rose-500";
			default:
				return "from-blue-500 via-purple-600 to-pink-500";
		}
	};

	return (
		<AnimatePresence>
			{isVisible && (
				<motion.div
					initial={{ x: 400, y: 100, opacity: 0, scale: 0.8 }}
					animate={{ x: 0, y: 0, opacity: 1, scale: 1 }}
					exit={{ x: 400, y: 100, opacity: 0, scale: 0.8 }}
					transition={{
						type: "spring",
						stiffness: 300,
						damping: 30,
						duration: 0.4,
					}}
					className={`relative bg-white rounded-xl shadow-lg border-l-4 ${getBorderColor()} overflow-hidden border border-gray-100`}
					style={{ minWidth: "280px", maxWidth: "340px" }}>
					{/* Shimmer effect at top */}
					<div
						className={`h-1 bg-gradient-to-r ${getShimmerColors()} animate-pulse`}
					/>

					<div className="p-4">
						{/* Header */}
						<div className="flex items-center justify-between mb-3">
							<div className="flex items-center gap-3">
								<div
									className={`w-7 h-7 rounded-full ${getIconBg()} flex items-center justify-center text-white shadow-lg`}>
									{getIcon()}
								</div>
								<h3 className="font-bold text-gray-900 text-base tracking-tight">
									{title}
								</h3>
							</div>
							<button
								onClick={handleClose}
								className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100">
								<X size={16} />
							</button>
						</div>

						{/* Message */}
						<p className="text-gray-700 text-sm leading-relaxed mb-4 font-medium">
							{message}
						</p>

						{/* Actions */}
						{showActions && (
							<div className="flex gap-3">
								{onViewBasket && (
									<button
										onClick={onViewBasket}
                                        className="flex-1 bg-primaryDark text-white px-4 py-2.5 rounded-full font-semibold text-sm hover:bg-primary transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0">
										View Basket
									</button>
								)}
								{onContinueShopping && (
									<button
										onClick={onContinueShopping}
										className="flex-1 bg-gray-50 text-gray-700 px-4 py-2.5 rounded-full font-semibold text-sm hover:bg-gray-100 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 border border-gray-200">
										Continue Shopping
									</button>
								)}
							</div>
						)}
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default PremiumNotification;
