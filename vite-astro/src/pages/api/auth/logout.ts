import type { APIRoute } from 'astro'

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  cookies.delete('blink_session', { path: '/' })
  return redirect('/')
}
