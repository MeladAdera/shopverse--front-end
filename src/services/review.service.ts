// src/services/review.service.ts
import api from '../lib/axios';
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
      
      // ✅ CORRECT ENDPOINT: POST /api/products/:productId/reviews
      const response = await api.post(
        `/products/${reviewData.product_id}/reviews`,
        {
          rating: reviewData.rating,
          comment: reviewData.comment
        }
      );
      
      console.log('✅ تم إضافة التقييم بنجاح:', response.data);
      
      return {
        success: true,
        message: response.data?.message || 'تم إضافة التقييم بنجاح'
      };
    } catch (error: any) {
      console.error('❌ خطأ في إنشاء التقييم:', error);
      
      // Add more detailed error logging
      if (error.response) {
        console.error('📋 تفاصيل الخطأ:', {
          status: error.response.status,
          data: error.response.data,
          endpoint: error.config?.url
        });
      }
      
      throw error;
    }
  }
};