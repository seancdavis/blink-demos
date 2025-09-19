import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { PostCard } from '../components/PostCard';
import { Pagination } from '../components/Pagination';
import { Feedback } from '../components/Feedback';
import type { PostWithUser, PaginationData, FeedbackData } from '../utils/types';
import { getPageFromSearchParams } from '../utils/posts-index';

export function Posts() {
  const { page: pageParam } = useParams<{ page: string }>();
  const [searchParams] = useSearchParams();

  // Get page from URL params or search params, fallback to 1
  const urlPage = pageParam ? parseInt(pageParam, 10) : null;
  const searchPage = getPageFromSearchParams(searchParams);
  const currentPage = urlPage || searchPage;

  const [posts, setPosts] = useState<PostWithUser[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);

  useDocumentTitle(`Posts - Page ${currentPage} | Blink (Vite)`);

  useEffect(() => {
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

    fetchPosts();
  }, [currentPage]);

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
      <main className="posts-page">
        <header className="posts-page__header">
          <h1>All Posts</h1>
          {pagination && (
            <p className="posts-page__subtitle">
              Page {pagination.currentPage} of {pagination.totalPages} • {pagination.totalPosts} total posts
            </p>
          )}
        </header>

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
              <p>There are no posts to display on this page.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}