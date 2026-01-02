// 📁 frontend/src/layouts/AdminLayout.tsx
import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  LayoutDashboard, 
  Users, 
  ShoppingBag, 
  Tag,
  LogOut,
  Menu,
  X,
  Settings,
  BarChart3,
  Home
} from 'lucide-react';

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const menuItems = [
    { path: '/admin/dashboard', icon: <LayoutDashboard size={20} />, label: 'لوحة التحكم' },
    { path: '/admin/users', icon: <Users size={20} />, label: 'المستخدمين' },
    { path: '/admin/orders', icon: <ShoppingBag size={20} />, label: 'الطلبات' },
    { path: '/admin/categories', icon: <Tag size={20} />, label: 'التصنيفات' },
    { path: '/admin/reports', icon: <BarChart3 size={20} />, label: 'التقارير' },
    { path: '/admin/settings', icon: <Settings size={20} />, label: 'الإعدادات' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`
          hidden lg:flex flex-col w-64 bg-gray-900 text-white
          transition-all duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-64'}
        `}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <LayoutDashboard size={20} />
            </div>
            <h1 className="text-xl font-bold mr-3">ShopVerse Admin</h1>
          </div>
          <p className="text-gray-400 text-sm mt-2">مرحباً، {user?.name}</p>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className="flex items-center p-3 rounded-lg hover:bg-gray-800 transition-colors text-gray-300 hover:text-white"
                >
                  <span className="ml-3">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleGoHome}
            className="flex items-center w-full p-3 rounded-lg hover:bg-gray-800 transition-colors text-gray-300 hover:text-white mb-2"
          >
            <Home size={20} className="ml-3" />
            <span>العودة للمتجر</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center w-full p-3 rounded-lg hover:bg-red-900 transition-colors text-red-300 hover:text-white"
          >
            <LogOut size={20} className="ml-3" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 lg:hidden">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="flex items-center">
              <h1 className="text-lg font-bold">الإدارة</h1>
            </div>
            <div className="w-10"></div> {/* Spacer */}
          </div>
        </header>

        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-40">
            <div 
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="fixed top-0 left-0 bottom-0 w-64 bg-gray-900 text-white p-4">
              {/* Mobile sidebar content */}
              <div className="mb-8">
                <h2 className="text-lg font-bold">ShopVerse Admin</h2>
                <p className="text-sm text-gray-400 mt-1">{user?.name}</p>
              </div>
              <nav>
                <ul className="space-y-2">
                  {menuItems.map((item) => (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className="flex items-center p-3 rounded-lg hover:bg-gray-800 transition-colors"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="ml-3">{item.icon}</span>
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;