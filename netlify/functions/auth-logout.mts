import type { Context } from '@netlify/edge-functions'
import { functionUtils } from '../../src/utils/index.mts'

export default async (request: Request, context: Context) => {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  const { redirect, cookies } = await functionUtils({
    request,
    context,
    defaultRedirectPath: '/login',
  })

  cookies.delete({ name: 'u_session', path: '/' })
  return redirect()
}
