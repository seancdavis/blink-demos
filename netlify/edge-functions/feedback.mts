import { Element, HTMLRewriter } from 'https://ghuc.cc/worker-tools/html-rewriter/index.ts'
import type { Context } from '@netlify/edge-functions'
import { html } from 'https://deno.land/x/html/mod.ts'
import { feedbackData, type FeedbackType, FeedbackName } from '../../src/utils/feedback-data.ts'

type FeedbackHandlerOptions = {
  type: FeedbackType
  message: string
}

export class FeedbackHandler {
  type: FeedbackType
  message: FeedbackHandlerOptions['message']

  constructor(options: FeedbackHandlerOptions) {
    this.type = options.type
    this.message = options.message
  }

  element(element: Element) {
    const partialHtml = html`<partial
      name="feedback"
      message="${this.message}"
      classname="${this.type}"
    ></partial>`
    element.replace(partialHtml, { html: true })
  }
}

export default async function handler(req: Request, context: Context) {
  const response = await context.next()
  const { cookies } = context

  const feedbackName = cookies.get('u_feedback') as FeedbackName
  if (!feedbackName) return

  const { message, type } = feedbackData[feedbackName]

  if (!message || !type) return

  return new HTMLRewriter()
    .on('feedback', new FeedbackHandler({ type, message }))
    .transform(response)
}
