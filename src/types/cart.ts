// src/types/cart.ts

export interface CartItem {
  original_price: any;
  category: string;
  id: number;
  product_id: number;
  product_name: string;
  product_price: string; // يأتي كـ string من الـ API
  product_images: string[];
  product_stock: number;
  quantity: number;
  item_total: number;
}

export interface CartResponse {
  id: number;
  user_id: number;
  items_count: number;
  total_price: number;
  items: CartItem[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  timestamp: string;
  data: T;
}