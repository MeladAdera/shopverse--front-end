// 📁 src/hooks/useOrderDetails.ts
import { useState, useEffect, useCallback } from 'react';
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
  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  const fetchOrder = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const orderId = parseInt(id || '0');
      if (!orderId) {
        throw new Error('Invalid order ID');
      }

      const response: ApiResponse<AdminOrder> = await adminService.getOrderById(orderId);
      setOrder(response.data);
      
    } catch (err: any) {
      console.error('❌ Error fetching order:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load order');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const updateOrderStatus = useCallback(async (newStatus: string) => {
    if (!order) return;

    try {
      setUpdating(true);
      await adminService.updateOrderStatus(order.id, newStatus);
      
      // تحديث الـ UI مباشرة
      setOrder({ ...order, status: newStatus as any });
      
    } catch (err: any) {
      console.error('❌ Error updating order:', err);
      setError(err.response?.data?.message || err.message || 'Failed to update order');
    } finally {
      setUpdating(false);
    }
  }, [order]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  return {
    order,
    loading,
    error,
    updating,
    fetchOrder,
    updateOrderStatus
  };
};