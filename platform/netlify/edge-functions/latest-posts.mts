import { getStore } from '@netlify/blobs'
import type { Context } from '@netlify/edge-functions'
import { Element, HTMLRewriter } from 'https://ghuc.cc/worker-tools/html-rewriter/index.ts'
import { getRecentPostIds } from '../../src/utils/posts-index.mts'
import { renderPartial } from '../../src/utils/render-partial.mts'
import { timeAgoInWords } from '../../src/utils/time-ago-in-words.mts'
import { PostWithUser } from '../../src/utils/types.mts'

type LatestPostsHandlerOptions = {
  posts: PostWithUser[]
}

export class LatestPostsHandler {
  posts: PostWithUser[]

  constructor(options: LatestPostsHandlerOptions) {
    this.posts = options.posts
  }

  element(element: Element) {
    const partialContent = this.posts
      .map((post) => {
        const date = timeAgoInWords(new Date(post.createdAt))
        return renderPartial({
          name: 'post-card',
          data: { ...post, ...post.user, date, postId: post.id },
        })
      })
      .join('')

    element.replace(partialContent, { html: true })
  }
}

export default async function handler(_: Request, context: Context) {
  const response = await context.next()

  // Get the 10 most recent post IDs from the sorted index
  const recentPostIds = await getRecentPostIds(10)

  // Fetch only the recent posts
  const postStore = getStore({ name: 'Post', consistency: 'strong' })
  const recentPosts = await Promise.all(
    recentPostIds.map(async (id) => await postStore.get(id, { type: 'json' })),
  )

  // Get unique user IDs from recent posts
  const uniqueUserIds = [...new Set(recentPosts.map((post) => post.userId))]

  // Only fetch users that are needed for recent posts
  const userStore = getStore({ name: 'User', consistency: 'strong' })
  const users = await Promise.all(
    uniqueUserIds.map(async (id) => await userStore.get(id, { type: 'json' })),
  )

  const posts: PostWithUser[] = recentPosts.map((post) => {
    const user = users.find((user) => user.id === post.userId)
    return { ...post, user }
  })

  return new HTMLRewriter()
    .on('latest-posts', new LatestPostsHandler({ posts }))
    .transform(response)
}
