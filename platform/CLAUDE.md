# Blink Platform Development Guide

This project is a social media platform built specifically for Netlify's platform. When working on this codebase, follow these patterns and conventions:

## Platform Architecture

### Netlify Functions (.mts files in netlify/functions/)

- Handle API endpoints and server-side logic
- Use TypeScript modules (.mts extension)
- Import utilities from `../../src/utils/index.mts`
- Always export a `config` object defining the path
- Return proper HTTP responses with status codes

### Netlify Edge Functions (.mts files in netlify/edge-functions/)

- Run at edge locations for performance
- Handle middleware-like functionality (auth, partials, feedback)
- Use `context.next()` to pass through to next handler
- Transform responses using HTMLRewriter when needed
- Define path configuration in `netlify.toml` to control for call order

### Data Storage with Netlify Blobs

- Use `@netlify/blobs` for data persistence
- Create stores with: `getStore({ name: 'StoreName', consistency: 'strong' })`
- Store JSON data: `store.set(key, data, { type: 'json' })`
- Retrieve data: `store.get(key, { type: 'json' })`
- List entries: `store.list()`

### Authentication System

- JWT-based auth using `jose` library
- Passwords hashed with `bcrypt`
- Session stored in httpOnly cookie `u_session`
- JWT secret from `COOKIE_JWT_SECRET` environment variable
- Auth middleware in `edge-functions/auth.mts` validates all requests

### Custom Templating System

#### Partial Components

- Use `<partial name="component-name">` tags in HTML
- Partials are rendered server-side by `netlify/edge-functions/partial.mts`
- Partial files stored in `src/partials/` as `.html` files
- Pass data via attributes: `<partial name="header" title="Page Title">`

#### Special Elements

- `<feedback></feedback>` - Displays user feedback messages
- `<latest-posts></latest-posts>` - Dynamically loads posts

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

- Import shared utilities from `src/utils/index.mts`
- Use `functionUtils()` for common function operations (redirects, feedback, cookies)
- Use `renderPartial()` for server-side partial rendering
- Use `getCurrentUser()` for auth checks

### File Upload System

- Avatar uploads handled by `user-upload-avatar.mts`
- Files stored in `/uploads/avatar/` directory
- Image resizing via Netlify's image transformation API
- Redirects in `netlify.toml` handle image optimization

### Environment Variables Required

- `COOKIE_JWT_SECRET` - Secret for JWT signing (generate with `npm run generate-secret`)
- `ADMIN_API_KEY` - Admin API key for backend access (when generating placeholder content)

### Development Commands

- `npm run dev` - Start Netlify Dev server
- `npm run build` - Build static assets
- `npm run generate-secret` - Generate JWT secret

### Conventions

- All server-side code uses TypeScript with `.mts` extension
- Function names should be descriptive of their HTTP endpoint
- Use strong consistency for Netlify Blobs when data integrity matters
- Handle form submissions with proper validation and feedback
- Always set appropriate HTTP status codes
- Use UUID for all entity IDs

### Security Patterns

- Validate all user inputs
- Hash passwords before storage
- Use httpOnly cookies for sessions
- Validate JWT tokens on protected routes
- Sanitize file uploads
- Use CSRF protection via sameSite cookie attributes

### Deployment

- Static files served from `www/` directory
- Build process copies assets and processes templates
- Netlify handles routing via `netlify.toml` configuration
- Edge functions run automatically based on path matching
