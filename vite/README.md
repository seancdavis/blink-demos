# Blink (Vite)

A modern social media application built with React 19, TypeScript, and Vite, deployed on Netlify.

## Features

- **User Authentication**: JWT-based login/register system with localStorage
- **User Profiles**: View user profiles with paginated posts at `/@{username}`
- **Post Management**: Create and view posts with pagination
- **Avatar Upload**: Upload and manage user avatars with file validation
- **Responsive Design**: Mobile-friendly interface with dropdown menus
- **Route Protection**: Authenticated routes and proper redirects

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Routing**: React Router 7
- **Backend**: Netlify Functions
- **Database**: Netlify Blob Storage
- **Authentication**: JWT tokens with localStorage
- **Deployment**: Netlify

## Getting Started

### Prerequisites

- Node.js (Latest LTS)
- Yarn package manager

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   yarn install
   ```

3. Start the development server:
   ```bash
   yarn dev
   ```

### Deployment

The application is configured for Netlify deployment with:
- Netlify Functions for API endpoints
- Netlify Blob Storage for data persistence
- Automatic builds from Git

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Feedback.tsx    # Error/success message component
│   ├── Header.tsx      # Navigation header with auth dropdown
│   ├── Pagination.tsx  # Reusable pagination component
│   └── PostCard.tsx    # Individual post display component
├── contexts/           # React Context providers
│   └── AuthContext.tsx # Global authentication state
├── hooks/              # Custom React hooks
│   └── useDocumentTitle.tsx # Document title management
├── pages/              # Route components
│   ├── Home.tsx        # Paginated posts homepage
│   ├── Login.tsx       # User login form
│   ├── Profile.tsx     # User profile with posts
│   ├── Register.tsx    # User registration form
│   └── Settings.tsx    # User settings and avatar upload
├── utils/              # Utility functions and types
│   ├── feedback-data.ts # User feedback messages
│   └── types.ts        # TypeScript type definitions
└── main.tsx           # Application entry point

netlify/functions/      # Backend API endpoints
├── auth/              # Authentication endpoints
├── posts/             # Post management endpoints
├── user/              # User management endpoints
└── uploads/           # File serving endpoints
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/user` - Get current user

### Posts
- `GET /api/posts` - Get paginated posts
- `GET /api/posts/{id}` - Get specific post
- `GET /api/user/{username}/posts` - Get user's posts

### User Management
- `POST /api/user/upload-avatar` - Upload user avatar
- `GET /uploads/avatar/{username}` - Serve user avatar

## Routes

- `/` - Homepage with paginated posts
- `/@{username}` - User profile pages
- `/posts/p/{page}` - Paginated posts view
- `/posts/{id}` - Individual post view
- `/login` - User login (redirects if authenticated)
- `/register` - User registration (redirects if authenticated)
- `/settings` - User settings and profile management
- `*` - 404 error page

## Authentication Flow

1. User registers/logs in through forms
2. JWT token stored in localStorage
3. Token sent in Authorization header for protected endpoints
4. AuthContext manages global authentication state
5. Route protection prevents access to auth pages when logged in

## Development Notes

- Uses custom `useDocumentTitle` hook instead of react-helmet for React 19 compatibility
- File uploads validated for size (2MB max) and type (images only)
- Pagination components are reusable across different pages
- Error handling with user-friendly feedback messages
- Click-outside functionality for dropdown menus

## Contributing

1. Follow existing code conventions
2. Use TypeScript for all new code
3. Test authentication flows thoroughly
4. Ensure responsive design principles
5. Validate all user inputs

## License

This project is part of the Blink demo series.