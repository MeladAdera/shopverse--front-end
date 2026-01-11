// src/types/product.ts

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_urls: string[];
  category_id: number;
  category_name: string;
  active: boolean;
  created_at: string;
  review_count: number;
  average_rating: number;
  
  // ✅ إضافة الحقول الجديدة من بياناتك
  color: string;
  size: string;
  style: string;
  brand: string;
  gender: string;
  season: string;
  material: string;
  sales_count: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProductsResponse {
  message: string;
  success: any;
  data: any;
  products: Product[];
  pagination: Pagination;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  timestamp: string;
  data: T;
}

export type ProductsApiResponse = ApiResponse<ProductsResponse>;

// ✅ إضافة نوع خاص لاستجابة المنتج الواحد
export type ProductApiResponse = ApiResponse<Product>;

// في src/types/product.ts
export interface Review {
  id: number;
  user_id: number;
  user_name: string;
  user_email?: string;
  product_id: number;
  rating: number;
  comment: string;
  created_at: string;
}

export interface ReviewsApiResponse {
  success: boolean;
  message: string;
  timestamp: string;
  data: Review[];
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
}
export interface BrandProductsResponse {
  success: boolean;
  message: string;
  timestamp: string;
  data: {
    products: {
      products: Product[];
      pagination: Pagination;
    }
  }
}