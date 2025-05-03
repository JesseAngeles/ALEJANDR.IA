import React from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/router';
import { PurchaseProvider } from './app/domain/context/PurchaseContext';
import { AuthProvider } from './app/domain/context/AuthContext';
import { CartProvider } from './app/domain/context/CartContext'; // ✅ IMPORTANTE
import './assets/styles/global.css';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider> {/* ✅ Aquí envuelves con el contexto del carrito */}
        <PurchaseProvider>
          <RouterProvider router={router} />
        </PurchaseProvider>
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);
