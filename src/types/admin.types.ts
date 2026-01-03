// 📁 src/types/admin.types.ts

// ⭐ واجهة الاستجابة العامة من API
export interface ApiResponse<T> {
  stats: any;
  pagination: any;
  orders: never[];
  success: boolean;
  message: string;
  timestamp?: string;
  data: T;
}

export interface DashboardStats {
  recent_orders: any[];
  total_users: number;
  total_orders: number;
  total_products: number;
  total_revenue: number;
  summary?: {
    total_revenue: number;
    total_orders: number;
    total_users: number;
    total_products: number;
  };
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
  active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface UserStatusUpdate {
  userId: number;
  active: boolean;
}

// ⭐ البيانات الداخلية للمستخدمين
export interface UsersData {
  users: AdminUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ⭐ الاستجابة الكاملة للمستخدمين
export type UsersListResponse = ApiResponse<UsersData>;

// ⭐ أنواع الطلبات
export interface AdminOrder {
  id: number;
  order_number?: string;
  user_id: number;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  shipping_address: string;
  city: string;
  total_amount: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_method?: string;
  items_count: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
  notes?: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  product_image?: string;
  quantity: number;
  unit_price: string;
  total_price: string;
}

export interface OrderStatusUpdate {
  orderId: number;
  status: AdminOrder['status'];
}

// ⭐ البيانات الداخلية للطلبات
export interface OrdersData {
  orders: AdminOrder[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  stats?: OrderStats;
}

// ⭐ الاستجابة الكاملة للطلبات
export type OrdersListResponse = ApiResponse<OrdersData>;

export interface OrderStats {
  total: number;
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  total_revenue: number;
}

// 🆕 حالة الطلب بالعربية
export const ORDER_STATUS_LABELS: Record<AdminOrder['status'], string> = {
  pending: 'قيد الانتظار',
  processing: 'قيد المعالجة',
  shipped: 'تم الشحن',
  delivered: 'تم التسليم',
  cancelled: 'ملغي'
};

// 🆕 ألوان حالة الطلب
export const ORDER_STATUS_COLORS: Record<AdminOrder['status'], string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

// 🆕 حالة الدفع بالعربية
export const PAYMENT_STATUS_LABELS: Record<AdminOrder['payment_status'], string> = {
  pending: 'قيد الانتظار',
  paid: 'مدفوع',
  failed: 'فشل',
  refunded: 'مسترد'
};

// 🆕 ألوان حالة الدفع
export const PAYMENT_STATUS_COLORS: Record<AdminOrder['payment_status'], string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-800'
};