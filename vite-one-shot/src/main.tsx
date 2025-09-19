import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { AuthProvider } from './contexts/AuthContext';
import App from './App';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { PostDetail } from './pages/PostDetail';
import { Posts } from './pages/Posts';
import { NotFound } from './pages/NotFound';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
      {
        path: '@/:username',
        element: <Profile />,
      },
      {
        path: 'posts/p/:page',
        element: <Posts />,
      },
      {
        path: 'posts/:id',
        element: <PostDetail />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);