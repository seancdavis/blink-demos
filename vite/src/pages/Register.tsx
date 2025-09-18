import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { Feedback } from '../components/Feedback';
import { feedbackData } from '../utils/feedback-data';
import { useAuth } from '../contexts/AuthContext';

export default function Register() {
  useDocumentTitle('Register | Blink (Vite)');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (!username || !password || !passwordConfirmation) {
      setError('user_pass_req');
      return;
    }

    if (password !== passwordConfirmation) {
      setError('pass_no_match');
      return;
    }

    if (password.length < 8) {
      setError('pass_too_short');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
          password_confirmation: passwordConfirmation,
        }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          setError('user_exists');
        } else {
          setError(data.error || 'Registration failed');
        }
        return;
      }

      // Store user data and token in context/localStorage
      login(data.user, data.token);

      // Redirect to home page on success
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      // Re-enable after 5 seconds as fallback
      setTimeout(() => {
        setIsSubmitting(false);
      }, 5000);
    }
  };

  return (
    <div className="container-xs">
      <h1>Register new account</h1>

      <Feedback
        feedbackKey={error && error in feedbackData ? error as any : null}
        customMessage={error && !(error in feedbackData) ? error : undefined}
        type="error"
      />

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoFocus
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="password_confirmation">Confirm password</label>
          <input
            type="password"
            name="password_confirmation"
            id="password_confirmation"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            required
            disabled={isSubmitting}
          />
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
            Already have an account? <Link to="/login">Sign in</Link>
          </span>
        </div>
      </form>
    </div>
  );
}