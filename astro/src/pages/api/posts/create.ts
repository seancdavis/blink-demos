import { getStore } from '@netlify/blobs'
import { v4 as uuidv4 } from 'uuid'
import { getCurrentUser } from '@utils/auth'
import { setFeedback } from '@utils/feedback'
import type { APIRoute } from 'astro'
import type { Post } from '@utils/types'
import { addToPostsIndex } from '@utils/posts'
import { purgeCache } from '@netlify/functions'

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const user = await getCurrentUser({ cookies })

  if (!user) {
    setFeedback({ cookies, value: 'login_required' })
    return redirect('/login')
  }

  const formData = await request.formData()
  const title = formData.get('title') as string
  const content = formData.get('content') as string

  if (!title || !content) {
    setFeedback({ cookies, value: 'post_missing_fields' })
    return redirect('/')
  }

  if (title.length < 10) {
    setFeedback({ cookies, value: 'post_title_too_short' })
    return redirect('/')
  }

  if (title.length > 64) {
    setFeedback({ cookies, value: 'post_title_too_long' })
    return redirect('/')
  }

  if (content.length < 10) {
    setFeedback({ cookies, value: 'post_content_too_short' })
    return redirect('/')
  }

  if (content.length > 400) {
    setFeedback({ cookies, value: 'post_content_too_long' })
    return redirect('/')
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
  setFeedback({ cookies, value: 'post_created' })
  return redirect('/')
}
