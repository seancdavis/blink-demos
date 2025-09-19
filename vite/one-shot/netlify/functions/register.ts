import { getStore } from "@netlify/blobs";
import type { Config } from "@netlify/functions";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";
import { v4 as uuidv4 } from "uuid";

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

    if (username.length < 3 || username.length > 30) {
      return new Response(
        JSON.stringify({
          error: "Username must be between 3 and 30 characters",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (password.length < 6) {
      return new Response(
        JSON.stringify({
          error: "Password must be at least 6 characters",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const userStore = getStore({ name: "User", consistency: "strong" });

    // Check if username already exists
    const allUsers = await userStore.list();
    for (const blob of allUsers.blobs) {
      try {
        const user = await userStore.get(blob.key, { type: "json" });
        if (user && user.username === username) {
          return new Response(
            JSON.stringify({
              error: "Username already exists",
            }),
            {
              status: 409,
              headers: { "Content-Type": "application/json" },
            }
          );
        }
      } catch (error) {
        console.error(`Error getting user ${blob.key}:`, error);
        continue;
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const userId = uuidv4();
    const userData = {
      username,
      password: hashedPassword,
      avatarSrc: `https://api.dicebear.com/7.x/identicon/png?seed=${userId}`,
    };

    // Store as text to ensure proper serialization
    await userStore.set(userId, JSON.stringify(userData));

    // Generate JWT token
    if (!process.env.COOKIE_JWT_SECRET) {
      throw new Error("Missing COOKIE_JWT_SECRET environment variable");
    }
    const secret = new TextEncoder().encode(process.env.COOKIE_JWT_SECRET);

    const jwt = await new SignJWT({ userId, username })
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
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Register error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const config: Config = {
  path: "/api/auth/register",
};