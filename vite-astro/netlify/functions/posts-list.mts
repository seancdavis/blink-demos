import { getStore } from '@netlify/blobs'
import { createSuccessResponse, createErrorResponse } from './shared/feedback'
import type { PostWithUser, PaginationResult, Post, User } from '../../src/utils/types'
import { timeAgoInWords } from '../../src/utils/date'
import { newlineToLineBreak, truncateText } from '../../src/utils/text'

const POSTS_INDEX_KEY = 'posts-sorted-by-date'

type PostIndexEntry = {
  id: string
  createdAt: string
}

async function getPostsIndex(): Promise<PostIndexEntry[]> {
  const cacheStore = getStore({ name: 'Cache', consistency: 'strong' })
  const index = await cacheStore.get(POSTS_INDEX_KEY, { type: 'json' })
  return index || []
}

async function getPaginatedPostIds(page: number = 1, limit: number = 12): Promise<PaginationResult> {
  const index = await getPostsIndex()
  const totalPosts = index.length
  const totalPages = Math.ceil(totalPosts / limit)

  const currentPage = Math.max(1, Math.min(page, totalPages || 1))
  const offset = (currentPage - 1) * limit
  const postIds = index.slice(offset, offset + limit).map((entry) => entry.id)

  return {
    postIds,
    currentPage,
    totalPages,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
    totalPosts,
  }
}

export default async (request: Request) => {
  if (request.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '12')

    // Get paginated post IDs and metadata
    const pagination = await getPaginatedPostIds(page, limit)

    // Fetch only the posts for current page
    const postStore = getStore({ name: 'Post', consistency: 'strong' })
    const posts = await Promise.all(
      pagination.postIds.map(async (id) => await postStore.get(id, { type: 'json' }))
    )

    // Get unique user IDs from posts
    const uniqueUserIds = [...new Set(posts.map((post: Post) => post.userId))]

    // Only fetch users that are needed for posts
    const userStore = getStore({ name: 'User', consistency: 'strong' })
    const users = await Promise.all(
      uniqueUserIds.map(async (id) => await userStore.get(id, { type: 'json' }))
    )

    const postsWithUsers: PostWithUser[] = posts.map((post: Post) => {
      const user = users.find((user: User) => user.id === post.userId)
      const date = timeAgoInWords(new Date(post.createdAt))
      const truncatedContent = truncateText(post.content, 150)

      return {
        ...post,
        user,
        date,
        postId: post.id,
        content: newlineToLineBreak(truncatedContent),
      }
    })

    return createSuccessResponse({
      posts: postsWithUsers,
      pagination,
    })
  } catch (error) {
    console.error('Posts list error:', error)
    return createErrorResponse('Failed to fetch posts', 500)
  }
}