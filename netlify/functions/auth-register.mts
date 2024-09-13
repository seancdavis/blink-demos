import type { Context } from '@netlify/functions'
import { FeedbackName } from '../../src/utils/feedback-data'

export default async (request: Request, context: Context) => {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  const redirect = (path: string = 'register') => {
    return new Response(null, {
      status: 303,
      headers: {
        Location: `${url.origin}/${path}`,
        'Cache-Control': 'no-cache',
      },
    })
  }

  const setFeedback = (value: FeedbackName) => {
    cookies.set({ name: 'u_feedback', value, path: '/', httpOnly: true, sameSite: 'Strict' })
  }

  const { cookies } = context
  const url = new URL(request.url)

  const formData = await request.formData()
  const username = formData.get('username')
  const password = formData.get('password')
  const pwdConfirmation = formData.get('password_confirmation')

  if (!username || !password) {
    setFeedback('user_pass_req')
    return redirect()
  }

  if (password !== pwdConfirmation) {
    setFeedback('pass_no_match')
    return redirect()
  }

  return new Response('Hello, world!')
}
