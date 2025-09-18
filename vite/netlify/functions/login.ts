import { getStore } from "@netlify/blobs";
import type { Config, Context } from "@netlify/functions";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";
import type { User } from "../../src/utils/types";

export default async (request: Request, context: Context) => {
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
        JSON.stringify({ error: "Username and password are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const userStore = getStore({ name: "User", consistency: "strong" });

    // Find user by username
    const allUsers = await userStore.list();
    let userId: string | null = null;
    for (const blob of allUsers.blobs) {
      const user: User = await userStore.get(blob.key, { type: "json" });
      if (user.username === username) {
        userId = blob.key;
        break;
      }
    }

    if (!userId) {
      return new Response(
        JSON.stringify({ error: "Invalid username or password" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const userBlob: User = await userStore.get(userId, { type: "json" });
    const passwordValid = await bcrypt.compare(password, userBlob.password);

    if (!passwordValid) {
      return new Response(
        JSON.stringify({ error: "Invalid username or password" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (!process.env.COOKIE_JWT_SECRET) {
      throw new Error("Missing COOKIE_JWT_SECRET environment variable");
    }
    const secret = new TextEncoder().encode(process.env.COOKIE_JWT_SECRET);

    const jwt = await new SignJWT(userBlob)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1w")
      .sign(secret);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = userBlob;

    return new Response(
      JSON.stringify({
        success: true,
        user: userWithoutPassword,
        token: jwt,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Login error:", error);

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
  path: "/api/auth/login",
};
