// 📁 src/pages/admin/OrderById.tsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Package, 
  User, 
  MapPin, 
  CreditCard,
  Truck,
  CheckCircle,
  ArrowLeft,
  AlertCircle,
  ShoppingBag,
  ImageIcon
} from 'lucide-react';
import { useOrderDetails } from '../../hooks/useOrderDetails';
import { 
  formatCurrency, 
  formatDate, 
  getStatusColor, 
  getStatusText,
  statusOptions,
  getPaymentStatusColor,
  getPaymentStatusText
} from '../../utils/orderFormatters';

const OrderById: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const {
    order,
    loading,
    error,
    updating,
    fetchOrder,
    updateOrderStatus
  } = useOrderDetails(id);

  const handleUpdateStatus = async (newStatus: string) => {
    try {
      await updateOrderStatus(newStatus);
    } catch (err) {
      console.error('Failed to update order status:', err);
    }
  };

  // تحقق من حالة الدفع لعرض التنسيق الصحيح
  const renderPaymentStatus = () => {
    if (!order?.payment_status) return null;
    
    const color = getPaymentStatusColor(order.payment_status);
    const text = getPaymentStatusText(order.payment_status);
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${color}`}>
        {text}
      </span>
    );
  };

  // عرض التحميل
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="bg-white rounded-xl p-8 shadow-sm border">
              <div className="h-32 bg-gray-100 rounded mb-6"></div>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-6 bg-gray-100 rounded mb-4"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // عرض الخطأ
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate('/admin/orders')}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </button>
          
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-center">
              <AlertCircle className="text-red-500 mr-3" size={24} />
              <div>
                <h3 className="text-lg font-bold text-red-800">Error Loading Order</h3>
                <p className="text-red-600 mt-1">{error}</p>
                <button
                  onClick={fetchOrder}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // إذا لم يتم العثور على الطلب
  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate('/admin/orders')}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </button>
          
          <div className="bg-white rounded-xl p-8 text-center shadow-sm border">
            <Package className="h-16 w-16 text-gray-400 mx-auto" />
            <h2 className="text-xl font-bold mt-4">Order Not Found</h2>
            <p className="text-gray-600 mt-2">The order you're looking for doesn't exist.</p>
            <button
              onClick={() => navigate('/admin/orders')}
              className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Browse All Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/admin/orders')}
              className="flex items-center text-blue-600 hover:text-blue-800 mr-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </button>
            <h1 className="text-2xl font-bold">Order #{order.id}</h1>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center space-x-3">
            <span className={`px-4 py-2 rounded-full font-medium ${getStatusColor(order.status)}`}>
              {getStatusText(order.status)}
            </span>
            
            <div className="relative">
              <select
                value={order.status}
                onChange={(e) => handleUpdateStatus(e.target.value)}
                disabled={updating}
                className="px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {statusOptions.map((option: { value: string; label: string }) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {updating && (
                <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center">
                  <div className="h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Order Info Card */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center">
              <ShoppingBag className="h-5 w-5 mr-2 text-gray-600" />
              Order Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500">Order ID</label>
                <p className="font-medium">#{order.id}</p>
              </div>
              
              <div>
                <label className="text-sm text-gray-500">Order Date</label>
                <p className="font-medium">{formatDate(order.created_at)}</p>
              </div>
              
              <div>
                <label className="text-sm text-gray-500">Last Updated</label>
                <p className="font-medium">{formatDate(order.updated_at)}</p>
              </div>
              
              <div>
                <label className="text-sm text-gray-500">Items Count</label>
                <p className="font-medium">{order.items_count} items</p>
              </div>
            </div>
          </div>

          {/* Customer Info Card */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center">
              <User className="h-5 w-5 mr-2 text-gray-600" />
              Customer Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500">Customer Name</label>
                <p className="font-medium">{order.customer_name}</p>
              </div>
              
              <div>
                <label className="text-sm text-gray-500">Email Address</label>
                <p className="font-medium">{order.customer_email || 'Not provided'}</p>
              </div>
              
              <div>
                <label className="text-sm text-gray-500">Phone Number</label>
                <p className="font-medium">{order.customer_phone || 'Not provided'}</p>
              </div>
            </div>
          </div>

          {/* Shipping & Payment Card */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center">
              <Truck className="h-5 w-5 mr-2 text-gray-600" />
              Shipping & Payment
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500 flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  Shipping Address
                </label>
                <p className="font-medium">{order.shipping_address}</p>
                <p className="text-sm text-gray-500">{order.city}</p>
              </div>
              
              <div>
                <label className="text-sm text-gray-500">Payment Status</label>
                {renderPaymentStatus()}
              </div>
              
              <div>
                <label className="text-sm text-gray-500">Payment Method</label>
                <p className="font-medium">{order.payment_method || 'Not specified'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Total Card */}
        <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold mb-2">Order Total</h2>
              <p className="text-3xl font-bold">{formatCurrency(order.total_amount)}</p>
              <p className="text-gray-600 mt-1">Including all taxes and shipping fees</p>
            </div>
            <div className="bg-white p-4 rounded-full">
              <CreditCard className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-bold mb-4">Order Items</h2>
          
          {order.items && order.items.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Product</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Price</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Quantity</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="font-medium">{item.product_name}</div>
                        {item.product_image && (
                          <div className="text-sm text-gray-500 mt-1">
                            <ImageIcon className="inline h-3 w-3 mr-1" />
                            Image available
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4">{formatCurrency(item.unit_price)}</td>
                      <td className="py-4 px-4">{item.quantity}</td>
                      <td className="py-4 px-4 font-medium">
                        {formatCurrency(item.total_price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-400 mx-auto" />
              <p className="text-gray-600 mt-4">No item details available</p>
            </div>
          )}
        </div>

        {/* Order Notes */}
        {order.notes && (
          <div className="bg-white rounded-xl shadow-sm border p-6 mt-6">
            <h2 className="text-lg font-bold mb-4">Order Notes</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">{order.notes}</p>
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mt-6">
          <h2 className="text-lg font-bold mb-4">Order Timeline</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
              <div>
                <p className="font-medium">Order Placed</p>
                <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
              </div>
            </div>
            
            {order.status !== 'pending' && (
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-blue-500 mr-3" />
                <div>
                  <p className="font-medium">Order Confirmed</p>
                  <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
                </div>
              </div>
            )}
            
            {(order.status === 'shipped' || order.status === 'delivered') && (
              <div className="flex items-center">
                <Truck className="h-5 w-5 text-indigo-500 mr-3" />
                <div>
                  <p className="font-medium">Order Shipped</p>
                  <p className="text-sm text-gray-500">{formatDate(order.updated_at)}</p>
                </div>
              </div>
            )}
            
            {order.status === 'delivered' && (
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                <div>
                  <p className="font-medium">Order Delivered</p>
                  <p className="text-sm text-gray-500">{formatDate(order.updated_at)}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderById;