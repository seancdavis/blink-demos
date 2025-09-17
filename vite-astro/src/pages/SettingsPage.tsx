import React from 'react'
import { HelmetProvider } from 'react-helmet-async'
import Layout from '../components/Layout'

const SettingsPage: React.FC = () => {
  return (
    <HelmetProvider>
      <Layout title="Settings">
        <div className="container-xs">
          <h1>Settings</h1>
          <p>Settings functionality coming soon...</p>
        </div>
      </Layout>
    </HelmetProvider>
  )
}

export default SettingsPage