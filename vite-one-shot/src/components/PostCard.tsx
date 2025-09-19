import React from 'react';
import { Link, useNavigate } from 'react-router';
import type { PostWithUser } from '../utils/types';
import { getUserAvatarUrl, getUserProfileUrl } from '../utils/user';
import { truncateText } from '../utils/truncate-text';

interface PostCardProps {
  post: PostWithUser;
}

export function PostCard({ post }: PostCardProps) {
  const navigate = useNavigate();

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on the username link
    if ((e.target as HTMLElement).closest('.post-card__username')) {
      return;
    }
    // Navigate to post detail
    navigate(`/posts/${post.id}`);
  };

  return (
    <article className="post-card post-card--clickable" onClick={handleCardClick}>
      <header className="post-card__header">
        <div className="post-card__user">
          <img
            src={getUserAvatarUrl(post.user)}
            alt={`${post.user.username} avatar`}
            className="avatar avatar--small"
          />
          <div className="post-card__user-info">
            <Link
              to={getUserProfileUrl(post.user.username)}
              className="post-card__username"
            >
              @{post.user.username}
            </Link>
            <time className="post-card__date">{post.date}</time>
          </div>
        </div>
      </header>

      <div className="post-card__content">
        <h3 className="post-card__title">{post.title}</h3>
        <p className="post-card__excerpt">
          {truncateText(post.content, 150)}
        </p>
      </div>
    </article>
  );
}