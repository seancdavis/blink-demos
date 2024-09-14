import { Element, HTMLRewriter } from 'https://ghuc.cc/worker-tools/html-rewriter/index.ts'
import type { Context } from '@netlify/edge-functions'
import { type PartialName } from '../../src/utils/partial-data.ts'
import { renderPartial } from '../../src/utils/render-partial.ts'

export class PartialHandler {
  element(element: Element) {
    const partialName = element.getAttribute('name') as PartialName

    const partialData: Record<string, string> = {}
    Array.from(element.attributes).forEach(([key, value]) => (partialData[key] = value))

    const partialContent = renderPartial({ name: partialName, data: partialData })
    element.replace(partialContent, { html: true })
  }
}

export default async function handler(_: Request, context: Context) {
  const response = await context.next()
  return new HTMLRewriter().on('partial', new PartialHandler()).transform(response)
}
