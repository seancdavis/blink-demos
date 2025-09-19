import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User, AuthContextType } from '../utils/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('blink_user');
      const storedToken = localStorage.getItem('blink_token');

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      }
    } catch (error) {
      console.error('Failed to restore auth state:', error);
      // Clear invalid data
      localStorage.removeItem('blink_user');
      localStorage.removeItem('blink_token');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (userData: User, userToken: string) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('blink_user', JSON.stringify(userData));
    localStorage.setItem('blink_token', userToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('blink_user');
    localStorage.removeItem('blink_token');
  };

  const updateUser = (userData: User) => {
    setUser(userData);
    localStorage.setItem('blink_user', JSON.stringify(userData));
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}