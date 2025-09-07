# Blink Platform Development Guide

This project is a social media platform built with Astro and deployed on Netlify. When working on this codebase, follow these patterns and conventions:

## Platform Architecture

### Astro Framework

- Built with Astro for server-side rendering and static site generation
- Uses Astro's API routes for backend functionality (src/pages/api/)
- Components written in .astro format combining HTML, CSS, and TypeScript
- Middleware handles authentication and routing (src/middleware.ts)
- Static assets served from www/ directory (configured as publicDir)

### API Routes (src/pages/api/)

- Handle API endpoints and server-side logic
- Use TypeScript (.ts extension)
- Export named functions (GET, POST, etc.) following Astro conventions
- Receive { request, cookies, redirect, params } as parameters
- Return proper HTTP responses with status codes

### Data Storage with Netlify Blobs

- Use `@netlify/blobs` for data persistence
- Create stores with: `getStore({ name: 'StoreName', consistency: 'strong' })`
- Store JSON data: `store.set(key, data, { type: 'json' })`
- Retrieve data: `store.get(key, { type: 'json' })`
- List entries: `store.list()`

### Authentication System

- JWT-based auth using `jose` library
- Passwords hashed with `bcrypt`
- Session stored in httpOnly cookie `blink_session`
- JWT secret from `COOKIE_JWT_SECRET` environment variable
- Auth middleware in `edge-functions/auth.mts` handles page redirects for login/register pages
- Auth-gate system provides conditional content rendering based on authentication state

### Astro Components System

#### Components (src/components/)

- Reusable UI components written in .astro format
- Server-side rendering with optional client-side JavaScript
- Import and use components directly in pages and layouts
- Pass data via props: `<Header user={user} />`
- Components can fetch data directly using await in frontmatter

#### Authentication System

Authentication is handled natively in Astro components and middleware:

- Authentication logic in components using conditional rendering
- Middleware (src/middleware.ts) handles route-level authentication
- User data fetched directly in components via getCurrentUser()
- No need for auth-gate HTML elements - use standard conditional rendering

```astro
{user ? (
  <!-- Content for logged-in users -->
  <div>Welcome, {user.username}!</div>
) : (
  <!-- Content for guest users -->
  <a href="/login">Sign in</a>
)}
```

#### Layout and Page Structure

- Base layout in src/layouts/BaseLayout.astro
- Pages in src/pages/ using .astro extension
- Dynamic routes using [param].astro or [...param].astro
- Feedback component in src/components/Feedback.astro
- Posts loaded via API routes and displayed in components

### Types and Data Models

Data schema definitions are located in `src/utils/types.mts`.

```typescript
type User = {
  id: string
  username: string
  password: string // bcrypt hashed
  avatarSrc: string
}

type Post = {
  id: string
  title: string
  content: string
  userId: string
  createdAt: string
}
```

### Utility Functions

- Import shared utilities from `src/utils/`
- Use `astroUtils()` for common Astro operations (redirects, feedback, cookies)
- Use `getCurrentUser()` for auth checks in components and API routes
- Cookie handling adapted for Astro's cookie API
- Authentication utilities compatible with Astro's request/response cycle

### File Upload System

- Avatar uploads handled by `user-upload-avatar.mts`
- Files stored in `/uploads/avatar/` directory
- Image resizing via Netlify's image transformation API
- Redirects in `netlify.toml` handle image optimization

### Environment Variables Required

- `COOKIE_JWT_SECRET` - Secret for JWT signing (generate with `npm run generate-secret`)
- `ADMIN_API_KEY` - Admin API key for backend access (when generating placeholder content)

### Development Commands

- `npm run dev` - Start Astro development server
- `npm run build` - Build Astro project for production
- `npm run preview` - Preview built site locally
- `npm run netlify:dev` - Start Netlify Dev server (for testing with Netlify-specific features)
- `npm run generate-secret` - Generate JWT secret

### Conventions

- Pages use `.astro` extension, API routes use `.ts` extension
- API route functions named after HTTP methods (GET, POST, etc.)
- Use strong consistency for Netlify Blobs when data integrity matters
- Handle form submissions with proper validation and feedback
- Always set appropriate HTTP status codes
- Use UUID for all entity IDs
- Components can use both server-side and client-side JavaScript
- Middleware handles authentication and redirects

### 404 Error Handling Pattern

Astro handles 404 errors using its built-in routing system:

1. **404 Page** (`src/pages/404.astro`) - Astro's automatic 404 handling
2. **Dynamic Route 404s** - API routes and dynamic pages return Response(null, { status: 404 })
3. **Middleware 404s** - Middleware can redirect to 404 page or return 404 responses

Astro automatically serves the 404.astro page for unmatched routes, and dynamic routes can programmatically return 404 responses when content is not found.

### Code Quality Standards

- NEVER duplicate functions across multiple files
- ALWAYS create utility functions for shared logic in `src/utils/`
- Follow existing patterns in the codebase
- Use Astro's built-in optimizations for static assets
- Prefer server-side rendering in components over client-side data fetching
- Use TypeScript for type safety in both components and API routes

### Security Patterns

- Validate all user inputs
- Hash passwords before storage
- Use httpOnly cookies for sessions
- Validate JWT tokens on protected routes
- Sanitize file uploads
- Use CSRF protection via sameSite cookie attributes

### Deployment

- Built files output to `dist/` directory
- Static assets served from `public/` directory (Astro standard)
- Astro handles routing and server-side rendering
- Netlify adapter enables server-side features
- Middleware runs automatically for all routes
- API routes deployed as Netlify Functions automatically
