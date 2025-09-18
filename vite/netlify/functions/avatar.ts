import { getStore } from "@netlify/blobs";
import type { Config, Context } from "@netlify/functions";
import { getUserByUsername } from "../../src/utils/user";

export default async (request: Request, context: Context) => {
  try {
    if (request.method !== "GET") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    const username = context.params.username;

    if (!username) {
      return new Response("Not Found", { status: 404 });
    }

    // Remove file extension if present (e.g., username.jpg -> username)
    const cleanUsername = username.split('.')[0];

    const user = await getUserByUsername(cleanUsername);
    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    // Check if user has a custom avatar (not default)
    if (user.avatarSrc.includes('identicon') || user.avatarSrc.includes('default-avatar')) {
      return new Response("No custom avatar", { status: 404 });
    }

    const userAvatarStore = getStore({ name: "UserAvatar", consistency: "strong" });
    const userAvatarBlob = await userAvatarStore.get(user.username.toString(), {
      type: "stream",
    });

    if (!userAvatarBlob) {
      return new Response("Avatar not found", { status: 404 });
    }

    // Determine content type based on the stored blob
    let contentType = "image/jpeg"; // Default fallback

    // Try to determine content type from the blob
    if (userAvatarBlob instanceof ReadableStream) {
      // For streams, we'll use a default content type
      contentType = "image/jpeg";
    }

    return new Response(userAvatarBlob, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000", // Cache for 1 year
      },
    });
  } catch (error) {
    console.error("Avatar serving error:", error);
    return new Response("Internal server error", { status: 500 });
  }
};

export const config: Config = {
  path: "/uploads/avatar/:username",
};