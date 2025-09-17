import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { User } from '@utils/types'

interface AuthContextType {
  user: User | null
  setUser: (user: User | null) => void
  login: (username: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/.netlify/functions/auth-check')
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const formData = new FormData()
      formData.append('username', username)
      formData.append('password', password)

      const response = await fetch('/.netlify/functions/auth-login', {
        method: 'POST',
        body: formData,
        redirect: 'manual' // Handle redirects manually
      })

      // Check if login was successful (redirect or 200)
      if (response.status === 302 || response.ok) {
        await checkAuthStatus()
        return true
      }
      return false
    } catch (error) {
      console.error('Login failed:', error)
      return false
    }
  }

  const logout = async () => {
    try {
      await fetch('/.netlify/functions/auth-logout', {
        method: 'POST',
      })
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      setUser(null)
    }
  }

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const value = {
    user,
    setUser,
    login,
    logout,
    isLoading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}