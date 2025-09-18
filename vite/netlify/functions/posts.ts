import { getStore } from "@netlify/blobs";
import type { Config } from "@netlify/functions";
import { newlineToLineBreak } from "../../src/utils/nl2br";
import { getPaginatedPostIds } from "../../src/utils/posts-index";
import { timeAgoInWords } from "../../src/utils/time-ago-in-words";
import { truncateText } from "../../src/utils/truncate-text";
import { PostWithUser } from "../../src/utils/types";

export default async (request: Request) => {
  try {
    // Get page number from query params (default to 1)
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);

    // Get paginated post IDs and metadata
    const pagination = await getPaginatedPostIds(page, 12);

    // Fetch only the posts for current page
    const postStore = getStore({ name: "Post", consistency: "strong" });
    const posts = await Promise.all(
      pagination.postIds.map(
        async (id) => await postStore.get(id, { type: "json" })
      )
    );

    // Get unique user IDs from posts
    const uniqueUserIds = [...new Set(posts.map((post) => post.userId))];

    // Only fetch users that are needed for posts
    const userStore = getStore({ name: "User", consistency: "strong" });
    const users = await Promise.all(
      uniqueUserIds.map(async (id) => await userStore.get(id, { type: "json" }))
    );

    const postsWithUsers: PostWithUser[] = posts.map((post) => {
      const user = users.find((user) => user.id === post.userId);
      const date = timeAgoInWords(new Date(post.createdAt));
      const truncatedContent = truncateText(post.content, 150);

      return {
        ...post,
        user,
        date,
        content: newlineToLineBreak(truncatedContent),
      };
    });

    return new Response(
      JSON.stringify({
        posts: postsWithUsers,
        pagination,
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching posts:", error);

    return new Response(
      JSON.stringify({
        error: "Failed to fetch posts",
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
  path: "/api/posts",
};
