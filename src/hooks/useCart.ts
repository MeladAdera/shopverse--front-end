// src/hooks/useCart.ts
import { useState, useCallback, useEffect } from 'react';
import { cartService } from '../services/cart.service';
import type { CartResponse, ApiResponse } from '../types/cart';

export function useCart() {
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // جلب محتويات السلة
  const fetchCart = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response: ApiResponse<CartResponse> = await cartService.getCart();
      if (response.success) {
        setCart(response.data);
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      setError(err.message || 'فشل في جلب محتويات السلة');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // إضافة إلى السلة
  const addToCart = useCallback(async (productId: number, quantity: number = 1) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await cartService.addToCart(productId, quantity);
      if (response.success) {
        setCart(response.data);
        return { success: true, data: response.data };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'فشلت العملية';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // تحديث الكمية
  const updateCartItem = useCallback(async (itemId: number, quantity: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await cartService.updateCartItem(itemId, quantity);
      if (response.success) {
        setCart(response.data);
        return { success: true, data: response.data };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'فشلت العملية';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // حذف منتج
  const removeFromCart = useCallback(async (itemId: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await cartService.removeFromCart(itemId);
      if (response.success) {
        setCart(response.data);
        return { success: true, data: response.data };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'فشلت العملية';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // تفريغ السلة
  const clearCart = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await cartService.clearCart();
      if (response.success) {
        setCart(null);
        return { success: true, message: response.data.message };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'فشلت العملية';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // جلب عدد المنتجات
  const getCartCount = useCallback(async () => {
    try {
      const response = await cartService.getCartCount();
      return response.data.count;
    } catch (err) {
      return 0;
    }
  }, []);

  // تحميل السلة تلقائياً عند تشغيل الـ hook
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return {
    // الحالة
    cart,
    isLoading,
    error,
    
    // الدوال
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartCount,
    refreshCart: fetchCart,
    
    // مساعدات
    cartItemsCount: cart?.items_count || 0,
    cartTotal: cart?.total_price || 0,
    
    // إعادة تعيين الخطأ
    resetError: () => setError(null)
  };
}