import { getStore } from '@netlify/blobs'
import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ request }) => {
  try {
    const postsStore = getStore({ name: 'Post', consistency: 'strong' })
    const postsList = await postsStore.list()

    const posts: { key: string; data: any }[] = []
    for (const { key } of postsList.blobs) {
      const post = await postsStore.get(key, { type: 'json' })
      posts.push({ key, data: post })
    }

    const sortedPosts = posts.sort((a, b) => {
      return new Date(b.data?.createdAt || 0).getTime() - new Date(a.data?.createdAt || 0).getTime()
    })

    return new Response(JSON.stringify({ totalPosts: posts.length, posts: sortedPosts }, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
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
