//frontend/src/components/ReviewCard.tsx
export function ReviewCard() {
  // بعد imports وقبل المكون الرئيسي
  interface Review {
    id: number;
    name: string;
    role?: string; // اختياري
    rating: number;
    comment: string;
    date: string;
    avatar?: string; // URL للصورة
  }

  const reviews: Review[] = [
    {
      id: 1,
      name: "Samantha D.",
      rating: 5,
      comment: "I absolutely love this t-shirt! The design is unique and the fabric feels so comfortable. As a fellow designer, I appreciate the attention to detail. It's become my favorite go-to shirt.",
      date: "August 14, 2023",
      avatar: "/avatars/samantha.jpg" // اختياري
    },
    {
      id: 2,
      name: "Samantha D.",
      rating: 5,
      comment: "I absolutely love this t-shirt! The design is unique and the fabric feels so comfortable. As a fellow designer, I appreciate the attention to detail. It's become my favorite go-to shirt.",
      date: "August 14, 2023",
      avatar: "/avatars/samantha.jpg" // اختياري
    },
    {
      id: 3,
      name: "Samantha D.",
      rating: 5,
      comment: "I absolutely love this t-shirt! The design is unique and the fabric feels so comfortable. As a fellow designer, I appreciate the attention to detail. It's become my favorite go-to shirt.",
      date: "August 14, 2023",
      avatar: "/avatars/samantha.jpg" // اختياري
    },
    {
      id: 4,
      name: "Samantha D.",
      rating: 5,
      comment: "I absolutely love this t-shirt! The design is unique and the fabric feels so comfortable. As a fellow designer, I appreciate the attention to detail. It's become my favorite go-to shirt.",
      date: "August 14, 2023",
      avatar: "/avatars/samantha.jpg" // اختياري
    },
    {
      id: 5,
      name: "Samantha D.",
      rating: 5,
      comment: "I absolutely love this t-shirt! The design is unique and the fabric feels so comfortable. As a fellow designer, I appreciate the attention to detail. It's become my favorite go-to shirt.",
      date: "August 14, 2023",
      avatar: "/avatars/samantha.jpg" // اختياري
    },
     {
      id: 6,
      name: "Samantha D.",
      rating: 5,
      comment: "I absolutely love this t-shirt! The design is unique and the fabric feels so comfortable. As a fellow designer, I appreciate the attention to detail. It's become my favorite go-to shirt.",
      date: "August 14, 2023",
      avatar: "/avatars/samantha.jpg" // اختياري
    },
  ];

  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {reviews.map((review) => (
        <div 
          key={review.id} 
          className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
        >
          {/* Header مع الاسم والتاريخ */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="font-semibold text-gray-900">{review.name}</h4>
              
              {/* النجوم */}
              <div className="flex items-center gap-1 mt-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.rating 
                        ? "text-yellow-400 fill-yellow-400" 
                        : "text-gray-300"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
            
           
          </div>
          
          {/* نص التعليق */}
          <p className="text-gray-600 leading-relaxed ">{review.comment}</p>

                  {/* التاريخ */}

          <span className="text-sm text-gray-500">{review.date}</span>

          
          {/* Read More إذا التعليق طويل */}
          {review.comment.length > 150 && (
            <button className="text-sm text-blue-600 font-medium mt-3 hover:text-blue-800 px-5">
              Read more
            </button>
          )}
        </div>
      ))}
    </div>
  );
}