import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Header from '../components/Header'
import Feedback from '../components/Feedback'
import NotFoundPage from './NotFoundPage'

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

function PostPage() {
  const { id } = useParams<{ id: string }>()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (id) {
      fetchPost(id)
    }
  }, [id])

  useEffect(() => {
    if (post) {
      document.title = `${post.title} - Blink`
    }
  }, [post])

  const fetchPost = async (postId: string) => {
    try {
      const response = await fetch(`/api/view-post/${postId}`)
      if (response.ok) {
        const postData = await response.json()
        setPost(postData)
      } else if (response.status === 404) {
        setNotFound(true)
      }
    } catch (error) {
      console.error('Failed to fetch post:', error)
      setNotFound(true)
    } finally {
      setLoading(false)
    }
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

  if (loading) {
    return (
      <>
        <Header />
        <div className="container">
          <div>Loading post...</div>
        </div>
      </>
    )
  }

  if (notFound || !post) {
    return <NotFoundPage />
  }

  return (
    <>
      <Header />
      <Feedback />

      <div className="container-xs post-detail">
        <div className="post-detail-header">
          <Link to={`/@${post.user.username}`} className="avatar-link">
            <img
              className="avatar"
              src={post.user.avatarSrc}
              alt={`${post.user.username} avatar`}
            />
          </Link>
          <div className="post-detail-author-info">
            <Link to={`/@${post.user.username}`} className="username">
              {post.user.username}
            </Link>
            <span className="date">{timeAgoInWords(post.createdAt)}</span>
          </div>
        </div>

        <div className="post-detail-content">
          <h1>{post.title}</h1>
          <div
            className="post-content"
            dangerouslySetInnerHTML={{
              __html: newlineToLineBreak(post.content),
            }}
          />
        </div>
      </div>
    </>
  )
}

export default PostPage