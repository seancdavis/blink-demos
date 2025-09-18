import { useDocumentTitle } from "../hooks/useDocumentTitle";

export default function NotFound() {
  useDocumentTitle("404 - Page Not Found | Blink (Vite)");

  return (
    <div className="container-xs not-found-page">
      <div className="not-found-content">
        <h1>404</h1>
        <h2>Page not found</h2>
        <p>The page you're looking for doesn't exist or has been moved.</p>
        <div className="not-found-actions">
          <a href="/" className="button">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}
