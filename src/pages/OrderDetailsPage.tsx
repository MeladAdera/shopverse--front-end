// 📁 src/pages/OrderDetailsPage.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderService } from '../services/order.service';
import type { Order, OrderItem } from '../types/order';
import { showToast } from '../utils/toast';

// Interface for order details
interface OrderDetails extends Order {
  items?: OrderItem[];
}

export default function OrderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (id) {
      loadOrder(parseInt(id));
    }
  }, [id]);

  const loadOrder = async (orderId: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await orderService.getOrder(orderId);
      
      if (response.success && response.data) {
        setOrder(response.data);
      } else {
        setError('Order not found');
        showToast.error('Order not found');
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to load order details';
      setError(errorMsg);
      showToast.error(errorMsg);
      console.error('Error loading order:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/orders');
  };

  const handleCancelOrder = async () => {
    if (!id || !order) return;
    
    try {
    const confirmed = window.confirm('Are you sure you want to cancel this order?');
      
      if (!confirmed) return;
      
      setCancelling(true);
      const loadingToast = showToast.loading('Cancelling your order...');
      
      await orderService.cancelOrder(parseInt(id));
      
      showToast.dismiss(loadingToast);
      showToast.success('Order cancelled successfully');
      
      // Refresh order data
      loadOrder(parseInt(id));
      
      // Redirect to orders page after 2 seconds
      setTimeout(() => {
        navigate('/orders');
      }, 2000);
      
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to cancel order';
      showToast.error(errorMsg);
      console.error('Error cancelling order:', err);
    } finally {
      setCancelling(false);
    }
  };

  // Helper function to parse string to number safely
  const parseToNumber = (value: string | number): number => {
    if (typeof value === 'number') return value;
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  };

  // Format currency safely
  const formatCurrency = (amount: string | number): string => {
    const numAmount = parseToNumber(amount);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(numAmount);
  };

  // Format date safely
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid date';
    }
  };

  // Get status display configuration
  const getStatusConfig = (status: string) => {
    const config: Record<string, { text: string; className: string; icon: string }> = {
      pending: {
        text: 'Pending',
        className: 'bg-yellow-50 text-yellow-800 border-yellow-200',
        icon: '⏳'
      },
      processing: {
        text: 'Processing',
        className: 'bg-blue-50 text-blue-800 border-blue-200',
        icon: '⚙️'
      },
      shipped: {
        text: 'Shipped',
        className: 'bg-purple-50 text-purple-800 border-purple-200',
        icon: '🚚'
      },
      delivered: {
        text: 'Delivered',
        className: 'bg-green-50 text-green-800 border-green-200',
        icon: '✅'
      },
      cancelled: {
        text: 'Cancelled',
        className: 'bg-red-50 text-red-800 border-red-200',
        icon: '❌'
      }
    };
    
    return config[status] || {
      text: status,
      className: 'bg-gray-50 text-gray-800 border-gray-200',
      icon: '📦'
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading order details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-red-500 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Order Not Found</h3>
              <p className="text-gray-600 mb-6">{error || 'The order you are looking for does not exist or you do not have permission to view it.'}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button 
                  onClick={handleBack}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                >
                  Back to Orders
                </button>
                <button 
                  onClick={() => navigate('/')}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Go to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(order.status);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium mb-4 group transition-colors"
          >
            <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Orders
          </button>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">New-Order </h1>
                <p className="text-gray-600 mt-2">Placed on {formatDate(order.created_at)}</p>
              </div>
              
              <div className={`inline-flex items-center px-4 py-2.5 rounded-lg border ${statusConfig.className}`}>
                <span className="mr-2">{statusConfig.icon}</span>
                <span className="font-semibold">{statusConfig.text}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Order Items - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900">Order Items</h2>
              </div>
              
              <div className="p-6">
                {order.items && order.items.length > 0 ? (
                  <div className="space-y-4">
                    {order.items.map((item: OrderItem) => (
                      <div key={item.id} className="flex items-start p-4 hover:bg-gray-50 rounded-lg transition-colors">
                        {/* Product Image */}
                        <div className="w-20 h-20 bg-gray-100 rounded-lg shrink-0 overflow-hidden">
                          {item.product_images && item.product_images.length > 0 ? (
                            <img
                              src={item.product_images[0]}
                              alt={item.product_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        
                        {/* Product Details */}
                        <div className="ml-4 flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">{item.product_name}</h3>
                          <div className="mt-2 flex flex-wrap gap-2 items-center">
                            <span className="text-sm text-gray-500">
                              Quantity: <span className="font-medium">{item.quantity}</span>
                            </span>
                            <span className="text-gray-300">•</span>
                            <span className="text-sm text-gray-500">
                              Price: <span className="font-medium">{formatCurrency(item.product_price)}</span>
                            </span>
                          </div>
                        </div>
                        
                        {/* Item Total */}
                        <div className="ml-4 text-right">
                          <div className="font-semibold text-gray-900">{formatCurrency(item.item_total)}</div>
                          <div className="text-sm text-gray-500 mt-1">
                            {formatCurrency(item.product_price)} × {item.quantity}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-300 mb-3">
                      <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                    </div>
                    <p className="text-gray-500">No items found in this order</p>
                  </div>
                )}
              </div>
            </div>

            {/* Shipping Information Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Shipping Information
                </h2>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Shipping Address</label>
                    <p className="font-medium text-gray-900">{order.shipping_address}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">City</label>
                      <p className="font-medium text-gray-900">{order.shipping_city}</p>
                    </div>
                    
                    {order.shipping_phone && (
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Phone Number</label>
                        <p className="font-medium text-gray-900">{order.shipping_phone}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary & Actions - Right Column */}
          <div className="space-y-6">
            {/* Order Summary Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">{formatCurrency(order.total_amount)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Shipping Fee</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                
                {order.status === 'cancelled' && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Cancellation</span>
                    <span className="font-medium text-red-600">Refund Processed</span>
                  </div>
                )}
                
                <hr className="my-4 border-gray-200" />
                
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Total Amount</span>
                  <span className="text-2xl font-bold text-gray-900">{formatCurrency(order.total_amount)}</span>
                </div>
              </div>

              {/* Order Actions */}
              <div className="mt-8 space-y-3">
                {/* Cancel Order Button - Only for pending/processing orders */}
                {(order.status === 'pending' || order.status === 'processing') && (
                  <button
                    onClick={handleCancelOrder}
                    disabled={cancelling}
                    className="w-full py-3.5 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {cancelling ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-red-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Cancelling...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Cancel Order
                      </>
                    )}
                  </button>
                )}
                
                {/* Reorder Button - Only for delivered/cancelled orders */}
                {(order.status === 'delivered' || order.status === 'cancelled') && (
                  <button
                    onClick={() => showToast.success('Reorder feature coming soon!')}
                    className="w-full py-3.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Reorder
                  </button>
                )}
                
                {/* Track Order Button - Only for shipped orders */}
                {order.status === 'shipped' && (
                  <button
                    onClick={() => showToast.success('Track order feature coming soon!')}
                    className="w-full py-3.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition-colors flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Track Order
                  </button>
                )}
                
                {/* Contact Support Button */}
                <button
                  onClick={() => showToast.success('Support contact feature coming soon!')}
                  className="w-full py-3.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Contact Support
                </button>
                
                {/* Continue Shopping Button */}
                <button
                  onClick={() => navigate('/')}
                  className="w-full py-3.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Continue Shopping
                </button>
              </div>
            </div>

            {/* Order Timeline Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Timeline</h2>
              
              <div className="space-y-4">
                {/* Created */}
                <div className="flex items-start">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">Order Placed</p>
                    <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
                  </div>
                </div>
                
                {/* Processing */}
                {order.status !== 'pending' && (
                  <div className="flex items-start">
                    <div className="shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-900">Processing</p>
                      <p className="text-sm text-gray-500">
                        {order.updated_at ? formatDate(order.updated_at) : 'In progress'}
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Status-specific timeline */}
                {order.status === 'shipped' && (
                  <div className="flex items-start">
                    <div className="shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                      <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-900">Shipped</p>
                      <p className="text-sm text-gray-500">On its way to you</p>
                    </div>
                  </div>
                )}
                
                {order.status === 'delivered' && (
                  <div className="flex items-start">
                    <div className="shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-900">Delivered</p>
                      <p className="text-sm text-gray-500">Successfully delivered</p>
                    </div>
                  </div>
                )}
                
                {order.status === 'cancelled' && (
                  <div className="flex items-start">
                    <div className="shrink-0 w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                      <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-900">Cancelled</p>
                      <p className="text-sm text-gray-500">Order was cancelled</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}