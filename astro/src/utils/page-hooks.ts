import type { AstroCookies } from 'astro'
import { getAndClearFeedback, type FeedbackMessage } from './feedback'

type BeforePageLoadOptions = {
  cookies: AstroCookies
}

type BeforePageLoadResponse = {
  feedback?: FeedbackMessage
}

export async function beforePageLoad(
  options: BeforePageLoadOptions,
): Promise<BeforePageLoadResponse> {
  const { cookies } = options
  const feedback = getAndClearFeedback(cookies)
  return {
    feedback,
  }
}
