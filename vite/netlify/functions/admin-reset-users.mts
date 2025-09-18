import { getStore } from "@netlify/blobs";
import type { Context } from "@netlify/edge-functions";
import type { Config } from "@netlify/functions";

export default async (request: Request, context: Context) => {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const formData = await request.formData();
  const apiKey = formData.get("api_key") as string;

  if (apiKey !== process.env.ADMIN_API_KEY) {
    return new Response("Unauthorized", { status: 401 });
  }

  const userStore = getStore({ name: "User", consistency: "strong" });
  const allUserIds = (await userStore.list()).blobs.map(({ key }) => key);
  await Promise.all(allUserIds.map((id) => userStore.delete(id)));

  return new Response("All users deleted successfully");
};

export const config: Config = {
  path: "/api/admin/reset-users",
};
