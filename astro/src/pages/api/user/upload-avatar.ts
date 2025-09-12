import { getStore } from '@netlify/blobs'
import { setFeedback } from '@utils/feedback'
import { beforeApiLoad } from '@utils/page-hooks'
import type { APIRoute } from 'astro'

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const { user } = await beforeApiLoad({ cookies })

  if (!user) {
    setFeedback({ cookies, value: 'login_required' })
    return redirect('/login')
  }

  const formData = await request.formData()
  const image = formData.get('avatar') as File

  // Validate file exists
  if (!image || !image.size) {
    setFeedback({ cookies, value: 'avatar_required' })
    return redirect('/settings')
  }

  // Validate file size (2 MB limit)
  const maxSizeBytes = 2 * 1024 * 1024 // 2 MB
  if (image.size > maxSizeBytes) {
    setFeedback({ cookies, value: 'avatar_too_large' })
    return redirect('/settings')
  }

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  if (!allowedTypes.includes(image.type)) {
    setFeedback({ cookies, value: 'avatar_invalid_type' })
    return redirect('/settings')
  }

  // Store the avatar image in the UserAvatar store
  const userAvatarStore = getStore({ name: 'UserAvatar', consistency: 'strong' })
  await userAvatarStore.set(user.username.toString(), image)

  // Update the user blob with the new avatar URL
  const userStore = getStore({ name: 'User', consistency: 'strong' })
  user.avatarSrc = `/img/avatar/small/${user.username}`
  await userStore.setJSON(user.id, user)

  setFeedback({ cookies, value: 'avatar_uploaded' })
  return redirect('/settings')
}
