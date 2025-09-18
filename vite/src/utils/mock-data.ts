import { Post, User, PostWithUser } from './types';

// Mock users
export const mockUsers: User[] = [
  {
    id: '1',
    username: 'alice',
    password: 'hashedpassword',
    avatarSrc: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice'
  },
  {
    id: '2',
    username: 'bob',
    password: 'hashedpassword',
    avatarSrc: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob'
  },
  {
    id: '3',
    username: 'charlie',
    password: 'hashedpassword',
    avatarSrc: 'https://api.dicebear.com/7.x/avataaars/svg?seed=charlie'
  },
  {
    id: '4',
    username: 'diana',
    password: 'hashedpassword',
    avatarSrc: 'https://api.dicebear.com/7.x/avataaars/svg?seed=diana'
  }
];

// Mock posts
export const mockPosts: Post[] = [
  {
    id: '1',
    title: 'Getting Started with React',
    content: 'React is a powerful library for building user interfaces. In this post, I\'ll walk through the basics of creating your first React component.',
    userId: '1',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 minutes ago
  },
  {
    id: '2',
    title: 'Understanding JavaScript Promises',
    content: 'Promises are essential for handling asynchronous operations in JavaScript. Let\'s explore how they work and when to use them.',
    userId: '2',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() // 2 hours ago
  },
  {
    id: '3',
    title: 'CSS Grid vs Flexbox',
    content: 'Both CSS Grid and Flexbox are powerful layout tools, but knowing when to use each one is key to effective web design.',
    userId: '3',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString() // 6 hours ago
  },
  {
    id: '4',
    title: 'TypeScript Best Practices',
    content: 'TypeScript adds type safety to JavaScript, but following best practices is crucial for maintaining clean, scalable code.',
    userId: '4',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString() // 12 hours ago
  },
  {
    id: '5',
    title: 'Building APIs with Node.js',
    content: 'Node.js makes it easy to build fast, scalable APIs. Here\'s a guide to creating your first REST API with Express.',
    userId: '1',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() // 1 day ago
  },
  {
    id: '6',
    title: 'Modern JavaScript Features',
    content: 'ES2020 and beyond have introduced many new features that make JavaScript more powerful and expressive.',
    userId: '2',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString() // 2 days ago
  },
  {
    id: '7',
    title: 'React Hooks Deep Dive',
    content: 'Hooks revolutionized React development. Let\'s explore useState, useEffect, and custom hooks in detail.',
    userId: '3',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString() // 3 days ago
  },
  {
    id: '8',
    title: 'Database Design Principles',
    content: 'Good database design is fundamental to building scalable applications. Here are the key principles to follow.',
    userId: '4',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString() // 4 days ago
  },
  {
    id: '9',
    title: 'Web Performance Optimization',
    content: 'Making your website fast is crucial for user experience. Learn the techniques that make the biggest impact.',
    userId: '1',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString() // 5 days ago
  },
  {
    id: '10',
    title: 'Git Workflow Best Practices',
    content: 'Effective Git workflows can make or break a development team. Here\'s how to set up a workflow that scales.',
    userId: '2',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString() // 6 days ago
  },
  {
    id: '11',
    title: 'Testing React Components',
    content: 'Testing is essential for maintaining reliable React applications. Learn how to test components effectively.',
    userId: '3',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString() // 1 week ago
  },
  {
    id: '12',
    title: 'Docker for Developers',
    content: 'Docker simplifies development and deployment. Here\'s everything you need to know to get started.',
    userId: '4',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString() // 8 days ago
  },
  {
    id: '13',
    title: 'Introduction to GraphQL',
    content: 'GraphQL offers a more efficient alternative to REST APIs. Learn the basics and when to use it.',
    userId: '1',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9).toISOString() // 9 days ago
  },
  {
    id: '14',
    title: 'Serverless Architecture',
    content: 'Serverless computing is changing how we build applications. Explore the benefits and challenges.',
    userId: '2',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString() // 10 days ago
  },
  {
    id: '15',
    title: 'Security Best Practices',
    content: 'Security should be built into every application from the ground up. Here are the essential practices.',
    userId: '3',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 11).toISOString() // 11 days ago
  }
];

// Helper function to get posts with user data
export function getPostsWithUsers(): PostWithUser[] {
  return mockPosts.map(post => {
    const user = mockUsers.find(u => u.id === post.userId)!;
    return { ...post, user };
  });
}

// Mock pagination function for client-side use
export function getMockPaginatedPosts(page: number = 1, limit: number = 12) {
  const allPosts = getPostsWithUsers();
  const totalPosts = allPosts.length;
  const totalPages = Math.ceil(totalPosts / limit);
  const currentPage = Math.max(1, Math.min(page, totalPages || 1));
  const offset = (currentPage - 1) * limit;
  const posts = allPosts.slice(offset, offset + limit);

  return {
    posts,
    pagination: {
      currentPage,
      totalPages,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
      totalPosts
    }
  };
}