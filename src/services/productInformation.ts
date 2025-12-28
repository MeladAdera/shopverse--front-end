import { getImageUrl } from "@/lib/api-client";
import type { FAQApiResponse, Product, ProductApiResponse, RelatedProductsApiResponse, ReviewsApiResponse } from "@/types/product";

// services/productService.ts
const API_BASE_URL = 'http://localhost:5000/api';

export const productInformation = {
 // جلب بيانات منتج معين
  async getProduct(productId: number | string) {
    try {
      console.log(`📦 [API] Fetching product ID: ${productId}`);
      
      const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Product not found');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch product');
      }

      // ✅ تحويل روابط الصور
      const product = data.data;
      if (product.image_urls) {
        product.image_urls = product.image_urls.map(getImageUrl);
      }

      return {
        success: true,
        message: data.message,
        timestamp: data.timestamp,
        data: product
      };
      
    } catch (error) {
      console.error('❌ [API] Failed to fetch product:', error);
      throw error;
    }
  },

  // جلب التقييمات الخاصة بمنتج معين
  async getProductReviews(productId: number | string): Promise<ReviewsApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}/reviews`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.warn(`⚠️ No reviews found for product ${productId}, returning empty array`);
        return {
          success: true,
          message: 'No reviews found',
          timestamp: new Date().toISOString(),
          data: []
        };
      }

      const data: ReviewsApiResponse = await response.json();
      return data;
    } catch (error) {
      console.error('❌ [API] Failed to fetch reviews:', error);
      return {
        success: false,
        message: 'Failed to fetch reviews',
        timestamp: new Date().toISOString(),
        data: []
      };
    }
  },

  // جلب الأسئلة الشائعة الخاصة بمنتج معين
  async getProductFAQs(productId: number | string): Promise<FAQApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}/faqs`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.warn(`⚠️ No FAQs found for product ${productId}, returning empty array`);
        return {
          success: true,
          message: 'No FAQs found',
          timestamp: new Date().toISOString(),
          data: []
        };
      }

      const data: FAQApiResponse = await response.json();
      return data;
    } catch (error) {
      console.error('❌ [API] Failed to fetch FAQs:', error);
      return {
        success: false,
        message: 'Failed to fetch FAQs',
        timestamp: new Date().toISOString(),
        data: []
      };
    }
  },

  // جلب منتجات مشابهة (بناءً على التصنيف)
  async getRelatedProducts(categoryId: number, excludeProductId: number): Promise<RelatedProductsApiResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/products?category_id=${categoryId}&limit=4`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        console.warn(`⚠️ Failed to fetch related products, returning empty array`);
        return {
          success: true,
          message: 'No related products found',
          timestamp: new Date().toISOString(),
          data: []
        };
      }

      const data = await response.json();
      
      // تصفية المنتج الحالي من النتائج
      const filteredProducts = data.data.products?.filter(
        (product: Product) => product.id !== excludeProductId
      ) || [];
      
      return {
        success: true,
        message: 'Related products fetched successfully',
        timestamp: new Date().toISOString(),
        data: filteredProducts.slice(0, 4) // الحد الأقصى 4 منتجات
      };
    } catch (error) {
      console.error('❌ [API] Failed to fetch related products:', error);
      return {
        success: false,
        message: 'Failed to fetch related products',
        timestamp: new Date().toISOString(),
        data: []
      };
    }
  },

  // إضافة منتج إلى السلة
  async addToCart(productData: {
    productId: number;
    quantity: number;
    color?: string;
    size?: string;
  }) {
    try {
      // هنا يمكنك إضافة منطق إرسال الطلب إلى API السلة
      // هذا مثال فقط - يجب تعديله ليناسب API الخاص بك
      console.log('🛒 [Cart] Adding to cart:', productData);
      
      // تخزين محلي مؤقت
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      cart.push(productData);
      localStorage.setItem('cart', JSON.stringify(cart));
      
      return {
        success: true,
        message: 'Product added to cart successfully',
        timestamp: new Date().toISOString(),
        data: productData
      };
    } catch (error) {
      console.error('❌ [Cart] Failed to add to cart:', error);
      throw error;
    }
  }
};