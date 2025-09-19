import { getStore } from "@netlify/blobs";
import type { Config } from "@netlify/functions";
import { v4 as uuidv4 } from "uuid";
import { jwtVerify } from "jose";

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
    const url = new URL(request.url);
    const postStore = getStore({ name: "Post", consistency: "strong" });
    const userStore = getStore({ name: "User", consistency: "strong" });

    // Note: Use /api/seed endpoint to populate the database with initial data

    if (request.method === "GET") {
      // Handle pagination
      const page = parseInt(url.searchParams.get("page") || "1", 10);
      const perPage = 12;

      // Get all posts and sort by creation date
      const allPostBlobs = await postStore.list();
      const posts = [];

      for (const blob of allPostBlobs.blobs) {
        try {
          // Get as text first to avoid JSON parsing errors
          const postText = await postStore.get(blob.key, { type: "text" });

          if (!postText || postText === "[object Object]" || postText.includes("[object Object]")) {
            console.warn(`Corrupted blob detected for ${blob.key}, deleting`);
            await postStore.delete(blob.key);
            continue;
          }

          // Try to parse the JSON manually
          let post;
          try {
            post = JSON.parse(postText);
          } catch (parseError) {
            console.warn(`Invalid JSON for ${blob.key}, deleting`);
            await postStore.delete(blob.key);
            continue;
          }

          // Validate the post structure
          if (post && typeof post === 'object' && post.title && post.content && post.userId && post.createdAt) {
            posts.push({ ...post, id: blob.key });
          } else {
            console.warn(`Invalid post structure for ${blob.key}, deleting`);
            await postStore.delete(blob.key);
          }
        } catch (error) {
          console.error(`Error processing post ${blob.key}:`, error);
          // Try to delete corrupted blob
          try {
            await postStore.delete(blob.key);
            console.log(`Deleted corrupted post blob ${blob.key}`);
          } catch (deleteError) {
            console.error(`Error deleting corrupted post ${blob.key}:`, deleteError);
          }
        }
      }

      posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      const startIndex = (page - 1) * perPage;
      const paginatedPosts = posts.slice(startIndex, startIndex + perPage);
      const totalPages = Math.ceil(posts.length / perPage);

      // Add user data to posts
      const postsWithUsers = await Promise.all(
        paginatedPosts.map(async (post) => {
          try {
            const user = await userStore.get(post.userId, { type: "json" });
            return {
              ...post,
              user: user ? { ...user, password: undefined } : null,
              date: timeAgoInWords(new Date(post.createdAt)),
            };
          } catch (error) {
            console.error(`Error getting user ${post.userId}:`, error);
            return {
              ...post,
              user: null,
              date: timeAgoInWords(new Date(post.createdAt)),
            };
          }
        })
      );

      return new Response(
        JSON.stringify({
          posts: postsWithUsers,
          pagination: {
            currentPage: page,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
            totalPosts: posts.length,
          },
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (request.method === "POST") {
      // Extract user from JWT token
      const authHeader = request.headers.get("Authorization");
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return new Response(JSON.stringify({ error: "Authentication required" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }

      const token = authHeader.substring(7);
      let userId;
      try {
        if (!process.env.COOKIE_JWT_SECRET) {
          throw new Error("Missing COOKIE_JWT_SECRET environment variable");
        }
        const secret = new TextEncoder().encode(process.env.COOKIE_JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        userId = payload.userId;
      } catch (error) {
        return new Response(JSON.stringify({ error: "Invalid token" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }

      const body = await request.json();
      const { title, content } = body;

      // Validation
      if (!title || title.length < 10 || title.length > 64) {
        return new Response(
          JSON.stringify({
            error: "Title must be between 10 and 64 characters",
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      if (!content || content.length < 10 || content.length > 400) {
        return new Response(
          JSON.stringify({
            error: "Content must be between 10 and 400 characters",
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      const postId = uuidv4();
      const newPost = {
        title,
        content,
        userId,
        createdAt: new Date().toISOString(),
      };

      // Store as text to ensure proper serialization
      await postStore.set(postId, JSON.stringify(newPost));

      return new Response(JSON.stringify({ ...newPost, id: postId }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Posts API error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const config: Config = {
  path: "/api/posts",
};