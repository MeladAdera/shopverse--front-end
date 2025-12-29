// src/components/ui/UserMenu.tsx
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Settings, ShoppingBag, Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const UserMenu = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
    navigate('/');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!user) {
    return (
      <button 
        onClick={() => navigate('/login')}
        className="hover:bg-gray-100 rounded-full p-2 transition-colors flex items-center gap-2"
      >
        <User className="w-5 h-5 lg:w-6 lg:h-6" />
        <span className="hidden lg:inline text-sm font-medium">Sign In</span>
      </button>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:bg-gray-100 rounded-full p-2 transition-colors"
      >
        <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-medium">
          {getInitials(user.name)}
        </div>
        <span className="hidden lg:inline text-sm font-medium truncate max-w-[100px]">
          {user.name.split(' ')[0]}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border z-50 overflow-hidden">
          {/* User Info */}
          <div className="p-4 border-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center text-sm font-medium">
                {getInitials(user.name)}
              </div>
              <div>
                <p className="font-medium text-sm">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <button
              onClick={() => {
                navigate('/profile');
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
            >
              <User className="w-4 h-4" />
              <span>My Profile</span>
            </button>

            <button
              onClick={() => {
                navigate('/orders');
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>My Orders</span>
            </button>

            <button
              onClick={() => {
                navigate('/wishlist');
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
            >
              <Heart className="w-4 h-4" />
              <span>Wishlist</span>
            </button>

            <button
              onClick={() => {
                navigate('/settings');
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </div>

          {/* Logout Button */}
          <div className="border-t py-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;