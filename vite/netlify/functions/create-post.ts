import { getStore } from "@netlify/blobs";
import type { Config } from "@netlify/functions";
import { decodeJwt } from "jose";
import { v4 as uuidv4 } from "uuid";
import type { User, Post } from "../../src/utils/types";
import { addToPostsIndex } from "../../src/utils/posts-index";

export default async (request: Request) => {
  try {
    if (request.method !== "POST") {
      console.log("Method not allowed:", request.method);
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get JWT token from Authorization header
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({
          error: "Authentication required",
          feedbackKey: "login_required",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const token = authHeader.substring(7);
    let decodedUser: User;

    try {
      decodedUser = decodeJwt(token);
    } catch (error) {
      return new Response(
        JSON.stringify({
          error: "Invalid token",
          feedbackKey: "login_required",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (!decodedUser || !decodedUser.id) {
      return new Response(
        JSON.stringify({
          error: "Invalid token",
          feedbackKey: "login_required",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Use decoded user directly for simplicity
    const user = decodedUser;

    const body = await request.json();
    const title = body.title as string;
    const content = body.content as string;

    if (!title || !content) {
      return new Response(
        JSON.stringify({
          error: "Title and content are required",
          feedbackKey: "post_missing_fields",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (title.length < 10) {
      return new Response(
        JSON.stringify({
          error: "Title too short",
          feedbackKey: "post_title_too_short",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (title.length > 64) {
      return new Response(
        JSON.stringify({
          error: "Title too long",
          feedbackKey: "post_title_too_long",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (content.length < 10) {
      return new Response(
        JSON.stringify({
          error: "Content too short",
          feedbackKey: "post_content_too_short",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (content.length > 400) {
      return new Response(
        JSON.stringify({
          error: "Content too long",
          feedbackKey: "post_content_too_long",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Generate unique post ID
    const postStore = getStore({ name: "Post", consistency: "strong" });
    const generatePostId = async (): Promise<string> => {
      const id = uuidv4();
      const existingPost = await postStore.get(id, { type: "json" });
      return existingPost ? generatePostId() : id;
    };

    const id = await generatePostId();
    const createdAt = new Date().toISOString();

    const post: Post = {
      id,
      title: title.trim(),
      content: content.trim(),
      userId: user.id,
      createdAt,
    };

    // Save the post
    await postStore.setJSON(post.id, post);

    // Add to posts index for pagination
    try {
      await addToPostsIndex(post.id, post.createdAt);
    } catch (error) {
      console.error("Failed to update posts index:", error);
      // Continue anyway - post was saved successfully
    }

    return new Response(
      JSON.stringify({
        success: true,
        post,
        feedbackKey: "post_created",
      }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Post creation error:", error);

    return new Response(
      JSON.stringify({
        error: "Internal server error",
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
  path: "/api/create-post",
};
