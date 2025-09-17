import { getStore } from '@netlify/blobs'
import type { HandlerEvent, HandlerContext } from '@netlify/functions'
import { decodeJwt } from 'jose'
import type { User } from '../../src/utils/types.mts'

export const config = {
  path: '/api/auth/check',
}

async function getCurrentUserFromEvent(event: HandlerEvent): Promise<User | null> {
  let decodedJwt: User | null = null

  // Parse cookies from headers
  const cookieHeader = event.headers.cookie || ''
  const cookies = cookieHeader
    .split(';')
    .map(cookie => cookie.trim().split('='))
    .reduce((acc, [key, value]) => {
      acc[key] = decodeURIComponent(value || '')
      return acc
    }, {} as Record<string, string>)

  const sessionCookie = cookies['blink_session']

  // No session cookie is set
  if (!sessionCookie) return null

  try {
    decodedJwt = decodeJwt(sessionCookie)
  } catch (_err: unknown) {
    // Decoding the JWT failed
    return null
  }

  // The JWT didn't fail to decode, but it's not a valid JWT
  if (!decodedJwt) return null

  const userStore = getStore({ name: 'User', consistency: 'strong' })
  const userBlob: User | null = await userStore.get(decodedJwt.id, { type: 'json' })

  // User blob not found
  if (!userBlob) return null

  const userMatches =
    userBlob &&
    userBlob.username === decodedJwt.username &&
    userBlob.id === decodedJwt.id &&
    userBlob.password === decodedJwt.password

  // User blob is not a match to the JWT
  if (!userMatches) return null

  return userBlob
}

export default async function handler(event: HandlerEvent, context: HandlerContext) {
  try {
    if (event.httpMethod !== 'GET') {
      return {
        statusCode: 405,
        body: 'Method Not Allowed',
      }
    }

    const user = await getCurrentUserFromEvent(event)

    if (!user) {
      return {
        statusCode: 401,
        body: 'Unauthorized',
      }
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: user.id,
        username: user.username,
        avatarSrc: user.avatarSrc,
      }),
    }
  } catch (error) {
    console.error('Error checking auth:', error)
    return {
      statusCode: 500,
      body: 'Internal Server Error',
    }
  }
}