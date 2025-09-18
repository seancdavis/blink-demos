import { getStore } from "@netlify/blobs";
import type { Config, Context } from "@netlify/functions";
import { getCurrentUser } from "../../src/utils/user";
import type { User } from "../../src/utils/types";

export default async (request: Request, context: Context) => {
  try {
    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get current user from JWT
    const user = await getCurrentUser({ cookies: context.cookies });
    if (!user) {
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const formData = await request.formData();
    const image = formData.get("avatar") as File;

    // Validate file exists
    if (!image || !image.size) {
      return new Response(
        JSON.stringify({
          error: "Avatar file is required",
          feedbackKey: "avatar_required"
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Validate file size (2 MB limit)
    const maxSizeBytes = 2 * 1024 * 1024; // 2 MB
    if (image.size > maxSizeBytes) {
      return new Response(
        JSON.stringify({
          error: "File too large",
          feedbackKey: "avatar_too_large"
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedTypes.includes(image.type)) {
      return new Response(
        JSON.stringify({
          error: "Invalid file type",
          feedbackKey: "avatar_invalid_type"
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Store the avatar image in the UserAvatar store
    const userAvatarStore = getStore({ name: "UserAvatar", consistency: "strong" });
    await userAvatarStore.set(user.username.toString(), image);

    // Update the user blob with the new avatar URL
    const userStore = getStore({ name: "User", consistency: "strong" });
    const updatedUser: User = {
      ...user,
      avatarSrc: `/uploads/avatar/${user.username}`,
    };
    await userStore.setJSON(user.id, updatedUser);

    // Remove password from response
    const { password, ...userWithoutPassword } = updatedUser;

    return new Response(
      JSON.stringify({
        success: true,
        user: userWithoutPassword,
        feedbackKey: "avatar_uploaded",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Avatar upload error:", error);

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
  path: "/api/user/upload-avatar",
};