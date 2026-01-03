// 📁 src/services/adminService.ts
import type { UserFilters } from '@/types/filters.types';
import api from '../lib/axios';
import type { 
  DashboardStats, 
  AdminUser, 
  AdminOrder,
  OrdersListResponse,
  OrderStats,
  UsersListResponse // 🆕 إضافة
} from '../types/admin.types';


class AdminService {
  // 📊 الحصول على إحصائيات لوحة التحكم
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await api.get('/admin/dashboard/stats');
      console.log('📊 Dashboard stats:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('❌ Error fetching dashboard stats:', error);
      throw error;
    }
  }

  // 👥 الحصول على المستخدمين مع التصفية
   async getUsers(
    page: number = 1, 
    limit: number = 10, 
    filters?: UserFilters // 🆕 استخدام النوع الصحيح
  ): Promise<UsersListResponse> {
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
      
      // 🆕 التأكد من أن الاستجابة تطابق UsersListResponse
      return {
        users: response.data.data?.users || response.data.users || [],
        pagination: response.data.data?.pagination || response.data.pagination || {
          page,
          limit,
          total: 0,
          totalPages: 0
        }
      };
    } catch (error) {
      console.error('❌ Error fetching users:', error);
      throw error;
    }
  }

  // 🆕 تحديث حالة المستخدم
  async updateUserStatus(userId: number, active: boolean): Promise<{ 
    success: boolean; 
    message: string;
    data?: any;
  }> {
    try {
      const response = await api.put(`/admin/users/${userId}/status`, { active });
      console.log('✅ User status updated:', response.data);
      
      return {
        success: true,
        message: response.data.message || `User ${active ? 'activated' : 'blocked'} successfully`,
        data: response.data.data
      };
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
  ): Promise<OrdersListResponse> {
    try {
      let url = `/admin/orders?page=${page}&limit=${limit}`;
      
      if (status) {
        url += `&status=${status}`;
      }
      
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }
      
      const response = await api.get(url);
      console.log('📦 Orders data:', response.data);
      
      // 🆕 التأكد من تنسيق الاستجابة
      return {
        orders: response.data.data?.orders || response.data.orders || [],
        pagination: response.data.data?.pagination || response.data.pagination || {
          page,
          limit,
          total: 0,
          totalPages: 0
        },
        stats: response.data.data?.stats || response.data.stats
      };
    } catch (error) {
      console.error('❌ Error fetching orders:', error);
      throw error;
    }
  }

  // 📦 الحصول على طلب محدد
  async getOrderById(orderId: number): Promise<AdminOrder> {
    try {
      const response = await api.get(`/admin/orders/${orderId}`);
      console.log('📦 Order details:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('❌ Error fetching order:', error);
      throw error;
    }
  }

  // 🔄 تحديث حالة الطلب
  async updateOrderStatus(orderId: number, status: string): Promise<{ 
    success: boolean; 
    message: string;
  }> {
    try {
      const response = await api.put(`/admin/orders/${orderId}/status`, { status });
      console.log('✅ Order status updated:', response.data);
      return {
        success: true,
        message: response.data.message || 'Order status updated successfully'
      };
    } catch (error) {
      console.error('❌ Error updating order status:', error);
      throw error;
    }
  }

  // 📊 الحصول على إحصائيات الطلبات
  async getOrderStats(): Promise<OrderStats> {
    try {
      const response = await api.get('/admin/orders/stats');
      console.log('📊 Order stats:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('❌ Error fetching order stats:', error);
      throw error;
    }
  }

  // 🆕 تحديث بيانات المستخدم
  async updateUser(userId: number, userData: Partial<AdminUser>): Promise<AdminUser> {
    try {
      const response = await api.put(`/admin/users/${userId}`, userData);
      console.log('✅ User updated:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('❌ Error updating user:', error);
      throw error;
    }
  }

  // 🆕 إنشاء مستخدم جديد
  async createUser(userData: Partial<AdminUser>): Promise<AdminUser> {
    try {
      const response = await api.post('/admin/users', userData);
      console.log('✅ User created:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('❌ Error creating user:', error);
      throw error;
    }
  }

  // 🆕 حذف مستخدم
  async deleteUser(userId: number): Promise<{ 
    success: boolean; 
    message: string;
  }> {
    try {
      const response = await api.delete(`/admin/users/${userId}`);
      console.log('✅ User deleted:', response.data);
      return {
        success: true,
        message: response.data.message || 'User deleted successfully'
      };
    } catch (error) {
      console.error('❌ Error deleting user:', error);
      throw error;
    }
  }

  // 🆕 جلب مستخدم محدد
  async getUserById(userId: number): Promise<AdminUser> {
    try {
      const response = await api.get(`/admin/users/${userId}`);
      console.log('✅ User details:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('❌ Error fetching user:', error);
      throw error;
    }
  }
}

export default new AdminService();