import type { APIRoute } from 'astro'
import { getStore } from '@netlify/blobs'
import { getPostsIndex } from '../../../utils/posts-index.ts'
import { Post, User } from '../../../utils/types.ts'

export const GET: APIRoute = async ({ url }) => {
  const pageParam = url.searchParams.get('page') || '1'
  const page = parseInt(pageParam, 10)
  const postsPerPage = 12
  const skip = (page - 1) * postsPerPage

  try {
    // Get posts from index
    const postsIndex = await getPostsIndex()
    const postEntries = postsIndex.slice(skip, skip + postsPerPage)

    if (postEntries.length === 0) {
      return new Response('<p>No posts available.</p>', {
        headers: { 'Content-Type': 'text/html' },
      })
    }

    // Get post and user data
    const postStore = getStore({ name: 'Post', consistency: 'strong' })
    const userStore = getStore({ name: 'User', consistency: 'strong' })

    const posts: (Post & { user: User })[] = []

    for (const postEntry of postEntries) {
      const postId = postEntry.id
      try {
        const postData = await postStore.get(postId, { type: 'json' })
        if (!postData) continue
        const post = postData as Post

        const userData = await userStore.get(post.userId, { type: 'json' })
        if (!userData) continue
        const user = userData as User

        if (post && user) {
          posts.push({ ...post, user })
        }
      } catch (error) {
        // Skip posts that can't be loaded
        console.error(`Failed to load post ${postId}:`, error)
      }
    }

    // Generate HTML for posts
    let html = ''
    for (const post of posts) {
      const postDate = new Date(post.createdAt)
      const truncatedContent =
        post.content.length > 150 ? post.content.substring(0, 150) + '...' : post.content

      html += `
        <article class="post-card">
          <header class="post-card-header">
            <div class="post-author">
              <img class="avatar" src="${post.user.avatarSrc}" alt="${post.user.username}'s avatar" />
              <div class="author-info">
                <a href="/@${post.user.username}" class="author-name">@${post.user.username}</a>
                <time class="post-date" datetime="${post.createdAt}">
                  ${postDate.toLocaleDateString()}
                </time>
              </div>
            </div>
          </header>
          <div class="post-card-content">
            <h3><a href="/post/${post.id}">${post.title}</a></h3>
            <p>${truncatedContent}</p>
          </div>
        </article>
      `
    }

    return new Response(html, {
      headers: { 'Content-Type': 'text/html' },
    })
  } catch (error) {
    console.error('Failed to load posts:', error)
    return new Response('<p>Failed to load posts.</p>', {
      status: 500,
      headers: { 'Content-Type': 'text/html' },
    })
  }
}
