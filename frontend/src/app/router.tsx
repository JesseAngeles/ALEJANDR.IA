import { createBrowserRouter } from 'react-router-dom';
import { RootLayout } from './layout/RootLayout';
import { HomePage } from './routes/home/HomePage';
import {ShoppingCart} from './routes/shopping/ShoppingCart'
import {Account} from './routes/account/Account'
import React from 'react';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/cart',
        element: <ShoppingCart />
      },
      {
        path: '/account',
        element: <Account/>
      }
      // Otras rutas...
    ],
  },
]);