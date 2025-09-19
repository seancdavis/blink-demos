import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { Feedback } from '../components/Feedback';
import { getUserAvatarUrl, getUserProfileUrl } from '../utils/user';
import { nl2br } from '../utils/nl2br';
import type { PostWithUser, FeedbackData } from '../utils/types';

export function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<PostWithUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);

  useDocumentTitle(
    post ? `${post.title} | Blink (Vite)` : 'Post | Blink (Vite)'
  );

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setFeedback(null);

        const response = await fetch(`/api/post?id=${encodeURIComponent(id)}`);
        const data = await response.json();

        if (response.ok) {
          setPost(data.post);
        } else {
          setFeedback({
            type: 'error',
            message: data.error || 'Failed to load post.',
          });
        }
      } catch (error) {
        setFeedback({
          type: 'error',
          message: 'Network error. Please check your connection and try again.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="container">
        <div className="loading-state">
          <p>Loading post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container">
        <div className="error-state">
          <h2>Post Not Found</h2>
          <p>The requested post could not be found.</p>
          <Link to="/" className="button">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <main className="post-detail">
        <nav className="breadcrumb">
          <Link to="/" className="breadcrumb__link">
            Home
          </Link>
          <span className="breadcrumb__separator">→</span>
          <span className="breadcrumb__current">Post</span>
        </nav>

        <Feedback feedback={feedback} onClose={() => setFeedback(null)} />

        <article className="post-detail__content">
          <header className="post-detail__header">
            <div className="post-detail__author">
              <img
                src={getUserAvatarUrl(post.user)}
                alt={`${post.user.username} avatar`}
                className="avatar"
              />
              <div className="post-detail__author-info">
                <Link
                  to={getUserProfileUrl(post.user.username)}
                  className="post-detail__author-name"
                >
                  @{post.user.username}
                </Link>
                <time className="post-detail__date">{post.date}</time>
              </div>
            </div>
          </header>

          <div className="post-detail__body">
            <h1 className="post-detail__title">{post.title}</h1>
            <div className="post-detail__text">
              {nl2br(post.content)}
            </div>
          </div>

          <footer className="post-detail__footer">
            <Link
              to={getUserProfileUrl(post.user.username)}
              className="button button--outline"
            >
              View @{post.user.username}'s Profile
            </Link>
          </footer>
        </article>
      </main>
    </div>
  );
}