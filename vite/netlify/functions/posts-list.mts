import { getStore } from '@netlify/blobs'
import type { HandlerEvent, HandlerContext } from '@netlify/functions'
import { getPaginatedPostIds } from '../../src/utils/posts-index.mts'
import { PostWithUser } from '../../src/utils/types.mts'

export const config = {
  path: '/api/posts/list',
}

export default async function handler(event: HandlerEvent, context: HandlerContext) {
  try {
    if (event.httpMethod !== 'GET') {
      return {
        statusCode: 405,
        body: 'Method Not Allowed',
      }
    }

    // Get page number from query params (default to 1)
    const page = parseInt(event.queryStringParameters?.page || '1', 10)

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

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        posts: postsWithUsers,
        pagination,
      }),
    }
  } catch (error) {
    console.error('Error fetching posts:', error)
    return {
      statusCode: 500,
      body: 'Internal Server Error',
    }
  }
}