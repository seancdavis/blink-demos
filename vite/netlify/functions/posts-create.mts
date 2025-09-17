import { getStore } from '@netlify/blobs'
import type { Context } from '@netlify/edge-functions'
import { type Config, purgeCache } from '@netlify/functions'
import { v4 as uuidv4 } from 'uuid'
import { functionUtils } from '../../utils/index.mts'
import { addToPostsIndex } from '../../utils/posts-index.mts'
import { Post } from '../../utils/types.mts'

export default async (request: Request, context: Context) => {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  const { user, setFeedback, redirect } = await functionUtils({ request, context })

  if (!user) {
    setFeedback('login_required')
    return redirect('/login')
  }

  const formData = await request.formData()
  const title = formData.get('title') as string
  const content = formData.get('content') as string

  if (!title || !content) {
    setFeedback('post_missing_fields')
    return redirect('/')
  }

  if (title.length < 10) {
    setFeedback('post_title_too_short')
    return redirect('/')
  }

  if (title.length > 64) {
    setFeedback('post_title_too_long')
    return redirect('/')
  }

  if (content.length < 10) {
    setFeedback('post_content_too_short')
    return redirect('/')
  }

  if (content.length > 400) {
    setFeedback('post_content_too_long')
    return redirect('/')
  }

  const postStore = getStore({ name: 'Post', consistency: 'strong' })
  const generatePostId = async () => {
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
  setFeedback('post_created')
  return redirect('/')
}

export const config: Config = {
  path: '/api/posts/create',
}
