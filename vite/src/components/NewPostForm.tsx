import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router";
import { Feedback } from "./Feedback";
import { feedbackData } from "../utils/feedback-data";

interface NewPostFormProps {
  onPostCreated?: () => void;
}

export const NewPostForm = ({ onPostCreated }: NewPostFormProps) => {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const maxContentLength = 400;
  const remaining = maxContentLength - content.length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (!title.trim() || !content.trim()) {
      setError("post_missing_fields");
      return;
    }

    if (title.length < 10) {
      setError("post_title_too_short");
      return;
    }

    if (title.length > 64) {
      setError("post_title_too_long");
      return;
    }

    if (content.length < 10) {
      setError("post_content_too_short");
      return;
    }

    if (content.length > 400) {
      setError("post_content_too_long");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem("blink_token");
      if (!token) {
        setError("Authentication required");
        return;
      }

      const response = await fetch("/api/create-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          content,
        }),
      });

      console.log("Response status:", response.status);
      console.log(
        "Response headers:",
        Object.fromEntries(response.headers.entries())
      );

      let data;
      const responseText = await response.text();
      console.log("Raw response:", responseText);

      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        setError("Server response was not valid JSON");
        return;
      }

      if (!response.ok) {
        setError(data.feedbackKey || data.error || "Failed to create post");
        return;
      }

      setSuccess("post_created");
      setTitle("");
      setContent("");

      // Notify parent component that a post was created
      if (onPostCreated) {
        onPostCreated();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setTimeout(() => {
        setIsSubmitting(false);
      }, 5000);
    }
  };

  if (!user) {
    return (
      <div className="container-xs new-post-form guest">
        <div className="auth-prompt">
          <h2>Share your thoughts</h2>
          <p>Sign in to create posts and join the conversation.</p>
          <div className="form-actions">
            <Link className="button" to="/login">
              Sign in
            </Link>
            <Link className="button secondary" to="/register">
              Create account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-xs new-post-form">
      <div className="new-post-header">
        <img
          className="avatar new-post-avatar"
          src={user.avatarSrc}
          alt={`${user.username}'s avatar`}
        />
        <h2>Write a New post</h2>
      </div>

      <Feedback
        feedbackKey={error && error in feedbackData ? error : null}
        customMessage={error && !(error in feedbackData) ? error : undefined}
        type="error"
      />

      <Feedback
        feedbackKey={success && success in feedbackData ? success : null}
        type="success"
      />

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            id="title"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            minLength={10}
            maxLength={64}
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            name="content"
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            minLength={10}
            maxLength={400}
            required
            disabled={isSubmitting}
          />
          <div
            id="new-post-remaining-count"
            className={`${
              remaining < 5 ? "danger" : remaining < 20 ? "warning" : ""
            }`}>
            {remaining}
          </div>
        </div>
        <div className="form-actions is-compact">
          <button className="button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create post"}
          </button>
        </div>
      </form>
    </div>
  );
};
