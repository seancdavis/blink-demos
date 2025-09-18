import type { Config } from "@netlify/functions";
import { getStore } from "@netlify/blobs";

export default async () => {
  try {
    const cacheStore = getStore({ name: "Cache", consistency: "strong" });
    const cacheList = await cacheStore.list();

    const cacheEntries: Array<{ key: string; data: any }> = [];
    for (const { key } of cacheList.blobs) {
      const cacheData = await cacheStore.get(key, { type: "json" });
      cacheEntries.push({ key, data: cacheData });
    }

    return new Response(
      JSON.stringify(
        {
          totalCacheEntries: cacheEntries.length,
          cacheEntries: cacheEntries.sort((a, b) => a.key.localeCompare(b.key)),
        },
        null,
        2
      ),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Failed to retrieve cache",
        details: error instanceof Error ? error.message : String(error),
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
  path: "/api/debug/cache",
};
