import { getStore } from '@netlify/blobs'
import { Context } from '@netlify/edge-functions'
import { decodeJwt } from 'jose'
import type { User } from './types.mts'

type GetCurrentUserOptions = {
  cookies: Context['cookies']
}

export async function getCurrentUser(options: GetCurrentUserOptions): Promise<User | null> {
  const { cookies } = options
  let decodedJwt: User | null = null

  const sessionCookie = cookies.get('u_session')
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
