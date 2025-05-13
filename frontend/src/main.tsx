import React from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/router';
import { PurchaseProvider } from './app/domain/context/PurchaseContext';
import { AuthProvider } from './app/domain/context/AuthContext';
import { CartProvider } from './app/domain/context/CartContext';
import { FavoritesProvider } from "./app/domain/context/FavoritesContext";
import './assets/styles/global.css';
import { OrderProvider } from './app/domain/context/OrderContext';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <FavoritesProvider>
        <CartProvider>
          <PurchaseProvider>
            <RouterProvider router={router} />
          </PurchaseProvider>
        </CartProvider>
      </FavoritesProvider>
    </AuthProvider>
  </React.StrictMode>
);
