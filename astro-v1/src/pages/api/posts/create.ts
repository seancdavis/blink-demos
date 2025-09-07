import type { APIRoute } from 'astro'
import { getStore } from '@netlify/blobs'
import { v4 as uuidv4 } from 'uuid'
import { getCurrentUserFromAstro } from '../../../utils/auth.ts'
import { addToPostsIndex } from '../../../utils/posts-index.ts'
import { Post } from '../../../utils/types.ts'

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const user = await getCurrentUserFromAstro(cookies)

  if (!user) {
    cookies.set('feedback', 'login_required', {
      path: '/',
      httpOnly: false,
      maxAge: 60 * 5,
      sameSite: 'strict',
    })
    return redirect('/login')
  }

  const formData = await request.formData()
  const title = formData.get('title') as string
  const content = formData.get('content') as string

  if (!title || !content) {
    cookies.set('feedback', 'post_missing_fields', {
      path: '/',
      httpOnly: false,
      maxAge: 60 * 5,
      sameSite: 'strict',
    })
    return redirect('/')
  }

  if (title.length < 10) {
    cookies.set('feedback', 'post_title_too_short', {
      path: '/',
      httpOnly: false,
      maxAge: 60 * 5,
      sameSite: 'strict',
    })
    return redirect('/')
  }

  if (title.length > 64) {
    cookies.set('feedback', 'post_title_too_long', {
      path: '/',
      httpOnly: false,
      maxAge: 60 * 5,
      sameSite: 'strict',
    })
    return redirect('/')
  }

  if (content.length < 10) {
    cookies.set('feedback', 'post_content_too_short', {
      path: '/',
      httpOnly: false,
      maxAge: 60 * 5,
      sameSite: 'strict',
    })
    return redirect('/')
  }

  if (content.length > 400) {
    cookies.set('feedback', 'post_content_too_long', {
      path: '/',
      httpOnly: false,
      maxAge: 60 * 5,
      sameSite: 'strict',
    })
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

  cookies.set('feedback', 'post_created', {
    path: '/',
    httpOnly: false,
    maxAge: 60 * 5,
    sameSite: 'strict',
  })

  return redirect('/')
}
