import React, { useState } from 'react';
import { Link } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { getUserAvatarUrl } from '../utils/user';
import { Feedback } from './Feedback';
import type { FeedbackData } from '../utils/types';

interface NewPostFormProps {
  onPostCreated?: () => void;
}

export function NewPostForm({ onPostCreated }: NewPostFormProps) {
  const { user, token } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);

  const titleLength = title.length;
  const contentLength = content.length;
  const isTitleValid = titleLength >= 10 && titleLength <= 64;
  const isContentValid = contentLength >= 10 && contentLength <= 400;
  const isFormValid = isTitleValid && isContentValid && !isSubmitting;

  const getCharacterCountClass = (current: number, max: number, min: number) => {
    if (current < min) return 'character-count--error';
    if (current > max * 0.9) return 'character-count--warning';
    return 'character-count--normal';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid || !token) return;

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      });

      const data = await response.json();

      if (response.ok) {
        setTitle('');
        setContent('');
        setFeedback({
          type: 'success',
          message: 'Your post has been published successfully!',
        });
        onPostCreated?.();
      } else {
        setFeedback({
          type: 'error',
          message: data.error || 'Failed to create post. Please try again.',
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

  if (!user) {
    return (
      <div className="new-post-form">
        <div className="new-post-form__guest-prompt">
          <h3>Share your thoughts with the world</h3>
          <p>Join Blink to start sharing your ideas and connecting with others.</p>
          <div className="new-post-form__guest-actions">
            <Link to="/register" className="button">
              Sign Up
            </Link>
            <Link to="/login" className="button button--outline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="new-post-form">
      <div className="new-post-form__header">
        <img
          src={getUserAvatarUrl(user)}
          alt={`${user.username} avatar`}
          className="avatar"
        />
        <div className="new-post-form__user-info">
          <span className="new-post-form__username">@{user.username}</span>
          <span className="new-post-form__prompt">What's on your mind?</span>
        </div>
      </div>

      <Feedback feedback={feedback} onClose={() => setFeedback(null)} />

      <form onSubmit={handleSubmit} className="new-post-form__form">
        <div className="form-group">
          <label htmlFor="post-title" className="form-label">
            Title
          </label>
          <input
            id="post-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give your post a catchy title..."
            className="form-input"
            maxLength={64}
            required
          />
          <div className={`character-count ${getCharacterCountClass(titleLength, 64, 10)}`}>
            {titleLength}/64 characters
            {titleLength < 10 && ' (minimum 10 characters)'}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="post-content" className="form-label">
            Content
          </label>
          <textarea
            id="post-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts, experiences, or ideas..."
            className="form-textarea"
            rows={4}
            maxLength={400}
            required
          />
          <div className={`character-count ${getCharacterCountClass(contentLength, 400, 10)}`}>
            {contentLength}/400 characters
            {contentLength < 10 && ' (minimum 10 characters)'}
          </div>
        </div>

        <div className="new-post-form__actions">
          <button
            type="submit"
            disabled={!isFormValid}
            className="button"
          >
            {isSubmitting ? 'Publishing...' : 'Publish Post'}
          </button>
        </div>
      </form>
    </div>
  );
}