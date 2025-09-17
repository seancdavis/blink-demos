import type { Context } from '@netlify/edge-functions'
import { edgeFunctionUtils } from '../../src/utils/index.mts'

export default async function handler(request: Request, context: Context) {
  const { user, setFeedback } = await edgeFunctionUtils({ request, context })
  const url = new URL(request.url)

  // If user is authenticated and trying to access auth pages, redirect to home
  if (user && ['/login', '/register'].includes(url.pathname)) {
    setFeedback('already_logged_in')
    return Response.redirect(new URL('/', url.origin), 302)
  }

  // Continue to next handler
  return context.next()
}
