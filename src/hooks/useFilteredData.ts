// 📁 hooks/useFilteredData.ts
"use client";

import { useEffect, useRef } from 'react';
import { useFilters } from '@/context/FilterContext';
import { useProductFilter } from './useProductFilter';

export const useFilteredData = () => {
  const { filters, buildQueryParams, isFilterActive } = useFilters();
  const productHook = useProductFilter();
  
  const prevFiltersRef = useRef<string>('');
  
  // Debug logging
  useEffect(() => {
    console.group('🔍 [useFilteredData] Debug Info');
    console.log('📋 Current Filters:', filters);
    console.log('🔗 Is Filter Active:', isFilterActive);
    console.log('📦 Products Count:', productHook.products.length);
    console.log('⏳ Loading:', productHook.loading);
    console.log('❌ Error:', productHook.error);
    console.groupEnd();
  }, [filters, productHook]);

  // عند تغيير الفلاتر، جلب البيانات
  useEffect(() => {
    const currentFilters = JSON.stringify(filters);
    
    // تجنب إعادة الجلب إذا الفلاتر ما تغيرت
    if (currentFilters === prevFiltersRef.current) {
      console.log('⏭️ [useFilteredData] Filters unchanged, skipping fetch');
      return;
    }
    
    console.log('🔄 [useFilteredData] Filters changed, fetching data...');
    console.log('📊 Previous:', JSON.parse(prevFiltersRef.current || '{}'));
    console.log('📊 Current:', filters);
    
    // بناء الـ query params
    const queryParams = buildQueryParams();
    console.log('🔗 Query Params for API:', queryParams);
    
    // جلب البيانات
    productHook.fetchFilteredProducts(queryParams);
    
    // حفظ الحالة السابقة
    prevFiltersRef.current = currentFilters;
    
  }, [filters, buildQueryParams, productHook]);

  return {
    // من useProductFilter
    products: productHook.products,
    loading: productHook.loading,
    error: productHook.error,
    fetchFilteredProducts: productHook.fetchFilteredProducts,
    fetchAllProducts: productHook.fetchAllProducts,
    fetchByCategory: productHook.fetchByCategory,
    fetchByColor: productHook.fetchByColor,
    fetchBySize: productHook.fetchBySize,
    setProducts: productHook.setProducts,
    
    // من useFilters
    filters,
    isFilterActive,
    resetFilters: useFilters().resetFilters,
    setFilters: useFilters().setFilters,
    
    // دوال خاصة بالهوك المدمج
    getFilterSummary: () => {
      const activeFilters = [];
      if (filters.category_id) activeFilters.push(`التصنيف: ${filters.category_id}`);
      if (filters.color) activeFilters.push(`اللون: ${filters.color}`);
      if (filters.size) activeFilters.push(`المقاس: ${filters.size}`);
      if (filters.priceRange.min > 0 || filters.priceRange.max < 500) {
        activeFilters.push(`السعر: ${filters.priceRange.min}-${filters.priceRange.max}`);
      }
      return activeFilters;
    }
  };
};

// 📝 Export type for better TypeScript support
export type UseFilteredDataReturn = ReturnType<typeof useFilteredData>;