import { getStore } from '@netlify/blobs'
import type { Context } from '@netlify/edge-functions'
import { edgeFunctionUtils } from '../../src/utils/index.mts'
import { renderPartial } from '../../src/utils/render-partial.mts'
import { timeAgoInWords } from '../../src/utils/time-ago-in-words.mts'

export default async function handler(request: Request, context: Context) {
  const { url } = await edgeFunctionUtils({ request, context })
  const postId = url.pathname
    .split('/')
    .find((part) => part.length > 0 && !part.startsWith('index.') && part !== 'post')
    ?.replace(/\.html?$/, '')

  if (!postId || postId.length === 0) {
    return new Response('Not Found', { status: 404 })
  }

  const postStore = getStore({ name: 'Post', consistency: 'strong' })
  const userStore = getStore({ name: 'User', consistency: 'strong' })
  const post = await postStore.get(postId, { type: 'json' })
  const date = timeAgoInWords(new Date(post.createdAt))
  const user = await userStore.get(post.userId, { type: 'json' })

  const html = renderPartial({ name: 'post-detail', data: { ...post, ...user, date } })

  return new Response(html, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'public, max-age=0, must-revalidate',
      'netlify-cdn-cache-control': 'public, durable, s-maxage=31536000',
      'netlify-cache-tag': post.id,
    },
  })
}
