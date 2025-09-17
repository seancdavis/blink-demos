import React from 'react'
import { HelmetProvider } from 'react-helmet-async'
import Layout from '../components/Layout'

const RegisterPage: React.FC = () => {
  return (
    <HelmetProvider>
      <Layout title="Register">
        <div className="container-xs">
          <h1>Create an account</h1>
          <p>Registration functionality coming soon...</p>
        </div>
      </Layout>
    </HelmetProvider>
  )
}

export default RegisterPage