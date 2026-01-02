// 📁 src/services/order.service.ts
import api from '../lib/axios';
import type {
    CreateOrderResponse,
    GetOrdersResponse,
    GetOrderResponse,
    CancelOrderResponse
} from '../types/order';

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
  async getOrders(params: GetOrdersParams = {}): Promise<GetOrdersResponse> {
    const { page = 1, limit = 10, status } = params;
    
    const response = await api.get<GetOrdersResponse>('/orders', {
      params: {
        page,
        limit,
        ...(status && { status })
      }
    });
    
    return response.data;
  },

  // 🛒 Get single order by ID
  async getOrder(orderId: number): Promise<GetOrderResponse> {
    const response = await api.get<GetOrderResponse>(`/orders/${orderId}`);
    return response.data;
  },

  // 🛒 Create order from cart (checkout)
  async createOrder(orderData: CreateOrderData): Promise<CreateOrderResponse> {
    const response = await api.post<CreateOrderResponse>('/orders/checkout', orderData);
    return response.data;
  },

  // 🛒 Cancel order
  async cancelOrder(orderId: number): Promise<CancelOrderResponse> {
    const response = await api.put<CancelOrderResponse>(`/orders/${orderId}/cancel`);
    return response.data;
  }
};