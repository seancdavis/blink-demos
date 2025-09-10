import { getStore } from '@netlify/blobs'
import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ request }) => {
  try {
    const cacheStore = getStore({ name: 'Cache', consistency: 'strong' })
    const cacheList = await cacheStore.list()

    const cacheEntries = []
    for (const { key } of cacheList.blobs) {
      const cacheData = await cacheStore.get(key, { type: 'json' })
      cacheEntries.push({ key, data: cacheData })
    }

    const sortedCacheEntries = cacheEntries.sort((a, b) => a.key.localeCompare(b.key))
    const totalCacheEntries = cacheEntries.length

    return new Response(
      JSON.stringify({ totalCacheEntries, cacheEntries: sortedCacheEntries }, null, 2),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: 'Failed to retrieve cache',
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
  }
}
