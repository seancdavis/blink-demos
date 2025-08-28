import { getStore } from '@netlify/blobs'
import type { Context } from '@netlify/edge-functions'
import { Element, HTMLRewriter } from 'https://ghuc.cc/worker-tools/html-rewriter/index.ts'
import { getPaginatedPostIds, PaginationResult } from '../../src/utils/posts-index.mts'
import { renderPartial } from '../../src/utils/render-partial.mts'
import { timeAgoInWords } from '../../src/utils/time-ago-in-words.mts'
import { PostWithUser } from '../../src/utils/types.mts'

type LatestPostsHandlerOptions = {
  posts: PostWithUser[]
}

type PaginationHandlerOptions = {
  pagination: PaginationResult
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

export class PaginationHandler {
  pagination: PaginationResult

  constructor(options: PaginationHandlerOptions) {
    this.pagination = options.pagination
  }

  element(element: Element) {
    const { currentPage, totalPages, hasNextPage, hasPrevPage } = this.pagination
    
    const partialContent = renderPartial({
      name: 'pagination',
      data: {
        currentPage: currentPage.toString(),
        totalPages: totalPages.toString(),
        hasNextPage: hasNextPage.toString(),
        hasPrevPage: hasPrevPage.toString(),
        prevPage: (currentPage - 1).toString(),
        nextPage: (currentPage + 1).toString(),
      },
    })

    element.replace(partialContent, { html: true })
  }
}

export default async function handler(request: Request, context: Context) {
  const response = await context.next()
  
  // Get page number from query params (default to 1)
  const url = new URL(request.url)
  const page = parseInt(url.searchParams.get('page') || '1', 10)
  
  // Get paginated post IDs and metadata
  const pagination = await getPaginatedPostIds(page, 10)

  // Fetch only the posts for current page
  const postStore = getStore({ name: 'Post', consistency: 'strong' })
  const posts = await Promise.all(
    pagination.postIds.map(async (id) => await postStore.get(id, { type: 'json' })),
  )

  // Get unique user IDs from posts
  const uniqueUserIds = [...new Set(posts.map((post) => post.userId))]

  // Only fetch users that are needed for posts
  const userStore = getStore({ name: 'User', consistency: 'strong' })
  const users = await Promise.all(
    uniqueUserIds.map(async (id) => await userStore.get(id, { type: 'json' })),
  )

  const postsWithUsers: PostWithUser[] = posts.map((post) => {
    const user = users.find((user) => user.id === post.userId)
    return { ...post, user }
  })

  return new HTMLRewriter()
    .on('latest-posts', new LatestPostsHandler({ posts: postsWithUsers }))
    .on('pagination', new PaginationHandler({ pagination }))
    .transform(response)
}
