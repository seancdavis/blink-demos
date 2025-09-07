import { defineMiddleware } from 'astro:middleware';
import { getCurrentUser } from './utils/get-current-user.mts';

export const onRequest = defineMiddleware(async (context, next) => {
  // Skip middleware for static assets and API routes that don't need auth
  if (context.url.pathname.startsWith('/css/') || 
      context.url.pathname.startsWith('/images/') || 
      context.url.pathname.startsWith('/uploads/') ||
      context.url.pathname.startsWith('/api/debug/') ||
      context.url.pathname.startsWith('/api/admin/')) {
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