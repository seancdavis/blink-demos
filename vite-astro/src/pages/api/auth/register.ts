import { getStore } from '@netlify/blobs'
import { purgeCache } from '@netlify/functions'
import { setFeedback } from '@utils/feedback'
import type { User } from '@utils/types'
import type { APIRoute } from 'astro'
import bycrypt from 'bcrypt'
import { SignJWT } from 'jose'
import { v4 as uuidv4 } from 'uuid'

const DEFAULT_REDIRECT_PATH = '/register'

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const formData = await request.formData()
  const username = formData.get('username') as string | null
  const password = formData.get('password') as string | null
  const pwdConfirmation = formData.get('password_confirmation') as string | null

  if (!username || !password) {
    setFeedback({ cookies, value: 'user_pass_req' })
    return redirect(DEFAULT_REDIRECT_PATH)
  }

  if (password !== pwdConfirmation) {
    setFeedback({ cookies, value: 'pass_no_match' })
    return redirect(DEFAULT_REDIRECT_PATH)
  }

  if (password.length < 8) {
    setFeedback({ cookies, value: 'pass_too_short' })
    return redirect(DEFAULT_REDIRECT_PATH)
  }

  const userStore = getStore({ name: 'User', consistency: 'strong' })

  const userStoreList = await userStore.list()
  const allUsers = await Promise.all(
    userStoreList.blobs.map(async (blob) => {
      const user = await userStore.get(blob.key, { type: 'json' })
      return user
    }),
  )
  const userExists = allUsers.some((user) => user.username === username)

  if (userExists) {
    setFeedback({ cookies, value: 'user_exists' })
    return redirect(DEFAULT_REDIRECT_PATH)
  }

  const passwordHash = await bycrypt.hash(password, 10)
  const uuid = uuidv4()
  const user: User = {
    id: uuid,
    username,
    password: passwordHash,
    avatarSrc: `/img/avatar/identicon/${username}`,
  }

  await userStore.setJSON(uuid, user)

  if (!import.meta.env.COOKIE_JWT_SECRET) {
    throw new Error('Missing COOKIE_JWT_SECRET environment variable')
  }
  const secret = new TextEncoder().encode(import.meta.env.COOKIE_JWT_SECRET)

  const jwt = await new SignJWT(user)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1w')
    .sign(secret)

  cookies.set('blink_session', jwt, { path: '/', httpOnly: true, sameSite: 'strict' })

  // The username is used to cache 404 responses on the profile page
  await purgeCache({ tags: [user.username] })
  setFeedback({ cookies, value: 'user_created' })
  return redirect('/')
}
