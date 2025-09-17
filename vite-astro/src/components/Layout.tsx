import React, { ReactNode } from 'react'
import { Helmet } from 'react-helmet-async'
import { useFeedback } from '../contexts/FeedbackContext'
import { useAuth } from '../contexts/AuthContext'
import Header from './Header'
import Feedback from './Feedback'

interface LayoutProps {
  title: string
  children: ReactNode
}

const Layout: React.FC<LayoutProps> = ({ title, children }) => {
  const { feedback } = useFeedback()
  const { user } = useAuth()

  return (
    <>
      <Helmet>
        <title>{title} | Blink</title>
      </Helmet>

      <Header user={user} />
      {feedback && <Feedback {...feedback} />}
      <main>{children}</main>
    </>
  )
}

export default Layout