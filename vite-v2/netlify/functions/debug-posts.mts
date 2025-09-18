import { getStore } from '@netlify/blobs'
import type { Config, Context } from '@netlify/functions'

export default async (request: Request, context: Context) => {
  const url = new URL(request.url)
  const apiKey = url.searchParams.get('api_key')

  if (apiKey !== process.env.ADMIN_API_KEY) {
    return new Response('Unauthorized', { status: 401 })
  }
  try {
    const postsStore = getStore({ name: 'Post', consistency: 'strong' })
    const postsList = await postsStore.list()

    const posts: { key: string; data: any }[] = []
    for (const { key } of postsList.blobs) {
      const post = await postsStore.get(key, { type: 'json' })
      posts.push({ key, data: post })
    }

    return new Response(
      JSON.stringify(
        {
          totalPosts: posts.length,
          posts: posts.sort(
            (a, b) =>
              new Date(b.data?.createdAt || 0).getTime() -
              new Date(a.data?.createdAt || 0).getTime(),
          ),
        },
        null,
        2,
      ),
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
        error: 'Failed to retrieve posts',
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

export const config: Config = {
  path: '/api/debug/posts',
}
