import { getStore } from '@netlify/blobs'
import type { Context } from '@netlify/edge-functions'
import bycrypt from 'bcrypt'
import { SignJWT } from 'jose'
import { v4 as uuidv4 } from 'uuid'
import { functionUtils } from '../../src/utils/index.mts'
import { User } from '../../src/utils/types.mts'

export default async (request: Request, context: Context) => {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  const { redirect, setFeedback, cookies } = await functionUtils({
    request,
    context,
    defaultRedirectPath: '/register',
  })

  const formData = await request.formData()
  const username = formData.get('username') as string | null
  const password = formData.get('password') as string | null
  const pwdConfirmation = formData.get('password_confirmation') as string | null

  if (!username || !password) {
    setFeedback('user_pass_req')
    return redirect()
  }

  if (password !== pwdConfirmation) {
    setFeedback('pass_no_match')
    return redirect()
  }

  if (password.length < 8) {
    setFeedback('pass_too_short')
    return redirect()
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
    setFeedback('user_exists')
    return redirect()
  }

  const passwordHash = await bycrypt.hash(password, 10)
  const uuid = uuidv4()
  const user: User = {
    id: uuid,
    username,
    password: passwordHash,
    avatarSrc: '/images/default-avatar.jpg',
  }

  await userStore.setJSON(uuid, user)

  if (!process.env.COOKIE_JWT_SECRET) {
    throw new Error('Missing COOKIE_JWT_SECRET environment variable')
  }
  const secret = new TextEncoder().encode(process.env.COOKIE_JWT_SECRET)

  const jwt = await new SignJWT(user)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1w')
    .sign(secret)

  cookies.set({ name: 'u_session', value: jwt, path: '/', httpOnly: true, sameSite: 'Strict' })

  setFeedback('user_created')
  return redirect()
}
