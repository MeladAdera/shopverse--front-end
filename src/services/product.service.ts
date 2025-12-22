// src/services/product.service.ts
import { api, getImageUrl } from '@/lib/api-client';
import type { ProductsResponse, Product } from '@/types/product';

export const productService = {
    getProductsByCategory: async (categoryId: number): Promise<Product[]> => {
  const products = await productService.getProducts({
    category_id: categoryId
  });
  return products;
},
  getProducts: async (params?: any): Promise<Product[]> => {
    const response = await api.get<ProductsResponse>('/products', { params });
    return response.data.data.products;
  },

  getNewArrivals: async (limit: number = 4): Promise<any[]> => {
    const products = await productService.getProducts({
      sort: 'newest',
      limit
    });
    
    return products.map(product => ({
      id: product.id,
      name: product.name,
      category: product.category_name,
      image: product.image_urls?.[0] ? getImageUrl(product.image_urls[0]) : '/placeholder.jpg',
      price: `$${product.price}`,
      rating: product.average_rating || 4.5,
      ratingStars: '★'.repeat(Math.round(product.average_rating || 4.5)) + 
                  '☆'.repeat(5 - Math.round(product.average_rating || 4.5))
    }));
  },

  getTopSelling: async (limit: number = 4): Promise<any[]> => {
    const products = await productService.getProducts({
      sort: 'popular',
      limit
    });
    
    return products.map(product => ({
      id: product.id,
      name: product.name,
      category: product.category_name,
      image: product.image_urls?.[0] ? getImageUrl(product.image_urls[0]) : '/placeholder.jpg',
      price: `$${product.price}`,
      rating: product.average_rating || 4.5,
      ratingStars: '★'.repeat(Math.round(product.average_rating || 4.5)) + 
                  '☆'.repeat(5 - Math.round(product.average_rating || 4.5))
    }));
    
    
  }
};