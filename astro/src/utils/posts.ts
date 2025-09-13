import { getStore } from '@netlify/blobs'
import type { PostWithUser } from './types'
import { timeAgoInWords } from './date'
import { newlineToLineBreak, truncateText } from './text'

const POSTS_INDEX_KEY = 'posts-sorted-by-date'

type PostIndexEntry = {
  id: string
  createdAt: string
}

/**
 * Get the sorted posts index (most recent first)
 */
export async function getPostsIndex(): Promise<PostIndexEntry[]> {
  const cacheStore = getStore({ name: 'Cache', consistency: 'strong' })
  const index = await cacheStore.get(POSTS_INDEX_KEY, { type: 'json' })
  return index || []
}

/**
 * Add a new post to the index (maintains sort order)
 */
export async function addToPostsIndex(postId: string, createdAt: string) {
  const cacheStore = getStore({ name: 'Cache', consistency: 'strong' })
  const currentIndex = await getPostsIndex()

  const newEntry: PostIndexEntry = { id: postId, createdAt }
  const updatedIndex = [newEntry, ...currentIndex].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  await cacheStore.setJSON(POSTS_INDEX_KEY, updatedIndex)
}

/**
 * Clear the posts index (used when resetting all posts)
 */
export async function clearPostsIndex() {
  const cacheStore = getStore({ name: 'Cache', consistency: 'strong' })
  await cacheStore.delete(POSTS_INDEX_KEY)
}

/**
 * Get the most recent N post IDs
 */
export async function getRecentPostIds(limit = 12): Promise<string[]> {
  const index = await getPostsIndex()
  return index.slice(0, limit).map((entry) => entry.id)
}

export type PaginationResult = {
  postIds: string[]
  currentPage: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
  totalPosts: number
}

type GetPaginatedPostIdsOptions = {
  page?: number
  limit?: number
}

/**
 * Get paginated post IDs with pagination metadata
 */
export async function getPaginatedPostIds(
  options: GetPaginatedPostIdsOptions = {},
): Promise<PaginationResult> {
  const { page = 1, limit = 12 } = options

  const index = await getPostsIndex()
  const totalPosts = index.length
  const totalPages = Math.ceil(totalPosts / limit)

  // Ensure page is within valid range
  const currentPage = Math.max(1, Math.min(page, totalPages || 1))

  // Calculate offset
  const offset = (currentPage - 1) * limit

  // Get the page slice
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

type GetPaginatedPostsWithUsersOptions = {
  page?: number
  limit?: number
}

/**
 * Get paginated posts with user data
 */
export async function getPaginatedPostsWithUsers(
  options: GetPaginatedPostsWithUsersOptions = {},
): Promise<{
  posts: PostWithUser[]
  pagination: PaginationResult
}> {
  const { page = 1, limit = 12 } = options

  // Get paginated post IDs and metadata
  const pagination = await getPaginatedPostIds({ page, limit })

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

  return {
    posts: postsWithUsers,
    pagination,
  }
}

/**
 * Get all posts by a specific user
 */
export async function getUserPosts(userId: string): Promise<PostWithUser[]> {
  const postStore = getStore({ name: 'Post', consistency: 'strong' })
  const userStore = getStore({ name: 'User', consistency: 'strong' })
  
  // Get all posts
  const allPostIds = (await postStore.list()).blobs.map(({ key }) => key)
  const allPosts = await Promise.all(
    allPostIds.map(async (id) => await postStore.get(id, { type: 'json' }))
  )

  // Filter posts by user and sort by date (newest first)
  const userPosts = allPosts
    .filter((post) => post.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  // Get the user data
  const user = await userStore.get(userId, { type: 'json' })
  
  if (!user) {
    return []
  }

  // Format posts with user data and additional fields
  const postsWithUser: PostWithUser[] = userPosts.map((post) => {
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

  return postsWithUser
}
