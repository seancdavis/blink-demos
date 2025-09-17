import { getStore } from '@netlify/blobs'
import { v4 as uuidv4 } from 'uuid'
import { getCurrentUser } from './shared/auth'
import { createSuccessResponse, createErrorResponse } from './shared/feedback'
import type { Post } from '../../src/utils/types'
import { purgeCache } from '@netlify/functions'

async function addToPostsIndex(postId: string, createdAt: string) {
  const cacheStore = getStore({ name: 'Cache', consistency: 'strong' })
  const POSTS_INDEX_KEY = 'posts-sorted-by-date'

  const currentIndex = await cacheStore.get(POSTS_INDEX_KEY, { type: 'json' }) || []
  const newEntry = { id: postId, createdAt }
  const updatedIndex = [newEntry, ...currentIndex].sort(
    (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  await cacheStore.setJSON(POSTS_INDEX_KEY, updatedIndex)
}

export default async (request: Request) => {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const user = await getCurrentUser(request)

    if (!user) {
      return createErrorResponse('Login required', 401)
    }

    const formData = await request.formData()
    const title = formData.get('title') as string
    const content = formData.get('content') as string

    if (!title || !content) {
      return createErrorResponse('Missing title or content')
    }

    if (title.length < 10) {
      return createErrorResponse('Title too short (minimum 10 characters)')
    }

    if (title.length > 64) {
      return createErrorResponse('Title too long (maximum 64 characters)')
    }

    if (content.length < 10) {
      return createErrorResponse('Content too short (minimum 10 characters)')
    }

    if (content.length > 400) {
      return createErrorResponse('Content too long (maximum 400 characters)')
    }

    const postStore = getStore({ name: 'Post', consistency: 'strong' })

    const generatePostId = async (): Promise<string> => {
      const id = uuidv4()
      const existingPost = await postStore.get(id, { type: 'json' })
      return existingPost ? generatePostId() : id
    }

    const id = await generatePostId()
    const createdAt = new Date().toISOString()

    const post: Post = { id, title, content, userId: user.id, createdAt }

    await postStore.setJSON(post.id, post)
    await addToPostsIndex(post.id, post.createdAt)

    await purgeCache({ tags: [post.id, user.id] })

    return createSuccessResponse({ message: 'Post created successfully', post })
  } catch (error) {
    console.error('Create post error:', error)
    return createErrorResponse('Failed to create post', 500)
  }
}