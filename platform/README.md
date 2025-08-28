# Blink - Social Media Platform

A Twitter/X-like social media platform built on Netlify's serverless architecture with custom templating, JWT authentication, and blob storage.

## Features

- **User Authentication** - Register, login, logout with JWT sessions
- **Post Creation** - Create and view posts with titles and content
- **User Profiles** - Custom avatars and profile pages
- **Real-time Feed** - Latest posts displayed on homepage
- **Image Optimization** - Automatic avatar resizing and optimization
- **Admin Tools** - Seed users and posts for development

## Tech Stack

- **Frontend:** Static HTML with custom `<partial>` components
- **Backend:** Netlify Functions & Edge Functions (TypeScript)
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

- `npm run dev` - Start Netlify Dev server with live reload
- `npm run build` - Build static assets and prepare for deployment
- `npm run generate-secret` - Generate a new JWT secret

## Project Structure

```
platform/
├── netlify/
│   ├── functions/          # API endpoints (auth, posts, admin)
│   └── edge-functions/     # Middleware (auth, partials, feedback)
├── src/
│   ├── partials/          # Reusable HTML components
│   ├── scripts/           # Build and utility scripts
│   └── utils/             # Shared TypeScript utilities
├── www/                   # Static frontend files
│   ├── css/
│   ├── images/
│   └── *.html            # Page templates
├── netlify.toml          # Netlify configuration
└── package.json
```

## Key Concepts

### Custom Templating

Uses a custom partial system with server-side rendering. These elements are replaced by edge functions at runtime.

```html
<partial name="header" title="Page Title"></partial>
<feedback></feedback>
<latest-posts></latest-posts>
```

### Auth-Gate System

Provides conditional content rendering based on authentication state using semantic HTML:

```html
<auth-gate>
  <is-authenticated>
    <!-- Content for logged-in users -->
  </is-authenticated>
  <is-unauthenticated>
    <!-- Content for guest users -->
  </is-unauthenticated>
</auth-gate>
```

The authenticated sections receive user data attributes for template population.

The `build` script collects all the HTML partials from `src/partials/` and compiles them into the final output.

### Data Storage

Utilizes Netlify Blobs for persistence. Schema is defined in `src/utils/types.mts`.

- Users stored in 'User' store
- Posts stored in 'Post' store
- Strong consistency for data integrity

### Authentication Flow

1. User registers/logs in via forms
2. Password hashed with bcrypt
3. JWT token created and stored in httpOnly cookie
4. Edge function validates token on each request

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/posts/create` - Create new post
- `GET /api/view-post/:id` - View post details
- `GET /api/view-profile/:username` - View user profile
- `POST /api/user/upload-avatar` - Upload avatar image
- `POST /api/admin/seed` - Seed test data (admin only)

## Deployment

### Environment Variables

Set these in your Netlify dashboard:

- `COOKIE_JWT_SECRET` - JWT signing secret (required)
- `ADMIN_API_KEY` - Admin API key for backend access (when generating placeholder content)

### Manual Deployment

1. Build the project: `npm run build`
2. Deploy the `www` directory to Netlify
3. Set environment variables in Netlify dashboard

### Automatic Deployment

Connect your repository to Netlify for automatic deployments on push.

## Admin Features

Use the admin seed endpoint to populate your site with test data:

```bash
curl -X POST https://your-site.netlify.app/api/admin/seed
```

This creates sample users and posts for development and testing.
