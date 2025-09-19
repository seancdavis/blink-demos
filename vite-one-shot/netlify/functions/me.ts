import { getStore } from "@netlify/blobs";
import type { Config } from "@netlify/functions";
import { jwtVerify } from "jose";

export default async (request: Request) => {
  try {
    if (request.method !== "GET") {
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

    if (!process.env.COOKIE_JWT_SECRET) {
      throw new Error("Missing COOKIE_JWT_SECRET environment variable");
    }

    const secret = new TextEncoder().encode(process.env.COOKIE_JWT_SECRET);

    let userId;
    try {
      const { payload } = await jwtVerify(token, secret);
      userId = payload.userId;
    } catch (error) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const userStore = getStore({ name: "User", consistency: "strong" });
    const userData = await userStore.get(userId as string, { type: "json" });

    if (!userData) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = userData;

    return new Response(
      JSON.stringify({
        user: { ...userWithoutPassword, id: userId },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Me error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const config: Config = {
  path: "/api/auth/me",
};