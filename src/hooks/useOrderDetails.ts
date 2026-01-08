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

  // Mutation لتحديث الحالة
  const updateMutation = useMutation({
    mutationFn: async (newStatus: string) => {
      if (!orderId) throw new Error('رقم الطلب غير صالح');
      
      const response = await adminService.updateOrderStatus(orderId, newStatus);
      
      if (!response.success) {
        throw new Error(response.message || 'فشل في تحديث الطلب');
      }
      
      return response.data;
    },
    onSuccess: (updatedOrder) => {
      // تحديث cache
      queryClient.setQueryData(['order', orderId], updatedOrder);
      
      // تحديث قائمة الطلبات أيضاً
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  const updateOrderStatus = async (newStatus: string) => {
    try {
      await updateMutation.mutateAsync(newStatus);
    } catch (error) {
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