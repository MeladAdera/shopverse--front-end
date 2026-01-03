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
  Settings,
  BarChart3,
  Home
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const AdminLayout: React.FC = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Handle user logout
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Navigate to store frontend
  const handleGoHome = () => {
    navigate('/');
  };

  // Admin menu items
  const menuItems = [
    { path: '/admin/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/admin/users', icon: <Users size={20} />, label: 'Users' },
    { path: '/admin/orders', icon: <ShoppingBag size={20} />, label: 'Orders' },
    { path: '/admin/categories', icon: <Tag size={20} />, label: 'Categories' },
    { path: '/admin/reports', icon: <BarChart3 size={20} />, label: 'Reports' },
    { path: '/admin/settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  const NavigationContent = ({ onItemClick }: { onItemClick?: () => void }) => (
    <>
      <div className="mb-8">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <LayoutDashboard size={20} />
          </div>
          <h2 className="text-xl font-bold ml-3">ShopVerse Admin</h2>
        </div>
        <p className="text-gray-400 text-sm mt-2">Welcome, {user?.name}</p>
      </div>

      <nav className="flex-1">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className="flex items-center p-3 rounded-lg hover:bg-gray-800 transition-colors text-gray-300 hover:text-white"
                onClick={onItemClick}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="pt-4 border-t border-gray-800">
        <button
          onClick={() => {
            handleGoHome();
            onItemClick?.();
          }}
          className="flex items-center w-full p-3 rounded-lg hover:bg-gray-800 transition-colors text-gray-300 hover:text-white mb-2"
        >
          <Home size={20} className="mr-3" />
          <span>Back to Store</span>
        </button>
        <button
          onClick={() => {
            handleLogout();
            onItemClick?.();
          }}
          className="flex items-center w-full p-3 rounded-lg hover:bg-red-900 transition-colors text-red-300 hover:text-white"
        >
          <LogOut size={20} className="mr-3" />
          <span>Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar - Hidden on mobile */}
      <aside className="hidden lg:flex flex-col w-64 bg-gray-900 text-white">
        <div className="h-full flex flex-col">
         

          <div className="flex-1 p-4 flex flex-col">
            <NavigationContent />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="bg-white border-b border-gray-200 lg:hidden sticky top-0 z-30">
          <div className="flex items-center justify-between p-4">
            <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
              <SheetTrigger asChild>
                <button
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <Menu size={24} />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-gray-900 text-white border-gray-800 w-64 p-0">
                <SheetHeader className="sr-only">
                  <SheetTitle>Admin Navigation</SheetTitle>
                </SheetHeader>
                <div className="h-full p-4 flex flex-col">
                  <NavigationContent onItemClick={() => setMobileSidebarOpen(false)} />
                </div>
              </SheetContent>
            </Sheet>
            
            <div className="flex items-center">
              <h1 className="text-lg font-bold">Admin Panel</h1>
            </div>
            
            <div className="w-10"></div> {/* Spacer for balance */}
          </div>
        </header>

        {/* Page Content Container */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;