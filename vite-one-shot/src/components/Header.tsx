import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { getUserAvatarUrl, getUserProfileUrl } from '../utils/user';

export function Header() {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close dropdown on navigation
  useEffect(() => {
    setIsDropdownOpen(false);
  }, [navigate]);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate('/');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header__content">
          <Link to="/" className="header__logo">
            BLINK
          </Link>

          <nav className="header__nav">
            {user ? (
              <div className="header__auth" ref={dropdownRef}>
                <button
                  className="header__user-button"
                  onClick={toggleDropdown}
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="true"
                >
                  <img
                    src={getUserAvatarUrl(user)}
                    alt={`${user.username} avatar`}
                    className="avatar avatar--small"
                  />
                  <span className="header__username">@{user.username}</span>
                  <span className="header__dropdown-arrow">▼</span>
                </button>

                {isDropdownOpen && (
                  <div className="header__dropdown">
                    <Link
                      to={getUserProfileUrl(user.username)}
                      className="header__dropdown-link"
                    >
                      Your Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="header__dropdown-link"
                    >
                      Settings
                    </Link>
                    <hr className="header__dropdown-separator" />
                    <button
                      onClick={handleLogout}
                      className="header__dropdown-button"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="header__auth-links">
                <Link to="/login" className="button button--outline">
                  Sign In
                </Link>
                <Link to="/register" className="button">
                  Sign Up
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}