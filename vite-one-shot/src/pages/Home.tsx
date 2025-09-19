import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { PostCard } from '../components/PostCard';
import { Pagination } from '../components/Pagination';
import { NewPostForm } from '../components/NewPostForm';
import { Feedback } from '../components/Feedback';
import type { PostWithUser, PaginationData, FeedbackData } from '../utils/types';
import { getPageFromSearchParams } from '../utils/posts-index';

export function Home() {
  useDocumentTitle('Home | Blink (Vite)');

  const [searchParams] = useSearchParams();
  const [posts, setPosts] = useState<PostWithUser[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);

  const currentPage = getPageFromSearchParams(searchParams);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setFeedback(null);

      const response = await fetch(`/api/posts?page=${currentPage}`);
      const data = await response.json();

      if (response.ok) {
        setPosts(data.posts || []);
        setPagination(data.pagination);
      } else {
        setFeedback({
          type: 'error',
          message: data.error || 'Failed to load posts.',
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

  useEffect(() => {
    fetchPosts();
  }, [currentPage]);

  const handlePostCreated = () => {
    // Refresh posts after a new post is created
    fetchPosts();
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading-state">
          <p>Loading posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <main className="home">
        <NewPostForm onPostCreated={handlePostCreated} />

        <Feedback feedback={feedback} onClose={() => setFeedback(null)} />

        <section className="posts-section">
          {posts.length > 0 ? (
            <>
              <div className="posts-grid">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>

              {pagination && <Pagination pagination={pagination} />}
            </>
          ) : (
            <div className="empty-state">
              <h3>No posts found</h3>
              <p>Be the first to share something with the community!</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}