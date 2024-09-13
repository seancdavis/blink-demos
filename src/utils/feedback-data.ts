export type FeedbackType = 'success' | 'error'

export const feedbackData: Record<string, { type: FeedbackType; message: string }> = {
  user_pass_req: {
    type: 'error',
    message: 'Username and password are required.',
  },
  pass_no_match: {
    type: 'error',
    message: 'Passwords do not match.',
  },
  pass_too_short: {
    type: 'error',
    message: 'Password must be at least 8 characters.',
  },
}

export type FeedbackName = keyof typeof feedbackData
