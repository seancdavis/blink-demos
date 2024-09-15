import type { Context } from '@netlify/edge-functions'
import { Element, HTMLRewriter } from 'https://ghuc.cc/worker-tools/html-rewriter/index.ts'
import { edgeFunctionUtils } from '../../src/utils/index.mts'
import { renderPartial } from '../../src/utils/render-partial.mts'

type AuthLinksHandlerOptions = {
  signedIn: boolean
  username?: string
  hasAvatar?: boolean
}

export class AuthLinksHandler {
  signedIn: boolean
  username?: string
  hasAvatar?: boolean

  constructor(options: AuthLinksHandlerOptions) {
    this.signedIn = options.signedIn
    this.username = options.username
    this.hasAvatar = options.hasAvatar
  }

  element(element: Element) {
    const avatarSrc =
      this.signedIn && this.hasAvatar
        ? `/images/avatar/small/${this.username}`
        : '/images/default-avatar.jpg'

    const partialContent = this.signedIn
      ? renderPartial({
          name: 'auth-links-signed-in',
          data: { username: this.username || '', avatarSrc },
        })
      : renderPartial({ name: 'auth-links-signed-out' })

    element.replace(partialContent, { html: true })
  }
}

export default async function handler(request: Request, context: Context) {
  const { setFeedback, url, cookies, user } = await edgeFunctionUtils({ request, context })
  const requestPath = url.pathname
  const isAuthPage = ['/login', '/register', '/api/auth/register', '/api/auth/login'].includes(
    requestPath,
  )

  const nextContextWithAuthLinks = async (options: AuthLinksHandlerOptions) => {
    const { signedIn, username, hasAvatar } = options
    const response = await context.next()
    return new HTMLRewriter()
      .on('auth-links', new AuthLinksHandler({ signedIn, username, hasAvatar }))
      .transform(response)
  }

  // If no user is found and the page is not an auth page, redirect to login
  if (!user && !isAuthPage) {
    cookies.delete({ name: 'u_session', path: '/' })
    setFeedback('login_required')
    return Response.redirect('/login', 303)
  }

  // If no user is found and the page is an auth page, render the page with the
  // unauthenticated auth links
  if (!user && isAuthPage) {
    return nextContextWithAuthLinks({ signedIn: false })
  }

  // If a user is found and the page is an auth page, redirect to the home page
  if (user && isAuthPage) {
    setFeedback('already_logged_in')
    return Response.redirect('/', 303)
  }

  // If a user is found and the page is not an auth page, render the page with
  // the authenticated auth links.
  //
  // Note: The user does exist at this point based on the logic above, so we can
  // safely assert that the user is not null.
  return nextContextWithAuthLinks({
    signedIn: true,
    username: user!.username,
    hasAvatar: user!.hasAvatar,
  })
}
