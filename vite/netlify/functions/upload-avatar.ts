import { getStore } from "@netlify/blobs";
import type { Config } from "@netlify/functions";
import { decodeJwt } from "jose";
import type { User } from "../../src/utils/types";

export default async (request: Request) => {
  console.log("Avatar upload request started");
  console.log("Method:", request.method);
  console.log("Headers:", Object.fromEntries(request.headers.entries()));

  // Simplified test response
  if (request.method !== "POST") {
    console.log("Method not allowed:", request.method);
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Return a simple test response first
  return new Response(JSON.stringify({ success: true, message: "Test response" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });

  /*
  // Original function code commented out for testing
  */
};

export const config: Config = {
  path: "/api/user/upload-avatar",
};
