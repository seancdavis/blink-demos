import { Context } from '@netlify/edge-functions'
import { redirectFn } from './redirect-fn.mts'
import { setFeedbackFn } from './set-feedback-fn.mts'

type FunctionUtilsOptions = {
  request: Request
  context: Context
  defaultRedirectPath?: string
}

type FunctionUtilsResponse = {
  redirect: ReturnType<typeof redirectFn>
  setFeedback: ReturnType<typeof setFeedbackFn>
  url: URL
  cookies: Context['cookies']
}

export function functionUtils(options: FunctionUtilsOptions): FunctionUtilsResponse {
  const { request, context, defaultRedirectPath } = options

  const { cookies } = context
  const url = new URL(request.url)
  const redirect = redirectFn({ defaultPath: defaultRedirectPath || '', url })
  const setFeedback = setFeedbackFn({ cookies })

  return { redirect, setFeedback, url, cookies }
}
