import React from 'react'
import Layout from '../components/Layout'
import LoginForm from '../components/LoginForm'

const LoginPage: React.FC = () => {
  return (
    <Layout title="Sign In">
      <div className="container-xs">
        <h1>Sign in to your account</h1>
        <LoginForm />
      </div>
    </Layout>
  )
}

export default LoginPage