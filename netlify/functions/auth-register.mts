import type { Context } from '@netlify/functions'

export default async (request: Request, context: Context) => {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  const { cookies } = context
  const url = new URL(request.url)

  const formData = await request.formData()
  const username = formData.get('username')
  const password = formData.get('password')

  if (!username || !password) {
    cookies.set({
      name: 'u_feedback',
      value: 'user_pass_req',
      path: '/',
      httpOnly: true,
      sameSite: 'Strict',
    })

    return new Response(null, {
      status: 303,
      headers: {
        Location: `${url.origin}/login`,
        'Cache-Control': 'no-cache',
      },
    })
  }

  return new Response('Hello, world!')
}
