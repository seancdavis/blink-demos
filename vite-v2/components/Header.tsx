import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function Header() {
  const { user, isAuthenticated, logout } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDetailsElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && dropdownOpen) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    document.addEventListener('keydown', handleEscapeKey)

    return () => {
      document.removeEventListener('click', handleClickOutside)
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [dropdownOpen])

  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <header>
      <div className="header-content container">
        <Link className="header-logo" to="/">
          <img src="/images/blink-logo.svg" alt="BLINK Logo" />
        </Link>
        <nav>
          {isAuthenticated && user ? (
            <details
              className="header-auth-links signed-in"
              ref={dropdownRef}
              open={dropdownOpen}
              onToggle={() => setDropdownOpen(!dropdownOpen)}
            >
              <summary>
                <img
                  className="avatar"
                  src={user.avatarSrc}
                  alt={`${user.username} avatar`}
                />
              </summary>
              <div className="header-auth-links-dropdown">
                <Link to={`/@${user.username}`} className="profile-link">
                  {user.username}
                </Link>
                <Link to="/settings">Edit profile</Link>
                <form onSubmit={handleLogout}>
                  <button className="sign-out" type="submit">
                    Sign out
                  </button>
                </form>
              </div>
            </details>
          ) : (
            <Link className="button" to="/login">
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header