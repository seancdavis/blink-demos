import { Context } from '@netlify/edge-functions'
import { getCurrentUser } from './get-current-user.mts'
import { redirectFn } from './redirect-fn.mts'
import { setFeedbackFn } from './set-feedback-fn.mts'

export { newlineToLineBreak } from './nl2br.mts'

/* ---- Functions ---- */

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
  user: Awaited<ReturnType<typeof getCurrentUser>>
}

export async function functionUtils(options: FunctionUtilsOptions): Promise<FunctionUtilsResponse> {
  const { request, context, defaultRedirectPath } = options

  const { cookies } = context
  const url = new URL(request.url)
  const redirect = redirectFn({ defaultPath: defaultRedirectPath || '/', url })
  const setFeedback = setFeedbackFn({ cookies })
  const user = await getCurrentUser({ cookies })

  return { redirect, setFeedback, url, cookies, user }
}

/* ---- Edge Functions ---- */

type EdgeFunctionUtilsOptions = {
  request: Request
  context: Context
}

type EdgeFunctionUtilsResponse = {
  setFeedback: ReturnType<typeof setFeedbackFn>
  url: URL
  cookies: Context['cookies']
  user: Awaited<ReturnType<typeof getCurrentUser>>
}

export async function edgeFunctionUtils(
  options: EdgeFunctionUtilsOptions,
): Promise<EdgeFunctionUtilsResponse> {
  const { request, context } = options

  const { cookies } = context
  const url = new URL(request.url)
  const setFeedback = setFeedbackFn({ cookies })
  const user = await getCurrentUser({ cookies })

  return { setFeedback, url, cookies, user }
}

