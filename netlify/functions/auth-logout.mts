import type { Context } from '@netlify/functions'

export default async (request: Request, context: Context) => {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  const { cookies } = context
  const url = new URL(request.url)

  cookies.delete({ name: 'u_session', path: '/' })

  return new Response(null, {
    status: 303,
    headers: {
      Location: url.origin + '/login',
      'Cache-Control': 'no-cache',
    },
  })
}
