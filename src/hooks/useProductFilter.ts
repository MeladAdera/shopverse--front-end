// 📁 hooks/useProductFilter.ts
import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchProductsWithFilters, type FilterParams } from '@/services/productApi';

export const useProductFilter = () => {
  const [filters, setFilters] = useState<FilterParams>({});

  const {
    data: productsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['products', filters],
    queryFn: async () => {
      const result = await fetchProductsWithFilters(filters);
      
      if (!result.success) {
        throw new Error(result.message || 'فشل في جلب المنتجات');
      }
      
      return result.data;
    },
  });

  const products = productsData?.products || [];
  const pagination = productsData?.pagination;

  const fetchFilteredProducts = useCallback(async (newFilters: FilterParams) => {
    setFilters(newFilters);
    // لا حاجة لـ refetch() لأن TanStack Query سيتحسس للتغيير تلقائياً
  }, []);

  const fetchAllProducts = useCallback(() => {
    fetchFilteredProducts({});
  }, [fetchFilteredProducts]);

  const fetchByCategory = useCallback((category: string) => {
    fetchFilteredProducts({ category });
  }, [fetchFilteredProducts]);

  const fetchByColor = useCallback((color: string) => {
    fetchFilteredProducts({ color });
  }, [fetchFilteredProducts]);

  const fetchBySize = useCallback((size: string) => {
    fetchFilteredProducts({ size });
  }, [fetchFilteredProducts]);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  return {
    products,
    loading: isLoading,
    error: error?.message || null,
    filters,
    pagination,
    fetchFilteredProducts,
    fetchAllProducts,
    fetchByCategory,
    fetchByColor,
    fetchBySize,
    clearFilters,
    refreshProducts: refetch,
  };
};