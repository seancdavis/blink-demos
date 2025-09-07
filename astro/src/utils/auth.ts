import type { AstroCookies } from 'astro';
import { getCurrentUser } from './get-current-user.ts';

// Convert Astro cookies to format expected by getCurrentUser
function convertCookies(astroCookies: AstroCookies) {
  return {
    get: (name: string) => {
      const cookie = astroCookies.get(name);
      return cookie?.value;
    }
  };
}

// Check if user is authenticated
export async function isAuthenticated(cookies: AstroCookies) {
  const convertedCookies = convertCookies(cookies);
  const user = await getCurrentUser({ cookies: convertedCookies });
  return !!user;
}

// Get current user from Astro cookies
export async function getCurrentUserFromAstro(cookies: AstroCookies) {
  const convertedCookies = convertCookies(cookies);
  return await getCurrentUser({ cookies: convertedCookies });
}

// Redirect helpers
export function redirectIfAuthenticated(cookies: AstroCookies, path: string) {
  return async function(redirect: (url: string) => Response) {
    const authenticated = await isAuthenticated(cookies);
    if (authenticated) {
      return redirect('/');
    }
    return null;
  };
}

export function redirectIfNotAuthenticated(cookies: AstroCookies, path: string) {
  return async function(redirect: (url: string) => Response) {
    const authenticated = await isAuthenticated(cookies);
    if (!authenticated) {
      return redirect('/login');
    }
    return null;
  };
}