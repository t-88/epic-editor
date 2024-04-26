import engine from './lib/engine';
import runner from './lib/runner';
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Runner from './routes/Runner';
import { init_wasm } from './op_lang/wapper';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/run",
    element: <Runner />,
  },
]);

init_wasm();
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<RouterProvider router={router} />);


