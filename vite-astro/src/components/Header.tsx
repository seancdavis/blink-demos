import React from 'react'
import { Link } from 'react-router-dom'
import type { User } from '@utils/types'
import HeaderUserDisplay from './HeaderUserDisplay'

interface HeaderProps {
  user?: User | null
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  return (
    <header>
      <div className="header-content container">
        <Link className="header-logo" to="/">
          <img src="/img/blink-logo.svg" alt="BLINK Logo" />
        </Link>
        <nav>
          {user ? (
            <HeaderUserDisplay user={user} />
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