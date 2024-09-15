import { Context } from '@netlify/edge-functions'
import { FeedbackName } from '../feedback-data.ts'

type SetFeedbackFnOptions = {
  cookies: Context['cookies']
}

export function setFeedbackFn(options: SetFeedbackFnOptions) {
  const { cookies } = options

  return (value: FeedbackName) => {
    cookies.set({ name: 'u_feedback', value, path: '/', httpOnly: true, sameSite: 'Strict' })
  }
}
