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

    let cleanedPosts = 0;
    let cleanedUsers = 0;

    // Clean up corrupted posts
    console.log("Cleaning up posts...");
    const allPosts = await postStore.list();
    for (const blob of allPosts.blobs) {
      try {
        const post = await postStore.get(blob.key, { type: "json" });
        if (!post || typeof post !== 'object' || !post.title || !post.content || !post.userId || !post.createdAt) {
          console.log(`Deleting invalid post: ${blob.key}`);
          await postStore.delete(blob.key);
          cleanedPosts++;
        }
      } catch (error) {
        console.error(`Error checking post ${blob.key}, deleting:`, error);
        try {
          await postStore.delete(blob.key);
          cleanedPosts++;
        } catch (deleteError) {
          console.error(`Error deleting corrupted post ${blob.key}:`, deleteError);
        }
      }
    }

    // Clean up corrupted users
    console.log("Cleaning up users...");
    const allUsers = await userStore.list();
    for (const blob of allUsers.blobs) {
      try {
        const user = await userStore.get(blob.key, { type: "json" });
        if (!user || typeof user !== 'object' || !user.username || !user.password) {
          console.log(`Deleting invalid user: ${blob.key}`);
          await userStore.delete(blob.key);
          cleanedUsers++;
        }
      } catch (error) {
        console.error(`Error checking user ${blob.key}, deleting:`, error);
        try {
          await userStore.delete(blob.key);
          cleanedUsers++;
        } catch (deleteError) {
          console.error(`Error deleting corrupted user ${blob.key}:`, deleteError);
        }
      }
    }

    // Get final counts
    const finalPosts = await postStore.list();
    const finalUsers = await userStore.list();

    return new Response(
      JSON.stringify({
        success: true,
        message: "Cleanup completed successfully!",
        stats: {
          cleanedPosts,
          cleanedUsers,
          remainingPosts: finalPosts.blobs.length,
          remainingUsers: finalUsers.blobs.length,
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Cleanup API error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to cleanup database",
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
  path: "/api/cleanup",
};