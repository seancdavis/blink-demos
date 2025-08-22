import { getStore } from '@netlify/blobs'
import type { Context } from '@netlify/edge-functions'
import type { Config } from '@netlify/functions'

export default async (request: Request, context: Context) => {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  const formData = await request.formData()
  const apiKey = formData.get('api_key') as string

  if (apiKey !== process.env.ADMIN_API_KEY) {
    return new Response('Unauthorized', { status: 401 })
  }

  const postStore = getStore({ name: 'Post', consistency: 'strong' })
  const allPostIds = (await postStore.list()).blobs.map(({ key }) => key)
  await Promise.all(allPostIds.map((id) => postStore.delete(id)))

  return new Response('All posts deleted successfully')
}

export const config: Config = {
  path: '/api/admin/reset-posts',
}
