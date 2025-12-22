// src/hooks/useProducts.ts
import { useQuery } from '@tanstack/react-query';
import { productService } from '@/services/product.service';

export const useProducts = (params?: any) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productService.getProducts(params),
  });
};

export const useNewArrivals = (limit: number = 4) => {
  return useQuery({
    queryKey: ['products', 'new-arrivals', limit],
    queryFn: () => productService.getNewArrivals(limit),
  });
};

export const useTopSelling = (limit: number = 4) => {
  return useQuery({
    queryKey: ['products', 'top-selling', limit],
    queryFn: () => productService.getTopSelling(limit),
  });
};
export const useCategoryProducts = (categoryId: number) => {
  return useQuery({
    queryKey: ['products', 'category', categoryId],
    queryFn: () => productService.getProductsByCategory(categoryId),
    enabled: !!categoryId,
  });
}