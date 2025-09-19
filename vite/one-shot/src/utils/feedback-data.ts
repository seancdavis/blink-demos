import type { FeedbackData } from './types';

export const FEEDBACK_MESSAGES: Record<string, FeedbackData> = {
  // Authentication feedback
  LOGIN_SUCCESS: {
    type: 'success',
    message: 'Successfully logged in! Welcome back.',
  },
  LOGIN_FAILED: {
    type: 'error',
    message: 'Invalid username or password. Please try again.',
  },
  REGISTER_SUCCESS: {
    type: 'success',
    message: 'Account created successfully! Welcome to Blink.',
  },
  REGISTER_FAILED: {
    type: 'error',
    message: 'Registration failed. Please check your information and try again.',
  },
  LOGOUT_SUCCESS: {
    type: 'success',
    message: 'You have been logged out successfully.',
  },
  USERNAME_TAKEN: {
    type: 'error',
    message: 'This username is already taken. Please choose another.',
  },

  // Post feedback
  POST_CREATED: {
    type: 'success',
    message: 'Your post has been published successfully!',
  },
  POST_CREATE_FAILED: {
    type: 'error',
    message: 'Failed to create post. Please try again.',
  },
  POST_NOT_FOUND: {
    type: 'error',
    message: 'The requested post could not be found.',
  },

  // Profile feedback
  PROFILE_UPDATED: {
    type: 'success',
    message: 'Your profile has been updated successfully.',
  },
  PROFILE_UPDATE_FAILED: {
    type: 'error',
    message: 'Failed to update profile. Please try again.',
  },
  AVATAR_UPLOADED: {
    type: 'success',
    message: 'Avatar uploaded successfully!',
  },
  AVATAR_UPLOAD_FAILED: {
    type: 'error',
    message: 'Failed to upload avatar. Please try again.',
  },
  AVATAR_TOO_LARGE: {
    type: 'error',
    message: 'Avatar file is too large. Please choose a file under 2MB.',
  },
  AVATAR_INVALID_TYPE: {
    type: 'error',
    message: 'Invalid file type. Please upload an image file.',
  },

  // Form validation feedback
  TITLE_TOO_SHORT: {
    type: 'error',
    message: 'Title must be at least 10 characters long.',
  },
  TITLE_TOO_LONG: {
    type: 'error',
    message: 'Title must be no more than 64 characters long.',
  },
  CONTENT_TOO_SHORT: {
    type: 'error',
    message: 'Content must be at least 10 characters long.',
  },
  CONTENT_TOO_LONG: {
    type: 'error',
    message: 'Content must be no more than 400 characters long.',
  },
  USERNAME_TOO_SHORT: {
    type: 'error',
    message: 'Username must be at least 3 characters long.',
  },
  USERNAME_TOO_LONG: {
    type: 'error',
    message: 'Username must be no more than 30 characters long.',
  },
  PASSWORD_TOO_SHORT: {
    type: 'error',
    message: 'Password must be at least 6 characters long.',
  },

  // Network feedback
  NETWORK_ERROR: {
    type: 'error',
    message: 'Network error. Please check your connection and try again.',
  },
  SERVER_ERROR: {
    type: 'error',
    message: 'Server error. Please try again later.',
  },
  UNAUTHORIZED: {
    type: 'error',
    message: 'You must be logged in to perform this action.',
  },

  // General feedback
  LOADING: {
    type: 'info',
    message: 'Loading...',
  },
  NO_POSTS: {
    type: 'info',
    message: 'No posts found.',
  },
  NO_USER_POSTS: {
    type: 'info',
    message: 'This user hasn\'t posted anything yet.',
  },
};

export function getFeedbackMessage(key: string, fallbackMessage?: string): FeedbackData {
  return FEEDBACK_MESSAGES[key] || {
    type: 'error',
    message: fallbackMessage || 'An unexpected error occurred.',
  };
}