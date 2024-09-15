import { getStore } from '@netlify/blobs'
import type { Context } from '@netlify/edge-functions'
import * as jose from 'https://deno.land/x/jose@v5.9.2/index.ts'
import { Element, HTMLRewriter } from 'https://ghuc.cc/worker-tools/html-rewriter/index.ts'
import { User } from '../../src/types.d.ts'
import { functionUtils } from '../../src/utils/index.mts'
import { renderPartial } from '../../src/utils/render-partial.mts'

type AuthLinksHandlerOptions = {
  signedIn: boolean
  username?: string
}

export class AuthLinksHandler {
  signedIn: true | false
  username?: string

  constructor(options: AuthLinksHandlerOptions) {
    this.signedIn = options.signedIn
    this.username = options.username
  }

  element(element: Element) {
    const partialContent = this.signedIn
      ? renderPartial({
          name: 'auth-links-signed-in',
          data: { username: this.username || '', avatarSrc: '/images/default-avatar.jpg' },
        })
      : renderPartial({ name: 'auth-links-signed-out' })

    element.replace(partialContent, { html: true })
  }
}

export default async function handler(request: Request, context: Context) {
  const { cookies } = context
  const { setFeedback, url } = functionUtils({ request, context })
  const requestPath = url.pathname
  const isAuthPage = ['/login', '/register', '/api/auth/register', '/api/auth/login'].includes(
    requestPath,
  )

  const nextContextWithAuthLinks = async (options: AuthLinksHandlerOptions) => {
    const { signedIn, username } = options
    const response = await context.next()
    return new HTMLRewriter()
      .on('auth-links', new AuthLinksHandler({ signedIn, username }))
      .transform(response)
  }

  const sessionCookie = cookies.get('u_session')
  if (!sessionCookie && !isAuthPage) {
    setFeedback('login_required')
    return Response.redirect('/login', 303)
  }

  let decodedJwt: User | null = null

  try {
    decodedJwt = jose.decodeJwt(sessionCookie)
  } catch (_err: unknown) {
    if (!isAuthPage) {
      cookies.delete({ name: 'u_session', path: '/' })
      setFeedback('login_required')
      return Response.redirect('/login', 303)
    }
  }

  if (!decodedJwt && !isAuthPage) {
    setFeedback('login_required')
    return Response.redirect('/login', 303)
  }

  if (!decodedJwt) {
    return nextContextWithAuthLinks({ signedIn: false })
  }

  const userStore = getStore('User')
  const userBlob: User | null = await userStore.get(decodedJwt.id, { type: 'json' })

  if (!userBlob && !isAuthPage) {
    setFeedback('login_required')
    return Response.redirect('/login', 303)
  }

  if (!userBlob) {
    return nextContextWithAuthLinks({ signedIn: false })
  }

  const userMatches =
    userBlob &&
    userBlob.username === decodedJwt.username &&
    userBlob.id === decodedJwt.id &&
    userBlob.password === decodedJwt.password

  if (!userMatches && !isAuthPage) {
    setFeedback('login_required')
    return Response.redirect('/login', 303)
  }

  if (userMatches && isAuthPage) {
    setFeedback('already_logged_in')
    return Response.redirect('/', 303)
  }

  return nextContextWithAuthLinks({ signedIn: true, username: userBlob.username })
}
