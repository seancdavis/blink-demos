export type FeedbackType = 'success' | 'error'

export const feedbackData: Record<string, { type: FeedbackType; message: string }> = {
  user_pass_req: {
    type: 'error',
    message: 'Username and password are required.',
  },
}

export type FeedbackName = keyof typeof feedbackData
