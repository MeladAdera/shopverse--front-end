// src/types/product.ts
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;              // ✅ رقم (1222)
  stock: number;              // ✅ رقم (8)
  image_urls: string[];       // ✅ مصفوفة ["/uploads/products/..."]
  category_id: number;
  category_name: string;      // ✅ "clothes"
  active: boolean;
  created_at: string;         // ✅ ISO string
  review_count: number;       // ✅ رقم (0)
  average_rating: number;     // ✅ رقم (0)
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProductsResponse {
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