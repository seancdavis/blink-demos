import { getStore } from "@netlify/blobs";
import type { Config } from "@netlify/functions";

function timeAgoInWords(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
}

export default async (request: Request) => {
  try {
    if (request.method !== "GET") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json" },
      });
    }

    const url = new URL(request.url);
    const postId = url.searchParams.get("id");

    if (!postId) {
      return new Response(JSON.stringify({ error: "Post ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const postStore = getStore({ name: "Post", consistency: "strong" });
    const userStore = getStore({ name: "User", consistency: "strong" });

    const post = await postStore.get(postId, { type: "json" });

    if (!post) {
      return new Response(JSON.stringify({ error: "Post not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get user data
    let user = null;
    try {
      user = await userStore.get(post.userId, { type: "json" });
    } catch (error) {
      console.error(`Error getting user ${post.userId}:`, error);
    }

    const postWithUser = {
      ...post,
      id: postId,
      user: user ? { ...user, password: undefined } : null,
      date: timeAgoInWords(new Date(post.createdAt)),
    };

    return new Response(JSON.stringify({ post: postWithUser }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Post API error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const config: Config = {
  path: "/api/post",
};