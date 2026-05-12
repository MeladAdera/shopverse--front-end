// 📁 services/filterService.ts
import { isDemoDataEnabled } from '@/mocks/demoFlag';
import { DEMO_FILTER_OPTIONS } from '@/mocks/demoSeed';
import { initDemoState, getFilterCategoriesForDemo } from '@/mocks/demoState';

const API_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
  'http://localhost:5000/api';

export interface Category {
  id: number;
  name: string;
  image_url: string;
  products_count: string;
}

export interface FilterOptions {
  colors: string[];
  sizes: string[];
  brands: string[];
  genders: string[];
  seasons: string[];
  materials: string[];
  styles: string[];
  priceRange: {
    min: string;
    max: string;
  };
}

export const fetchCategories = async (): Promise<Category[]> => {
  if (isDemoDataEnabled()) {
    initDemoState();
    return getFilterCategoriesForDemo();
  }
  try {
    const response = await fetch(`${API_BASE_URL}/admin/categories?limit=50`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.success && data.data.categories) {
      // إزالة التكرارات بناءً على الاسم
      const uniqueCategories = data.data.categories.filter(
        (category: Category, index: number, self: Category[]) =>
          index === self.findIndex((c) => c.name === category.name)
      );
      
      return uniqueCategories;
    }
    return [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

export const fetchFilterOptions = async (): Promise<FilterOptions | null> => {
  if (isDemoDataEnabled()) {
    return DEMO_FILTER_OPTIONS;
  }
  try {
    const response = await fetch(`${API_BASE_URL}/products/filter-options`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.success && data.data) {
      return data.data;
    }
    return null;
  } catch (error) {
    console.error('Error fetching filter options:', error);
    return null;
  }
};