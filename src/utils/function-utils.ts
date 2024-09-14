import { Context } from '@netlify/functions'
import { FeedbackName } from './feedback-data.ts'

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

/* --- redirect() --- */

type RedirectFnOptions = {
  defaultPath: string
  url: URL
}

function redirectFn(options: RedirectFnOptions) {
  const { defaultPath, url } = options

  return (path: string = defaultPath) => {
    return new Response(null, {
      status: 303,
      headers: {
        Location: `${url.origin}/${path}`,
        'Cache-Control': 'no-cache',
      },
    })
  }
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
