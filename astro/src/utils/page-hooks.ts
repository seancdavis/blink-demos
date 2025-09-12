import type { AstroCookies } from 'astro'
import { getAndClearFeedback, type FeedbackMessage } from '@utils/feedback'
import type { User } from '@utils/types'
import { getCurrentUser } from '@utils/auth'

type BeforePageLoadOptions = {
  cookies: AstroCookies
}

type BeforePageLoadResponse = {
  feedback?: FeedbackMessage
  user?: User
}

export async function beforePageLoad(
  options: BeforePageLoadOptions,
): Promise<BeforePageLoadResponse> {
  const { cookies } = options

  const feedback = getAndClearFeedback(cookies)
  const user = await getCurrentUser({ cookies })

  return { feedback, user }
}
