import React from 'react';
import { Link } from 'react-router';
import type { PostWithUser } from '../utils/types';
import { getUserAvatarUrl, getUserProfileUrl } from '../utils/user';
import { truncateText } from '../utils/truncate-text';

interface PostCardProps {
  post: PostWithUser;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="post-card">
      <Link to={`/posts/${post.id}`} className="post-card__link">
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
                onClick={(e) => e.stopPropagation()}
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
      </Link>
    </article>
  );
}