import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const CartContext = createContext(null);
const STORAGE_KEY = '@shoply/cart/v1';

function normalizeCart(value) {
  if (!Array.isArray(value)) return [];
  const unique = new Map();
  value.forEach((item) => {
    const productId = Number(item?.productId ?? item?.id);
    const quantity = Math.floor(Number(item?.quantity));
    if (!Number.isFinite(productId) || productId <= 0 || !Number.isFinite(quantity) || quantity < 1) return;
    unique.set(productId, { ...item, id: productId, productId, quantity, price: Number(item.price) || 0 });
  });
  return [...unique.values()];
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isCartReady, setIsCartReady] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (active && saved) setCartItems(normalizeCart(JSON.parse(saved)));
      } catch (error) {
        console.warn('Không thể khôi phục giỏ hàng:', error);
      } finally {
        if (active) setIsCartReady(true);
      }
    })();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!isCartReady) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems)).catch((error) =>
      console.warn('Không thể lưu giỏ hàng:', error),
    );
  }, [cartItems, isCartReady]);

  const addToCart = useCallback((product) => {
    const productId = Number(product?.id ?? product?.productId);
    if (!Number.isFinite(productId) || productId <= 0) return;
    setCartItems((items) => {
      const existing = items.find((item) => item.productId === productId);
      if (existing) return items.map((item) => item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item);
      return [...items, { ...product, id: productId, productId, quantity: 1 }];
    });
  }, []);
  const removeFromCart = useCallback((productId) => setCartItems((items) => items.filter((item) => item.productId !== Number(productId))), []);
  const increaseQuantity = useCallback((productId) => setCartItems((items) => items.map((item) => item.productId === Number(productId) ? { ...item, quantity: item.quantity + 1 } : item)), []);
  const decreaseQuantity = useCallback((productId) => setCartItems((items) => items.map((item) => item.productId === Number(productId) ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item)), []);
  const updateQuantity = useCallback((productId, quantity) => {
    const next = Math.floor(Number(quantity));
    if (next <= 0) return removeFromCart(productId);
    setCartItems((items) => items.map((item) => item.productId === Number(productId) ? { ...item, quantity: next } : item));
  }, [removeFromCart]);
  const clearCart = useCallback(() => setCartItems([]), []);

  const value = useMemo(() => ({
    cartItems, isCartReady, addToCart, removeFromCart, increaseQuantity, decreaseQuantity, updateQuantity, clearCart,
    cartItemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
    distinctItemCount: cartItems.length,
    cartTotal: cartItems.reduce((sum, item) => sum + (Number(item.price) || 0) * item.quantity, 0),
  }), [cartItems, isCartReady, addToCart, removeFromCart, increaseQuantity, decreaseQuantity, updateQuantity, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
