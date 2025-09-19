import { getStore } from "@netlify/blobs";
import type { Config } from "@netlify/functions";

export default async (request: Request) => {
  try {
    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json" },
      });
    }

    const userStore = getStore({ name: "User", consistency: "strong" });
    const postStore = getStore({ name: "Post", consistency: "strong" });
    const avatarStore = getStore({ name: "UserAvatar", consistency: "strong" });

    let deletedPosts = 0;
    let deletedUsers = 0;
    let deletedAvatars = 0;

    console.log("Starting nuclear reset - deleting ALL data...");

    // Delete all posts
    const allPosts = await postStore.list();
    for (const blob of allPosts.blobs) {
      try {
        await postStore.delete(blob.key);
        deletedPosts++;
      } catch (error) {
        console.error(`Error deleting post ${blob.key}:`, error);
      }
    }

    // Delete all users
    const allUsers = await userStore.list();
    for (const blob of allUsers.blobs) {
      try {
        await userStore.delete(blob.key);
        deletedUsers++;
      } catch (error) {
        console.error(`Error deleting user ${blob.key}:`, error);
      }
    }

    // Delete all avatars
    const allAvatars = await avatarStore.list();
    for (const blob of allAvatars.blobs) {
      try {
        await avatarStore.delete(blob.key);
        deletedAvatars++;
      } catch (error) {
        console.error(`Error deleting avatar ${blob.key}:`, error);
      }
    }

    console.log("Nuclear reset completed!");

    return new Response(
      JSON.stringify({
        success: true,
        message: "All data deleted successfully! Database is now completely empty.",
        stats: {
          deletedPosts,
          deletedUsers,
          deletedAvatars,
          total: deletedPosts + deletedUsers + deletedAvatars,
        },
        note: "Use /api/seed to populate with fresh data",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Reset API error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to reset database",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

export const config: Config = {
  path: "/api/reset",
};