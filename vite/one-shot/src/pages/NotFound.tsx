import React from 'react';
import { Link } from 'react-router';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export function NotFound() {
  useDocumentTitle('Page Not Found | Blink (Vite)');

  return (
    <div className="container">
      <div className="not-found">
        <div className="not-found__content">
          <h1 className="not-found__title">404</h1>
          <h2 className="not-found__subtitle">Page Not Found</h2>
          <p className="not-found__message">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="not-found__actions">
            <Link to="/" className="button">
              Go Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="button button--outline"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}