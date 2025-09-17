
export default async (request: Request) => {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const headers = new Headers()
    headers.set('Location', '/')

    // Clear the session cookie
    const clearCookie = `blink_session=; Path=/; HttpOnly; SameSite=strict; Max-Age=0`
    headers.set('Set-Cookie', clearCookie)

    return new Response(null, {
      status: 302,
      headers
    })
  } catch (error) {
    console.error('Logout error:', error)
    return new Response('Internal server error', { status: 500 })
  }
}