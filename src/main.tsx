import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

// Import all your pages
import { HomePage } from './pages/homepage.tsx'; // Ensure this filename is correct (maybe HomePage.tsx?)
import { DetailsPage } from './pages/DetailsPage.tsx';
import { CheckoutPage } from './pages/CheckoutPage.tsx'; // 1. Import CheckoutPage
import { ResultPage } from './pages/ResultPage.tsx'; // 1. Import ResultPage
// Define the router ONCE
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // App is the main layout (with Header)
    children: [
      {
        path: '/', // The default page to show
        element: <HomePage />,
      },
      {
        path: '/details/:id', // The route for the details page
        element: <DetailsPage />,
      },
      { // 2. Add this new route object
        path: '/checkout', 
        element: <CheckoutPage />,
      },
      { // 2. Add this new route object
        path: '/result',
        element: <ResultPage />,
      },
      // We will add more routes here
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);