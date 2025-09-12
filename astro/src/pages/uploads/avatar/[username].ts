import { getStore } from '@netlify/blobs'
import { getUserByUsername } from '@utils/auth'
import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ request, cookies, redirect, params }) => {
  const { username } = params

  if (!username) {
    return new Response('Not Found', { status: 404 })
  }

  const avatarUsername = username.split('.')[0]

  if (!avatarUsername) {
    return new Response('Not Found', { status: 404 })
  }

  const user = await getUserByUsername(avatarUsername)
  if (!user || user.avatarSrc === '/img/default-avatar.jpg') {
    return new Response('Not Found', { status: 404 })
  }

  const userAvatarStore = getStore({ name: 'UserAvatar', consistency: 'strong' })
  const userAvatarBlob = await userAvatarStore.get(user.username.toString(), {
    type: 'stream',
  })

  return new Response(userAvatarBlob)
}
