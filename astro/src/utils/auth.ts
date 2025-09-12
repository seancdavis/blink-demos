import { getStore } from '@netlify/blobs'
import { decodeJwt } from 'jose'
import type { User } from '@utils/types'
import type { AstroCookies } from 'astro'

type GetCurrentUserOptions = {
  cookies: AstroCookies
}

export async function getCurrentUser(options: GetCurrentUserOptions): Promise<User | undefined> {
  const { cookies } = options
  let decodedJwt: User | null = null

  const sessionCookie = cookies.get('blink_session')
  // No session cookie is set
  if (!sessionCookie) return

  try {
    decodedJwt = decodeJwt(sessionCookie.value)
  } catch (_err: unknown) {
    // Decoding the JWT failed
    return
  }

  // The JWT didn't fail to decode, but it's not a valid JWT
  if (!decodedJwt) return

  const userStore = getStore({ name: 'User', consistency: 'strong' })
  const userBlob: User | null = await userStore.get(decodedJwt.id, { type: 'json' })

  // User blob not found
  if (!userBlob) return

  const userMatches =
    userBlob &&
    userBlob.username === decodedJwt.username &&
    userBlob.id === decodedJwt.id &&
    userBlob.password === decodedJwt.password

  // User blob is not a match to the JWT
  if (!userMatches) return

  return userBlob
}

export async function getUserByUsername(username: string): Promise<User | null> {
  const userStore = getStore({ name: 'User', consistency: 'strong' })
  const allUsers = await userStore.list()

  for (const blob of allUsers.blobs) {
    const user: User = await userStore.get(blob.key, { type: 'json' })
    if (user.username === username) {
      return user
    }
  }

  return null
}
