// 📁 hooks/useFilteredData.ts
"use client";

import { useEffect, useRef } from 'react';
import { useFilters } from '@/context/FilterContext';
import { useProductFilter } from './useProductFilter';

export const useFilteredData = () => {
  const { filters, buildQueryParams, isFilterActive } = useFilters();
  const productHook = useProductFilter();
  
  const prevFiltersRef = useRef<string>('');
  const isInitialMount = useRef(true);
  
  // Debug logging - ENHANCED
  useEffect(() => {
    console.group('🔍 [useFilteredData] Enhanced Debug Info');
    console.log('📋 Current Filters:', filters);
    console.log('🔍 Search value:', filters.search);
    console.log('🔗 Is Filter Active:', isFilterActive);
    console.log('📦 Products Count:', productHook.products.length);
    console.log('⏳ Loading:', productHook.loading);
    console.log('❌ Error:', productHook.error);
    console.log('🏷️ Previous filters (string):', prevFiltersRef.current);
    console.groupEnd();
  }, [filters, productHook]);

  // عند تغيير الفلاتر، جلب البيانات - FIXED VERSION
  useEffect(() => {
    const currentFilters = JSON.stringify(filters);
    const previousFilters = prevFiltersRef.current;
    
    console.log('🔄 [useFilteredData] Filter Comparison:', {
      currentFilters,
      previousFilters,
      areEqual: currentFilters === previousFilters,
      isInitial: isInitialMount.current
    });
    
    // 🔥 FIX 1: Always fetch on initial mount
    if (isInitialMount.current) {
      console.log('🚀 [useFilteredData] Initial mount, fetching data...');
      isInitialMount.current = false;
    }
    // 🔥 FIX 2: Check if filters actually changed
    else if (currentFilters === previousFilters) {
      console.log('⏭️ [useFilteredData] Filters unchanged, skipping fetch');
      return;
    }
    
    console.log('🎯 [useFilteredData] Filters changed, fetching data...');
    console.log('📊 Previous:', JSON.parse(previousFilters || '{}'));
    console.log('📊 Current:', filters);
    
    // بناء الـ query params
    const queryParams = buildQueryParams();
    console.log('🔗 Query Params for API:', queryParams);
    
    // 🔥 FIX 3: Only fetch if there are actual query params or it's initial load
    if (Object.keys(queryParams).length > 0 || isInitialMount.current) {
      console.log('📤 [useFilteredData] Calling fetchFilteredProducts with:', queryParams);
      productHook.fetchFilteredProducts(queryParams);
    } else {
      console.log('⚠️ [useFilteredData] No query params, skipping fetch');
    }
    
    // حفظ الحالة السابقة
    prevFiltersRef.current = currentFilters;
    
  }, [filters, buildQueryParams, productHook]);

  // 🔥 FIX 4: Add search to filter summary
  const getFilterSummary = () => {
    const activeFilters = [];
    if (filters.search && filters.search.trim() !== '') {
      activeFilters.push(`Search: ${filters.search}`);
    }
    if (filters.category_id) activeFilters.push(`التصنيف: ${filters.category_id}`);
    if (filters.color) activeFilters.push(`اللون: ${filters.color}`);
    if (filters.size) activeFilters.push(`المقاس: ${filters.size}`);
    if (filters.priceRange.min > 0 || filters.priceRange.max < 500) {
      activeFilters.push(`السعر: ${filters.priceRange.min}-${filters.priceRange.max}`);
    }
    return activeFilters;
  };

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
    setProducts: productHook.products,
    
    // من useFilters
    filters,
    isFilterActive,
    resetFilters: useFilters().resetFilters,
    setFilters: useFilters().setFilters,
    
    // دوال خاصة بالهوك المدمج
    getFilterSummary,
  };
};

// 📝 Export type for better TypeScript support
export type UseFilteredDataReturn = ReturnType<typeof useFilteredData>;