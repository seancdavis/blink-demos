import { getStore } from '@netlify/blobs'
import bcrypt from 'bcrypt'
import { SignJWT } from 'jose'
import { createFeedbackResponse, createErrorResponse } from './shared/feedback'
import type { User } from '../../src/utils/types'

export default async (request: Request) => {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const formData = await request.formData()
    const username = formData.get('username') as string | null
    const password = formData.get('password') as string | null

    if (!username || !password) {
      return createFeedbackResponse('user_pass_req')
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
      return createFeedbackResponse('user_pass_error')
    }

    const userBlob: User = await userStore.get(userId, { type: 'json' })
    const passwordValid = await bcrypt.compare(password, userBlob.password)

    if (!passwordValid) {
      return createFeedbackResponse('user_pass_error')
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

    const headers = new Headers()
    headers.set('Location', '/')

    // Set both session and feedback cookies
    const sessionCookie = `blink_session=${jwt}; Path=/; HttpOnly; SameSite=strict`
    const feedbackCookie = `blink_feedback=login_success; Path=/; HttpOnly; SameSite=strict`
    headers.append('Set-Cookie', sessionCookie)
    headers.append('Set-Cookie', feedbackCookie)

    return new Response(null, {
      status: 302,
      headers
    })
  } catch (error) {
    console.error('Login error:', error)
    return createErrorResponse('Internal server error', 500)
  }
}