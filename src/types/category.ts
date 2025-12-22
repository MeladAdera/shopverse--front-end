// src/types/category.ts
export interface Category {
  id: number;
  name: string;
  image_url: string;
  created_at: string;
  products_count: string; // من الـ API يأتي كـ string
}

export interface CategoryPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CategoriesResponse {
  categories: Category[];
  pagination: CategoryPagination;
}

export interface CategoriesApiResponse {
  success: boolean;
  message: string;
  timestamp: string;
  data: CategoriesResponse;
}