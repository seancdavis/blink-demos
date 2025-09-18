import { getStore } from "@netlify/blobs";
import type { Config } from "@netlify/functions";
import { newlineToLineBreak } from "../../src/utils/nl2br";
import { timeAgoInWords } from "../../src/utils/time-ago-in-words";
import { truncateText } from "../../src/utils/truncate-text";
import { getPostsIndex } from "../../src/utils/posts-index";
import type { PostWithUser } from "../../src/utils/types";

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

    if (!username || username.length === 0) {
      return new Response(
        JSON.stringify({ error: "Username is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const userStore = getStore({ name: "User", consistency: "strong" });
    const postStore = getStore({ name: "Post", consistency: "strong" });

    // Find user by username
    const allUserBlobs = await userStore.list();
    const users = await Promise.all(
      allUserBlobs.blobs.map(async (blob) =>
        userStore.get(blob.key, { type: "json" })
      )
    );
    const user = users.find((u) => u.username === username);

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get all posts and filter by user
    const postsIndex = await getPostsIndex();
    const userPostIds = [];

    // Check each post to see if it belongs to this user
    for (const indexEntry of postsIndex) {
      const post = await postStore.get(indexEntry.id, { type: "json" });
      if (post && post.userId === user.id) {
        userPostIds.push(indexEntry.id);
      }
    }

    // Calculate pagination
    const limit = 12;
    const totalPosts = userPostIds.length;
    const totalPages = Math.ceil(totalPosts / limit);
    const currentPage = Math.max(1, Math.min(page, totalPages || 1));
    const offset = (currentPage - 1) * limit;
    const paginatedPostIds = userPostIds.slice(offset, offset + limit);

    // Fetch the posts for current page
    const posts = await Promise.all(
      paginatedPostIds.map(async (id) =>
        postStore.get(id, { type: "json" })
      )
    );

    // Remove password from user data
    const { password, ...userWithoutPassword } = user;

    // Process posts with user data
    const postsWithUser: PostWithUser[] = posts.map((post) => {
      const date = timeAgoInWords(new Date(post.createdAt));
      const truncatedContent = truncateText(post.content, 150);

      return {
        ...post,
        user: userWithoutPassword,
        date,
        content: newlineToLineBreak(truncatedContent),
      };
    });

    return new Response(
      JSON.stringify({
        user: userWithoutPassword,
        posts: postsWithUser,
        pagination: {
          currentPage,
          totalPages,
          hasNextPage: currentPage < totalPages,
          hasPrevPage: currentPage > 1,
          totalPosts,
        },
        postStats: `${totalPosts} post${totalPosts !== 1 ? "s" : ""}`,
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching user profile:", error);

    return new Response(
      JSON.stringify({
        error: "Failed to fetch user profile",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};

export const config: Config = {
  path: "/api/user",
};