import React from 'react'
import { Link } from 'react-router-dom'
import type { PostWithUser } from '@utils/types'

interface PostCardProps extends PostWithUser {}

const PostCard: React.FC<PostCardProps> = ({ title, content, user, date, postId }) => {
  return (
    <div className="post-card">
      <div className="post-card-meta">
        <img className="avatar" src={user.avatarSrc} alt={`${user.username} avatar`} />
        <div>
          <Link className="post-card-username" to={`/@${user.username}`}>
            {user.username}
          </Link>
          <span className="post-card-date">{date}</span>
        </div>
      </div>
      <div className="post-card-content">
        <h3 className="post-card-title">
          <a href={`/post/${postId}`}>{title}</a>
        </h3>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </div>
  )
}

export default PostCard