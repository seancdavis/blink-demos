import React, { createContext, useContext, useState, ReactNode } from 'react'

export type FeedbackMessage = {
  message: string
  classname?: string
}

interface FeedbackContextType {
  feedback: FeedbackMessage | null
  setFeedback: (feedback: FeedbackMessage | null) => void
  clearFeedback: () => void
}

const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined)

export const useFeedback = () => {
  const context = useContext(FeedbackContext)
  if (context === undefined) {
    throw new Error('useFeedback must be used within a FeedbackProvider')
  }
  return context
}

interface FeedbackProviderProps {
  children: ReactNode
}

export const FeedbackProvider: React.FC<FeedbackProviderProps> = ({ children }) => {
  const [feedback, setFeedback] = useState<FeedbackMessage | null>(null)

  const clearFeedback = () => {
    setFeedback(null)
  }

  const value = {
    feedback,
    setFeedback,
    clearFeedback,
  }

  return <FeedbackContext.Provider value={value}>{children}</FeedbackContext.Provider>
}