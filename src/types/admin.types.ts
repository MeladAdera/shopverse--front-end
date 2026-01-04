// 📁 src/types/admin.types.ts

// ⭐ واجهة الاستجابة العامة من API - نظيفة تماماً
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  timestamp?: string;
  data: T;
  // 🚫 إزالة كل شيء آخر - stats, pagination, orders لا تنتمي هنا
}

// ⭐ بيانات Dashboard الحقيقية (بناءً على Postman)
export interface DashboardStats {
  users: {
    total_users: number;
    active_users: number;
    admin_users: number;
    new_users_week: number;
  };
  products: {
    total_products: number;
    in_stock: number;
    out_of_stock: number;
    inactive_products: number;
    total_sales: number;
  };
  orders: {
    total_orders: number;
    pending_orders: number;
    confirmed_orders: number;
    shipped_orders: number;
    delivered_orders: number;
    new_orders_week: number;
  };
  revenue: {
    total_revenue: number;
    confirmed_revenue: number;
    revenue_30_days: number;
  };
  recent_orders: RecentOrder[];
  summary: {
    total_revenue: number;
    total_orders: number;
    total_users: number;
    total_products: number;
  };
}

// ⭐ نوع Order المبسط لـ Recent Orders
export interface RecentOrder {
  id: number;
  total_amount: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
  customer_name: string;
  items_count: string;
}

// ⭐ بيانات المستخدم
export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
  active: boolean;
  created_at: string;
  updated_at?: string;
}

// ⭐ البيانات الداخلية للمستخدمين (تأتي داخل data)
export interface UsersData {
  users: AdminUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ⭐ أنواع الطلبات الكاملة
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

// ⭐ البيانات الداخلية للطلبات (تأتي داخل data)
export interface OrdersData {
  orders: AdminOrder[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  // ⚠️ ملاحظة: stats لم تأتِ في البيانات الحقيقية من /orders
  // إذا كانت تأتي من endpoint آخر، ابقها optional
  stats?: OrderStats;
}

// ⭐ إحصائيات الطلبات (لـ endpoint منفصل مثل /orders/stats)
export interface OrderStats {
  total: number;
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  total_revenue: number;
}

// ⭐ عناصر الطلب
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

// ⭐ يمكنك إبقاء الأنواع المساعدة (Helper Types) إن أردت
export type UsersListResponse = ApiResponse<UsersData>;
export type OrdersListResponse = ApiResponse<OrdersData>;
export type DashboardStatsResponse = ApiResponse<DashboardStats>;

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
// 📁 src/types/admin.types.ts

// ⭐ نوع بيانات الفئة (Category)
export interface Category {
  id: number;
  name: string;
  image_url: string;
  created_at: string;
  updated_at?: string;
  product_count?: number; // اختياري
}

// ⭐ البيانات الداخلية للفئات (تأتي داخل data)
export interface CategoriesData {
  categories: Category[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ⭐ نوع طلب إنشاء/تحديث الفئة
export interface CreateCategoryRequest {
  name: string;
  image_url: string;
}

export interface UpdateCategoryRequest {
  name?: string;
  image_url?: string;
}