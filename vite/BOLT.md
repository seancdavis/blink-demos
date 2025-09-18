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
npm install @faker-js/faker@^10.0.0 bcrypt@^6.0.0 jose@^6.1.0 react-router@^7.9.1 uuid@^13.0.0
npm install -D @types/bcrypt @types/uuid
```

## Project Structure

```
src/
├── components/
│   ├── Header.tsx
│   ├── PostCard.tsx
│   ├── Pagination.tsx
│   └── Feedback.tsx
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

- Previous/Next navigation
- Show current page info
- Handle pagination state with URL params

## Key Pages

### Home (src/pages/Home.tsx)

- Fetch and display paginated posts
- Grid layout of PostCard components
- Loading and error states
- Pagination controls

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

- Dark theme with purple-950 background
- Purple-50 text color
- Purple accent colors for links and buttons
- Rotating rainbow border animation on hover

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

## API Simulation

Since Bolt doesn't support real backends, create mock API functions that:

- Simulate authentication with localStorage
- Return paginated post data
- Handle user profiles and settings
- Use setTimeout to simulate network delays
- Return proper error states

## Functional Requirements

### Authentication

- Login with username/password
- Registration with validation
- Persistent sessions via localStorage
- Protected routes (settings page)
- Proper logout clearing state

### Posts System

- Display posts in reverse chronological order
- Pagination (12 posts per page)
- Post detail pages with full content
- User profile pages showing their posts
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

## Implementation Notes

1. Start with the basic Vite React-TS template
2. Install all dependencies first
3. Set up the routing structure in main.tsx
4. Create the AuthContext before building components
5. Build core components (Header, PostCard) first
6. Implement pages in order: Home → Auth → Profile
7. Add styling incrementally, component by component
8. Test authentication flow thoroughly
9. Ensure all routes work correctly
10. Add mock data and API simulation last

The app should feel like a real social media platform with smooth interactions, proper state management, and a polished user interface. Focus on attention to detail in animations, typography, and user experience.
