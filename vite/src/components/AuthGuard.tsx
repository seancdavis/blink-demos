import React, { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface AuthGuardProps {
  children: ReactNode
}

function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

export default AuthGuard