import { getStore } from "@netlify/blobs";
import type { Context } from "@netlify/edge-functions";
import type { Config } from "@netlify/functions";
import { clearPostsIndex } from "../../src/utils/posts-index";

export default async (request: Request, context: Context) => {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const data = await request.json();
  const apiKey = data.api_key as string;

  if (apiKey !== process.env.ADMIN_API_KEY) {
    return new Response("Unauthorized", { status: 401 });
  }

  const postStore = getStore({ name: "Post", consistency: "strong" });
  const allPostIds = (await postStore.list()).blobs.map(({ key }) => key);
  await Promise.all(allPostIds.map((id) => postStore.delete(id)));
  await clearPostsIndex();

  return new Response("All posts deleted successfully");
};

export const config: Config = {
  path: "/api/admin/reset-posts",
};
