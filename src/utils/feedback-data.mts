export type FeedbackType = 'info' | 'success' | 'error'

export const feedbackData: Record<string, { type: FeedbackType; message: string }> = {
  already_logged_in: {
    type: 'info',
    message: 'You are already logged in.',
  },
  avatar_uploaded: {
    type: 'success',
    message: 'Avatar uploaded successfully.',
  },
  login_required: {
    type: 'error',
    message: 'You must be logged in to access this page.',
  },
  login_success: {
    type: 'success',
    message: 'You have been logged in.',
  },
  pass_no_match: {
    type: 'error',
    message: 'Passwords do not match.',
  },
  pass_too_short: {
    type: 'error',
    message: 'Password must be at least 8 characters.',
  },
  post_created: {
    type: 'success',
    message: 'Post created successfully.',
  },
  post_missing_fields: {
    type: 'error',
    message: 'Title and content are required.',
  },
  user_created: {
    type: 'success',
    message: 'User created successfully.',
  },
  user_exists: {
    type: 'error',
    message: 'Username is already taken.',
  },
  user_pass_error: {
    type: 'error',
    message: 'User or password is incorrect.',
  },
  user_pass_req: {
    type: 'error',
    message: 'Username and password are required.',
  },
}

export type FeedbackName = keyof typeof feedbackData
