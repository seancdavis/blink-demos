import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useFeedback } from '../contexts/FeedbackContext'

export default function LoginForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { login } = useAuth()
  const { setFeedback } = useFeedback()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (isSubmitting) {
      return false
    }

    setIsSubmitting(true)

    try {
      const formData = new FormData(e.currentTarget)
      const username = formData.get('username') as string
      const password = formData.get('password') as string

      const success = await login(username, password)

      if (success) {
        setFeedback({ message: 'Successfully signed in!', classname: 'success' })
        navigate('/')
      } else {
        setFeedback({ message: 'Invalid username or password', classname: 'error' })
      }
    } catch (error) {
      console.error('Login error:', error)
      setFeedback({ message: 'An error occurred during sign in', classname: 'error' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">Username</label>
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
          Don't have an account? <Link to="/register">Create an account</Link>
        </span>
      </div>
    </form>
  )
}