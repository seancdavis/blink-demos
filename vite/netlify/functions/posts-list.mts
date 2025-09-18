import { getStore } from '@netlify/blobs'
import type { Context } from '@netlify/edge-functions'
import type { Config } from '@netlify/functions'
import { getPaginatedPostIds } from '../../utils/posts-index.mts'
import { PostWithUser } from '../../utils/types.mts'

export default async (request: Request, context: Context) => {
  if (request.method !== 'GET') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  try {
    // Get page number from query params (default to 1)
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1', 10)

    // Get paginated post IDs and metadata
    const pagination = await getPaginatedPostIds(page, 12)

    // Fetch only the posts for current page
    const postStore = getStore({ name: 'Post', consistency: 'strong' })
    const posts = await Promise.all(
      pagination.postIds.map(async (id) => await postStore.get(id, { type: 'json' })),
    )

    // Get unique user IDs from posts
    const uniqueUserIds = [...new Set(posts.map((post) => post.userId))]

    // Only fetch users that are needed for posts
    const userStore = getStore({ name: 'User', consistency: 'strong' })
    const users = await Promise.all(
      uniqueUserIds.map(async (id) => await userStore.get(id, { type: 'json' })),
    )

    const postsWithUsers: PostWithUser[] = posts.map((post) => {
      const user = users.find((user) => user.id === post.userId)
      return { ...post, user }
    })

    return new Response(
      JSON.stringify({
        posts: postsWithUsers,
        pagination,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
  } catch (error) {
    console.error('Error fetching posts:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}

export const config: Config = {
  path: '/api/posts/list',
}
