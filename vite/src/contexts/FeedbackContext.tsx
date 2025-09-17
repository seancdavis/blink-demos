import React, { createContext, useContext, useState, ReactNode } from 'react'

interface FeedbackContextType {
  message: string | null
  showFeedback: (message: string) => void
  clearFeedback: () => void
}

const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined)

export function useFeedback() {
  const context = useContext(FeedbackContext)
  if (context === undefined) {
    throw new Error('useFeedback must be used within a FeedbackProvider')
  }
  return context
}

interface FeedbackProviderProps {
  children: ReactNode
}

export function FeedbackProvider({ children }: FeedbackProviderProps) {
  const [message, setMessage] = useState<string | null>(null)

  const showFeedback = (message: string) => {
    setMessage(message)
    // Auto-clear after 5 seconds
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const clearFeedback = () => {
    setMessage(null)
  }

  return (
    <FeedbackContext.Provider value={{ message, showFeedback, clearFeedback }}>
      {children}
    </FeedbackContext.Provider>
  )
}