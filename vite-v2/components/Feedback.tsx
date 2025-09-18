import React from 'react'
import { useFeedback } from '../contexts/FeedbackContext'

function Feedback() {
  const { message, clearFeedback } = useFeedback()

  if (!message) return null

  return (
    <div className="feedback">
      <div className="container">
        <p>{message}</p>
        <button onClick={clearFeedback} className="feedback-close">
          ×
        </button>
      </div>
    </div>
  )
}

export default Feedback