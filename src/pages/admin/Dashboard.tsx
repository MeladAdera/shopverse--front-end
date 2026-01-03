// 📁 src/pages/admin/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { 
  Users, 
  ShoppingBag, 
  Package, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertCircle
} from 'lucide-react';
import adminService from '../../services/admin.service';

// 🛠️ Define actual data structure
interface DashboardStatsResponse {
  users: {
    total: number;
    // ... may have other properties
  };
  products: {
    total: number;
  };
  orders: {
    total: number;
  };
  revenue: {
    total: number;
  };
  recent_orders: Array<{
    id: number;
    total_amount: string;
    status: string;
    created_at: string;
    customer_name: string;
    items_count: string;
  }>;
  summary?: {
    total_revenue: number;
    total_orders: number;
    total_users: number;
    total_products: number;
  };
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStatsResponse | null>(null);
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

      // 🛠️ Use try-catch for better error handling
      const [statsData, ordersData] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getOrders(1, 5)
      ]);

      console.log('📊 Dashboard stats received:', statsData);
      console.log('📦 Recent orders received:', ordersData);

      // 🛠️ Process different data structures
      if (statsData) {
        setStats(statsData);
        
        // 🛠️ Safely handle recent_orders
        if (statsData.recent_orders && Array.isArray(statsData.recent_orders)) {
          setRecentOrders(statsData.recent_orders);
        } else if (ordersData.data && Array.isArray(ordersData.data)) {
          setRecentOrders(ordersData.data);
        }
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

  // 🛠️ Safely process statistics data
  const statCards = [
    {
      title: 'Total Users',
      value: stats?.users?.total?.toLocaleString() || stats?.summary?.total_users?.toLocaleString() || '0',
      icon: <Users className="text-blue-500" size={24} />,
      change: '+12%',
      trend: 'up' as const,
      color: 'bg-blue-50'
    },
    {
      title: 'Total Orders',
      value: stats?.orders?.total?.toLocaleString() || stats?.summary?.total_orders?.toLocaleString() || '0',
      icon: <ShoppingBag className="text-green-500" size={24} />,
      change: '+8%',
      trend: 'up' as const,
      color: 'bg-green-50'
    },
    {
      title: 'Total Products',
      value: stats?.products?.total?.toLocaleString() || stats?.summary?.total_products?.toLocaleString() || '0',
      icon: <Package className="text-purple-500" size={24} />,
      change: '+5%',
      trend: 'up' as const,
      color: 'bg-purple-50'
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(stats?.revenue?.total || stats?.summary?.total_revenue || 0),
      icon: <DollarSign className="text-yellow-500" size={24} />,
      change: '+15%',
      trend: 'up' as const,
      color: 'bg-yellow-50'
    }
  ];

  // 🛠️ Improved loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Loading data...</p>
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
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-center">
          <AlertCircle className="text-red-500 mr-3" size={24} />
          <div>
            <h3 className="text-lg font-bold text-red-800">Error Occurred</h3>
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's an overview of your store.</p>
      </div>

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
            <div className="flex items-center mt-4">
              {stat.trend === 'up' ? (
                <TrendingUp className="text-green-500 mr-1" size={16} />
              ) : (
                <TrendingDown className="text-red-500 mr-1" size={16} />
              )}
              <span className={`text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change} from last month
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Recent Orders</h2>
          <button 
            onClick={() => window.location.href = '/admin/orders'}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View All →
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
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">#{order.id}</td>
                    <td className="py-3 px-4">{order.customer_name || 'Not specified'}</td>
                    <td className="py-3 px-4 font-medium">${order.total_amount || '0'}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <ShoppingBag className="mx-auto text-gray-400" size={48} />
            <p className="text-gray-500 mt-4">No recent orders</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;