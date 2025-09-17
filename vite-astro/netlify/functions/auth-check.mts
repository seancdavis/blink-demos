import { getCurrentUser } from './shared/auth'

export default async (request: Request) => {
  if (request.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const user = await getCurrentUser(request)

    if (user) {
      return new Response(JSON.stringify(user), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    } else {
      return new Response('Unauthorized', { status: 401 })
    }
  } catch (error) {
    console.error('Auth check error:', error)
    return new Response('Internal server error', { status: 500 })
  }
}