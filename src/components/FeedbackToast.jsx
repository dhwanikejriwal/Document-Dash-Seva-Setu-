import React from 'react';

export default function FeedbackToast({ toast }) {
  if (!toast || !toast.show) return null;

  const isError = toast.type === 'error';

  return (
    <div
      className={`floating-toast ${isError ? 'error-toast' : ''} show`}
      role="alert"
    >
      <div className="toast-icon">{toast.icon || (isError ? '⚠️' : '✨')}</div>
      <div className="toast-text-box">
        <span className="toast-heading">{toast.heading}</span>
        <span className="toast-sub">{toast.sub}</span>
      </div>
    </div>
  );
}
