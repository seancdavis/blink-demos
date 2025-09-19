import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { PostCard } from '../components/PostCard';
import { Pagination } from '../components/Pagination';
import { Feedback } from '../components/Feedback';
import { getUserAvatarUrl } from '../utils/user';
import { getPageFromSearchParams } from '../utils/posts-index';
import type { User, PostWithUser, PaginationData, FeedbackData } from '../utils/types';

export function Profile() {
  const { username } = useParams<{ username: string }>();
  const [searchParams] = useSearchParams();
  const { user: currentUser } = useAuth();

  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<PostWithUser[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);

  const currentPage = getPageFromSearchParams(searchParams);
  const isOwnProfile = currentUser && currentUser.username === username;

  useDocumentTitle(
    profileUser
      ? `@${profileUser.username} | Blink (Vite)`
      : 'Profile | Blink (Vite)'
  );

  useEffect(() => {
    const fetchProfile = async () => {
      if (!username) return;

      try {
        setLoading(true);
        setFeedback(null);

        const response = await fetch(`/api/user?username=${encodeURIComponent(username)}&page=${currentPage}`);
        const data = await response.json();

        if (response.ok) {
          setProfileUser(data.user);
          setPosts(data.posts || []);
          setPagination(data.pagination);
        } else {
          setFeedback({
            type: 'error',
            message: data.error || 'Failed to load profile.',
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

    fetchProfile();
  }, [username, currentPage]);

  if (loading) {
    return (
      <div className="container">
        <div className="loading-state">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="container">
        <div className="error-state">
          <h2>Profile Not Found</h2>
          <p>The user @{username} could not be found.</p>
          <Link to="/" className="button">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <main className="profile">
        <header className="profile__header">
          <div className="profile__info">
            <img
              src={getUserAvatarUrl(profileUser)}
              alt={`${profileUser.username} avatar`}
              className="avatar avatar--large"
            />
            <div className="profile__details">
              <h1 className="profile__username">@{profileUser.username}</h1>
              {pagination && (
                <p className="profile__stats">
                  {pagination.totalPosts} {pagination.totalPosts === 1 ? 'post' : 'posts'}
                </p>
              )}
            </div>
          </div>

          {isOwnProfile && (
            <div className="profile__actions">
              <Link to="/settings" className="button button--outline">
                Edit Profile
              </Link>
            </div>
          )}
        </header>

        <Feedback feedback={feedback} onClose={() => setFeedback(null)} />

        <section className="profile__posts">
          {posts.length > 0 ? (
            <>
              <h2 className="profile__posts-title">
                {isOwnProfile ? 'Your Posts' : 'Posts'}
              </h2>

              <div className="posts-grid">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>

              {pagination && <Pagination pagination={pagination} />}
            </>
          ) : (
            <div className="empty-state">
              <h3>No posts yet</h3>
              <p>
                {isOwnProfile
                  ? "You haven't shared anything yet. Create your first post!"
                  : `@${profileUser.username} hasn't shared anything yet.`
                }
              </p>
              {isOwnProfile && (
                <Link to="/" className="button">
                  Create Your First Post
                </Link>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}