import { Link } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { useRef, useEffect } from 'react';

export const Header = () => {
  const { user, logout, isLoading } = useAuth();
  const detailsRef = useRef<HTMLDetailsElement>(null);

  const handleLogout = async () => {
    if (detailsRef.current) {
      detailsRef.current.open = false;
    }
    await logout();
  };

  const handleLinkClick = () => {
    if (detailsRef.current) {
      detailsRef.current.open = false;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (detailsRef.current && !detailsRef.current.contains(event.target as Node)) {
        detailsRef.current.open = false;
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <header>
      <div className="header-content container">
        <a className="header-logo" href="/">
          <img src="/img/blink-logo.svg" alt="BLINK Logo" />
        </a>
        <nav>
          {isLoading ? null : user ? (
            <details className="header-auth-links signed-in" ref={detailsRef}>
              <summary>
                <img
                  className="avatar"
                  src={user.avatarSrc}
                  alt={`${user.username} avatar`}
                />
              </summary>
              <div className="header-auth-links-dropdown">
                <Link to={`/@/${user.username}`} onClick={handleLinkClick}>
                  {user.username}
                </Link>
                <Link to="/settings" onClick={handleLinkClick}>Edit profile</Link>
                <button
                  className="sign-out"
                  type="button"
                  onClick={handleLogout}
                >
                  Sign out
                </button>
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
  );
};
