import type { Context } from '@netlify/edge-functions'
import { edgeFunctionUtils } from '../../src/utils/index.mts'

export default async function handler(request: Request, context: Context) {
  const { setFeedback, url, cookies, user } = await edgeFunctionUtils({ request, context })
  const requestPath = url.pathname
  const isAuthPage = ['/login', '/register', '/api/auth/register', '/api/auth/login'].includes(
    requestPath,
  )

  // If no user is found and the page is not an auth page, redirect to login
  if (!user && !isAuthPage) {
    cookies.delete({ name: 'blink_session', path: '/' })
    setFeedback('login_required')
    return Response.redirect('/login', 303)
  }

  // If a user is found and the page is an auth page, redirect to the home page
  if (user && isAuthPage) {
    setFeedback('already_logged_in')
    return Response.redirect('/', 303)
  }

  // Continue to next handler
  return context.next()
}
