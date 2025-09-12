import { getStore } from '@netlify/blobs'
import bycrypt from 'bcrypt'
import { SignJWT } from 'jose'
import { setFeedback } from '@utils/feedback'
import type { User } from '@utils/types'
import type { APIRoute } from 'astro'

const DEFAULT_REDIRECT_PATH = '/'

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const formData = await request.formData()
  const username = formData.get('username') as string | null
  const password = formData.get('password') as string | null

  if (!username || !password) {
    setFeedback({ cookies, value: 'user_pass_req' })
    return redirect(DEFAULT_REDIRECT_PATH)
  }

  const userStore = getStore({ name: 'User', consistency: 'strong' })

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
    setFeedback({ cookies, value: 'user_pass_error' })
    return redirect(DEFAULT_REDIRECT_PATH)
  }

  const userBlob: User = await userStore.get(userId, { type: 'json' })
  const passwordValid = await bycrypt.compare(password, userBlob.password)

  if (!passwordValid) {
    setFeedback({ cookies, value: 'user_pass_error' })
    return redirect(DEFAULT_REDIRECT_PATH)
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

  cookies.set('blink_session', jwt, { path: '/', httpOnly: true, sameSite: 'strict' })

  setFeedback({ cookies, value: 'login_success' })
  return redirect('/')
}
