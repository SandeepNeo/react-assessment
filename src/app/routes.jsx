import React from 'react';
import { Navigate } from 'react-router-dom';
import Shell from '../components/layout/Shell';
import EcommercePage from '../modules/ecommerce/pages/EcommercePage';
import CartPage from '../modules/ecommerce/pages/CartPage';

export const routes = [
  {
    path: '/',
    element: <Shell />,
    children: [
      { index: true, element: <Navigate to="/ecommerce" replace /> },
      { path: 'ecommerce', element: <EcommercePage /> },
      { path: 'ecommerce/cart', element: <CartPage /> },
      { path: '*', element: <Navigate to="/ecommerce" replace /> },
    ],
  },
];

export default routes;
