"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import PremiumNotification, { NotificationProps } from "./PremiumNotification";

interface NotificationContextType {
	showNotification: (notification: Omit<NotificationProps, "id">) => void;
	hideNotification: (id: string) => void;
	clearAllNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
	undefined
);

export const useNotifications = () => {
	const context = useContext(NotificationContext);
	if (!context) {
		throw new Error(
			"useNotifications must be used within a NotificationProvider"
		);
	}
	return context;
};

interface NotificationManagerProps {
	children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationManagerProps> = ({
	children,
}) => {
	const [notifications, setNotifications] = useState<NotificationProps[]>([]);

	const showNotification = useCallback(
		(notification: Omit<NotificationProps, "id">) => {
			const id = `notification-${Date.now()}-${Math.random()
				.toString(36)
				.substr(2, 9)}`;
			const newNotification: NotificationProps = {
				...notification,
				id,
			};

			setNotifications((prev) => [...prev, newNotification]);
		},
		[]
	);

	const hideNotification = useCallback((id: string) => {
		setNotifications((prev) =>
			prev.filter((notification) => notification.id !== id)
		);
	}, []);

	const clearAllNotifications = useCallback(() => {
		setNotifications([]);
	}, []);

	const handleNotificationClose = useCallback(
		(id: string) => {
			hideNotification(id);
		},
		[hideNotification]
	);

	return (
		<NotificationContext.Provider
			value={{ showNotification, hideNotification, clearAllNotifications }}>
			{children}

			{/* Notification Container - Bottom Right */}
			<div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 max-w-xs">
				{notifications.map((notification) => (
					<PremiumNotification
						key={notification.id}
						{...notification}
						onClose={() => handleNotificationClose(notification.id)}
					/>
				))}
			</div>
		</NotificationContext.Provider>
	);
};

// Convenience functions for common notification types
export const showBasketNotification = (
	showNotification: (notification: Omit<NotificationProps, "id">) => void,
	productName: string,
	onViewBasket?: () => void,
	onContinueShopping?: () => void
) => {
	showNotification({
		title: "Added to Basket! 🎉",
		message: `${productName} has been successfully added to your basket. You can now view your basket or continue shopping.`,
		type: "basket",
		showActions: true,
		onViewBasket,
		onContinueShopping,
		autoHide: true,
		duration: 5000,
		dismissOnScroll: true,
	});
};

export const showSuccessNotification = (
	showNotification: (notification: Omit<NotificationProps, "id">) => void,
	title: string,
	message: string,
	duration?: number
) => {
	showNotification({
		title,
		message,
		type: "success",
		autoHide: true,
		duration: duration || 4000,
		dismissOnScroll: true,
	});
};

export const showInfoNotification = (
	showNotification: (notification: Omit<NotificationProps, "id">) => void,
	title: string,
	message: string,
	duration?: number
) => {
	showNotification({
		title,
		message,
		type: "info",
		autoHide: true,
		duration: duration || 4000,
		dismissOnScroll: true,
	});
};

export const showWarningNotification = (
	showNotification: (notification: Omit<NotificationProps, "id">) => void,
	title: string,
	message: string,
	duration?: number
) => {
	showNotification({
		title,
		message,
		type: "warning",
		autoHide: true,
		duration: duration || 5000,
		dismissOnScroll: true,
	});
};

export const showErrorNotification = (
	showNotification: (notification: Omit<NotificationProps, "id">) => void,
	title: string,
	message: string,
	duration?: number
) => {
	showNotification({
		title,
		message,
		type: "error",
		autoHide: true,
		duration: duration || 6000,
		dismissOnScroll: true,
	});
};
