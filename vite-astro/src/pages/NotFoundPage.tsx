import React from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'

const NotFoundPage: React.FC = () => {
  return (
    <HelmetProvider>
      <Layout title="404 Not Found">
        <div className="not-found-page">
          <div className="not-found-content">
            <h1>404</h1>
            <h2>Page not found</h2>
            <p>The page you're looking for doesn't exist or has been moved.</p>
            <div className="not-found-actions">
              <Link className="button" to="/">
                Go home
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    </HelmetProvider>
  )
}

export default NotFoundPage