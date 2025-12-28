// src/routes/AllReviewsPage.tsx
import { useParams } from 'react-router-dom';
import { ReviewCard } from '@/components/productdatails/ReviewCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AllReviewsPage() {
  const { id } = useParams<{ id: string }>();
  const productId = id ? parseInt(id) : undefined;
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 md:px-8 py-8">
        {/* زر العودة */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back to Product
          </Button>
        </div>

        {/* عنوان الصفحة */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">All Reviews</h1>
          <p className="text-gray-600 mt-2">Showing all reviews for this product</p>
        </div>

        {/* عرض كل التقييمات */}
        <ReviewCard 
  productId={productId ?? undefined} 
  showAll={true} 
/>
      </div>
    </div>
  );
}