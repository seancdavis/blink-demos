import { getStore } from '@netlify/blobs'

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
export async function getRecentPostIds(limit = 10): Promise<string[]> {
  const index = await getPostsIndex()
  return index.slice(0, limit).map((entry) => entry.id)
}
