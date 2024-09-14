import { Context } from '@netlify/edge-functions'
import { FeedbackName } from './feedback-data.ts'

type EdgeFunctionUtilsOptions = {
  request: Request
  context: Context
}

type EdgeFunctionUtilsResponse = {
  setFeedback: ReturnType<typeof setFeedbackFn>
  url: URL
}

export function edgeFunctionUtils(options: EdgeFunctionUtilsOptions): EdgeFunctionUtilsResponse {
  const { request, context } = options

  const url = new URL(request.url)
  const setFeedback = setFeedbackFn({ cookies: context.cookies })

  return { setFeedback, url }
}

/* --- feedback() --- */

type SetFeedbackFnOptions = {
  cookies: Context['cookies']
}

function setFeedbackFn(options: SetFeedbackFnOptions) {
  const { cookies } = options

  return (value: FeedbackName) => {
    cookies.set({ name: 'u_feedback', value, path: '/', httpOnly: true, sameSite: 'Strict' })
  }
}
