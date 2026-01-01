// src/services/cart.service.ts
import api from '../lib/axios';
import type { CartResponse, ApiResponse } from '../types/cart';

export const cartService = {
  // 1. إضافة إلى السلة
  async addToCart(productId: number, quantity: number): Promise<ApiResponse<CartResponse>> {
    const response = await api.post('/cart/items', {
      product_id: productId,
      quantity: quantity
    });
    return response.data;
  },

  // 2. جلب محتويات السلة
  async getCart(): Promise<ApiResponse<CartResponse>> {
    const response = await api.get('/cart/');
    return response.data;
  },

  // 3. تحديث كمية منتج
  async updateCartItem(itemId: number, quantity: number): Promise<ApiResponse<CartResponse>> {
    const response = await api.put(`/cart/items/${itemId}`, {
      quantity: quantity
    });
    return response.data;
  },

  // 4. حذف منتج من السلة
  async removeFromCart(itemId: number): Promise<ApiResponse<CartResponse>> {
    const response = await api.delete(`/cart/items/${itemId}`);
    return response.data;
  },

  // 5. تفريغ السلة
  async clearCart(): Promise<ApiResponse<{ message: string }>> {
    const response = await api.delete('/cart/clear');
    return response.data;
  },

  // 6. عدد المنتجات في السلة
  async getCartCount(): Promise<ApiResponse<{ count: number }>> {
    const response = await api.get('/cart/count');
    return response.data;
  }
};