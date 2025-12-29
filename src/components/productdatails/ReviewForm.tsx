import { useState } from "react";
import { Star, X } from "lucide-react";
import { reviewService } from '@/services/review.service';

interface ReviewFormProps {
  productId: number;
  productName?: string;
  onClose: () => void;
  onReviewSubmitted: () => void;
}

export function ReviewForm({ productId, productName, onClose, onReviewSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!rating) {
      setError("Please select a rating");
      return;
    }
    
    if (!comment.trim()) {
      setError("Please write a review comment");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const reviewData = {
        product_id: productId,
        rating,
        comment: comment.trim()
      };

      await reviewService.createReview(reviewData);
      setSuccess(true);
      
      // إعادة تحميل التقييمات بعد ثانية واحدة
      setTimeout(() => {
        onReviewSubmitted();
        onClose();
      }, 1500);
    } catch (err: any) {
      console.error('Error submitting review:', err);
      setError(err.response?.data?.message || 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={handleOverlayClick}>
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h3>
          <p className="text-gray-600 mb-6">Your review has been submitted successfully.</p>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors font-medium w-full"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-2xl p-6 max-w-lg w-full my-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Write a Review</h3>
            {productName && (
              <p className="text-gray-600 mt-1">For: {productName}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Rating Stars */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-3">
              How would you rate this product? *
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                >
                  <Star
                    size={40}
                    className={
                      star <= (hoverRating || rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }
                  />
                </button>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-500">
              <span>Poor</span>
              <span>Excellent</span>
            </div>
          </div>

          {/* Comment */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-3">
              Share your experience *
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you like or dislike? Would you recommend this to others?"
              className="w-full h-40 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              maxLength={1000}
            />
            <div className="text-right text-sm text-gray-500 mt-2">
              {comment.length}/1000 characters
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Tips */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <h4 className="font-medium text-gray-900 mb-2">Tips for writing a great review:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Be specific about what you liked or disliked</li>
              <li>• Mention quality, performance, or features</li>
              <li>• Would you recommend this to a friend?</li>
              <li>• Avoid personal information</li>
            </ul>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors font-medium"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </>
              ) : (
                'Submit Review'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}