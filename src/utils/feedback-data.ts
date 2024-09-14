export type FeedbackType = 'success' | 'error'

export const feedbackData: Record<string, { type: FeedbackType; message: string }> = {
  already_logged_in: {
    type: 'success',
    message: 'You are already logged in.',
  },
  login_required: {
    type: 'error',
    message: 'You must be logged in to access this page.',
  },
  pass_no_match: {
    type: 'error',
    message: 'Passwords do not match.',
  },
  pass_too_short: {
    type: 'error',
    message: 'Password must be at least 8 characters.',
  },
  user_created: {
    type: 'success',
    message: 'User created successfully.',
  },
  user_exists: {
    type: 'error',
    message: 'Username is already taken.',
  },
  user_pass_req: {
    type: 'error',
    message: 'Username and password are required.',
  },
}

export type FeedbackName = keyof typeof feedbackData
