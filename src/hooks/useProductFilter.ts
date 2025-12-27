// 📁 hooks/useProductFilter.ts
import { useState, useEffect, useCallback } from 'react';
import { fetchProductsWithFilters, type FilterParams, type Product } from '@/services/productApi';

export const useProductFilter = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // دالة لجلب المنتجات مع الفلاتر
  const fetchFilteredProducts = useCallback(async (filters: FilterParams) => {
    console.log('🎯 [useProductFilter] Fetching with filters:', filters);
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchProductsWithFilters(filters);
      
      if (result.success) {
        setProducts(result.data.products || []);
        console.log(`✅ [useProductFilter] Found ${result.data.products?.length || 0} products`);
      } else {
        setError(result.message);
        setProducts([]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('❌ [useProductFilter] Error:', errorMessage);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // جلب جميع المنتجات (بدون فلتر)
  const fetchAllProducts = useCallback(async () => {
    console.log('📦 [useProductFilter] Fetching all products');
    await fetchFilteredProducts({});
  }, [fetchFilteredProducts]);

  // جلب منتجات بتصنيف معين
  const fetchByCategory = useCallback(async (category: string) => {
    console.log(`🏷️ [useProductFilter] Fetching by category: ${category}`);
    await fetchFilteredProducts({ category });
  }, [fetchFilteredProducts]);

  // جلب منتجات بلون معين
  const fetchByColor = useCallback(async (color: string) => {
    console.log(`🎨 [useProductFilter] Fetching by color: ${color}`);
    await fetchFilteredProducts({ color });
  }, [fetchFilteredProducts]);

  // جلب منتجات بحجم معين
  const fetchBySize = useCallback(async (size: string) => {
    console.log(`📏 [useProductFilter] Fetching by size: ${size}`);
    await fetchFilteredProducts({ size });
  }, [fetchFilteredProducts]);

  // جلب المنتجات عند تحميل المكون أول مرة
  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  return {
    products,
    loading,
    error,
    fetchFilteredProducts,
    fetchAllProducts,
    fetchByCategory,
    fetchByColor,
    fetchBySize,
    setProducts,
  };}