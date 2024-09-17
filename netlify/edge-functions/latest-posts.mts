import { getStore } from '@netlify/blobs'
import type { Context } from '@netlify/edge-functions'
import { Element, HTMLRewriter } from 'https://ghuc.cc/worker-tools/html-rewriter/index.ts'
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
        return renderPartial({ name: 'post-card', data: { ...post, ...post.user, date } })
      })
      .join('')

    element.replace(partialContent, { html: true })
  }
}

export default async function handler(_: Request, context: Context) {
  const response = await context.next()

  const userStore = getStore({ name: 'User', consistency: 'strong' })
  const allUsersIds = (await userStore.list()).blobs.map(({ key }) => key)
  const users = await Promise.all(
    allUsersIds.map(async (id) => await userStore.get(id, { type: 'json' })),
  )

  const postStore = getStore({ name: 'Post', consistency: 'strong' })
  const allPostIds = (await postStore.list()).blobs.map(({ key }) => key)
  const posts: PostWithUser[] = (
    await Promise.all(allPostIds.map(async (id) => await postStore.get(id, { type: 'json' })))
  )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map((post) => {
      const user = users.find((user) => user.id === post.userId)
      return { ...post, user }
    })

  return new HTMLRewriter()
    .on('latest-posts', new LatestPostsHandler({ posts }))
    .transform(response)
}
