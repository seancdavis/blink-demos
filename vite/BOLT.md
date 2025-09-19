# Blink Social Media App - Bolt Recreation Prompt

Create a React + TypeScript social media application called "Blink" using Vite. This is a Twitter-like microblogging platform with authentication, posts, profiles, and real-time interactions.

## Project Setup

```bash
npm create vite@latest blink-app -- --template react-ts
cd blink-app
npm install
```

## Dependencies

Install these exact packages:

```bash
npm install @faker-js/faker@^10.0.0 @netlify/blobs@^8.1.0 @netlify/vite-plugin@^2.5.10 bcrypt@^6.0.0 jose@^6.1.0 react-router@^7.9.1 uuid@^13.0.0
npm install -D @types/bcrypt @types/uuid
```

**CRITICAL:** `@netlify/blobs` is REQUIRED for persistent data storage. DO NOT use in-memory storage or mock data.

## Vite Configuration (vite.config.ts)

Replace the default Vite config with this exact configuration to enable Netlify functions:

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import netlify from "@netlify/vite-plugin";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), netlify()],
});
```

This configuration enables:

- React plugin for JSX/TSX support
- Netlify plugin for serverless function API routes
- Automatic API proxy during development

## Project Structure

```
netlify/
└── functions/
    ├── posts.ts
    ├── post.ts
    ├── login.ts
    ├── register.ts
    ├── logout.ts
    ├── me.ts
    ├── user.ts
    ├── avatar.ts
    └── upload-avatar.ts
src/
├── components/
│   ├── Header.tsx
│   ├── PostCard.tsx
│   ├── Pagination.tsx
│   ├── Feedback.tsx
│   └── NewPostForm.tsx
├── contexts/
│   └── AuthContext.tsx
├── hooks/
│   └── useDocumentTitle.ts
├── pages/
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Profile.tsx
│   ├── Settings.tsx
│   ├── Posts.tsx
│   ├── PostDetail.tsx
│   └── NotFound.tsx
├── utils/
│   ├── types.ts
│   ├── mock-data.ts
│   ├── user.ts
│   ├── time-ago-in-words.ts
│   ├── truncate-text.ts
│   ├── nl2br.ts
│   ├── posts-index.ts
│   └── feedback-data.ts
├── App.tsx
├── main.tsx
└── index.css
vite.config.ts
```

## Core Types (src/utils/types.ts)

```typescript
export type User = {
  id: string;
  username: string;
  password: string;
  avatarSrc: string;
};

export type Post = {
  id: string;
  title: string;
  content: string;
  userId: string;
  createdAt: string;
};

