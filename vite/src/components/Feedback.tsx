import { feedbackData, type FeedbackName } from '../utils/feedback-data';

interface FeedbackProps {
  feedbackKey?: FeedbackName | null;
  customMessage?: string;
  type?: 'info' | 'success' | 'error';
}

export function Feedback({ feedbackKey, customMessage, type }: FeedbackProps) {
  if (!feedbackKey && !customMessage) {
    return null;
  }

  const feedback = feedbackKey ? feedbackData[feedbackKey] : null;
  const message = feedback?.message || customMessage || '';
  const feedbackType = feedback?.type || type || 'info';

  return (
    <div className={`feedback container-xs ${feedbackType}`}>
      <small>{message}</small>
    </div>
  );
}