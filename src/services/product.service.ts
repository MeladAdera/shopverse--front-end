// src/services/product.service.ts
import { api, getImageUrl } from '@/lib/api-client';
import { ProductsResponse, Product } from '@/types/product.types';

export const productService = {
  // الحصول على منتجات مع فلترة
  getProducts: async (params?: {
    category_id?: number;
    search?: string;
    page?: number;
    limit?: number;
    sort?: 'newest' | 'price_asc' | 'price_desc' | 'popular';
  }): Promise<Product[]> => {
    const response = await api.get<ProductsResponse>('/products', { params });
    return response.data.data.products;
  },

  // الحصول على New Arrivals
  getNewArrivals: async (limit: number = 4): Promise<Product[]> => {
    const products = await productService.getProducts({
      sort: 'newest',
      limit
    });
    
    // معالجة الصور
    return products.map(product => ({
      ...product,
      image_urls: product.image_urls.map(getImageUrl)
    }));
  },

  // الحصول على Top Selling
  getTopSelling: async (limit: number = 4): Promise<Product[]> => {
    const products = await productService.getProducts({
      sort: 'popular', // أو 'top-selling' - نحتاج اختبار
      limit
    });
    
    return products.map(product => ({
      ...product,
      image_urls: product.image_urls.map(getImageUrl)
    }));
  }
};