import { getStore } from "@netlify/blobs";
import type { Config } from "@netlify/functions";

export default async (request: Request) => {
  try {
    if (request.method !== "GET") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json" },
      });
    }

    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const username = pathParts[pathParts.length - 1]; // Get username from URL path

    if (!username) {
      return new Response("Username not found", { status: 404 });
    }

    const userStore = getStore({ name: "User", consistency: "strong" });
    const avatarStore = getStore({ name: "UserAvatar", consistency: "strong" });

    // Find user by username
    const allUsers = await userStore.list();
    let userData = null;

    for (const blob of allUsers.blobs) {
      const user = await userStore.get(blob.key, { type: "json" });
      if (user && user.username === username) {
        userData = user;
        break;
      }
    }

    if (!userData || !userData.avatarKey) {
      // Return a default avatar or 404
      return new Response("Avatar not found", { status: 404 });
    }

    // Get avatar file from blob storage
    const avatarData = await avatarStore.get(userData.avatarKey, { type: "binary" });
    const avatarMetadata = await avatarStore.getMetadata(userData.avatarKey);

    if (!avatarData) {
      return new Response("Avatar not found", { status: 404 });
    }

    return new Response(avatarData, {
      headers: {
        "Content-Type": avatarMetadata?.contentType || "image/png",
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error("Avatar API error:", error);
    return new Response("Internal server error", { status: 500 });
  }
};

export const config: Config = {
  path: "/uploads/avatar/:username",
};