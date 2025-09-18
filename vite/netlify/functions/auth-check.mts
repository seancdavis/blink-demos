import { getStore } from '@netlify/blobs'
import type { Context } from '@netlify/edge-functions'
import type { Config } from '@netlify/functions'
import { functionUtils } from '../../utils/index.mts'

export default async (request: Request, context: Context) => {
  if (request.method !== 'GET') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  const { user } = await functionUtils({ request, context })

  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  return new Response(
    JSON.stringify({
      id: user.id,
      username: user.username,
      avatarSrc: user.avatarSrc,
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )
}

export const config: Config = {
  path: '/api/auth/check',
}
