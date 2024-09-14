import type { Context } from '@netlify/functions'
import { functionUtils } from '../../src/utils/function-utils'

export default async (request: Request, context: Context) => {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  const { redirect, cookies } = functionUtils({
    request,
    context,
    defaultRedirectPath: 'login',
  })

  cookies.delete({ name: 'u_session', path: '/' })
  return redirect()
}
