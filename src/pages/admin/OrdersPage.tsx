// 📁 src/pages/admin/OrdersPage.tsx
import React, { useEffect, useState } from 'react';
import { 
  Package, 
  Truck, 
  RefreshCw, 
  AlertCircle, 
  BarChart3,
  Download
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import adminService from '../../services/admin.service';
import OrdersTable from '../../components/admin/OrdersTable';
import type { AdminOrder, OrdersListResponse, OrderStats } from '../../types/admin.types';

const AdminOrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  });
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Fetch orders
  const fetchOrders = async (page = 1, status?: string | null, search?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response: OrdersListResponse = await adminService.getOrders(
        page, 
        pagination.limit, 
        status || undefined,
        search || undefined
      );
      
      console.log('📦 Orders response:', response);
      
      setOrders(response.orders || []);
      setPagination({
        page: response.pagination.page,
        limit: response.pagination.limit,
        total: response.pagination.total,
        totalPages: response.pagination.totalPages
      });
      
      // Save statistics if available
      if (response.stats) {
        setStats(response.stats);
      }
    } catch (err: any) {
      console.error('❌ Error fetching orders:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  // Fetch order statistics
  const fetchOrderStats = async () => {
    try {
      const statsData = await adminService.getOrderStats();
      setStats(statsData);
    } catch (err) {
      console.error('❌ Error fetching order stats:', err);
    }
  };

  useEffect(() => {
    fetchOrders(1, statusFilter, searchQuery);
    fetchOrderStats();
  }, []);

  // Update order status
  const handleUpdateStatus = async (orderId: number, status: string) => {
    try {
      // Update UI immediately
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status: status as any } : order
        )
      );

      // Send update to server
      await adminService.updateOrderStatus(orderId, status);
      
      // Refresh statistics
      fetchOrderStats();
      
      console.log(`✅ Order ${orderId} status updated to ${status}`);
      
    } catch (err: any) {
      console.error('❌ Error updating order status:', err);
      
      // Reload data in case of error
      fetchOrders(pagination.page, statusFilter, searchQuery);
      
      setError(err.response?.data?.message || 'Failed to update order status');
    }
  };

  // View order details
  const handleViewOrder = (order: AdminOrder) => {
    navigate(`/admin/orders/${order.id}`);
  };

  // Change page
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchOrders(newPage, statusFilter, searchQuery);
    }
  };

  // Export data
  const handleExportOrders = () => {
    // TODO: Implement data export
    alert('Export feature will be added soon');
  };

  // Quick statistics cards
  const statCards = [
    {
      title: 'Total Orders',
      value: stats?.total?.toLocaleString() || '0',
      icon: <Package className="text-blue-500" size={24} />,
      color: 'bg-blue-50',
      change: '+12%'
    },
    {
      title: 'Processing',
      value: stats?.processing?.toLocaleString() || '0',
      icon: <Package className="text-yellow-500" size={24} />,
      color: 'bg-yellow-50',
      change: '+5%'
    },
    {
      title: 'Shipped',
      value: stats?.shipped?.toLocaleString() || '0',
      icon: <Truck className="text-indigo-500" size={24} />,
      color: 'bg-indigo-50',
      change: '+8%'
    },
    {
      title: 'Total Revenue',
      value: stats?.total_revenue ? 
        new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0
        }).format(stats.total_revenue) : '$0',
      icon: <BarChart3 className="text-green-500" size={24} />,
      color: 'bg-green-50',
      change: '+15%'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Title and Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
          <p className="text-gray-600 mt-1">
            Total Orders: <span className="font-bold">{pagination.total}</span>
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => fetchOrders(pagination.page, statusFilter, searchQuery)}
            disabled={loading}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          
          <button
            onClick={handleExportOrders}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center">
            <AlertCircle className="text-red-500 mr-3" size={24} />
            <div>
              <h3 className="text-lg font-bold text-red-800">Error</h3>
              <p className="text-red-600 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className={`${stat.color} p-6 rounded-xl shadow-sm border`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold mt-2">{stat.value}</p>
              </div>
              <div className="p-3 rounded-full bg-white">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Status Distribution Chart (can be enhanced later) */}
      {stats && (
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-bold mb-4">Orders Distribution by Status</h3>
          <div className="flex flex-wrap gap-4">
            {Object.entries({
              pending: stats.pending,
              processing: stats.processing,
              shipped: stats.shipped,
              delivered: stats.delivered,
              cancelled: stats.cancelled
            }).map(([status, count]) => (
              <div key={status} className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${
                  status === 'pending' ? 'bg-yellow-500' :
                  status === 'processing' ? 'bg-blue-500' :
                  status === 'shipped' ? 'bg-indigo-500' :
                  status === 'delivered' ? 'bg-green-500' :
                  'bg-red-500'
                }`} />
                <span className="text-sm text-gray-600 mr-1">
                  {status === 'pending' ? 'Pending' :
                   status === 'processing' ? 'Processing' :
                   status === 'shipped' ? 'Shipped' :
                   status === 'delivered' ? 'Delivered' :
                   'Cancelled'}
                </span>
                <span className="font-bold ml-2">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Orders Table */}
      <OrdersTable
        orders={orders}
        loading={loading}
        onViewOrder={handleViewOrder}
        onUpdateStatus={handleUpdateStatus}
        onPageChange={handlePageChange}
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        onStatusFilter={(status) => {
          setStatusFilter(status);
          fetchOrders(1, status, searchQuery);
        }}
        onSearch={(query) => {
          setSearchQuery(query);
          fetchOrders(1, statusFilter, query);
        }}
      />
    </div>
  );
};

export default AdminOrdersPage;