// 📁 src/pages/admin/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { 
  Users, 
  ShoppingBag, 
  Package, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  ShoppingCart,
  CreditCard,
  UserCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import adminService from '../../services/admin.service';
import type { 
  ApiResponse,
  DashboardStats} from '../../types/admin.types';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // ✅ الآن نستخدم ApiResponse<DashboardStats>
      const statsResponse: ApiResponse<DashboardStats> = await adminService.getDashboardStats();
      console.log('📊 Dashboard stats response:', statsResponse);
      
      // ✅ البيانات تأتي من statsResponse.data
      const dashboardData = statsResponse.data;
      setStats(dashboardData);
      
      // ✅ recent_orders تأتي من dashboardData.recent_orders
      if (dashboardData.recent_orders && Array.isArray(dashboardData.recent_orders)) {
        setRecentOrders(dashboardData.recent_orders);
      }
      
    } catch (err: any) {
      console.error('❌ Error fetching dashboard data:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(date);
    } catch {
      return dateString;
    }
  };

  // ✅ احصل على البيانات من الهيكل الجديد
  const getStatValue = () => {
    if (!stats) return { users: 0, orders: 0, products: 0, revenue: 0 };
    
    return {
      users: stats.users.total_users || 0,
      orders: stats.orders.total_orders || 0,
      products: stats.products.total_products || 0,
      revenue: stats.revenue.total_revenue || 0
    };
  };

  const statValues = getStatValue();

  // ✅ تحديث statCards مع البيانات الجديدة
  const statCards = [
    {
      title: 'Total Users',
      value: statValues.users.toLocaleString(),
      icon: <Users className="text-blue-500" size={24} />,
      change: `+${stats?.users?.new_users_week || 0} this week`,
      trend: 'up' as const,
      color: 'bg-blue-50',
      description: `${stats?.users?.active_users || 0} active users`,
      onClick: () => navigate('/admin/users')
    },
    {
      title: 'Total Orders',
      value: statValues.orders.toLocaleString(),
      icon: <ShoppingBag className="text-green-500" size={24} />,
      change: `+${stats?.orders?.new_orders_week || 0} this week`,
      trend: 'up' as const,
      color: 'bg-green-50',
      description: `${stats?.orders?.delivered_orders || 0} delivered`,
      onClick: () => navigate('/admin/orders')
    },
    {
      title: 'Total Products',
      value: statValues.products.toLocaleString(),
      icon: <Package className="text-purple-500" size={24} />,
      change: `${stats?.products?.in_stock || 0} in stock`,
      trend: 'up' as const,
      color: 'bg-purple-50',
      description: `${stats?.products?.total_sales || 0} total sales`,
      onClick: () => navigate('/admin/products')
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(statValues.revenue),
      icon: <DollarSign className="text-yellow-500" size={24} />,
      change: formatCurrency(stats?.revenue?.revenue_30_days || 0) + ' (30 days)',
      trend: 'up' as const,
      color: 'bg-yellow-50',
      description: formatCurrency(stats?.revenue?.confirmed_revenue || 0) + ' confirmed',
      onClick: () => navigate('/admin/analytics')
    }
  ];

  // ✅ إحصائيات إضافية
  const additionalStats = [
    {
      title: 'Pending Orders',
      value: stats?.orders?.pending_orders || 0,
      icon: <ShoppingCart className="text-orange-500" size={20} />,
      color: 'bg-orange-50'
    },
    {
      title: 'Confirmed Revenue',
      value: formatCurrency(stats?.revenue?.confirmed_revenue || 0),
      icon: <CreditCard className="text-teal-500" size={20} />,
      color: 'bg-teal-50'
    },
    {
      title: 'Admin Users',
      value: stats?.users?.admin_users || 0,
      icon: <UserCheck className="text-indigo-500" size={20} />,
      color: 'bg-indigo-50'
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 animate-pulse">Dashboard</h1>
          <p className="text-gray-600 animate-pulse">Loading data...</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-100 animate-pulse p-6 rounded-xl h-32"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 m-6">
        <div className="flex items-center">
          <AlertCircle className="text-red-500 mr-3" size={24} />
          <div>
            <h3 className="text-lg font-bold text-red-800">Error Loading Dashboard</h3>
            <p className="text-red-600 mt-1">{error}</p>
            <button
              onClick={fetchDashboardData}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600">
            Welcome back! Here's what's happening with your store today.
            <span className="ml-2 text-sm text-green-600">
              Last updated: {stats && formatDate(new Date().toISOString())}
            </span>
          </p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="mt-4 md:mt-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Refresh Data
        </button>
      </div>

      {/* Main Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div 
            key={index} 
            className={`${stat.color} p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow cursor-pointer`}
            onClick={stat.onClick}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold mt-2">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
              </div>
              <div className="p-3 rounded-full bg-white">
                {stat.icon}
              </div>
            </div>
            <div className="flex items-center mt-4">
              {stat.trend === 'up' ? (
                <TrendingUp className="text-green-500 mr-1" size={16} />
              ) : (
                <TrendingDown className="text-red-500 mr-1" size={16} />
              )}
              <span className={`text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {additionalStats.map((stat, index) => (
          <div key={index} className={`${stat.color} p-4 rounded-lg border`}>
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-white mr-3">
                {stat.icon}
              </div>
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-lg font-bold">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Section */}
      {stats?.summary && (
        <div className="bg-linear-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border">
          <h3 className="text-lg font-bold mb-4">Store Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{formatCurrency(stats.summary.total_revenue)}</p>
              <p className="text-sm text-gray-600">Total Revenue</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{stats.summary.total_orders}</p>
              <p className="text-sm text-gray-600">Total Orders</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{stats.summary.total_users}</p>
              <p className="text-sm text-gray-600">Total Users</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{stats.summary.total_products}</p>
              <p className="text-sm text-gray-600">Total Products</p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Recent Orders</h2>
          <button 
            onClick={() => navigate('/admin/orders')}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
          >
            View All Orders
            <TrendingUp className="ml-1" size={16} />
          </button>
        </div>
        
        {recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">Order ID</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">Customer</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">Amount</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">Date</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">Items</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr 
                    key={order.id} 
                    className="border-b hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/admin/orders/${order.id}`)}
                  >
                    <td className="py-3 px-4 font-medium">#{order.id}</td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">{order.customer_name || 'N/A'}</p>
                        <p className="text-sm text-gray-500">{order.customer_email || ''}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium">${order.total_amount || '0'}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'pending' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {order.status === 'pending' ? 'Pending' :
                         order.status === 'processing' ? 'Processing' :
                         order.status === 'shipped' ? 'Shipped' :
                         order.status === 'delivered' ? 'Delivered' :
                         'Cancelled'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-500">{formatDate(order.created_at)}</td>
                    <td className="py-3 px-4">
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                        {order.items_count || '0'} items
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <ShoppingBag className="mx-auto text-gray-400" size={64} />
            <p className="text-gray-500 mt-4 text-lg">No recent orders</p>
            <p className="text-gray-400 text-sm mt-2">New orders will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;