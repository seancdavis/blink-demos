import { getStore } from "@netlify/blobs";
import type { Config, Context } from "@netlify/functions";
import { getCurrentUser } from "../../src/utils/user";

export default async (request: Request, context: Context) => {
  try {
    if (request.method !== "GET") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json" },
      });
    }

    const user = await getCurrentUser({ cookies: context.cookies });

    if (!user) {
      return new Response(JSON.stringify({ user: null }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user;

    return new Response(
      JSON.stringify({
        user: userWithoutPassword,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Get current user error:", error);

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
  path: "/api/auth/me",
};