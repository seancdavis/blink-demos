import { getStore } from '@netlify/blobs'
import type { Context } from '@netlify/edge-functions'
import { getUserByUsername } from '../../src/utils/get-user-by-username.mts'
import { functionUtils } from '../../src/utils/index.mts'

export default async (request: Request, context: Context) => {
  if (request.method !== 'GET') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  const { url } = await functionUtils({ request, context })

  const avatarUsername = url.searchParams.get('username')

  if (!avatarUsername) {
    return new Response('Not Found', { status: 404 })
  }

  const user = await getUserByUsername(avatarUsername)
  if (!user || user.avatarSrc === '/images/default-avatar.jpg') {
    return new Response('Not Found', { status: 404 })
  }

  const userAvatarStore = getStore({ name: 'UserAvatar', consistency: 'strong' })
  const userAvatarBlob = await userAvatarStore.get(user.username.toString(), {
    type: 'stream',
  })

  return new Response(userAvatarBlob)
}
