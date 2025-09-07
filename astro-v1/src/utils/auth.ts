import type { AstroCookies } from 'astro'
import { decodeJwt } from 'jose'
import { getCurrentUser } from './get-current-user.ts'
import type { User } from './types.ts'

// Convert Astro cookies to format expected by getCurrentUser
function convertCookies(astroCookies: AstroCookies) {
  return {
    get: (name: string) => {
      const cookie = astroCookies.get(name)
      return cookie?.value || ''
    },
    set: () => '', // Not used in getCurrentUser
    delete: () => {}, // Not used in getCurrentUser
  } as any // Type assertion to avoid interface mismatch
}

// Fast auth check - only decodes JWT, no database call
export function isAuthenticatedFast(cookies: AstroCookies): boolean {
  const sessionCookie = cookies.get('blink_session')?.value
  if (!sessionCookie) return false
  
  try {
    const decoded = decodeJwt(sessionCookie)
    return !!(decoded && decoded.id && decoded.username)
  } catch {
    return false
  }
}

// Get user info from JWT without database verification (fast)
export function getUserFromJWT(cookies: AstroCookies): { id: string; username: string; avatarSrc: string } | null {
  const sessionCookie = cookies.get('blink_session')?.value
  if (!sessionCookie) return null
  
  try {
    const decoded = decodeJwt(sessionCookie) as any
    return decoded && decoded.id && decoded.username ? {
      id: decoded.id,
      username: decoded.username,
      avatarSrc: decoded.avatarSrc || '/images/default-avatar.svg'
    } : null
  } catch {
    return null
  }
}

// Check if user is authenticated (with database verification)
export async function isAuthenticated(cookies: AstroCookies) {
  const convertedCookies = convertCookies(cookies)
  const user = await getCurrentUser({ cookies: convertedCookies })
  return !!user
}

// Get current user from Astro cookies (with database verification)
export async function getCurrentUserFromAstro(cookies: AstroCookies) {
  const convertedCookies = convertCookies(cookies)
  return await getCurrentUser({ cookies: convertedCookies })
}

// Redirect helpers (path parameter kept for future use)
export function redirectIfAuthenticated(cookies: AstroCookies, _path: string) {
  return async function (redirect: (url: string) => Response) {
    const authenticated = await isAuthenticated(cookies)
    if (authenticated) {
      return redirect('/')
    }
    return null
  }
}

export function redirectIfNotAuthenticated(cookies: AstroCookies, _path: string) {
  return async function (redirect: (url: string) => Response) {
    const authenticated = await isAuthenticated(cookies)
    if (!authenticated) {
      return redirect('/login')
    }
    return null
  }
}
