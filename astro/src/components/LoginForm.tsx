import { useState } from 'react'

export default function Login() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (isSubmitting) {
      e.preventDefault()
      return false
    }

    setIsSubmitting(true)

    // Re-enable after 5 seconds as fallback (in case of network issues)
    setTimeout(() => {
      setIsSubmitting(false)
    }, 5000)
  }

  return (
    <div className="container-xs">
      <h1>Sign in</h1>

      <form action="/api/auth/login" method="post" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">username</label>
          <input type="text" name="username" id="username" required autoFocus />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password" minLength={8} required />
        </div>

        <div className="form-actions">
          <button 
            className="button" 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
          <span className="form-actions-link">
            Don't have an account? <a href="/register">Create an account</a>
          </span>
        </div>
      </form>
    </div>
  )
}