export type PostWithUser = Post & {
  user: User;
  date: string;
};
```

## Routing Configuration (src/main.tsx)

Set up React Router with these exact routes:

- `/` - Home page (latest posts)
- `/@/:username` - User profile pages
- `/login` - Login form
- `/register` - Registration form
- `/settings` - User settings (auth required)
- `/posts/p/:page` - Paginated posts view
- `/posts/:id` - Individual post detail
- `/*` - 404 Not Found page

Wrap the app with `AuthProvider` context for authentication state.

## Authentication Context (src/contexts/AuthContext.tsx)

Create an AuthContext that manages:

- User login/logout state
- Local storage persistence (`blink_user`, `blink_token`)
- Login, logout, and updateUser functions
- Loading state during initialization

The context should restore user state from localStorage on app load.

## Key Components

### Header (src/components/Header.tsx)

- Logo linking to home page
- Authentication state display
- User avatar dropdown with:
  - Link to user profile (`/@/username`)
  - Link to settings
  - Sign out button
- "Sign in" button when not authenticated
- Dropdown closes on outside clicks

### PostCard (src/components/PostCard.tsx)

- Display post title, truncated content, user info
- User avatar, username (linking to profile), and relative date
- Click to view full post detail
- Hover animation with rotating border colors

### Pagination (src/components/Pagination.tsx)

- Previous/Next navigation with arrow icons (← →)
- Show current page info ("Page X of Y")
- Handle pagination via URL search params (`?page=2`)
- Links should navigate to `/?page=X` for home page
- Gray out disabled buttons (first/last page)
- Only show if there are multiple pages

### NewPostForm (src/components/NewPostForm.tsx)

- Guest prompt with sign-in/register buttons when not authenticated
- Post creation form with user avatar when signed in
- Real-time character counter (400 char limit) with visual feedback
- Form validation (title 10-64 chars, content 10-400 chars)
- Integration with auth context and feedback system
- Auto-refresh parent component after successful post creation

## Key Pages

### Home (src/pages/Home.tsx)

- NewPostForm component at the top for creating posts
- Fetch and display paginated posts using URL search params (`?page=X`)
- Grid layout of PostCard components
- Loading and error states
- Pagination controls that update URL (`/?page=2`, `/?page=3`, etc.)
- Auto-refresh posts after new post creation
- **IMPORTANT:** Pagination must use URL search params, not component state

### Login/Register (src/pages/Login.tsx, Register.tsx)

- Form validation
- Error message display
- Redirect after successful auth
- Link between login/register pages

### Profile (src/pages/Profile.tsx)

- User info header with avatar
- Display user's posts
- "No posts" empty state
- Edit profile link for own profile

### Settings (src/pages/Settings.tsx)

- Update username
- Avatar upload functionality
- Form validation and feedback

## Styling Approach (src/index.css)

Use a comprehensive CSS file with:

### CSS Custom Properties

- Color palette: purple, blue, rose, lime, orange, neutral
- Font weights: normal (400), medium (600), bold (800)
- Container widths: 75rem, 50rem, 30rem

### Color Scheme

- **Dark theme:** Deep purple-950 background (#080214)
- **Text:** Light purple-50 (#e8e9ff) for readability
- **Subtle UI elements:** Use neutral grays (neutral-400 to neutral-700)
- **Accent colors:** Purple for buttons and links, but sparingly
- **Borders:** Dark neutral-950 for cards and form elements
- **NOT overwhelming purple** - should feel dark and minimal with purple accents

### Layout System

- Container classes with responsive padding
- Grid layout for post cards
- Flexbox for header and navigation

### Typography

- Poppins font for headings
- Open Sans for body text
- Multiple font weight options

### Component Styles

Key styled components:

- `.button` - Purple gradient buttons with hover effects
- `.post-card` - Bordered cards with hover animations
- `.avatar` - Circular user images
- `.pagination` - Navigation controls
- `.header-auth-links` - Dropdown menus
- Form elements with focus states

### Animations

- `@keyframes rotateColors` - Rainbow border animation cycling through purple, rose, lime, blue, orange
- Smooth transitions on hover states
- Transform effects on pagination

## Mock Data System

Create utility functions for:

- Generating fake users with @faker-js/faker
- Creating sample posts with realistic content
- Time formatting ("2 hours ago", "3 days ago")
- Text truncation for post previews
- Converting newlines to HTML line breaks

## CRITICAL: Netlify Functions API Backend

**⚠️ IMPORTANT: This app REQUIRES Netlify Functions to work properly. DO NOT skip this section!**

You MUST create serverless API functions in the `netlify/functions/` directory. The `@netlify/vite-plugin` automatically maps these to `/api/*` routes during development.

### How Netlify Functions Work:

1. Create `.ts` files in `netlify/functions/` directory
2. Each file exports a default handler function and config object
3. The config object defines the API path (e.g., `/api/posts`)
4. The Netlify plugin proxies requests from your React app to these functions
5. Functions run as serverless endpoints both in development and production

### Required Directory Structure:

```
netlify/
└── functions/
    ├── login.ts       → handles /api/auth/login
    ├── register.ts    → handles /api/auth/register
    ├── logout.ts      → handles /api/auth/logout
    ├── me.ts          → handles /api/auth/me
    ├── posts.ts       → handles /api/posts
    ├── post.ts        → handles /api/posts/[id]
    ├── user.ts        → handles /api/users/[username]
    ├── avatar.ts      → handles /api/users/[id]/avatar
    └── upload-avatar.ts → handles avatar uploads
```

### Example Function Implementation:

#### netlify/functions/posts.ts

```typescript
import { getStore } from "@netlify/blobs";
import type { Config } from "@netlify/functions";
import { v4 as uuidv4 } from "uuid";
import { faker } from "@faker-js/faker";
import { jwtDecode } from "jose";

export default async (request: Request) => {
  try {
    const url = new URL(request.url);
    const postStore = getStore({ name: "Post", consistency: "strong" });
    const userStore = getStore({ name: "User", consistency: "strong" });

    // Initialize with fake data if empty
    const allPosts = await postStore.list();
    if (allPosts.blobs.length === 0) {
      await initializeFakeData(postStore, userStore);
    }

    if (request.method === "GET") {
      // Handle pagination
      const page = parseInt(url.searchParams.get("page") || "1", 10);
      const perPage = 12;

      // Get all posts and sort by creation date
      const allPostBlobs = await postStore.list();
      const posts = await Promise.all(
        allPostBlobs.blobs.map(async (blob) => {
          const post = await postStore.get(blob.key, { type: "json" });
          return { ...post, id: blob.key };
        })
      );

      posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      const startIndex = (page - 1) * perPage;
      const paginatedPosts = posts.slice(startIndex, startIndex + perPage);
      const totalPages = Math.ceil(posts.length / perPage);

      // Add user data to posts
      const postsWithUsers = await Promise.all(
        paginatedPosts.map(async (post) => {
          const user = await userStore.get(post.userId, { type: "json" });
          return {
            ...post,
            user: user ? { ...user, password: undefined } : null,
            date: timeAgoInWords(new Date(post.createdAt)),
          };
        })
      );

      return new Response(
        JSON.stringify({
          posts: postsWithUsers,
          pagination: {
            currentPage: page,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
            totalPosts: posts.length,
          },
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (request.method === "POST") {
      // Extract user from JWT token
      const authHeader = request.headers.get("Authorization");
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return new Response(JSON.stringify({ error: "Authentication required" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }

      const token = authHeader.substring(7);
      let userId;
      try {
        const decoded = jwtDecode(token);
        userId = decoded.userId;
      } catch (error) {
        return new Response(JSON.stringify({ error: "Invalid token" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }

      const body = await request.json();
      const { title, content } = body;

      // Validation
      if (!title || title.length < 10 || title.length > 64) {
        return new Response(
          JSON.stringify({
            error: "Title must be between 10 and 64 characters",
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      if (!content || content.length < 10 || content.length > 400) {
        return new Response(
          JSON.stringify({
            error: "Content must be between 10 and 400 characters",
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      const postId = uuidv4();
      const newPost = {
        title,
        content,
        userId,
        createdAt: new Date().toISOString(),
      };

      await postStore.set(postId, newPost, { type: "json" });

      return new Response(JSON.stringify({ ...newPost, id: postId }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Posts API error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

async function initializeFakeData(postStore, userStore) {
  // Create fake users
  const userIds = [];
  for (let i = 0; i < 5; i++) {
    const userId = uuidv4();
    const userData = {
      username: faker.internet.username(),
      password: await bcrypt.hash("password123", 10),
      avatarSrc: `https://api.dicebear.com/7.x/identicon/png?seed=${userId}`,
    };
    await userStore.set(userId, userData, { type: "json" });
    userIds.push(userId);
  }

  // Create fake posts
  for (let i = 0; i < 50; i++) {
    const postId = uuidv4();
    const postData = {
      title: faker.lorem.sentence(3),
      content: faker.lorem.paragraphs(2),
      userId: userIds[Math.floor(Math.random() * userIds.length)],
      createdAt: new Date(
        Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
    };
    await postStore.set(postId, postData, { type: "json" });
  }
}

function timeAgoInWords(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
}

export const config: Config = {
  path: "/api/posts",
};
```

#### netlify/functions/login.ts

```typescript
import { getStore } from "@netlify/blobs";
import type { Config } from "@netlify/functions";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";

export default async (request: Request) => {
  try {
    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return new Response(
        JSON.stringify({
          error: "Username and password are required",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const userStore = getStore({ name: "User", consistency: "strong" });

    // Find user by username - search through all users
    const allUsers = await userStore.list();
    let userId: string | null = null;
    let userData = null;

    for (const blob of allUsers.blobs) {
      const user = await userStore.get(blob.key, { type: "json" });
      if (user.username === username) {
        userId = blob.key;
        userData = user;
        break;
      }
    }

    if (!userId || !userData) {
      return new Response(
        JSON.stringify({
          error: "Invalid username or password",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Verify password with bcrypt
    const passwordValid = await bcrypt.compare(password, userData.password);

    if (!passwordValid) {
      return new Response(
        JSON.stringify({
          error: "Invalid username or password",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Generate JWT token
    if (!process.env.COOKIE_JWT_SECRET) {
      throw new Error("Missing COOKIE_JWT_SECRET environment variable");
    }
    const secret = new TextEncoder().encode(process.env.COOKIE_JWT_SECRET);

    const jwt = await new SignJWT({ userId, username: userData.username })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1w")
      .sign(secret);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = userData;

    return new Response(
      JSON.stringify({
        success: true,
        user: { ...userWithoutPassword, id: userId },
        token: jwt,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Login error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const config: Config = {
  path: "/api/auth/login",
};
```

### ⚠️ CRITICAL Implementation Steps:

1. **Create `netlify/functions/` directory FIRST**
2. **Implement ALL 8 API functions before building React components**
3. **Each function MUST export both `default` handler and `config` object**
4. **Use Netlify Blobs for persistent data storage (NOT in-memory storage)**
5. **Pre-populate blob stores with faker.js data on first run**
6. **Test API endpoints work by visiting `/api/posts` in browser**

### Data Storage Strategy - USE NETLIFY BLOBS:

**⚠️ CRITICAL: You MUST use Netlify Blobs for data storage, NOT in-memory arrays/Maps!**

```typescript
import { getStore } from "@netlify/blobs";

// Get blob stores for different data types
const userStore = getStore({ name: "User", consistency: "strong" });
const postStore = getStore({ name: "Post", consistency: "strong" });

// Store data with unique IDs as keys
await userStore.set(userId, userData, { type: "json" });
await postStore.set(postId, postData, { type: "json" });

// Retrieve data by ID
const user = await userStore.get(userId, { type: "json" });
const post = await postStore.get(postId, { type: "json" });

// List all items in a store
const allUsers = await userStore.list();
for (const blob of allUsers.blobs) {
  const userData = await userStore.get(blob.key, { type: "json" });
}
```

**Blob Store Pattern:**
- Use separate stores: "User", "Post", "UserPost" (for user-post relationships)
- Store each item with UUID as key: `await store.set(uuid, data, { type: "json" })`
- Always use `{ consistency: "strong" }` for reliable reads
- Use `{ type: "json" }` for automatic serialization
- Data persists between deployments and restarts (unlike in-memory storage)

### Security Implementation:

- Hash passwords with `bcrypt.hash()` for registration
- Verify passwords with `bcrypt.compare()` for login
- Generate JWT tokens with `jose` library using `COOKIE_JWT_SECRET`
- Validate JWT tokens in protected endpoints
- Return proper HTTP status codes and error messages

### You MUST implement ALL these functions:

1. **netlify/functions/login.ts** - User authentication
2. **netlify/functions/register.ts** - User registration
3. **netlify/functions/logout.ts** - Clear sessions
4. **netlify/functions/me.ts** - Get current user info
5. **netlify/functions/posts.ts** - Get/create posts (example above)
6. **netlify/functions/post.ts** - Get individual post by ID
7. **netlify/functions/user.ts** - Get user profile and their posts
8. **netlify/functions/upload-avatar.ts** - Handle avatar uploads

Each function follows the same pattern:

- Import required dependencies (`@netlify/functions`, `uuid`, `bcrypt`, `jose`, etc.)
- Use in-memory storage (Maps/Arrays)
- Handle multiple HTTP methods (GET/POST/PUT/DELETE)
- Return JSON responses with proper status codes
- Export both default handler and config object

**The React app expects these exact API endpoints to exist. Without implementing ALL of them, the app will fail with 404 errors on API calls.**

## Authentication Flow - Critical Implementation Details

### Frontend JWT Token Handling:

**1. Login Process:**
```typescript
// In Login component
const handleLogin = async (username: string, password: string) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();
  if (data.success) {
    // Store token in localStorage and AuthContext
    login(data.user, data.token);
  }
};
```

**2. Making Authenticated Requests:**
```typescript
// Always include Authorization header for protected endpoints
const token = localStorage.getItem('blink_token');
const response = await fetch('/api/posts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify({ title, content }),
});
```

**3. AuthContext Implementation:**
```typescript
// AuthContext should:
// - Store JWT token in localStorage as 'blink_token'
// - Store user data in localStorage as 'blink_user'
// - Automatically restore on page refresh
// - Clear both on logout
// - Provide token to components that need it
```

### Backend JWT Validation Pattern:

**For ALL protected endpoints, use this pattern:**
```typescript
// Extract and validate JWT token
const authHeader = request.headers.get("Authorization");
if (!authHeader?.startsWith("Bearer ")) {
  return new Response(JSON.stringify({ error: "Authentication required" }), {
    status: 401,
    headers: { "Content-Type": "application/json" },
  });
}

const token = authHeader.substring(7);
try {
  const secret = new TextEncoder().encode(process.env.COOKIE_JWT_SECRET);
  const { payload } = await jwtVerify(token, secret);
  const userId = payload.userId;
  // Use userId for the request
} catch (error) {
  return new Response(JSON.stringify({ error: "Invalid token" }), {
    status: 401,
    headers: { "Content-Type": "application/json" },
  });
}
```

## Functional Requirements

### Authentication

- Login with username/password
- Registration with validation
- Persistent sessions via localStorage
- Protected routes (settings page)
- Proper logout clearing state

### Posts System

- Create new posts with title and content validation
- Display posts in reverse chronological order
- Pagination (12 posts per page)
- Post detail pages with full content
- User profile pages showing their posts
- Real-time character counting during post creation
- Auto-refresh after new post creation
- Responsive grid layout

### Navigation

- Header with logo and auth controls
- Breadcrumb-style navigation
- User profile links throughout app
- Proper 404 handling

### User Management

- Profile editing (username, avatar)
- Avatar upload/update functionality
- User profile pages
- Settings management

## Visual Design

### Brand Identity

- "Blink" logo in header
- Purple-dominant color scheme
- Modern, clean interface
- Dark theme aesthetic

### Interactive Elements

- Animated borders on hover
- Smooth transitions
- Dropdown menus with outside-click closing
- Button hover states
- Form focus indicators

### Responsive Behavior

- Container max-widths with padding
- Flexible grid systems
- Mobile-friendly touch targets
- Readable typography at all sizes

## Assets

For images and icons, reference the GitHub repository:

- Logo: Use text "BLINK" or simple SVG
- Favicon: Purple/geometric design
- Default avatars: Generated or placeholder images

Link to repository for reference: https://github.com/seancdavis/blink-demos/tree/main/vite

## Netlify Configuration (netlify.toml)

Create a `netlify.toml` file in the root directory with these basic build settings:

```toml
[build]
  command = "npm run build"
  publish = "dist"
```

This is REQUIRED for proper deployment and function routing.

## Environment Variables

Create a `.env` file in the root directory with:

```env
COOKIE_JWT_SECRET=your-super-secret-jwt-key-for-development
```

This is required for JWT token signing in the authentication functions.

## Implementation Notes

**CRITICAL: Follow this exact order for Bolt to work properly:**

1. Start with the basic Vite React-TS template
2. **IMMEDIATELY** install all dependencies including `@netlify/vite-plugin`
3. **IMMEDIATELY** update `vite.config.ts` with the Netlify plugin configuration
4. **IMMEDIATELY** create `netlify.toml` with build settings
5. Create the `.env` file with JWT secret
6. Set up all Netlify functions first (they're essential for the app to work)
7. Create the types and utility functions
8. Set up the routing structure in main.tsx
9. Create the AuthContext before building components
10. Build core components (Header, PostCard, NewPostForm, Pagination)
11. Implement pages in order: Home → Auth → Profile
12. Add styling incrementally, component by component
13. Test authentication flow thoroughly
14. Ensure all routes and API endpoints work correctly

**Important for Bolt:** The Netlify plugin enables the `/api/*` routes to work in development. Without it, all API calls will fail. Make sure to install and configure it before creating any components that make API calls.

## Design Guidelines

**Visual Identity:**

- **Dark, minimal theme** - NOT heavily purple everywhere
- Purple-950 background with subtle neutral borders and text
- Purple accents only for interactive elements (buttons, links)
- Use neutral grays for most UI elements
- Clean, modern aesthetic similar to Twitter/X dark mode

**Pagination Requirements:**

- Must use URL search parameters (`?page=2`) not component state
- Pagination component should generate proper navigation links
- Home page should read `page` param and fetch appropriate data
- Previous/Next buttons should be disabled appropriately
- Show page information ("Page 2 of 8" or similar)

The app should feel like a real social media platform with smooth interactions, proper state management, and a polished user interface. Focus on attention to detail in animations, typography, and user experience.
