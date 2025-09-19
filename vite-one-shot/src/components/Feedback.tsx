import React from 'react';
import type { FeedbackData } from '../utils/types';

interface FeedbackProps {
  feedback: FeedbackData | null;
  onClose?: () => void;
}

export function Feedback({ feedback, onClose }: FeedbackProps) {
  if (!feedback) return null;

  const getIconForType = (type: string) => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✗';
      case 'info':
        return 'ℹ';
      default:
        return '!';
    }
  };

  return (
    <div className={`feedback feedback--${feedback.type}`}>
      <span className="feedback__icon">
        {getIconForType(feedback.type)}
      </span>
      <span className="feedback__message">{feedback.message}</span>
      {onClose && (
        <button
          className="feedback__close"
          onClick={onClose}
          aria-label="Close feedback message"
        >
          ×
        </button>
      )}
    </div>
  );
}