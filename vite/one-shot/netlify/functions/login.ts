import { getStore } from "@netlify/blobs";
import type { Config } from "@netlify/functions";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";

export default async (request: Request) => {
  try {
    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return new Response(
        JSON.stringify({
          error: "Username and password are required",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const userStore = getStore({ name: "User", consistency: "strong" });

    // Find user by username - search through all users
    const allUsers = await userStore.list();
    let userId: string | null = null;
    let userData = null;

    for (const blob of allUsers.blobs) {
      try {
        const user = await userStore.get(blob.key, { type: "json" });
        if (user && user.username === username) {
          userId = blob.key;
          userData = user;
          break;
        }
      } catch (error) {
        console.error(`Error getting user ${blob.key}:`, error);
        continue;
      }
    }

    if (!userId || !userData) {
      return new Response(
        JSON.stringify({
          error: "Invalid username or password",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Verify password with bcrypt
    const passwordValid = await bcrypt.compare(password, userData.password);

    if (!passwordValid) {
      return new Response(
        JSON.stringify({
          error: "Invalid username or password",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Generate JWT token
    if (!process.env.COOKIE_JWT_SECRET) {
      throw new Error("Missing COOKIE_JWT_SECRET environment variable");
    }
    const secret = new TextEncoder().encode(process.env.COOKIE_JWT_SECRET);

    const jwt = await new SignJWT({ userId, username: userData.username })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1w")
      .sign(secret);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = userData;

    return new Response(
      JSON.stringify({
        success: true,
        user: { ...userWithoutPassword, id: userId },
        token: jwt,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Login error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const config: Config = {
  path: "/api/auth/login",
};