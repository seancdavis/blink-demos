import { getStore } from '@netlify/blobs'
import type { Context } from '@netlify/edge-functions'
import type { Config } from '@netlify/functions'
import { functionUtils } from '../../src/utils/index.mts'

export default async (request: Request, context: Context) => {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  const { redirect, setFeedback, user: userBlob } = await functionUtils({ request, context })

  // The auth edge function handles the redirect if the user is not found, so we
  // can assume that the user is found here
  const user = userBlob!

  const formData = await request.formData()
  const image = formData.get('avatar') as File

  // Validate file exists
  if (!image || !image.size) {
    setFeedback('avatar_required')
    return redirect('/settings')
  }

  // Validate file size (2 MB limit)
  const maxSizeBytes = 2 * 1024 * 1024 // 2 MB
  if (image.size > maxSizeBytes) {
    setFeedback('avatar_too_large')
    return redirect('/settings')
  }

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  if (!allowedTypes.includes(image.type)) {
    setFeedback('avatar_invalid_type')
    return redirect('/settings')
  }

  // Store the avatar image in the UserAvatar store
  const userAvatarStore = getStore({ name: 'UserAvatar', consistency: 'strong' })
  await userAvatarStore.set(user.username.toString(), image)

  // Update the user blob with the new avatar URL
  const userStore = getStore({ name: 'User', consistency: 'strong' })
  user.avatarSrc = `/images/avatar/small/${user.username}`
  await userStore.setJSON(user.id, user)

  setFeedback('avatar_uploaded')
  return redirect('/settings')
}

export const config: Config = {
  path: '/api/user/upload-avatar',
}
