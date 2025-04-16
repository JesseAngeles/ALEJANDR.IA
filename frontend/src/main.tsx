import React from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/router';
import { PurchaseProvider } from './app/domain/context/PurchaseContext';
import './assets/styles/global.css';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PurchaseProvider>
      <RouterProvider router={router} />
    </PurchaseProvider>
  </React.StrictMode>
);
