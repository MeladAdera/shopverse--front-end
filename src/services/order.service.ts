// 📁 src/services/order.service.ts
import api from '../lib/axios';

export interface CreateOrderData {
  shipping_address: string;
  shipping_city: string;
  shipping_phone?: string;
}

export interface GetOrdersParams {
  page?: number;
  limit?: number;
  status?: string;
}

export const orderService = {
  // 🛒 Get user orders
  async getOrders(params: GetOrdersParams = {}) {
    const { page = 1, limit = 10, status } = params;
    
    const response = await api.get('/orders', {
      params: {
        page,
        limit,
        ...(status && { status })
      }
    });
    
    return response.data;
  },

  // 🛒 Get single order by ID
  async getOrder(orderId: number) {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  },

  // 🛒 Create order from cart (checkout)
  async createOrder(orderData: CreateOrderData) {
    const response = await api.post('/orders/checkout', orderData);
    return response.data;
  },

  // 🛒 Cancel order
  async cancelOrder(orderId: number) {
    const response = await api.put(`/orders/${orderId}/cancel`);
    return response.data;
  }
};