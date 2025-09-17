import { getStore } from '@netlify/blobs'
import { decodeJwt } from 'jose'
import type { User } from '../../../src/utils/types'

export async function getCurrentUser(request: Request): Promise<User | undefined> {
  const cookies = request.headers.get('cookie') || ''
  const sessionCookie = parseCookie(cookies, 'blink_session')

  if (!sessionCookie) return

  let decodedJwt: User | null = null

  try {
    decodedJwt = decodeJwt(sessionCookie)
  } catch (_err: unknown) {
    return
  }

  if (!decodedJwt) return

  const userStore = getStore({ name: 'User', consistency: 'strong' })
  const userBlob: User | null = await userStore.get(decodedJwt.id, { type: 'json' })

  if (!userBlob) return

  const userMatches =
    userBlob &&
    userBlob.username === decodedJwt.username &&
    userBlob.id === decodedJwt.id &&
    userBlob.password === decodedJwt.password

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

function parseCookie(cookieString: string, name: string): string | undefined {
  const cookies = cookieString.split(';').map(cookie => cookie.trim())
  const targetCookie = cookies.find(cookie => cookie.startsWith(`${name}=`))
  return targetCookie ? targetCookie.split('=')[1] : undefined
}

export function setCookie(name: string, value: string, options: any = {}): string {
  let cookie = `${name}=${value}`

  if (options.path) cookie += `; Path=${options.path}`
  if (options.httpOnly) cookie += `; HttpOnly`
  if (options.sameSite) cookie += `; SameSite=${options.sameSite}`
  if (options.secure) cookie += `; Secure`
  if (options.maxAge) cookie += `; Max-Age=${options.maxAge}`

  return cookie
}