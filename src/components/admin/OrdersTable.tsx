// 📁 src/components/admin/OrdersTable.tsx
import React, { useState } from 'react';
import { 
  Package, 
  Eye,
  MoreVertical,
  Search,
  Filter,
  Calendar,
  User,
  MapPin,
  DollarSign,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import type { AdminOrder } from '../../types/admin.types';

interface OrdersTableProps {
  orders: AdminOrder[];
  loading: boolean;
  onViewOrder: (order: AdminOrder) => void;
  onUpdateStatus: (orderId: number, status: string) => Promise<void>;
  onPageChange?: (page: number) => void;
  currentPage?: number;
  totalPages?: number;
  onStatusFilter?: (status: string | null) => void;
  onSearch?: (query: string) => void;
}

const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  loading,
  onViewOrder,
  onUpdateStatus,
  onPageChange,
  currentPage = 1,
  totalPages = 1,
  onStatusFilter,
  onSearch
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleStatusFilter = (status: string) => {
    setSelectedStatus(status);
    if (onStatusFilter) {
      onStatusFilter(status === 'all' ? null : status);
    }
  };

  // Format date to readable string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Format currency
  const formatCurrency = (amount: string) => {
    const numAmount = parseFloat(amount);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(numAmount);
  };

  // Status update options
  const getStatusOptions = (currentStatus: AdminOrder['status']) => {
    const allStatuses: AdminOrder['status'][] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    return allStatuses.filter(status => status !== currentStatus);
  };

  if (loading && orders.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 🔍 Search and Filter Tools */}
      <div className="bg-white p-4 rounded-xl shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Search size={16} className="inline mr-1" />
              Search
            </label>
            <input
              type="text"
              placeholder="Search by order ID or customer name..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Filter size={16} className="inline mr-1" />
              Order Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => handleStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 📋 Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {orders.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4">No orders found</p>
            <p className="text-sm">Try changing your search criteria</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Order ID</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Customer</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Amount</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Date</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <React.Fragment key={order.id}>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-medium text-gray-900">
                          #{order.id}
                          {order.order_number && (
                            <span className="text-sm text-gray-500 block">
                              {order.order_number}
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {order.items_count} items
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <User className="h-5 w-5 text-gray-400 mr-2" />
                          <div>
                            <p className="font-medium text-gray-900">{order.customer_name}</p>
                            {order.customer_email && (
                              <p className="text-sm text-gray-500">{order.customer_email}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center font-bold">
                          <DollarSign className="h-5 w-5 text-gray-400 mr-2" />
                          {formatCurrency(order.total_amount)}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'shipped' ? 'bg-indigo-100 text-indigo-800' :
                            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {order.status === 'pending' ? 'Pending' :
                             order.status === 'processing' ? 'Processing' :
                             order.status === 'shipped' ? 'Shipped' :
                             order.status === 'delivered' ? 'Delivered' :
                             'Cancelled'}
                          </span>
                          
                          {/* Status update dropdown */}
                          <div className="relative">
                            <select
                              onChange={(e) => onUpdateStatus(order.id, e.target.value)}
                              className="text-sm border border-gray-300 rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                              defaultValue=""
                            >
                              <option value="" disabled>Change Status</option>
                              {getStatusOptions(order.status).map(status => (
                                <option key={status} value={status}>
                                  {status === 'pending' ? 'Mark as Pending' :
                                   status === 'processing' ? 'Mark as Processing' :
                                   status === 'shipped' ? 'Mark as Shipped' :
                                   status === 'delivered' ? 'Mark as Delivered' :
                                   'Cancel Order'}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                          <div>
                            <div>{formatDate(order.created_at)}</div>
                            <div className="text-xs text-gray-500">
                              {new Date(order.created_at).toLocaleTimeString('en-US')}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => onViewOrder(order)}
                            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium flex items-center"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </button>
                          
                          <button
                            onClick={() => setExpandedOrderId(
                              expandedOrderId === order.id ? null : order.id
                            )}
                            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                          >
                            <MoreVertical className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    
                    {/* Expandable Additional Details */}
                    {expandedOrderId === order.id && (
                      <tr className="bg-gray-50">
                        <td colSpan={6} className="px-6 py-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <h4 className="font-medium text-gray-700 mb-2">Shipping Address</h4>
                              <div className="flex items-start">
                                <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                                <div>
                                  <p>{order.shipping_address}</p>
                                  <p className="text-sm text-gray-500">{order.city}</p>
                                  {order.customer_phone && (
                                    <p className="text-sm text-gray-500 mt-1">
                                      📞 {order.customer_phone}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-medium text-gray-700 mb-2">Payment Method</h4>
                              <div className="flex items-center">
                                <div className={`px-2 py-1 rounded text-sm ${
                                  order.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                                  order.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {order.payment_status === 'paid' ? 'Paid' :
                                   order.payment_status === 'pending' ? 'Payment Pending' :
                                   'Payment Failed'}
                                </div>
                              </div>
                              {order.payment_method && (
                                <p className="text-sm text-gray-500 mt-2">
                                  {order.payment_method}
                                </p>
                              )}
                            </div>
                            
                            <div>
                              <h4 className="font-medium text-gray-700 mb-2">Products</h4>
                              <p className="text-sm text-gray-600">
                                {order.items_count} items
                              </p>
                              {order.items && order.items.length > 0 && (
                                <ul className="mt-2 space-y-1">
                                  {order.items.slice(0, 3).map(item => (
                                    <li key={item.id} className="text-sm text-gray-500">
                                      {item.product_name} × {item.quantity}
                                    </li>
                                  ))}
                                  {order.items.length > 3 && (
                                    <li className="text-sm text-gray-400">
                                      +{order.items.length - 3} more items
                                    </li>
                                  )}
                                </ul>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 📄 Pagination */}
        {onPageChange && totalPages > 1 && (
          <div className="border-t border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Page <span className="font-bold">{currentPage}</span> of <span className="font-bold">{totalPages}</span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg flex items-center ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </button>
                
                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => onPageChange(pageNum)}
                        className={`px-3 py-2 rounded-lg text-sm ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg flex items-center ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersTable;