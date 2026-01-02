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
  total_amount: string; // ✅ تبقى string لأن الـ backend يرسلها كـ string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shipping_address: string;
  shipping_city: string;
  shipping_phone?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  items_count: string; // ✅ تبقى string لأن الـ backend يرسلها كـ string
  items?: OrderItem[]; // Optional: full items when getting single order
}

// 📦 Response لإنشاء order جديد (Checkout)
export interface CreateOrderResponse {
  success: boolean;
  message: string;
  timestamp: string;
  data: {
    order_id: number;    // ⚠️ مختلف عن id في Order interface
    total_amount: string;
    status: string;
    created_at: string;
  };
}

// 📦 Response لجلب جميع الـ orders
export interface GetOrdersResponse {
  success: boolean;
  message: string;
  timestamp: string;
  data: {
    orders: Order[];     // ⚠️ هنا Order فيها id (ليست order_id)
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

// 📦 Response لجلب order واحد
export interface GetOrderResponse {
  success: boolean;
  message: string;
  timestamp: string;
  data: Order & {        // Order كامل مع items
    items: OrderItem[];
  };
}

// 📦 Response لإلغاء order
export interface CancelOrderResponse {
  success: boolean;
  message: string;
  timestamp: string;
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