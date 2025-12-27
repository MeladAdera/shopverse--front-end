"use client";

import { createContext, useContext, useState, type ReactNode, useCallback } from 'react';
import type { FilterParams } from '@/services/productApi';

interface FilterState {
  category: string;          // اسم التصنيف (للعرض)
  category_id: string;       // 🔥 جديد: ID التصنيف (للتشغيل مع Backend)
  color: string;
  size: string;
  style: string;
  brand: string;
  gender: string;
  priceRange: {
    min: number;
    max: number;
  };
}

interface FilterContextType {
  filters: FilterState;
  setFilters: (updates: Partial<FilterState>) => void;
  resetFilters: () => void;
  isFilterActive: boolean;
  buildQueryParams: () => FilterParams;
  applyFiltersAndFetch: (updates?: Partial<FilterState>) => Promise<void>;
}

const defaultFilters: FilterState = {
  category: '',
  category_id: '', // 🔥 جديد
  color: '',
  size: '',
  style: '',
  brand: '',
  gender: '',
  priceRange: {
    min: 0,
    max: 500
  }
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFiltersState] = useState<FilterState>(defaultFilters);
  

  const setFilters = (updates: Partial<FilterState>) => {
    setFiltersState(prev => ({ ...prev, ...updates }));
  };

  const resetFilters = () => {
    setFiltersState(defaultFilters);
  };

  const isFilterActive = 
    filters.category !== '' ||
    filters.category_id !== '' || // 🔥 أضفنا category_id
    filters.color !== '' ||
    filters.size !== '' ||
    filters.style !== '' ||
    filters.brand !== '' ||
    filters.gender !== '' ||
    filters.priceRange.min > 0 ||
    filters.priceRange.max < 500;

  const buildQueryParams = (): FilterParams => {
    const params: FilterParams = {};
    
    // 🔥 الأولوية لـ category_id إذا كان موجوداً
    if (filters.category_id) {
      params.category_id = filters.category_id;
    } else if (filters.category) {
      // دعم للإصدار القديم
      params.category_id = filters.category_id;
    }
    
    if (filters.color) params.color = filters.color.toLowerCase();
    if (filters.size) params.size = filters.size;
    if (filters.style) params.style = filters.style.toLowerCase();
    if (filters.brand) params.brand = filters.brand;
    if (filters.gender) params.gender = filters.gender.toLowerCase();
    if (filters.priceRange.min > 0) params.min_price = filters.priceRange.min;
    if (filters.priceRange.max < 500) params.max_price = filters.priceRange.max;
    
    console.log('🔧 [FilterContext] Built query params:', params);
    return params;
  };

  const applyFiltersAndFetch = useCallback(async (updates?: Partial<FilterState>) => {
    console.log('🔄 [FilterContext] Applying filters and fetching...');
    
    if (updates) {
      setFiltersState(prev => ({ ...prev, ...updates }));
    }
    
    const queryParams = buildQueryParams();
    console.log('📤 Query params for fetch:', queryParams);
    
    if (Object.keys(queryParams).length > 0) {
      console.log('🔍 Would fetch with filters:', queryParams);
    } else {
      console.log('📦 Would fetch all products');
    }
    
  }, [filters]);

  return (
    <FilterContext.Provider value={{ 
      filters, 
      setFilters, 
      resetFilters, 
      isFilterActive,
      buildQueryParams,
      applyFiltersAndFetch 
    }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
}