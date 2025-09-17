import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useFeedback } from '../contexts/FeedbackContext'
import Header from '../components/Header'
import Feedback from '../components/Feedback'

function SettingsPage() {
  const { user, updateUser } = useAuth()
  const { showFeedback } = useFeedback()
  const [isUploading, setIsUploading] = useState(false)

  React.useEffect(() => {
    document.title = 'Settings - Blink'
  }, [])

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('avatar', file)

      const response = await fetch('/api/user/upload-avatar', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      })

      if (response.ok) {
        const updatedUser = await response.json()
        updateUser(updatedUser)
        showFeedback('Avatar updated successfully!')
      } else {
        const error = await response.text()
        showFeedback(error || 'Failed to upload avatar')
      }
    } catch (error) {
      showFeedback('Network error. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <>
      <Header />
      <Feedback />

      <div className="container-xs settings-page">
        <h1>Edit Profile</h1>

        <div className="settings-section">
          <h2>Profile Picture</h2>
          <div className="avatar-upload">
            <img
              className="avatar large"
              src={user.avatarSrc}
              alt={`${user.username} avatar`}
            />
            <div className="avatar-upload-controls">
              <label className="button secondary" htmlFor="avatar-upload">
                {isUploading ? 'Uploading...' : 'Change Avatar'}
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                disabled={isUploading}
                style={{ display: 'none' }}
              />
              <small>
                Upload a new profile picture. We'll automatically resize it for you.
              </small>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h2>Account Information</h2>
          <div className="account-info">
            <div className="info-item">
              <label>Username</label>
              <span>@{user.username}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SettingsPage