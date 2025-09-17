import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useFeedback } from '../contexts/FeedbackContext'

function NewPostForm() {
  const { user } = useAuth()
  const { showFeedback } = useFeedback()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const maxLength = 400
  const remaining = maxLength - content.length

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isSubmitting) return

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/posts/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ title, content }),
        credentials: 'include',
      })

      if (response.ok) {
        setTitle('')
        setContent('')
        showFeedback('Post created successfully!')
        // Refresh the page to show new post
        window.location.reload()
      } else {
        const error = await response.text()
        showFeedback(error || 'Failed to create post')
      }
    } catch (error) {
      showFeedback('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getCharCountClass = () => {
    if (remaining < 5) return 'danger'
    if (remaining < 20) return 'warning'
    return ''
  }

  return (
    <div className="container-xs new-post-form">
      <div className="new-post-header">
        <img
          className="avatar new-post-avatar"
          src={user?.avatarSrc}
          alt="Your avatar"
        />
        <h2>Write a New post</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            minLength={10}
            maxLength={64}
          />
        </div>
        <div>
          <label htmlFor="content">Content</label>
          <textarea
            name="content"
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            minLength={10}
            maxLength={maxLength}
            required
          />
          <div className={`new-post-remaining-count ${getCharCountClass()}`}>
            {remaining}
          </div>
        </div>
        <div className="form-actions is-compact">
          <button
            className="button"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create post'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default NewPostForm