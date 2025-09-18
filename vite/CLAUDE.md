# Claude Code Development Notes

## Project Overview
Blink (Vite) is a React SPA social media app built with:
- **React 19** + **TypeScript** + **Vite**
- **React Router 7** for client-side routing
- **Netlify Functions** for backend API
- **Netlify Blob Storage** for data persistence
- **JWT Authentication** with localStorage

## Architecture Decisions

### Authentication System
- **Client-side auth**: Uses localStorage + React Context instead of server-side cookies
- **JWT tokens**: Stored in localStorage, sent via Authorization header
- **No cookies**: Eliminated cross-domain cookie issues with Netlify
- **Auth routes**: Login/Register redirect authenticated users to home

### Routes Structure
```
/ - Home (paginated posts)
/@/:username - User profiles (paginated posts)
/login - Login form
/register - Registration form
/settings - Profile settings (avatar upload)
/posts/p/:page - Posts pagination
/posts/:id - Individual post detail
* - 404 page
```

### API Endpoints
- `POST /api/auth/login` - User login (returns JWT + user data)
- `POST /api/auth/register` - User registration (returns JWT + user data)
- `POST /api/auth/logout` - Logout (clears server session)
- `GET /api/auth/me` - Get current user (cookie-based, legacy)
- `GET /api/posts?page=N` - Paginated posts
- `GET /api/user?username=X&page=N` - User profile with posts
- `GET /api/post?id=X` - Individual post
- `POST /api/user/upload-avatar` - Avatar upload (requires Bearer token)
- `GET /uploads/avatar/:username` - Serve uploaded avatars

### Data Storage (Netlify Blobs)
- **User**: User accounts with credentials
- **Post**: Blog posts with content
- **UserAvatar**: Uploaded avatar images
- **Cache**: Posts index for pagination

### Key Components

#### AuthContext
- Manages global user state
- Handles login/logout/updateUser
- Persists auth state in localStorage
- Provides loading states

#### PostCard
- Reusable post display component
- Shows user info, title, truncated content
- Links to profile and post detail

#### Pagination
- Route-aware pagination (works on home + profiles)
- Uses current pathname for correct URLs
- Hides buttons when not applicable

#### Feedback
- Unified error/success message system
- Uses predefined feedback keys from feedback-data.ts
- Falls back to custom messages

### Security Considerations
- **No passwords in API responses**: Always strip password field
- **JWT validation**: Decode tokens to verify user identity
- **File upload validation**: Size (2MB), type (image/*), existence
- **Auth-protected routes**: Settings requires authentication
- **Token expiration**: 1 week JWT expiration

## Development Patterns

### API Function Structure
```typescript
export default async (request: Request, context?: Context) => {
  try {
    // Method validation
    if (request.method !== 'POST') return methodNotAllowed();

    // Authentication (if required)
    const token = getAuthToken(request);
    const user = await validateToken(token);

    // Business logic
    const result = await processRequest();

    // Return response
    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return errorResponse(error);
  }
};

export const config: Config = {
  path: '/api/endpoint-name'
};
```

### React Page Structure
```typescript
export default function PageName() {
  useDocumentTitle('Page Title | Blink (Vite)');

  const { user } = useAuth(); // If auth needed
  const [searchParams] = useSearchParams(); // If pagination

  // Redirect logic for auth pages
  useEffect(() => {
    if (!isLoading && user && isAuthPage) {
      navigate('/');
    }
  }, [user, isLoading, navigate]);

  // Loading/error states
  if (loading) return <LoadingState />;
  if (error) return <ErrorState />;

  return <PageContent />;
}
```

## Important Files

### Core Configuration
- `src/main.tsx` - App entry point with providers
- `src/App.tsx` - Main layout with Outlet
- `src/contexts/AuthContext.tsx` - Global auth state

### Utilities
- `src/utils/types.ts` - TypeScript definitions
- `src/utils/user.ts` - User-related utilities
- `src/utils/posts-index.ts` - Post pagination logic
- `src/utils/feedback-data.ts` - Error/success messages
- `src/hooks/useDocumentTitle.ts` - Page title management

### API Functions
- `netlify/functions/*.ts` - All backend endpoints

## Common Tasks

### Adding New API Endpoint
1. Create `netlify/functions/endpoint-name.ts`
2. Follow the API function structure pattern
3. Add proper error handling and validation
4. Use correct `Config.path` for routing

### Adding Authentication to Endpoint
```typescript
const authHeader = request.headers.get('Authorization');
if (!authHeader?.startsWith('Bearer ')) {
  return unauthorizedResponse();
}
const token = authHeader.substring(7);
const user = decodeJwt(token);
```

### Adding New Page
1. Create component in `src/pages/`
2. Add route to `src/main.tsx`
3. Use `useDocumentTitle` for page titles
4. Handle auth redirects if needed

### Running Development
- `yarn dev` - Start development server
- Functions run automatically with Vite

## Known Issues & Solutions

### Cookie Problems
- **Issue**: Netlify functions + SPA + cookies = cross-domain issues
- **Solution**: Use localStorage + Authorization headers instead

### React 19 Compatibility
- **Issue**: Many auth libraries don't support React 19 yet
- **Solution**: Custom auth context with native JWT handling

### File Uploads
- **Issue**: FormData + Authorization headers require manual token handling
- **Solution**: Get token from localStorage, add to headers manually

## Testing Notes
- Avatar uploads require valid JWT token in Authorization header
- Pagination works on both home page and user profiles
- Dropdown menu closes on outside clicks and navigation
- Auth redirects prevent access to login/register when signed in

## Environment Variables
- `COOKIE_JWT_SECRET` - JWT signing secret (required for auth)
- `ADMIN_API_KEY` - Admin operations (if using admin functions)