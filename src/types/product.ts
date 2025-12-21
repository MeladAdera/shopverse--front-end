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
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  timestamp: string;
  data: T;
}

export interface ProductsResponse {
  products: Product[];
  pagination: Pagination;
}

export type ProductsApiResponse = ApiResponse<ProductsResponse>;
export type ProductApiResponse = ApiResponse<Product>;