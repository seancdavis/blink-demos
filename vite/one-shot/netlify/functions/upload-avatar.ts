import { getStore } from "@netlify/blobs";
import type { Config } from "@netlify/functions";
import { jwtVerify } from "jose";

export default async (request: Request) => {
  try {
    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Extract and validate JWT token
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

    const formData = await request.formData();
    const file = formData.get("avatar") as File;

    if (!file) {
      return new Response(JSON.stringify({ error: "No file uploaded" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return new Response(JSON.stringify({ error: "File must be an image" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Validate file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      return new Response(JSON.stringify({ error: "File size must be less than 2MB" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const userStore = getStore({ name: "User", consistency: "strong" });
    const avatarStore = getStore({ name: "UserAvatar", consistency: "strong" });

    // Get current user data
    const userData = await userStore.get(userId as string, { type: "json" });
    if (!userData) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Store avatar file
    const avatarKey = `${userId}-${Date.now()}`;
    const fileBuffer = await file.arrayBuffer();
    await avatarStore.set(avatarKey, fileBuffer, {
      type: "binary",
      metadata: {
        contentType: file.type,
        filename: file.name
      }
    });

    // Update user's avatar URL
    const avatarUrl = `/uploads/avatar/${userData.username}`;
    const updatedUserData = {
      ...userData,
      avatarSrc: avatarUrl,
      avatarKey: avatarKey, // Store reference to blob
    };

    // Store as text to ensure proper serialization
    await userStore.set(userId as string, JSON.stringify(updatedUserData));

    return new Response(
      JSON.stringify({
        success: true,
        avatarUrl,
        user: { ...updatedUserData, password: undefined, id: userId },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Upload avatar error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const config: Config = {
  path: "/api/user/upload-avatar",
};