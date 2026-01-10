// src/services/product.service.ts
import { api } from '@/lib/api-client'; // ✅ استيراد getImageUrl
import type { ProductsResponse, Product, ProductApiResponse } from '@/types/product';

export const productService = {
   getProductById: async (productId: number | string): Promise<Product> => {
    try {
      const response = await api.get<ProductApiResponse>(`/products/${productId}`);
      
      if (!response.data?.success) {
        throw new Error(response.data?.message || 'Product not found');
      }
      
      const product = response.data.data;
      
      // 🔧 **إصلاح مسارات الصور**
      if (product.image_urls && Array.isArray(product.image_urls)) {
        product.image_urls = product.image_urls.map(img => {
          // تحويل uploads إلى public
          if (img && img.includes('/uploads/')) {
            return img.replace('/uploads/', '/public/');
          }
          return img;
        });
      }
      
      console.log('✅ [productService] المنتج بعد الإصلاح:', {
        id: product.id,
        name: product.name,
        image_urls: product.image_urls
      });
      
      return product;
    } catch (error) {
      console.error('❌ [productService] خطأ:', error);
      throw error;
    }
  },
  getProductsByCategory: async (categoryId: number): Promise<Product[]> => {
    console.log('🔍 Getting products for category:', categoryId);
    
    try {
      const products = await productService.getProducts({
        category_id: categoryId
      });
      
      console.log('✅ Found', products.length, 'products for category', categoryId);
      return products;
    } catch (error) {
      console.error('❌ Error getting products by category:', error);
      throw error;
    }
  },
  
  getProducts: async (params?: any): Promise<Product[]> => {
    console.log('🔍 Getting products with params:', params);
    
    try {
      const response = await api.get<ProductsResponse>('/products', { params });
      if (!response.data?.data?.products) {
        console.warn('⚠️ No products in response');
        return [];
      }
      
      const products = response.data.data.products;
      console.log('✅ Retrieved', products.length, 'products');
      
      if (products.length > 0) {
        console.log('📝 Sample product:', {
          id: products[0].id,
          name: products[0].name,
          price: products[0].price,
          category: products[0].category_name
        });
      }
      
      return products;
    } catch (error) {
      console.error('❌ Error fetching products:', error);
      throw error;
    }
  },

  getNewArrivals: async (limit: number = 4): Promise<any[]> => {
    console.log('🔍 Getting new arrivals, limit:', limit);
    
    try {
      const products = await productService.getProducts({
        sort: 'newest',
        limit
      });
      
      console.log('✅ New arrivals:', products.length);
      
      return products.map(product => ({
        id: product.id,
        name: product.name,
        category: product.category_name,
        image: product.image_urls?.[0] || '/placeholder.jpg',
        price: `$${product.price}`,
        rating: product.average_rating || 4.5,
        ratingStars: '★'.repeat(Math.round(product.average_rating || 4.5)) + 
                    '☆'.repeat(5 - Math.round(product.average_rating || 4.5))
      }));
    } catch (error) {
      console.error('❌ Error getting new arrivals:', error);
      throw error;
    }
  },

  getTopSelling: async (limit: number = 4): Promise<any[]> => {
    console.log('🔍 Getting top selling, limit:', limit);
    
    try {
      const products = await productService.getProducts({
        sort: 'popular',
        limit
      });
      
      console.log('✅ Top selling:', products.length);
      
      return products.map(product => ({
        id: product.id,
        name: product.name,
        category: product.category_name,
        image: product.image_urls?.[0] || '/placeholder.jpg',
        price: `$${product.price}`,
        rating: product.average_rating || 4.5,
        ratingStars: '★'.repeat(Math.round(product.average_rating || 4.5)) + 
                    '☆'.repeat(5 - Math.round(product.average_rating || 4.5))
      }));
    } catch (error) {
      console.error('❌ Error getting top selling:', error);
      throw error;
    }
  },
  
};