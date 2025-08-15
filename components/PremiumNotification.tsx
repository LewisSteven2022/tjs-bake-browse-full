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
				return "bg-neutral-900";
			case "success":
				return "bg-green-600";
			case "info":
				return "bg-neutral-700";
			case "warning":
				return "bg-yellow-600";
			case "error":
				return "bg-red-600";
			default:
				return "bg-neutral-900";
		}
	};

	const getBorderColor = () => {
		switch (type) {
			case "basket":
				return "border-l-neutral-900";
			case "success":
				return "border-l-green-600";
			case "info":
				return "border-l-neutral-700";
			case "warning":
				return "border-l-yellow-600";
			case "error":
				return "border-l-red-600";
			default:
				return "border-l-neutral-900";
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
					className={`relative bg-white shadow-lg border-l-4 ${getBorderColor()} overflow-hidden border border-neutral-200`}
					style={{ minWidth: "280px", maxWidth: "340px" }}>
					<div className="p-4">
						{/* Header */}
						<div className="flex items-center justify-between mb-3">
							<div className="flex items-center gap-3">
								<div
									className={`w-7 h-7 ${getIconBg()} flex items-center justify-center text-white`}>
									{getIcon()}
								</div>
								<h3 className="text-elegance-heading text-base">{title}</h3>
							</div>
							<button
								onClick={handleClose}
								className="text-neutral-400 hover:text-neutral-600 transition-colors p-1 hover:bg-neutral-100">
								<X size={16} />
							</button>
						</div>

						{/* Message */}
						<p className="text-elegance-body text-sm mb-4">{message}</p>

						{/* Actions */}
						{showActions && (
							<div className="flex gap-3">
								{onViewBasket && (
									<button
										onClick={onViewBasket}
										className="flex-1 btn-elegance-primary text-sm">
										View Basket
									</button>
								)}
								{onContinueShopping && (
									<button
										onClick={onContinueShopping}
										className="flex-1 btn-elegance-secondary text-sm">
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
