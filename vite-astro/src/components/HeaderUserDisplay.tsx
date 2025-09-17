import { useState, useEffect, useRef } from 'react'
import type { User } from '@utils/types'

interface HeaderUserDisplayProps {
  user: User
}

export default function HeaderUserDisplay({ user }: HeaderUserDisplayProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDetailsElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    document.addEventListener('keydown', handleEscapeKey)

    return () => {
      document.removeEventListener('click', handleClickOutside)
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [isOpen])

  return (
    <details 
      ref={dropdownRef}
      className="header-auth-links signed-in" 
      open={isOpen}
      onToggle={(e) => setIsOpen((e.target as HTMLDetailsElement).open)}
    >
      <summary>
        <img 
          className="avatar" 
          src={user.avatarSrc} 
          alt={`${user.username} avatar`} 
        />
      </summary>
      <div className="header-auth-links-dropdown">
        <a href={`/@${user.username}`} className="profile-link">
          {user.username}
        </a>
        <a href="/settings">Edit profile</a>
        <form action="/api/auth/logout" method="post">
          <button className="sign-out" type="submit">
            Sign out
          </button>
        </form>
      </div>
    </details>
  )
}