import engine from './lib/engine';
import {
    createBrowserRouter,
    RouterProvider,
  } from "react-router-dom"


import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Runner from './routes/Runner';

const router = createBrowserRouter([
    {
      path: "/",
      element:<App />,
    },
    {
      path: "/run",
      element:<Runner />,
    },
  ]);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<RouterProvider router={router}/>);
