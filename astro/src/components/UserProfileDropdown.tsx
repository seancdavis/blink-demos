import { useState, useRef, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  avatarSrc: string;
}

interface UserProfileDropdownProps {
  user: User;
}

export default function UserProfileDropdown({ user }: UserProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <details 
      ref={dropdownRef}
      className="header-auth-links signed-in"
      open={isOpen}
      onToggle={(e) => setIsOpen((e.target as HTMLDetailsElement).open)}
      data-username={user.username}
      data-avatar-src={user.avatarSrc}
      data-user-id={user.id}
    >
      <summary>
        <img className="avatar" src={user.avatarSrc} alt={`${user.username} avatar`} />
      </summary>
      <div className="header-auth-links-dropdown">
        <a href={`/@${user.username}`} className="profile-link">{user.username}</a>
        <a href="/settings">Edit profile</a>
        <form action="/api/auth/logout" method="post">
          <button className="sign-out" type="submit">Sign out</button>
        </form>
      </div>
    </details>
  );
}