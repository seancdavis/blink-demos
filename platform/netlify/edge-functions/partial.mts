import type { Context } from '@netlify/edge-functions'
import { Element, HTMLRewriter } from 'https://ghuc.cc/worker-tools/html-rewriter/index.ts'
import { type PartialName } from '../../src/utils/partial-data.mts'
import { renderPartial } from '../../src/utils/render-partial.mts'
import { shouldProcessHtml } from '../../src/utils/index.mts'

export class PartialHandler {
  element(element: Element) {
    const partialName = element.getAttribute('name') as PartialName

    const partialData: Record<string, string> = {}
    Array.from(element.attributes).forEach(([key, value]) => (partialData[key] = value))

    const partialContent = renderPartial({ name: partialName, data: partialData })
    element.replace(partialContent, { html: true })
  }
}

export default async function handler(request: Request, context: Context) {
  const response = await context.next()

  if (!shouldProcessHtml(request, response)) {
    return response
  }

  return new HTMLRewriter().on('partial', new PartialHandler()).transform(response)
}
