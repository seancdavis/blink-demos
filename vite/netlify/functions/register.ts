import { getStore } from "@netlify/blobs";
import type { Config, Context } from "@netlify/functions";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";
import { v4 as uuidv4 } from "uuid";
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
    const { username, password, password_confirmation } = body;

    if (!username || !password) {
      return new Response(
        JSON.stringify({ error: "Username and password are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (password !== password_confirmation) {
      return new Response(
        JSON.stringify({ error: "Passwords do not match" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (password.length < 8) {
      return new Response(
        JSON.stringify({ error: "Password must be at least 8 characters" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const userStore = getStore({ name: "User", consistency: "strong" });

    // Check if username already exists
    const userStoreList = await userStore.list();
    const allUsers = await Promise.all(
      userStoreList.blobs.map(async (blob) => {
        const user = await userStore.get(blob.key, { type: "json" });
        return user;
      })
    );
    const userExists = allUsers.some((user) => user.username === username);

    if (userExists) {
      return new Response(
        JSON.stringify({ error: "Username already exists" }),
        {
          status: 409,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Create new user
    const passwordHash = await bcrypt.hash(password, 10);
    const uuid = uuidv4();
    const user: User = {
      id: uuid,
      username,
      password: passwordHash,
      avatarSrc: `/img/avatar/identicon/${username}`,
    };

    await userStore.setJSON(uuid, user);

    // Create JWT and set cookie
    if (!process.env.COOKIE_JWT_SECRET) {
      throw new Error("Missing COOKIE_JWT_SECRET environment variable");
    }
    const secret = new TextEncoder().encode(process.env.COOKIE_JWT_SECRET);

    const jwt = await new SignJWT(user)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1w")
      .sign(secret);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return new Response(
      JSON.stringify({
        success: true,
        user: userWithoutPassword,
        token: jwt,
      }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Register error:", error);

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
  path: "/api/auth/register",
};