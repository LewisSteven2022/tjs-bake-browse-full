"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { CartItem, getCart, getCartItemCount, getCartTotal } from "@/lib/cart";

interface CartContextType {
	items: CartItem[];
	itemCount: number;
	total: number;
	loading: boolean;
	refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
	const [items, setItems] = useState<CartItem[]>([]);
	const [loading, setLoading] = useState(true);

	const refreshCart = async () => {
		try {
			const cartItems = await getCart();
			setItems(cartItems);
		} catch (error) {
			console.error("Failed to refresh cart:", error);
			setItems([]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		refreshCart();
	}, []);

	useEffect(() => {
		const handleCartChange = () => {
			refreshCart();
		};

		window.addEventListener("cart:changed", handleCartChange);
		return () => window.removeEventListener("cart:changed", handleCartChange);
	}, []);

	const itemCount = getCartItemCount();
	const total = getCartTotal();

	return (
		<CartContext.Provider
			value={{
				items,
				itemCount,
				total,
				loading,
				refreshCart,
			}}>
			{children}
		</CartContext.Provider>
	);
}

export function useCart() {
	const context = useContext(CartContext);
	if (context === undefined) {
		throw new Error("useCart must be used within a CartProvider");
	}
	return context;
}
