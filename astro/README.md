# Blink - Social Media Platform

A Twitter/X-like social media platform built with Astro and deployed on Netlify's serverless architecture with JWT authentication and blob storage.

## Features

- **User Authentication** - Register, login, logout with JWT sessions
- **Post Creation** - Create and view posts with titles and content
- **User Profiles** - Custom avatars and profile pages
- **Real-time Feed** - Latest posts displayed on homepage
- **Image Optimization** - Automatic avatar resizing and optimization
- **Admin Tools** - Seed users and posts for development

## Tech Stack

- **Frontend:** Astro with server-side rendering
- **Backend:** Astro API routes (deployed as Netlify Functions)
- **Database:** Netlify Blobs for data persistence
- **Auth:** JWT with bcrypt password hashing
- **Images:** Netlify image transformation API
- **Hosting:** Netlify platform

## Quick Deploy

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/seancdavis/blink-demos&dir=platform)

After deploying, update the environment variables in your Netlify dashboard:

- `COOKIE_JWT_SECRET` - Generate with `npm run generate-secret`
- `ADMIN_API_KEY` - Use the same generated secret for admin access

## Local Development

### Prerequisites

- Node.js v20+
- Netlify CLI (`npm install -g netlify-cli`)
- A deployed Netlify site (see Quick Deploy above)

### Setup

1. **Clone and install dependencies:**

   ```bash
   git clone <repository-url>
   cd platform
   npm install
   ```

2. **Connect to your Netlify site:**

   ```bash
   netlify login
   netlify link
   ```

   This connects your local environment to your deployed site, allowing you to use the same environment variables.

3. **Start development server:**

   ```bash
   npm run dev
   ```

   The Netlify CLI automatically pulls environment variables from your deployed site, so no local `.env` file is needed.

### Development Commands

- `npm run dev` - Start Astro development server
- `npm run build` - Build Astro project for production
- `npm run preview` - Preview built site locally
- `npm run netlify:dev` - Start Netlify Dev server (for testing Netlify-specific features)
- `npm run generate-secret` - Generate a new JWT secret

## Project Structure

```
platform/
├── src/
│   ├── components/        # Reusable Astro components
│   ├── layouts/           # Page layouts
│   ├── middleware.ts      # Authentication and routing middleware
│   ├── pages/             # Astro pages and API routes
│   │   ├── api/           # API endpoints (auth, posts, admin)
│   │   └── *.astro        # Page components
│   └── utils/             # Shared TypeScript utilities
├── www/                   # Static assets (CSS, images, etc.)
├── astro.config.mjs       # Astro configuration
├── netlify.toml           # Netlify configuration
└── package.json
```

## Key Concepts

### Astro Components

Uses Astro's component system with server-side rendering and optional client-side JavaScript.

```astro
---
import Header from '../components/Header.astro';
import Feedback from '../components/Feedback.astro';
---

<Header />
<Feedback />
```

### Authentication System

Provides conditional content rendering based on authentication state using Astro's templating:

```astro
---
import { getCurrentUser } from '../utils/get-current-user.mts';
const user = await getCurrentUser({ cookies });
---

{user ? (
  <!-- Content for logged-in users -->
  <div>Welcome, {user.username}!</div>
) : (
  <!-- Content for guest users -->
  <a href="/login">Sign in</a>
)}
```

Astro components can fetch user data directly and conditionally render content.

### Data Storage

Utilizes Netlify Blobs for persistence. Schema is defined in `src/utils/types.mts`.

- Users stored in 'User' store
- Posts stored in 'Post' store
- Strong consistency for data integrity

### Authentication Flow

1. User registers/logs in via forms
2. Password hashed with bcrypt
3. JWT token created and stored in httpOnly cookie
4. Auth-gate edge function processes conditional content
5. Content varies based on authentication state (logged in vs guest)

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/posts/create` - Create new post
- `GET /api/posts` - Load posts for feed
- `GET /post/:id` - View post details (Astro page)
- `GET /@:username` - View user profile (Astro page)
- `POST /api/user/upload-avatar` - Upload avatar image
- `POST /api/admin/seed` - Seed test data (admin only)

## Deployment

### Environment Variables

Set these in your Netlify dashboard:

- `COOKIE_JWT_SECRET` - JWT signing secret (required)
- `ADMIN_API_KEY` - Admin API key for backend access (when generating placeholder content)

### Manual Deployment

1. Build the project: `npm run build`
2. Deploy the `dist` directory to Netlify
3. Set environment variables in Netlify dashboard

### Automatic Deployment

Connect your repository to Netlify for automatic deployments on push.

## Admin Features

Use the admin seed endpoint to populate your site with test data:

```bash
curl -X POST https://your-site.netlify.app/api/admin/seed
```

This creates sample users and posts for development and testing.
