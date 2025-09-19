import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { Feedback } from '../components/Feedback';
import { isValidUsername, isValidPassword } from '../utils/user';
import type { FeedbackData } from '../utils/types';

export function Register() {
  useDocumentTitle('Sign Up | Blink (Vite)');

  const { user, isLoading, login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && user) {
      navigate('/');
    }
  }, [user, isLoading, navigate]);

  const validateForm = () => {
    if (!username || !password || !confirmPassword) {
      setFeedback({
        type: 'error',
        message: 'Please fill in all fields.',
      });
      return false;
    }

    if (!isValidUsername(username)) {
      setFeedback({
        type: 'error',
        message: 'Username must be 3-30 characters and contain only letters, numbers, underscores, and hyphens.',
      });
      return false;
    }

    if (!isValidPassword(password)) {
      setFeedback({
        type: 'error',
        message: 'Password must be at least 6 characters long.',
      });
      return false;
    }

    if (password !== confirmPassword) {
      setFeedback({
        type: 'error',
        message: 'Passwords do not match.',
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        login(data.user, data.token);
        setFeedback({
          type: 'success',
          message: 'Account created successfully! Welcome to Blink.',
        });
        // Navigation will happen via useEffect when user state updates
      } else {
        setFeedback({
          type: 'error',
          message: data.error || 'Registration failed. Please try again.',
        });
      }
    } catch (error) {
      setFeedback({
        type: 'error',
        message: 'Network error. Please check your connection and try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading if auth is still initializing
  if (isLoading) {
    return (
      <div className="container">
        <div className="loading-state">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="auth-page">
        <div className="auth-card">
          <header className="auth-card__header">
            <h1>Sign Up for Blink</h1>
            <p>Join our community and start sharing your thoughts with the world.</p>
          </header>

          <Feedback feedback={feedback} onClose={() => setFeedback(null)} />

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a unique username"
                className="form-input"
                required
                autoComplete="username"
                minLength={3}
                maxLength={30}
              />
              <div className="form-help">
                3-30 characters, letters, numbers, underscores, and hyphens only
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                className="form-input"
                required
                autoComplete="new-password"
                minLength={6}
              />
              <div className="form-help">
                At least 6 characters
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="form-input"
                required
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !username || !password || !confirmPassword}
              className="button button--full-width"
            >
              {isSubmitting ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <footer className="auth-card__footer">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="auth-link">
                Sign in here
              </Link>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}