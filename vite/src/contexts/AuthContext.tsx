import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User } from '../utils/types';

interface AuthContextType {
  user: Omit<User, 'password'> | null;
  login: (user: Omit<User, 'password'>, token: string) => void;
  logout: () => void;
  updateUser: (user: Omit<User, 'password'>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
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
  const [user, setUser] = useState<Omit<User, 'password'> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user on app load
    const storedUser = localStorage.getItem('blink_user');
    const storedToken = localStorage.getItem('blink_token');

    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('blink_user');
        localStorage.removeItem('blink_token');
      }
    }

    setIsLoading(false);
  }, []);

  const login = (userData: Omit<User, 'password'>, token: string) => {
    localStorage.setItem('blink_user', JSON.stringify(userData));
    localStorage.setItem('blink_token', token);
    setUser(userData);
  };

  const logout = async () => {
    try {
      // Call logout API to clear server-side session/cookie
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout API call failed:', error);
    }

    // Clear client-side state
    localStorage.removeItem('blink_user');
    localStorage.removeItem('blink_token');
    setUser(null);
  };

  const updateUser = (userData: Omit<User, 'password'>) => {
    localStorage.setItem('blink_user', JSON.stringify(userData));
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}