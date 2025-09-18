import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import type { PostWithUser } from '../utils/types';

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState<PostWithUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useDocumentTitle(post ? `${post.title} | Blink (Vite)` : `Post ${id} | Blink (Vite)`);

  useEffect(() => {
    async function fetchPost() {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/post?id=${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Post not found');
          }
          throw new Error('Failed to fetch post');
        }

        const data: PostWithUser = await response.json();
        setPost(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="container-sm">
        <p>Loading post...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-sm">
        <h1>Error</h1>
        <p>{error}</p>
        <Link to="/">← Back to home</Link>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container-sm">
        <h1>Post not found</h1>
        <p>The post you're looking for doesn't exist.</p>
        <Link to="/">← Back to home</Link>
      </div>
    );
  }

  return (
    <div className="post-detail container-sm">
      <div className="post-detail-meta">
        <img className="avatar" src={post.user.avatarSrc} alt={`${post.user.username} avatar`} />
        <div>
          <Link className="post-detail-username" to={`/@${post.user.username}`}>
            {post.user.username}
          </Link>
          <span className="post-detail-date">{post.date}</span>
        </div>
      </div>
      <div className="post-detail-content">
        <h2 className="post-detail-title">{post.title}</h2>
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
    </div>
  );
}