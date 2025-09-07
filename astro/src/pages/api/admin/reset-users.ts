import type { APIRoute } from 'astro'
import { getStore } from '@netlify/blobs'

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData()
  const apiKey = formData.get('api_key') as string

  if (apiKey !== process.env.ADMIN_API_KEY) {
    return new Response('Unauthorized', { status: 401 })
  }

  const userStore = getStore({ name: 'User', consistency: 'strong' })
  const allUserIds = (await userStore.list()).blobs.map(({ key }) => key)
  await Promise.all(allUserIds.map((id) => userStore.delete(id)))

  return new Response('All users deleted successfully')
}
