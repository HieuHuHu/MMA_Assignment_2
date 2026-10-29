import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { CartProvider } from './src/context/CartContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <CartProvider>
      <StatusBar style="dark" />
      <AppNavigator />
    </CartProvider>
  );
}
