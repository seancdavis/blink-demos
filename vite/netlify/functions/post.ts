import { getStore } from "@netlify/blobs";
import type { Config } from "@netlify/functions";
import { newlineToLineBreak } from "../../src/utils/nl2br";
import { timeAgoInWords } from "../../src/utils/time-ago-in-words";
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
    const postId = url.searchParams.get("id");

    if (!postId || postId.length === 0) {
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

    const user = await userStore.get(post.userId, { type: "json" });
    const { password, ...userWithoutPassword } = user;
    const date = timeAgoInWords(new Date(post.createdAt));

    const postWithUser: PostWithUser = {
      ...post,
      user: userWithoutPassword,
      date,
      content: newlineToLineBreak(post.content),
    };

    return new Response(JSON.stringify(postWithUser), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching post:", error);

    return new Response(
      JSON.stringify({
        error: "Failed to fetch post",
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
  path: "/api/post",
};
