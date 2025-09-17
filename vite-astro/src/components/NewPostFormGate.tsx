import React from 'react'
import { Link } from 'react-router-dom'
import type { User } from '@utils/types'
import NewPostForm from './NewPostForm'

interface NewPostFormGateProps {
  user?: User | null
}

const NewPostFormGate: React.FC<NewPostFormGateProps> = ({ user }) => {
  if (user) {
    return <NewPostForm user={user} />
  }

  return (
    <div className="new-post-form guest">
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
  )
}

export default NewPostFormGate