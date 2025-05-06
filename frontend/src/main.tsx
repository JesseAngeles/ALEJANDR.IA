import React from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/router';
import { PurchaseProvider } from './app/domain/context/PurchaseContext';
import { AuthProvider } from './app/domain/context/AuthContext';
import './assets/styles/global.css';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <PurchaseProvider>
        <RouterProvider router={router} />
      </PurchaseProvider>
    </AuthProvider>
  </React.StrictMode>
);
