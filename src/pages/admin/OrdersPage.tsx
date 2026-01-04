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
import type { 
  AdminOrder, 
  OrderStats, 
  ApiResponse, 
  OrdersData,
  DashboardStats 
} from '../../types/admin.types';

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

  // Fetch orders - ✅ التعديل هنا
  const fetchOrders = async (page = 1, status?: string | null, search?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // ✅ تغيير النوع هنا
      const response: ApiResponse<OrdersData> = await adminService.getOrders(
        page, 
        pagination.limit, 
        status || undefined,
        search || undefined
      );
      
      console.log('📦 Orders response:', response);
      
      // ✅ الآن البيانات تأتي من response.data
      setOrders(response.data.orders || []);
      setPagination({
        page: response.data.pagination.page,
        limit: response.data.pagination.limit,
        total: response.data.pagination.total,
        totalPages: response.data.pagination.totalPages
      });
      
      // ✅ الإحصائيات تأتي من response.data.stats (إذا كانت موجودة)
      if (response.data.stats) {
        setStats(response.data.stats);
      }
    } catch (err: any) {
      console.error('❌ Error fetching orders:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  // Fetch order statistics - ✅ التعديل هنا
  const fetchOrderStats = async () => {
    try {
      
      
      // ✅ الخيار 2: استخدام إحصائيات Dashboard (بناءً على بيانات Postman)
      const response: ApiResponse<DashboardStats> = await adminService.getDashboardStats();
      
      const dashboardOrders = response.data.orders;
      
      // إذا كنت تحتاج OrderStats بالضبط، أنشئه من البيانات
      const orderStats: OrderStats = {
        total: dashboardOrders.total_orders,
        pending: dashboardOrders.pending_orders,
        processing: 0, // قد لا يكون موجوداً في Dashboard
        shipped: dashboardOrders.shipped_orders,
        delivered: dashboardOrders.delivered_orders,
        cancelled: 0, // قد لا يكون موجوداً في Dashboard
        total_revenue: response.data.revenue.total_revenue
      };
      
      setStats(orderStats);
      
    } catch (err) {
      console.error('❌ Error fetching order stats:', err);
    }
  };

  // Update order status - ✅ التعديل هنا (اختياري)
  const handleUpdateStatus = async (orderId: number, status: string) => {
    try {
      // Update UI immediately
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status: status as any } : order
        )
      );

      // ✅ لا نحتاج لمعالجة response لأنها ApiResponse<null>
      await adminService.updateOrderStatus(orderId, status);
      
      // Refresh data
      fetchOrders(pagination.page, statusFilter, searchQuery);
      fetchOrderStats();
      
      console.log(`✅ Order ${orderId} status updated to ${status}`);
      
    } catch (err: any) {
      console.error('❌ Error updating order status:', err);
      
      // Reload data in case of error
      fetchOrders(pagination.page, statusFilter, searchQuery);
      
      setError(err.response?.data?.message || err.message || 'Failed to update order status');
    }
  };

  // View order details - ✅ التعديل هنا
  const handleViewOrder = async (order: AdminOrder) => {
    try {
      // ✅ يمكنك جلب تفاصيل إضافية إذا أردت
      const response = await adminService.getOrderById(order.id);
      console.log('📦 Order details:', response.data);
      
      // انتقل للصفحة مع بيانات الطلب
      navigate(`/admin/orders/${order.id}`, { 
        state: { order: response.data } 
      });
      
    } catch (error) {
      console.error('❌ Error fetching order details:', error);
      // إذا فشل جلب التفاصيل، انتقل بالبيانات الأساسية فقط
      navigate(`/admin/orders/${order.id}`, { 
        state: { order } 
      });
    }
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

  // Quick statistics cards - ✅ تعديل بناءً على البيانات الجديدة
  const statCards = [
    {
      title: 'Total Orders',
      value: stats?.total?.toLocaleString() || '0',
      icon: <Package className="text-blue-500" size={24} />,
      color: 'bg-blue-50',
      change: '+12%'
    },
    {
      title: 'Pending',
      value: stats?.pending?.toLocaleString() || '0',
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

  // ✅ إضافة useEffect لتحميل البيانات
  useEffect(() => {
    fetchOrders(1, statusFilter, searchQuery);
    fetchOrderStats();
  }, []);

  return (
    <div className="space-y-6">
      {/* Title and Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
          <p className="text-gray-600 mt-1">
            Total Orders: <span className="font-bold">{pagination.total}</span>
            {Response && (
              <span className="ml-2 text-sm text-green-600">
                ({Response.name})
              </span>
            )}
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

      {/* Status Distribution Chart */}
      {stats && (
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-bold mb-4">Orders Distribution by Status</h3>
          <div className="flex flex-wrap gap-4">
            {Object.entries({
              pending: stats.pending || 0,
              processing: stats.processing || 0,
              shipped: stats.shipped || 0,
              delivered: stats.delivered || 0,
              cancelled: stats.cancelled || 0
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