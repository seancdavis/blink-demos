import { getStore } from '@netlify/blobs'
import { User } from './types.mts'

export async function getUserByUsername(username: string): Promise<User | null> {
  const userStore = getStore({ name: 'User', consistency: 'strong' })
  const allUsers = await userStore.list()

  for (const blob of allUsers.blobs) {
    const user: User = await userStore.get(blob.key, { type: 'json' })
    if (user.username === username) {
      return user
    }
  }

  return null
}
