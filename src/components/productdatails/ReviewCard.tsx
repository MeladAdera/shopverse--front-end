// src/components/productdatails/ReviewCard.tsx
import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { reviewService } from '@/services/review.service';
import type { Review } from '@/types/product';

interface ReviewCardProps {
  productId?: number;
  showAll?: boolean; // ✅ جديد: لعرض كل التقييمات أم 6 فقط
}

export function ReviewCard({ productId, showAll = false }: ReviewCardProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // ✅ جديد: لعرض أول 6 تقييمات فقط
  const [showLimited, setShowLimited] = useState(!showAll);
  const displayedReviews = showLimited ? reviews.slice(0, 6) : reviews;

  // 🔥 جلب التقييمات من API
  useEffect(() => {
    const fetchReviews = async () => {
      if (!productId) {
        console.log('⚠️ لا يوجد productId');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const reviewsData = await reviewService.getProductReviews(productId);
        setReviews(reviewsData);
      } catch (err: any) {
        console.error('❌ خطأ في جلب التقييمات:', err);
        setError('Failed to load reviews');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

  // ✅ دالة لتحويل التاريخ
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // ✅ حساب متوسط التقييم
  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  // ✅ عرض حالة التحميل
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div 
            key={i} 
            className="bg-white border border-gray-200 rounded-xl p-6 animate-pulse"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, j) => (
                    <div key={j} className="w-4 h-4 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ✅ عرض حالة الخطأ
  if (error) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 inline-block">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Reviews</h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  // ✅ عرض حالة عدم وجود تقييمات
  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 inline-block">
          <div className="text-gray-400 mb-4">
            <Star className="h-16 w-16 mx-auto opacity-50" />
          </div>
          <h4 className="text-xl font-medium text-gray-900 mb-2">No Reviews Yet</h4>
          <p className="text-gray-600">Be the first to review this product!</p>
          <button className="mt-4 px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors">
            Write a Review
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* إحصائيات التقييمات */}
      <div className="bg-gray-50 rounded-2xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* متوسط التقييم */}
          <div className="text-center md:text-left">
            <div className="text-5xl font-bold mb-2">
              {averageRating.toFixed(1)}
            </div>
            <div className="flex justify-center md:justify-start mb-2">
              {[...Array(5)].map((_, i) => {
                return (
                  <Star
                    key={i}
                    className={`h-6 w-6 ${
                      i < Math.floor(averageRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : i < averageRating
                        ? "fill-yellow-400/50 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                );
              })}
            </div>
            <p className="text-gray-600">
              Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* تفصيل النجوم */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = reviews.filter(r => Math.round(r.rating) === stars).length;
              const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
              
              return (
                <div key={stars} className="flex items-center">
                  <div className="flex items-center w-16">
                    <span className="text-sm text-gray-600 w-6">{stars}</span>
                    <Star className="h-4 w-4 text-yellow-400 ml-1" />
                  </div>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden mx-3">
                    <div
                      className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-10 text-right">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* قائمة التقييمات */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayedReviews.map((review) => (
          <div 
            key={review.id} 
            className="bg-white border border-gray-400 rounded-xl p-6 hover:shadow-md transition-shadow"
          >
            {/* Header مع الاسم والتاريخ */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-semibold text-gray-900">{review.user_name}</h4>
                {review.user_email && (
                  <p className="text-sm text-gray-500">{review.user_email}</p>
                )}
                
                {/* النجوم */}
                <div className="flex items-center gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={
                        i < review.rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>
              </div>
              
              {/* التاريخ */}
              <span className="text-sm text-gray-500">
                {formatDate(review.created_at)}
              </span>
            </div>
            
            {/* نص التعليق */}
            <p className="text-gray-600 leading-relaxed">{review.comment}</p>
            
            {/* Read More إذا التعليق طويل */}
            {review.comment.length > 200 && (
              <button className="text-sm text-blue-600 font-medium mt-3 hover:text-blue-800">
                Read more
              </button>
            )}
          </div>
        ))}
      </div>

      {/* زر عرض المزيد إذا كانت هناك أكثر من 6 تقييمات */}
      {reviews.length > 6 && showLimited && (
        <div className="text-center mt-8">
          <button 
            onClick={() => setShowLimited(false)}
            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full font-medium transition-colors"
          >
            Learn More Reviews ({reviews.length - 6} more)
          </button>
        </div>
      )}

      {/* زر كتابة تقييم */}
      <div className="mt-8 text-center">
        <button
          onClick={() => {
            // يمكنك فتح modal أو الانتقال لصفحة كتابة التقييم
            alert('Write Review feature coming soon!');
          }}
          className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors font-medium inline-flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Write a Review
        </button>
      </div>
    </div>
  );
}