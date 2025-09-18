import { useState, useEffect } from "react";
import { useParams, useSearchParams, Link } from "react-router";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { PostCard } from "../components/PostCard";
import { Pagination } from "../components/Pagination";
import type { PostWithUser, User } from "../utils/types";

interface UserProfileResponse {
  user: Omit<User, "password">;
  posts: PostWithUser[];
  pagination: {
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    totalPosts: number;
  };
  postStats: string;
}

export default function Profile() {
  const { username } = useParams();
  const [searchParams] = useSearchParams();
  const [profileData, setProfileData] = useState<UserProfileResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  useDocumentTitle(
    profileData
      ? `${profileData.user.username} Profile | Blink (Vite)`
      : `@${username} | Blink (Vite)`
  );

  useEffect(() => {
    async function fetchProfile() {
      if (!username) return;

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `/api/user?username=${username}&page=${currentPage}`
        );
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("User not found");
          }
          throw new Error("Failed to fetch user profile");
        }

        const data: UserProfileResponse = await response.json();
        setProfileData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [username, currentPage]);

  if (loading) {
    return (
      <div className="container">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <h1>Error</h1>
        <p>{error}</p>
        <Link to="/">← Back to home</Link>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="container">
        <h1>User not found</h1>
        <p>The user you're looking for doesn't exist.</p>
        <Link to="/">← Back to home</Link>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="profile-header">
        <img
          className="avatar profile-avatar"
          src={profileData.user.avatarSrc}
          alt={`${profileData.user.username}'s avatar`}
        />
        <div className="profile-info">
          <h2>@{profileData.user.username}</h2>
          <p className="profile-stats">{profileData.postStats}</p>
        </div>
      </div>

      <div className="profile-content">
        <h1>Latest posts from {profileData.user.username}</h1>

        {profileData.posts.length > 0 ? (
          <>
            <div className="post-card-grid">
              {profileData.posts.map((post) => (
                <PostCard
                  key={post.id}
                  postId={post.id}
                  title={post.title}
                  content={post.content}
                  username={post.user.username}
                  avatarSrc={post.user.avatarSrc}
                  date={post.date}
                />
              ))}
            </div>

            <Pagination
              currentPage={profileData.pagination.currentPage}
              totalPages={profileData.pagination.totalPages}
              hasNextPage={profileData.pagination.hasNextPage}
              hasPrevPage={profileData.pagination.hasPrevPage}
            />
          </>
        ) : (
          <p>No posts yet.</p>
        )}
      </div>
    </div>
  );
}
