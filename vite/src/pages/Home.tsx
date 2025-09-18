import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { PostCard } from "../components/PostCard";
import { Pagination } from "../components/Pagination";
import type { PostWithUser } from "../utils/types";

interface PostsResponse {
  posts: PostWithUser[];
  pagination: {
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    totalPosts: number;
  };
}

export default function Home() {
  useDocumentTitle("Home | Blink (Vite)");

  const [searchParams] = useSearchParams();
  const [postsData, setPostsData] = useState<PostsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/posts?page=${currentPage}`);
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }

        const data: PostsResponse = await response.json();
        setPostsData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [currentPage]);

  if (loading) {
    return (
      <div>
        <h1>Latest Posts</h1>
        <p>Loading posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1>Latest Posts</h1>
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!postsData || postsData.posts.length === 0) {
    return (
      <div>
        <h1>Latest Posts</h1>
        <p>No posts found.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Latest Posts</h1>

      <div className="posts-list">
        {postsData.posts.map((post) => (
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
        currentPage={postsData.pagination.currentPage}
        totalPages={postsData.pagination.totalPages}
        hasNextPage={postsData.pagination.hasNextPage}
        hasPrevPage={postsData.pagination.hasPrevPage}
      />
    </div>
  );
}
