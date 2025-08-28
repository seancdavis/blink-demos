import type { Context } from '@netlify/edge-functions'
import { Element, HTMLRewriter } from 'https://ghuc.cc/worker-tools/html-rewriter/index.ts'
import { type PartialName } from '../../src/utils/partial-data.mts'
import { renderPartial } from '../../src/utils/render-partial.mts'
import { edgeFunctionUtils } from '../../src/utils/index.mts'
import type { User } from '../../src/utils/types.mts'

export class PartialHandler {
  user: User | null

  constructor(user: User | null) {
    this.user = user
  }

  element(element: Element) {
    const partialName = element.getAttribute('name') as PartialName
    const authRequired = element.getAttribute('auth-required') === 'true'
    const authState = element.getAttribute('auth-state') // 'authenticated' | 'guest'

    const partialData: Record<string, string> = {}
    Array.from(element.attributes).forEach(([key, value]) => (partialData[key] = value))

    let finalPartialName = partialName
    let shouldRender = true

    // Handle conditional rendering based on auth state
    if (authRequired && !this.user) {
      shouldRender = false
    } else if (authState === 'authenticated' && !this.user) {
      // Try to find guest version
      finalPartialName = `${partialName}-guest` as PartialName
    } else if (authState === 'guest' && this.user) {
      // Try to find authenticated version  
      finalPartialName = `${partialName}-auth` as PartialName
    }

    // Add user data to partial context if authenticated
    if (this.user) {
      partialData.userId = this.user.id
      partialData.username = this.user.username
      partialData.avatarSrc = this.user.avatarSrc
    }

    if (shouldRender) {
      const partialContent = renderPartial({ name: finalPartialName, data: partialData })
      element.replace(partialContent, { html: true })
    } else {
      element.remove()
    }
  }
}

export default async function handler(request: Request, context: Context) {
  const { user } = await edgeFunctionUtils({ request, context })
  const response = await context.next()
  return new HTMLRewriter().on('partial', new PartialHandler(user)).transform(response)
}
