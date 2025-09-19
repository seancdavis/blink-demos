import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { Feedback } from '../components/Feedback';
import type { FeedbackData } from '../utils/types';

export function Login() {
  useDocumentTitle('Sign In | Blink (Vite)');

  const { user, isLoading, login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && user) {
      navigate('/');
    }
  }, [user, isLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      setFeedback({
        type: 'error',
        message: 'Please enter both username and password.',
      });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const response = await fetch('/api/auth/login', {
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
          message: 'Successfully logged in! Welcome back.',
        });
        // Navigation will happen via useEffect when user state updates
      } else {
        setFeedback({
          type: 'error',
          message: data.error || 'Login failed. Please try again.',
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
            <h1>Sign In to Blink</h1>
            <p>Welcome back! Please sign in to your account.</p>
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
                placeholder="Enter your username"
                className="form-input"
                required
                autoComplete="username"
              />
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
                placeholder="Enter your password"
                className="form-input"
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !username || !password}
              className="button button--full-width"
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <footer className="auth-card__footer">
            <p>
              Don't have an account?{' '}
              <Link to="/register" className="auth-link">
                Sign up here
              </Link>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}