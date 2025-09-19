import type { User } from './types';

export function getUserAvatarUrl(user: User | null): string {
  if (!user) {
    return 'https://api.dicebear.com/7.x/identicon/png?seed=anonymous';
  }

  return user.avatarSrc || `https://api.dicebear.com/7.x/identicon/png?seed=${user.id}`;
}

export function getUserProfileUrl(username: string): string {
  return `/@/${username}`;
}

export function isValidUsername(username: string): boolean {
  const usernameRegex = /^[a-zA-Z0-9_-]{3,30}$/;
  return usernameRegex.test(username);
}

export function isValidPassword(password: string): boolean {
  return password.length >= 6;
}

export function formatUsername(username: string): string {
  return `@${username}`;
}