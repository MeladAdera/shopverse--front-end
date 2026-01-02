// 📁 src/types/auth.ts
export interface User {
  id: string; // أو number حسب ما يرجع من الـ API
  name: string;
  email: string;
  role: 'user' | 'admin'; // 🆕 إضافة الدور
  active?: boolean; // 🆕 حالة الحساب (من الـ API)
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// 🆕 أنواع جديدة للإدارة
export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
  active: boolean;
  createdAt: string;
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