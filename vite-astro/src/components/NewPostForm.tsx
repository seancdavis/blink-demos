import { useState, useRef, type FormEvent, type ChangeEvent } from 'react'
import type { User } from '@utils/types'

interface NewPostFormProps {
  user: User
}

export default function NewPostForm({ user }: NewPostFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [remainingChars, setRemainingChars] = useState(400)
  const [buttonText, setButtonText] = useState('Create post')
  
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const maxLength = 400

  const handleTextareaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const remaining = maxLength - e.target.value.length
    setRemainingChars(remaining)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (isSubmitting) {
      return false
    }

    setIsSubmitting(true)
    setButtonText('Creating...')

    try {
      const formData = new FormData(e.currentTarget)
      const response = await fetch('/.netlify/functions/posts-create', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        // Reset form
        e.currentTarget.reset()
        setRemainingChars(400)
        // Reload page to see new post
        window.location.reload()
      } else {
        console.error('Failed to create post')
      }
    } catch (error) {
      console.error('Error creating post:', error)
    } finally {
      setIsSubmitting(false)
      setButtonText('Create post')
    }
  }

  const getCharCountClass = () => {
    if (remainingChars < 5) return 'danger'
    if (remainingChars < 20) return 'warning'
    return ''
  }

  return (
    <div className="container-xs new-post-form">
      <div className="new-post-header">
        <img 
          className="avatar new-post-avatar" 
          src={user.avatarSrc} 
          alt={`${user.username}'s avatar`} 
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
            required 
            minLength={10} 
            maxLength={64} 
          />
        </div>
        <div>
          <label htmlFor="content">Content</label>
          <textarea
            ref={textareaRef}
            id="new-post-content"
            name="content"
            placeholder="Content"
            minLength={10}
            maxLength={maxLength}
            required
            onChange={handleTextareaChange}
          />
          <div 
            id="new-post-remaining-count" 
            className={getCharCountClass()}
          >
            {remainingChars}
          </div>
        </div>
        <div className="form-actions is-compact">
          <button 
            className="button" 
            type="submit" 
            disabled={isSubmitting}
          >
            {buttonText}
          </button>
        </div>
      </form>
    </div>
  )
}