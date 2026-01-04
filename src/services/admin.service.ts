// 📁 src/services/adminService.ts
import type { UserFilters } from '@/types/filters.types';
import api from '../lib/axios';
import type { 
  DashboardStats, 
  AdminUser, 
  AdminOrder,
  OrderStats,
  // 🆕 استيراد الأنواع الجديدة
  ApiResponse,
  UsersData,
  OrdersData,
  CategoriesData,
  CreateCategoryRequest,
  Category,
  UpdateCategoryRequest
} from '../types/admin.types';

class AdminService {
  // 📊 الحصول على إحصائيات لوحة التحكم
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    try {
      const response = await api.get('/admin/dashboard/stats');
      console.log('📊 Dashboard stats response:', response.data);
      // ✅ إرجاع الـ response كاملة
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching dashboard stats:', error);
      throw error;
    }
  }

  // 👥 الحصول على المستخدمين مع التصفية
  async getUsers(
    page: number = 1, 
    limit: number = 10, 
    filters?: UserFilters
  ): Promise<ApiResponse<UsersData>> {
    try {
      const params: any = {
        page,
        limit,
        ...filters
      };

      if (filters?.active !== undefined) {
        params.active = filters.active.toString();
      }

      const response = await api.get('/admin/users', { params });
      console.log('👥 Users response:', response.data);
      
      // ✅ إرجاع الـ response كاملة
      return response.data;
      
    } catch (error) {
      console.error('❌ Error fetching users:', error);
      throw error;
    }
  }

  // 🆕 تحديث حالة المستخدم
  async updateUserStatus(
    userId: number, 
    active: boolean
  ): Promise<ApiResponse<null>> {
    try {
      const response = await api.put(`/admin/users/${userId}/status`, { active });
      console.log('✅ User status updated:', response.data);
      
      // ✅ إرجاع الـ response كاملة
      return response.data;
      
    } catch (error: any) {
      console.error('❌ Error updating user status:', error);
      
      // معالجة الأخطاء المختلفة
      if (error.response?.status === 403) {
        throw new Error('لا يمكنك تعطيل حسابك الخاص');
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('فشل تحديث حالة المستخدم');
      }
    }
  }

  // 📦 الحصول على الطلبات مع التصفية
  async getOrders(
    page: number = 1, 
    limit: number = 10,
    status?: string,
    search?: string
  ): Promise<ApiResponse<OrdersData>> {
    try {
      let url = `/admin/orders?page=${page}&limit=${limit}`;
      
      if (status) {
        url += `&status=${status}`;
      }
      
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }
      
      const response = await api.get(url);
      console.log('📦 Orders response:', response.data);
      
      // ✅ إرجاع الـ response كاملة
      return response.data;
      
    } catch (error) {
      console.error('❌ Error fetching orders:', error);
      throw error;
    }
  }

  // 📦 الحصول على طلب محدد
  async getOrderById(orderId: number): Promise<ApiResponse<AdminOrder>> {
    try {
      const response = await api.get(`/admin/orders/${orderId}`);
      console.log('📦 Order details response:', response.data);
      
      // ✅ إرجاع الـ response كاملة
      return response.data;
      
    } catch (error) {
      console.error('❌ Error fetching order:', error);
      throw error;
    }
  }

  // 🔄 تحديث حالة الطلب
  async updateOrderStatus(
    orderId: number, 
    status: string
  ): Promise<ApiResponse<null>> {
    try {
      const response = await api.put(`/admin/orders/${orderId}/status`, { status });
      console.log('✅ Order status updated:', response.data);
      
      // ✅ إرجاع الـ response كاملة
      return response.data;
      
    } catch (error) {
      console.error('❌ Error updating order status:', error);
      throw error;
    }
  }

  // 📊 الحصول على إحصائيات الطلبات (إذا كان هناك endpoint منفصل)
  async getOrderStats(): Promise<ApiResponse<OrderStats>> {
    try {
      const response = await api.get('/admin/orders/stats');
      console.log('📊 Order stats response:', response.data);
      
      // ✅ إرجاع الـ response كاملة
      return response.data;
      
    } catch (error) {
      console.error('❌ Error fetching order stats:', error);
      throw error;
    }
  }

  // 🆕 تحديث بيانات المستخدم
  async updateUser(
    userId: number, 
    userData: Partial<AdminUser>
  ): Promise<ApiResponse<AdminUser>> {
    try {
      const response = await api.put(`/admin/users/${userId}`, userData);
      console.log('✅ User updated:', response.data);
      
      // ✅ إرجاع الـ response كاملة
      return response.data;
      
    } catch (error) {
      console.error('❌ Error updating user:', error);
      throw error;
    }
  }

  

  

  // 🆕 جلب مستخدم محدد
  async getUserById(userId: number): Promise<ApiResponse<AdminUser>> {
    try {
      const response = await api.get(`/admin/users/${userId}`);
      console.log('✅ User details:', response.data);
      
      // ✅ إرجاع الـ response كاملة
      return response.data;
      
    } catch (error) {
      console.error('❌ Error fetching user:', error);
      throw error;
    }
  }
    // 📂 الحصول على الفئات مع التصفية
  async getCategories(
    page: number = 1, 
    limit: number = 10
  ): Promise<ApiResponse<CategoriesData>> {
    try {
      const response = await api.get(`/admin/categories?page=${page}&limit=${limit}`);
      console.log('📂 Categories response:', response.data);
      
      // ✅ إرجاع الـ response كاملة
      return response.data;
      
    } catch (error) {
      console.error('❌ Error fetching categories:', error);
      throw error;
    }
  }

  // 📂 إنشاء فئة جديدة
  async createCategory(
    categoryData: CreateCategoryRequest
  ): Promise<ApiResponse<Category>> {
    try {
      const response = await api.post('/admin/categories', categoryData);
      console.log('✅ Category created:', response.data);
      
      // ✅ إرجاع الـ response كاملة
      return response.data;
      
    } catch (error) {
      console.error('❌ Error creating category:', error);
      throw error;
    }
  }

  // 📂 تحديث فئة
  async updateCategory(
    categoryId: number,
    updateData: UpdateCategoryRequest
  ): Promise<ApiResponse<Category>> {
    try {
      const response = await api.put(`/admin/categories/${categoryId}`, updateData);
      console.log('✅ Category updated:', response.data);
      
      // ✅ إرجاع الـ response كاملة
      return response.data;
      
    } catch (error) {
      console.error('❌ Error updating category:', error);
      throw error;
    }
  }

  // 📂 حذف فئة
  async deleteCategory(categoryId: number): Promise<ApiResponse<null>> {
    try {
      const response = await api.delete(`/admin/categories/${categoryId}`);
      console.log('✅ Category deleted:', response.data);
      
      // ✅ إرجاع الـ response كاملة
      return response.data;
      
    } catch (error) {
      console.error('❌ Error deleting category:', error);
      throw error;
    }
  }

  // 📂 الحصول على فئة محددة
  async getCategoryById(categoryId: number): Promise<ApiResponse<Category>> {
    try {
      const response = await api.get(`/admin/categories/${categoryId}`);
      console.log('✅ Category details:', response.data);
      
      // ✅ إرجاع الـ response كاملة
      return response.data;
      
    } catch (error) {
      console.error('❌ Error fetching category:', error);
      throw error;
    }
  }
}

export default new AdminService();