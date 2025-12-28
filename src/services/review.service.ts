// src/services/review.service.ts
import { api } from '@/lib/api-client';
import type { ReviewsApiResponse, Review } from '@/types/product';

export const reviewService = {
  // 🔥 جلب تقييمات منتج معين
  getProductReviews: async (productId: number | string): Promise<Review[]> => {
    try {
      console.log(`📝 جلب تقييمات المنتج: ${productId}`);
      
      const response = await api.get<ReviewsApiResponse>(`/products/${productId}/reviews`);
      
      if (!response.data?.success) {
        console.warn(`⚠️ لا توجد تقييمات للمنتج ${productId}`);
        return [];
      }
      
      const reviews = response.data.data;
      console.log(`✅ تم جلب ${reviews.length} تقييمات`);
      
      return reviews;
    } catch (error) {
      console.error('❌ خطأ في جلب التقييمات:', error);
      return [];
    }
  },

  // 🔥 إنشاء تقييم جديد
  createReview: async (reviewData: {
    product_id: number;
    rating: number;
    comment: string;
  }): Promise<{ success: boolean; message: string }> => {
    try {
      console.log('📝 إنشاء تقييم جديد:', reviewData);
      
      // يمكنك إضافة التوكن هنا إذا كان API يتطلب مصادقة
      const response = await api.post('/reviews', reviewData);
      
      return {
        success: true,
        message: response.data?.message || 'تم إضافة التقييم بنجاح'
      };
    } catch (error) {
      console.error('❌ خطأ في إنشاء التقييم:', error);
      throw error;
    }
  }
};