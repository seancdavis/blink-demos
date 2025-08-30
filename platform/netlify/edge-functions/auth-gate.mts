import type { Context } from '@netlify/edge-functions'
import { Element, HTMLRewriter } from 'https://ghuc.cc/worker-tools/html-rewriter/index.ts'
import { edgeFunctionUtils } from '../../src/utils/index.mts'
import type { User } from '../../src/utils/types.mts'

export class IsAuthenticatedHandler {
  user: User | null

  constructor(user: User | null) {
    this.user = user
  }

  element(element: Element) {
    if (!this.user) {
      // Remove this element if user is not authenticated
      element.remove()
    } else {
      // Keep content and add user data attributes for template substitution
      element.setAttribute('data-username', this.user.username || '')
      element.setAttribute('data-avatar-src', this.user.avatarSrc || '')
      element.setAttribute('data-user-id', this.user.id || '')

      // Remove the custom tag name
      element.tagName = 'div'
    }
  }
}

export class IsUnauthenticatedHandler {
  user: User | null

  constructor(user: User | null) {
    this.user = user
  }

  element(element: Element) {
    if (this.user) {
      // Remove this element if user is authenticated
      element.remove()
    } else {
      // Keep content and remove custom tag name
      element.tagName = 'div'
    }
  }
}

export class AuthGateHandler {
  element(element: Element) {
    // Remove the auth-gate wrapper tag but keep content
    element.tagName = 'div'
    element.setAttribute('class', 'auth-gate')
  }
}

export default async function handler(request: Request, context: Context) {
  const { user } = await edgeFunctionUtils({ request, context })
  const response = await context.next()

  return new HTMLRewriter()
    .on('is-authenticated', new IsAuthenticatedHandler(user))
    .on('is-unauthenticated', new IsUnauthenticatedHandler(user))
    .on('auth-gate', new AuthGateHandler())
    .transform(response)
}
