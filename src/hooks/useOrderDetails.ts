// 📁 src/hooks/useOrderDetails.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import adminService from '../services/admin.service';
import type { AdminOrder, ApiResponse } from '../types/admin.types';

interface UseOrderDetailsReturn {
  order: AdminOrder | null;
  loading: boolean;
  error: string | null;
  updating: boolean;
  fetchOrder: () => Promise<void>;
  updateOrderStatus: (newStatus: string) => Promise<void>;
}

export const useOrderDetails = (id?: string): UseOrderDetailsReturn => {
  const queryClient = useQueryClient();
  const orderId = id ? parseInt(id) : 0;

  // Query لجلب الطلب
  const {
    data: order,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      if (!orderId) return null;
      
      const response: ApiResponse<AdminOrder> = await adminService.getOrderById(orderId);
      
      if (!response.success) {
        throw new Error(response.message || 'فشل في جلب الطلب');
      }
      
      return response.data;
    },
    enabled: !!orderId,
  });

  // Mutation لتحديث الحالة مع Optimistic Updates
  const updateMutation = useMutation({
    mutationFn: async (newStatus: string) => {
      if (!orderId) throw new Error('رقم الطلب غير صالح');
      
      const response = await adminService.updateOrderStatus(orderId, newStatus);
      
      if (!response.success) {
        throw new Error(response.message || 'فشل في تحديث الطلب');
      }
      
      return newStatus;
    },
    
    // ⭐⭐⭐ التحديث الفوري أمام المستخدم ⭐⭐⭐
    onMutate: async (newStatus: string) => {
      // إلغاء أي استعلامات جارية
      await queryClient.cancelQueries({ queryKey: ['order', orderId] });
      
      // حفظ البيانات القديمة للتراجع عند الخطأ
      const previousOrder = queryClient.getQueryData(['order', orderId]);
      
      // تحديث الكاش فوراً (Optimistic Update)
      queryClient.setQueryData(['order', orderId], (oldData: any) => {
        if (!oldData) return oldData;
        
        return {
          ...oldData,
          status: newStatus,
          updated_at: new Date().toISOString(),
        };
      });
      
      // إرجاع البيانات القديمة للتراجع عند الخطأ
      return { previousOrder };
    },
    
    // عند الخطأ، نرجع البيانات القديمة
    onError: (err: any, _newStatus: string, context: any) => {
      if (context?.previousOrder) {
        queryClient.setQueryData(['order', orderId], context.previousOrder);
      }
      
      console.error('❌ فشل تحديث حالة الطلب:', err.message);
    },
    
    // عند النجاح، نحدث باقي البيانات
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['order', orderId] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  const updateOrderStatus = async (newStatus: string) => {
    try {
      await updateMutation.mutateAsync(newStatus);
      return Promise.resolve();
    } catch (error: any) {
      console.error('❌ فشل تحديث حالة الطلب:', error);
      throw error;
    }
  };

  const fetchOrder = async () => {
    await refetch();
  };

  return {
    order: order || null,
    loading: isLoading,
    error: error?.message || null,
    updating: updateMutation.isPending,
    fetchOrder,
    updateOrderStatus,
  };
};