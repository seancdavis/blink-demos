import { faker } from '@faker-js/faker'
import { getStore } from '@netlify/blobs'
import type { Context } from '@netlify/edge-functions'
import type { Config } from '@netlify/functions'
import bycrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import { Post, User } from '../../src/utils/types.mts'

export default async (request: Request, context: Context) => {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  const formData = await request.formData()
  const userCount = parseInt((formData.get('users') || '0') as string)
  const postData = JSON.parse((formData.get('post_data') || '[]') as string)
  const apiKey = formData.get('api_key') as string

  if (apiKey !== process.env.ADMIN_API_KEY) {
    return new Response('Unauthorized', { status: 401 })
  }

  if (postData.length === 0) {
    return new Response(
      'Please supply `post_data` as an array with `title` and `content` properties',
      { status: 400 },
    )
  }

  const userStore = getStore({ name: 'User', consistency: 'strong' })
  const postStore = getStore({ name: 'Post', consistency: 'strong' })

  // Create a series of random users
  if (userCount > 0) {
    for (let i = 0; i < userCount; i++) {
      const randomPassword = Math.random().toString(36).substring(2, 15)
      const passwordHash = await bycrypt.hash(randomPassword, 10)
      const uuid = uuidv4()
      const username = faker.internet.userName()

      const user: User = {
        id: uuid,
        username,
        password: passwordHash,
        avatarSrc: '/images/default-avatar.jpg',
      }
      await userStore.setJSON(user.id, user)
    }
  }

  // Get all users
  const allUsersIds = (await userStore.list()).blobs.map(({ key }) => key)
  const users: User[] = await Promise.all(
    allUsersIds.map(async (id) => await userStore.get(id, { type: 'json' })),
  )

  // Create a series of random posts
  for (const { title, content } of postData) {
    const user = users[Math.floor(Math.random() * users.length)]
    const id = uuidv4()
    // Time between now and 7 days ago
    const createdAt = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()

    const post: Post = { id, title, content, userId: user.id, createdAt }
    await postStore.setJSON(post.id, post)
  }

  return new Response('Seeded successfully')
}

export const config: Config = {
  path: '/api/admin/seed',
}
