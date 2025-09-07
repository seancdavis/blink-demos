import { defineMiddleware } from 'astro:middleware';
import { getCurrentUser } from './utils/get-current-user.mts';

export const onRequest = defineMiddleware(async (context, next) => {
  // Skip middleware for API routes that don't need auth checks
  if (context.url.pathname.startsWith('/api/debug/') ||
      context.url.pathname.startsWith('/api/admin/') ||
      context.url.pathname.startsWith('/uploads/')) {
    return next();
  }

  // Get current user for auth-based redirects
  const cookies = {
    get: (name: string) => {
      const cookie = context.cookies.get(name);
      return cookie?.value;
    }
  };

  const user = await getCurrentUser({ cookies });

  // Auth redirect logic - redirect authenticated users away from login/register
  if ((context.url.pathname === '/login' || context.url.pathname === '/register') && user) {
    return context.redirect('/');
  }

  // For protected routes (like settings), redirect unauthenticated users
  if (context.url.pathname === '/settings' && !user) {
    return context.redirect('/login');
  }

  // Continue to the next middleware or route
  return next();
});