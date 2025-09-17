import React from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { useParams } from 'react-router-dom'
import Layout from '../components/Layout'

const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>()

  return (
    <HelmetProvider>
      <Layout title={`@${username}`}>
        <div className="container">
          <h1>@{username}</h1>
          <p>Profile functionality coming soon...</p>
        </div>
      </Layout>
    </HelmetProvider>
  )
}

export default ProfilePage