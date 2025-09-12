import { useState } from 'react'

export default function RegistrationForm() {
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
      <h1>Register new account</h1>

      <form action="/api/auth/register" method="post" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input type="text" name="username" id="username" required autoFocus />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password" minLength={8} required />
        </div>

        <div>
          <label htmlFor="password_confirmation">Confirm password</label>
          <input type="password" name="password_confirmation" id="password_confirmation" required />
        </div>

        <div className="form-actions">
          <button 
            className="button" 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating account...' : 'Register'}
          </button>
          <span className="form-actions-link">
            Already have an account? <a href="/login">Sign in</a>
          </span>
        </div>
      </form>
    </div>
  )
}