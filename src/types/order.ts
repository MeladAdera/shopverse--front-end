// 📁 src/types/order.ts

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  product_price: number;
  product_images: string[];
  quantity: number;
  item_total: number;
}

export interface Order {
  id: number;
  user_id: number;
  total_amount: string; // Decimal as string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shipping_address: string;
  shipping_city: string;
  shipping_phone?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  items_count: string; // From SQL COUNT()
  items?: OrderItem[]; // Optional: full items when getting single order
}

export interface OrderResponse {
  success: boolean;
  message?: string;
  data?: Order | Order[];
  pagination?: Pagination;
}

export interface OrdersResponse {
  success: boolean;
  message?: string;
  data: {
    orders: Order[];
    pagination: Pagination;
  };
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface OrderStatus {
  label: string;
  color: string;
  icon: string;
}