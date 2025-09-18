import { Context } from '@netlify/functions'
import { FeedbackName } from './feedback-data.mts'

type SetFeedbackFnOptions = {
  cookies: Context['cookies']
}

export function setFeedbackFn(options: SetFeedbackFnOptions) {
  const { cookies } = options

  return (value: FeedbackName) => {
    cookies.set({ name: 'blink_feedback', value, path: '/', httpOnly: true, sameSite: 'Strict' })
  }
}
