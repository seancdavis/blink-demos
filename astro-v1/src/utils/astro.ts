import type { AstroCookies } from 'astro'
import { getCurrentUser } from './get-current-user.ts'

export { newlineToLineBreak } from './nl2br.ts'

/* ---- Astro Utilities ---- */

type AstroUtilsOptions = {
  request: Request
  cookies: AstroCookies
  url: URL
  redirect: (url: string | URL, status?: number) => Response
}

type AstroUtilsResponse = {
  redirect: (url: string | URL, status?: number) => Response
  setFeedback: (message: string) => void
  url: URL
  cookies: AstroCookies
  user: Awaited<ReturnType<typeof getCurrentUser>>
}

// Convert Astro cookies to format expected by getCurrentUser
function convertCookies(astroCookies: AstroCookies) {
  return {
    get: (name: string) => {
      const cookie = astroCookies.get(name)
      return cookie?.value || ''
    },
    set: (name: string, value: string, options?: any) => {
      astroCookies.set(name, value, options)
      return ''
    },
    delete: (name: string) => {
      astroCookies.delete(name)
    },
  } as any // Type assertion to avoid interface mismatch
}

export async function astroUtils(options: AstroUtilsOptions): Promise<AstroUtilsResponse> {
  const { cookies, url, redirect } = options

  const convertedCookies = convertCookies(cookies)
  const user = await getCurrentUser({ cookies: convertedCookies })

  const setFeedback = (message: string) => {
    cookies.set('feedback', message, {
      path: '/',
      httpOnly: false,
      maxAge: 60 * 5, // 5 minutes
      sameSite: 'strict',
    })
  }

  return { redirect, setFeedback, url, cookies, user }
}

// Helper to get feedback from cookies
export function getFeedback(cookies: AstroCookies): string | null {
  const feedback = cookies.get('feedback')
  if (feedback) {
    cookies.delete('feedback')
    return feedback.value
  }
  return null
}
