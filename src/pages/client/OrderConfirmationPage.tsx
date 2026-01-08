// 📁 src/pages/client/OrderConfirmationPage.tsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderService } from '../../services/order.service';
import { showToast } from '../../utils/toast';

interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price_at_time: string; // تغيير من price إلى price_at_time
  created_at: string;
  product_name: string; // إضافة هذا الحقل
  product_images?: string[]; // إضافة هذا الحقل
}

interface Order {
  id: number;
  user_id: number;
  total_amount: string;
  status: string;
  shipping_address: string;
  shipping_city: string;
  shipping_phone?: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[]; // تغيير من order_items إلى items
}

export default function OrderConfirmationPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      console.log('🔍 Starting fetchOrder for order ID:', id);
      
      if (!id) {
        const errorMsg = 'Order ID is required';
        console.error('❌', errorMsg);
        setError(errorMsg);
        showToast.error(errorMsg);
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Convert URL parameter string to number
        const orderId = parseInt(id, 10);
        console.log('🔍 Parsed orderId:', orderId);
        
        if (isNaN(orderId)) {
          const errorMsg = 'Invalid order ID format';
          console.error('❌', errorMsg);
          setError(errorMsg);
          showToast.error(errorMsg);
          setIsLoading(false);
          return;
        }
        
        console.log('📡 Calling orderService.getOrder...');
        const response = await orderService.getOrder(orderId);
        console.log('📦 Response from API:', response);
        
        if (response.success) {
          console.log('✅ Order data received:', response.data);
          console.log('📋 Items in order:', response.data.items);
          setOrder(response.data);
        } else {
          const errorMsg = response.message || 'Failed to load order details';
          console.error('❌ Server error:', errorMsg);
          setError(errorMsg);
          showToast.error(errorMsg);
        }
      } catch (error: any) {
        console.error('🔥 Error in fetchOrder:', error);
        console.error('🔥 Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        
        const errorMessage = error.response?.data?.message || 
                            error.message || 
                            'An error occurred while loading order details';
        console.error('❌ Final error message:', errorMessage);
        setError(errorMessage);
        showToast.error(errorMessage);
      } finally {
        console.log('🏁 fetchOrder finished');
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  // For debugging
  useEffect(() => {
    if (order) {
      console.log('🔄 Order state updated:', order);
      console.log('🛍️ Items in order:', order.items);
    }
  }, [order]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading order #{id}...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Error Loading Order</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-x-4">
            <Link 
              to="/orders" 
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              View All Orders
            </Link>
            <Link 
              to="/" 
              className="inline-block bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-6">The order you're looking for doesn't exist.</p>
          <Link 
            to="/orders" 
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            View All Orders
          </Link>
        </div>
      </div>
    );
  }

  // حساب المبلغ الإجمالي
  const totalAmount = parseFloat(order.total_amount) || 0;

  // دالة للحصول على صورة المنتج الأولى
  const getProductImage = (item: OrderItem): string => {
    if (item.product_images && item.product_images.length > 0) {
      return `http://localhost:5000${item.product_images[0]}`;
    }
    return 'https://via.placeholder.com/100x100?text=No+Image';
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Success Header */}
      <div className="text-center mb-10">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">🎉 Order Confirmed!</h1>
        <p className="text-lg text-gray-600 mb-2">Thank you for your purchase. Your order has been successfully placed.</p>
        <div className="inline-flex items-center bg-blue-50 text-blue-700 px-6 py-3 rounded-full mt-4">
          <span className="font-semibold mr-2">Order ID:</span>
          <span className="font-bold">#{order.id}</span>
          <span className="mx-3">•</span>
          <span className="font-semibold mr-2">Date:</span>
          <span>{new Date(order.created_at).toLocaleDateString('en-US')}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Order Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Order Items Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-linear-to-r from-blue-50 to-blue-100 px-6 py-4 border-b">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                </svg>
                Order Items ({order.items?.length || 0})
              </h2>
            </div>
            
            <div className="p-6">
              {order.items && order.items.length > 0 ? (
                <div className="space-y-6">
                  {order.items.map((item, index) => {
                    const itemPrice = parseFloat(item.price_at_time || '0');
                    const itemTotal = itemPrice * item.quantity;
                    
                    return (
                      <div 
                        key={item.id || index} 
                        className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-300"
                      >
                        {/* Product Image */}
                        <div className="shrink-0">
                          <img 
                            src={getProductImage(item)} 
                            alt={item.product_name}
                            className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                            onError={(e) => {
                              e.currentTarget.src = 'https://via.placeholder.com/100x100?text=No+Image';
                            }}
                          />
                        </div>
                        
                        {/* Product Details */}
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-bold text-lg text-gray-800 mb-1">
                                {item.product_name}
                              </h3>
                              <div className="flex flex-wrap gap-2 mt-2">
                                <span className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                                  Product ID: {item.product_id}
                                </span>
                                <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                                  Qty: {item.quantity}
                                </span>
                                <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full">
                                  ${itemPrice.toFixed(2)} each
                                </span>
                              </div>
                            </div>
                            
                            {/* Item Total */}
                            <div className="text-right">
                              <p className="text-2xl font-bold text-blue-600">
                                ${itemTotal.toFixed(2)}
                              </p>
                              <p className="text-sm text-gray-500 mt-1">
                                {item.quantity} × ${itemPrice.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                  </div>
                  <p className="text-gray-500 text-lg">No items found in this order.</p>
                </div>
              )}
            </div>
          </div>

          {/* Shipping Information Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-linear-to-r from-green-50 to-green-100 px-6 py-4 border-b">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
                Shipping Information
              </h2>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Shipping Address</p>
                  <p className="text-lg font-semibold text-gray-800">{order.shipping_address}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">City</p>
                  <p className="text-lg font-semibold text-gray-800">{order.shipping_city}</p>
                </div>
                
                {order.shipping_phone && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Phone Number</p>
                    <p className="text-lg font-semibold text-gray-800">{order.shipping_phone}</p>
                  </div>
                )}
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Order Date</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {new Date(order.created_at).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="space-y-8">
          {/* Order Status Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-linear-to-r from-purple-50 to-purple-100 px-6 py-4 border-b">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <svg className="w-6 h-6 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Order Status
              </h2>
            </div>
            
            <div className="p-6">
              <div className="text-center mb-6">
                <span className={`inline-flex items-center px-6 py-3 rounded-full text-lg font-bold ${
                  order.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300' :
                  order.status === 'processing' ? 'bg-blue-100 text-blue-800 border-2 border-blue-300' :
                  order.status === 'shipped' ? 'bg-purple-100 text-purple-800 border-2 border-purple-300' :
                  order.status === 'delivered' ? 'bg-green-100 text-green-800 border-2 border-green-300' :
                  'bg-gray-100 text-gray-800 border-2 border-gray-300'
                }`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
              
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    order.status === 'pending' ? 'bg-yellow-500' :
                    order.status === 'processing' ? 'bg-blue-500' :
                    order.status === 'shipped' ? 'bg-purple-500' :
                    order.status === 'delivered' ? 'bg-green-500' :
                    'bg-gray-500'
                  }`}></div>
                  <span>Your order is currently {order.status}</span>
                </div>
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    order.status === 'pending' || order.status === 'processing' ? 'bg-blue-500' : 'bg-gray-300'
                  }`}></div>
                  <span>We'll notify you when it ships</span>
                </div>
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    order.status === 'delivered' ? 'bg-green-500' : 'bg-gray-300'
                  }`}></div>
                  <span>Estimated delivery: 3-5 business days</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-linear-to-r from-orange-50 to-orange-100 px-6 py-4 border-b">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <svg className="w-6 h-6 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Order Summary
              </h2>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {order.items?.map((item, index) => {
                  const itemPrice = parseFloat(item.price_at_time || '0');
                  const itemTotal = itemPrice * item.quantity;
                  
                  return (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                      <div className="flex-1">
                        <p className="font-medium text-gray-700">{item.product_name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity} × ${itemPrice.toFixed(2)}</p>
                      </div>
                      <p className="font-bold text-gray-800">${itemTotal.toFixed(2)}</p>
                    </div>
                  );
                })}
                
                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${totalAmount.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">$0.00</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">$0.00</span>
                  </div>
                  
                  <div className="flex justify-between pt-4 border-t border-gray-300">
                    <span className="text-xl font-bold text-gray-800">Total</span>
                    <span className="text-2xl font-bold text-blue-600">${totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-4">Payment Method</p>
                <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Cash on Delivery</p>
                    <p className="text-sm text-gray-500">Pay when you receive your order</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="space-y-4">
                <Link 
                  to="/" 
                  className="flex items-center justify-center w-full bg-linear-to-rrom-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-semibold"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                  </svg>
                  Continue Shopping
                </Link>
                
                <Link 
                  to="/orders" 
                  className="flex items-center justify-center w-full bg-linear-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 font-semibold"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                  View All Orders
                </Link>
                
                <button
                  onClick={() => window.print()}
                  className="flex items-center justify-center w-full bg-linear-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-300 font-semibold"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
                  </svg>
                  Print Receipt
                </button>
                
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-center text-sm text-gray-500">
                    Need help? <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">Contact Support</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}