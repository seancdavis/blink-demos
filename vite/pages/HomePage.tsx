import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Header from '../components/Header'
import Feedback from '../components/Feedback'
import NewPostForm from '../components/NewPostForm'

interface Post {
  id: string
  title: string
  content: string
  userId: string
  createdAt: string
  user: {
    username: string
    avatarSrc: string
  }
}

interface PaginationData {
  currentPage: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

function HomePage() {
  const { isAuthenticated } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async (page = 1) => {
    try {
      const response = await fetch(`/api/posts/list?page=${page}`)
      if (response.ok) {
        const data = await response.json()
        setPosts(data.posts)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  const timeAgoInWords = (date: string) => {
    const now = new Date()
    const then = new Date(date)
    const diffInMs = now.getTime() - then.getTime()
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
    const diffInHours = Math.floor(diffInMinutes / 60)
    const diffInDays = Math.floor(diffInHours / 24)

    if (diffInMinutes < 1) return 'just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInHours < 24) return `${diffInHours}h ago`
    return `${diffInDays}d ago`
  }

  const newlineToLineBreak = (text: string) => {
    return text.replace(/\n/g, '<br>')
  }

  return (
    <>
      <Header />
      <Feedback />

      {isAuthenticated ? (
        <NewPostForm />
      ) : (
        <div className="container-xs new-post-form guest">
          <div className="auth-prompt">
            <h2>Share your thoughts</h2>
            <p>Sign in to create posts and join the conversation.</p>
            <div className="form-actions">
              <Link className="button" to="/login">
                Sign in
              </Link>
              <Link className="button secondary" to="/register">
                Create account
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="container">
        <h1>Latest posts</h1>
        <div className="post-card-grid">
          {loading ? (
            <div>Loading posts...</div>
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.id} className="post-card">
                <div className="post-card-author">
                  <Link to={`/@${post.user.username}`} className="avatar-link">
                    <img
                      className="avatar"
                      src={post.user.avatarSrc}
                      alt={`${post.user.username} avatar`}
                    />
                  </Link>
                  <div className="post-card-author-info">
                    <Link to={`/@${post.user.username}`} className="username">
                      {post.user.username}
                    </Link>
                    <span className="date">{timeAgoInWords(post.createdAt)}</span>
                  </div>
                </div>
                <Link to={`/post/${post.id}`} className="post-card-content">
                  <h3>{post.title}</h3>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: newlineToLineBreak(truncateText(post.content, 150)),
                    }}
                  />
                </Link>
              </div>
            ))
          ) : (
            <div>No posts yet.</div>
          )}
        </div>

        {pagination.totalPages > 1 && (
          <div className="pagination">
            <div className="pagination-content">
              {pagination.hasPrevPage && (
                <button
                  onClick={() => fetchPosts(pagination.currentPage - 1)}
                  className="button secondary"
                >
                  ← Previous
                </button>
              )}
              <span className="pagination-info">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              {pagination.hasNextPage && (
                <button
                  onClick={() => fetchPosts(pagination.currentPage + 1)}
                  className="button secondary"
                >
                  Next →
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default HomePage