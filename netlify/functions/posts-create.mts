import { getStore } from '@netlify/blobs'
import type { Context } from '@netlify/edge-functions'
import { v4 as uuidv4 } from 'uuid'
import { functionUtils } from '../../src/utils/index.mts'
import { Post } from '../../src/utils/types.mts'

export default async (request: Request, context: Context) => {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  const { url, user, setFeedback, redirect } = await functionUtils({ request, context })

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

  setFeedback('post_created')
  return redirect('/')
}
