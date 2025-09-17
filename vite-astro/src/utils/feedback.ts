import type { AstroCookies } from 'astro'
import { feedbackData, type FeedbackName, type FeedbackType } from '@utils/feedback-data'

type SetFeedbackOptions = {
  cookies: AstroCookies
  value: FeedbackName
}

export function setFeedback(options: SetFeedbackOptions) {
  const { cookies, value } = options
  cookies.set('blink_feedback', value, { path: '/', httpOnly: true, sameSite: 'strict' })
}

export type FeedbackMessage = {
  type: FeedbackType
  message: string
}

export function getAndClearFeedback(cookies: AstroCookies): FeedbackMessage | undefined {
  const feedbackCookieValue = cookies.get('blink_feedback')?.value as FeedbackName | undefined
  if (!feedbackCookieValue) {
    return
  }

  cookies.delete('blink_feedback', { path: '/' })

  const feedback = feedbackData[feedbackCookieValue]
  if (!feedback) {
    return
  }

  return {
    type: feedback.type,
    message: feedback.message,
  }
}
