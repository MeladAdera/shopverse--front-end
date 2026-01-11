"use client";

import { createContext, useContext, useState, type ReactNode, useCallback } from 'react';
import type { FilterParams } from '@/services/productApi';

interface FilterState {
  category: string;
  category_id: string;
  color: string;
  size: string;
  style: string;
  brand: string;
  gender: string;
  search: string; // 👈 STEP 1: ADD THIS FIELD
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
  category_id: '',
  color: '',
  size: '',
  style: '',
  brand: '',
  gender: '',
  search: '', // 👈 STEP 1: INITIALIZE EMPTY
  priceRange: {
    min: 0,
    max: 500
  }
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFiltersState] = useState<FilterState>(defaultFilters);
  
  const setFilters = (updates: Partial<FilterState>) => {
    console.log('🔄 [FilterContext] Setting filters:', updates);
    setFiltersState(prev => ({ ...prev, ...updates }));
  };

  const resetFilters = () => {
    console.log('🗑️ [FilterContext] Resetting all filters');
    setFiltersState(defaultFilters);
  };

  const isFilterActive = 
    filters.category !== '' ||
    filters.category_id !== '' ||
    filters.color !== '' ||
    filters.size !== '' ||
    filters.style !== '' ||
    filters.brand !== '' ||
    filters.gender !== '' ||
    filters.search !== '' || // 👈 STEP 1: INCLUDE IN ACTIVE CHECK
    filters.priceRange.min > 0 ||
    filters.priceRange.max < 500;

 const buildQueryParams = (): FilterParams => {
  const params: FilterParams = {};
  
  console.log('🔧 [FilterContext] Building query params with filters:', {
    search: filters.search,
    hasSearch: !!filters.search,
    searchTrimmed: filters.search?.trim()
  });
  
  // 👇 STEP 1: ADD SEARCH PARAMETER - MAKE SURE IT'S INCLUDED
  if (filters.search && filters.search.trim() !== '') {
    params.search = filters.search.trim();
    console.log('🔍 [FilterContext] Adding search param:', params.search);
  }
  
  // ... rest of your params ...
  if (filters.category_id) {
    params.category_id = filters.category_id;
  }
  
  if (filters.color) params.color = filters.color.toLowerCase();
  if (filters.size) params.size = filters.size;
  if (filters.style) params.style = filters.style.toLowerCase();
  if (filters.brand) params.brand = filters.brand;
  if (filters.gender) params.gender = filters.gender.toLowerCase();
  if (filters.priceRange.min > 0) params.min_price = filters.priceRange.min;
  if (filters.priceRange.max < 500) params.max_price = filters.priceRange.max;
  
  console.log('🔧 [FilterContext] Final built params:', params);
  return params;
};

  const applyFiltersAndFetch = useCallback(async (updates?: Partial<FilterState>) => {
    console.log('🔄 [FilterContext] Applying filters and fetching...');
    
    if (updates) {
      setFiltersState(prev => ({ ...prev, ...updates }));
    }
    
    const queryParams = buildQueryParams();
    console.log('📤 Query params for fetch:', queryParams);
    
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