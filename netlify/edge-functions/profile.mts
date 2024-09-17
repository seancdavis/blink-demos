import { getStore } from '@netlify/blobs'
import type { Context } from '@netlify/edge-functions'
import { edgeFunctionUtils } from '../../src/utils/index.mts'
import { renderPartial } from '../../src/utils/render-partial.mts'
import { timeAgoInWords } from '../../src/utils/time-ago-in-words.mts'
import { Post, User } from '../../src/utils/types.mts'

export default async function handler(request: Request, context: Context) {
  const { url } = await edgeFunctionUtils({ request, context })
  const username = url.pathname
    .split('/')
    .find((part) => part.startsWith('@'))
    ?.slice(1)

  if (!username || username.length === 0) {
    return new Response('Not Found', { status: 404 })
  }

  const userStore = getStore({ name: 'User', consistency: 'strong' })
  const allUsersIds = (await userStore.list()).blobs.map(({ key }) => key)
  const users = await Promise.all(
    allUsersIds.map(async (id) => await userStore.get(id, { type: 'json' })),
  )
  const user = users.find((user: User) => user.username === username)

  // Cache the 404 result if the user is not found, and return
  if (!user) {
    const response = await context.next()
    response.headers.set('cache-control', 'public, max-age=0, must-revalidate')
    response.headers.set('netlify-cdn-cache-control', 'public, durable, s-maxage=31536000')
    response.headers.set('netlify-cache-tag', username)
    return response
  }

  const postStore = getStore({ name: 'Post', consistency: 'strong' })
  const allPostIds = (await postStore.list()).blobs.map(({ key }) => key)
  const userPosts: Post[] = (
    await Promise.all(allPostIds.map(async (id) => await postStore.get(id, { type: 'json' })))
  )
    .filter((post) => post.userId === user.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  let posts = userPosts
    .map((post) => {
      const date = timeAgoInWords(new Date(post.createdAt))
      return renderPartial({ name: 'post-card', data: { ...post, ...user, date } })
    })
    .join('')

  if (posts.length === 0) {
    posts = renderPartial({ name: 'profile-no-posts', data: { ...user } })
  }

  const data = { ...user, posts }
  const html = renderPartial({ name: 'profile', data })

  return new Response(html, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      // The browser should always check freshness
      'cache-control': 'public, max-age=0, must-revalidate',
      // The CDN should cache for a year, but revalidate if the cache tag changes
      'netlify-cdn-cache-control': 'public, durable, s-maxage=31536000',
      // Tag the page with the user ID
      'netlify-cache-tag': user.id,
    },
  })
}
