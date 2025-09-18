import { Link } from "react-router";

export interface PostCardProps {
  postId: string;
  title: string;
  content: string;
  username: string;
  avatarSrc: string;
  date: string;
}

export function PostCard({
  postId,
  title,
  content,
  username,
  avatarSrc,
  date,
}: PostCardProps) {
  return (
    <div className="post-card">
      <div className="post-card-meta">
        <img className="avatar" src={avatarSrc} alt={`${username} avatar`} />
        <div>
          <Link className="post-card-username" to={`/@/${username}`}>
            {username}
          </Link>
          <span className="post-card-date">{date}</span>
        </div>
      </div>
      <div className="post-card-content">
        <h3 className="post-card-title">
          <Link to={`/posts/${postId}`}>{title}</Link>
        </h3>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </div>
  );
}
