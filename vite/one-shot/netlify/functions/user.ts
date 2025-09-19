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
    const username = url.searchParams.get("username");
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const perPage = 12;

    if (!username) {
      return new Response(JSON.stringify({ error: "Username is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const userStore = getStore({ name: "User", consistency: "strong" });
    const postStore = getStore({ name: "Post", consistency: "strong" });

    // Find user by username
    const allUsers = await userStore.list();
    let userId: string | null = null;
    let userData = null;

    for (const blob of allUsers.blobs) {
      try {
        const user = await userStore.get(blob.key, { type: "json" });
        if (user && typeof user === 'object' && user.username === username && user.password) {
          userId = blob.key;
          userData = user;
          break;
        } else if (user && (!user.username || !user.password)) {
          // Delete corrupted user
          console.warn(`Invalid user data for ${blob.key}, deleting corrupted blob`);
          try {
            await userStore.delete(blob.key);
          } catch (deleteError) {
            console.error(`Error deleting corrupted user ${blob.key}:`, deleteError);
          }
        }
      } catch (error) {
        console.error(`Error getting user ${blob.key}:`, error);
        // Try to delete corrupted blob
        try {
          await userStore.delete(blob.key);
          console.log(`Deleted corrupted user blob ${blob.key}`);
        } catch (deleteError) {
          console.error(`Error deleting corrupted user ${blob.key}:`, deleteError);
        }
      }
    }

    if (!userId || !userData) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get user's posts
    const allPosts = await postStore.list();
    const userPosts = [];

    for (const blob of allPosts.blobs) {
      try {
        const post = await postStore.get(blob.key, { type: "json" });
        if (post && typeof post === 'object' && post.title && post.content && post.userId === userId && post.createdAt) {
          userPosts.push({ ...post, id: blob.key });
        } else if (post && (!post.title || !post.content || !post.userId || !post.createdAt)) {
          // Delete corrupted post
          console.warn(`Invalid post data for ${blob.key}, deleting corrupted blob`);
          try {
            await postStore.delete(blob.key);
          } catch (deleteError) {
            console.error(`Error deleting corrupted post ${blob.key}:`, deleteError);
          }
        }
      } catch (error) {
        console.error(`Error getting post ${blob.key}:`, error);
        // Try to delete corrupted blob
        try {
          await postStore.delete(blob.key);
          console.log(`Deleted corrupted post blob ${blob.key}`);
        } catch (deleteError) {
          console.error(`Error deleting corrupted post ${blob.key}:`, deleteError);
        }
      }
    }

    // Sort posts by creation date (newest first)
    userPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Paginate posts
    const startIndex = (page - 1) * perPage;
    const paginatedPosts = userPosts.slice(startIndex, startIndex + perPage);
    const totalPages = Math.ceil(userPosts.length / perPage);

    // Add user data and time formatting to posts
    const postsWithUser = paginatedPosts.map((post) => ({
      ...post,
      user: { ...userData, password: undefined, id: userId },
      date: timeAgoInWords(new Date(post.createdAt)),
    }));

    return new Response(
      JSON.stringify({
        user: { ...userData, password: undefined, id: userId },
        posts: postsWithUser,
        pagination: {
          currentPage: page,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
          totalPosts: userPosts.length,
        },
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("User API error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const config: Config = {
  path: "/api/user",
};