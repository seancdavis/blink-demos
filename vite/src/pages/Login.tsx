import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { Feedback } from "../components/Feedback";
import { feedbackData } from "../utils/feedback-data";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  useDocumentTitle("Login | Blink (Vite)");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user, login, isLoading } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && user) {
      navigate('/');
    }
  }, [user, isLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (!username || !password) {
      setError("user_pass_req");
      return;
    }

    if (password.length < 8) {
      setError("pass_too_short");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          setError("user_pass_error");
        } else {
          setError(data.error || "Login failed");
        }
        return;
      }

      // Store user data and token in context/localStorage
      login(data.user, data.token);

      // Redirect to home page on success
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      // Re-enable after 5 seconds as fallback
      setTimeout(() => {
        setIsSubmitting(false);
      }, 5000);
    }
  };

  return (
    <div className="container-xs">
      <h1>Sign in</h1>

      <Feedback
        feedbackKey={error && error in feedbackData ? error : null}
        customMessage={error && !(error in feedbackData) ? error : undefined}
        type="error"
      />

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">username</label>
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

        <div className="form-actions">
          <button className="button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
          <span className="form-actions-link">
            Don't have an account? <Link to="/register">Create an account</Link>
          </span>
        </div>
      </form>
    </div>
  );
}
