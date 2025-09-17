import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Header from '../components/Header'
import Feedback from '../components/Feedback'
import NotFoundPage from './NotFoundPage'

interface User {
  id: string
  username: string
  avatarSrc: string
}

interface Post {
  id: string
  title: string
  content: string
  userId: string
  createdAt: string
}

interface ProfileData {
  user: User
  posts: Post[]
}

function ProfilePage() {
  const { username } = useParams<{ username: string }>()
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (username) {
      fetchProfile(username)
    }
  }, [username])

  useEffect(() => {
    if (profileData) {
      document.title = `@${profileData.user.username} - Blink`
    }
  }, [profileData])

  const fetchProfile = async (profileUsername: string) => {
    try {
      const response = await fetch(`/api/view-profile/${profileUsername}`)
      if (response.ok) {
        const data = await response.json()
        setProfileData(data)
      } else if (response.status === 404) {
        setNotFound(true)
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error)
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

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  const newlineToLineBreak = (text: string) => {
    return text.replace(/\n/g, '<br>')
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="container">
          <div>Loading profile...</div>
        </div>
      </>
    )
  }

  if (notFound || !profileData) {
    return <NotFoundPage />
  }

  return (
    <>
      <Header />
      <Feedback />

      <div className="container profile-page">
        <div className="profile-header">
          <img
            className="avatar large"
            src={profileData.user.avatarSrc}
            alt={`${profileData.user.username} avatar`}
          />
          <div className="profile-info">
            <h1>@{profileData.user.username}</h1>
            <p>{profileData.posts.length} posts</p>
          </div>
        </div>

        <div className="profile-posts">
          <h2>Posts</h2>
          {profileData.posts.length > 0 ? (
            <div className="post-card-grid">
              {profileData.posts.map((post) => (
                <div key={post.id} className="post-card">
                  <div className="post-card-author">
                    <img
                      className="avatar"
                      src={profileData.user.avatarSrc}
                      alt={`${profileData.user.username} avatar`}
                    />
                    <div className="post-card-author-info">
                      <span className="username">{profileData.user.username}</span>
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
              ))}
            </div>
          ) : (
            <div className="profile-no-posts">
              <p>@{profileData.user.username} hasn't posted anything yet.</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default ProfilePage