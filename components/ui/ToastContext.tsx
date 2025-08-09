"use client";
import React, { createContext, useCallback, useContext, useState } from "react";

type ToastType = "success" | "error" | "info";

interface Toast {
	id: number;
	message: string;
	type: ToastType;
	duration: number;
	fading: boolean;
}

interface ToastContextProps {
	showToast: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
	const [toasts, setToasts] = useState<Toast[]>([]);
	const idRef = React.useRef(0);

	// Default durations per type
	const DEFAULT_DURATIONS: Record<ToastType, number> = {
		success: 2500,
		info: 2500,
		error: 4000, // errors stay 4s
	};

	const showToast = useCallback(
		(message: string, type: ToastType = "info", duration?: number) => {
			const id = ++idRef.current;
			const ms = duration ?? DEFAULT_DURATIONS[type];
			setToasts((curr) => [
				...curr,
				{ id, message, type, duration: ms, fading: false },
			]);

			// Start fade out a bit before removal
			setTimeout(() => {
				setToasts((curr) =>
					curr.map((t) => (t.id === id ? { ...t, fading: true } : t))
				);
			}, ms - 500); // fade starts 0.5s before removal

			// Remove after fade out
			setTimeout(() => {
				setToasts((curr) => curr.filter((t) => t.id !== id));
			}, ms);
		},
		[]
	);

	return (
		<ToastContext.Provider value={{ showToast }}>
			{children}
			{/* Toast container */}
			<div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
				{toasts.map((toast) => (
					<div
						key={toast.id}
						className={`px-4 py-2 rounded shadow text-white transition-opacity duration-500
              ${
								toast.type === "success"
									? "bg-green-500"
									: toast.type === "error"
									? "bg-red-500"
									: "bg-blue-500"
							}
              ${toast.fading ? "opacity-0" : "opacity-100"}
            `}>
						{toast.message}
					</div>
				))}
			</div>
		</ToastContext.Provider>
	);
}

export function useToast() {
	const ctx = useContext(ToastContext);
	if (!ctx) {
		throw new Error("useToast must be used within a ToastProvider");
	}
	return ctx;
}
