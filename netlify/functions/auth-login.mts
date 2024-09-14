import { getStore } from '@netlify/blobs'
import type { Context } from '@netlify/functions'
import bycrypt from 'bcrypt'
import { SignJWT } from 'jose'
import type { User } from '../../src/types'
import { FeedbackName } from '../../src/utils/feedback-data'

export default async (request: Request, context: Context) => {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  const redirect = (path: string = 'login') => {
    return new Response(null, {
      status: 303,
      headers: {
        Location: `${url.origin}/${path}`,
        'Cache-Control': 'no-cache',
      },
    })
  }

  const setFeedback = (value: FeedbackName) => {
    cookies.set({ name: 'u_feedback', value, path: '/', httpOnly: true, sameSite: 'Strict' })
  }

  const { cookies } = context
  const url = new URL(request.url)

  const formData = await request.formData()
  const username = formData.get('username') as string | null
  const password = formData.get('password') as string | null

  if (!username || !password) {
    setFeedback('user_pass_req')
    return redirect()
  }

  const userStore = getStore('User')

  const allUsers = await userStore.list()
  let userId: string | null = null
  for (const blob of allUsers.blobs) {
    const user: User = await userStore.get(blob.key, { type: 'json' })
    if (user.username === username) {
      userId = blob.key
      break
    }
  }

  if (!userId) {
    setFeedback('user_pass_error')
    return redirect()
  }

  const userBlob: User = await userStore.get(userId, { type: 'json' })
  const passwordValid = await bycrypt.compare(password, userBlob.password)

  if (!passwordValid) {
    setFeedback('user_pass_error')
    return redirect()
  }

  if (!process.env.COOKIE_JWT_SECRET) {
    throw new Error('Missing COOKIE_JWT_SECRET environment variable')
  }
  const secret = new TextEncoder().encode(process.env.COOKIE_JWT_SECRET)

  const jwt = await new SignJWT(userBlob)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1w')
    .sign(secret)

  cookies.set({ name: 'u_session', value: jwt, path: '/', httpOnly: true, sameSite: 'Strict' })

  setFeedback('login_success')
  return redirect('')
}
