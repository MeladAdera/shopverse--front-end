// 📁 src/services/adminService.ts
import api from '../lib/axios';
import type { 
  DashboardStats, 
  AdminUser, 
  AdminOrder,
  PaginatedResponse 
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

  // 👥 الحصول على المستخدمين
  async getUsers(page: number = 1, limit: number = 10): Promise<PaginatedResponse<AdminUser>> {
    try {
      const response = await api.get(`/admin/users?page=${page}&limit=${limit}`);
      console.log('👥 Users data:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('❌ Error fetching users:', error);
      throw error;
    }
  }

  // 📦 الحصول على الطلبات
  async getOrders(page: number = 1, limit: number = 10): Promise<PaginatedResponse<AdminOrder>> {
    try {
      const response = await api.get(`/admin/orders?page=${page}&limit=${limit}`);
      console.log('📦 Orders data:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('❌ Error fetching orders:', error);
      throw error;
    }
  }

  // 🔄 تغيير حالة المستخدم
  async updateUserStatus(userId: number, active: boolean): Promise<void> {
    try {
      const response = await api.put(`/admin/users/${userId}/status`, { active });
      console.log('✅ User status updated:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error updating user status:', error);
      throw error;
    }
  }
}

export default new AdminService();