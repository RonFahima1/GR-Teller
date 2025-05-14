import React from 'react';

interface ReviewSectionProps {
  reviewComment: string;
  setReviewComment: (comment: string) => void;
  canApprove: boolean;
  onApproveAll: () => void;
  onRejectAll: () => void;
}

/**
 * Component for KYC review actions and comments
 */
export function ReviewSection({ 
  reviewComment, 
  setReviewComment, 
  canApprove, 
  onApproveAll, 
  onRejectAll 
}: ReviewSectionProps) {
  return (
    <>
      <div className="mb-2 font-semibold">Review Comment</div>
      <textarea
        value={reviewComment}
        onChange={e => setReviewComment(e.target.value)}
        placeholder="Add a comment for KYC review..."
        className="border rounded px-2 py-1 text-sm w-full mb-2"
        rows={2}
        disabled={!canApprove}
      />
      <div className="flex gap-2">
        <button 
          className="px-4 py-2 bg-green-600 text-white rounded" 
          disabled={!canApprove}
          onClick={onApproveAll}
        >
          Approve All
        </button>
        <button 
          className="px-4 py-2 bg-red-600 text-white rounded" 
          disabled={!canApprove}
          onClick={onRejectAll}
        >
          Reject All
        </button>
      </div>
      <div className="mb-6" />
    </>
  );
}
