// 📁 src/types/admin.ts
export interface DashboardStats {
  recent_orders: boolean;
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

export interface AdminOrder {
  id: number;
  total_amount: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
  customer_name: string;
  items_count: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface UserStatusUpdate {
  userId: number;
  active: boolean;
}
export interface UsersListResponse {
  users: AdminUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
