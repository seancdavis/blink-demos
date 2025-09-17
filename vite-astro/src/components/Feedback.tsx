import React from 'react'

interface FeedbackProps {
  message: string
  classname?: string
}

const Feedback: React.FC<FeedbackProps> = ({ message, classname }) => {
  return (
    <div className={`feedback container-xs ${classname || ''}`}>
      <small>{message}</small>
    </div>
  )
}

export default Feedback