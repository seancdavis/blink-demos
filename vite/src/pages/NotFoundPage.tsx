import React from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Feedback from '../components/Feedback'

function NotFoundPage() {
  React.useEffect(() => {
    document.title = 'Page not found - Blink'
  }, [])

  return (
    <>
      <Header />
      <Feedback />

      <div className="container-xs not-found">
        <div className="not-found-content">
          <h1>404</h1>
          <h2>Page not found</h2>
          <p>The page you're looking for doesn't exist or has been moved.</p>
          <div className="form-actions">
            <Link className="button" to="/">
              Go home
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default NotFoundPage