// src/components/ui/header/Header.tsx
import { Menu, Search, ShoppingCart, ChevronRight, User, ShoppingBag, Heart } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import UserMenu from '../UserMenu';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { useState } from 'react';

function Header() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Simple search handler
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchQuery.trim()) {
      // Navigate to products page with search query
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(''); // Clear input after search
    }
  };

  // Handle Enter key press in search input
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  return (
    <>
      {/* Desktop Header - Hidden on mobile */}
      <div className="hidden md:block w-full sticky top-0 bg-white z-40 border-b">
        <div className="w-full flex justify-between items-center gap-8 lg:gap-10 px-4 md:px-[5%] lg:px-10 py-4">
          
          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0">
            <svg width="159" height="24" viewBox="0 0 159 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="cursor-pointer hover:opacity-80 transition-opacity">
              <path d="M11.3867 23.8933C3.65333 23.8667 2.08616e-07 21.4667 0.186667 15.6533H6.82667C6.90667 17.1733 8.18667 18.1067 11.3867 18.1333C14.2133 18.16 15.52 17.36 15.52 16.32C15.52 15.6 15.12 14.8533 12.9333 14.5333L10.0533 14.08C5.81333 13.3867 0.72 12.88 0.72 7.14667C0.72 2.72 4.32 0 11.44 0C17.8667 0 22.3467 1.78667 22.2133 8.18667H15.6267C15.36 6.69333 14.1067 5.76 11.28 5.76C8.82667 5.76 7.81333 6.50667 7.81333 7.52C7.81333 8.16 8.21333 8.93333 9.92 9.2L12.2933 9.6C16.7467 10.3467 22.8533 10.48 22.8533 16.6133C22.8533 21.4933 19.0667 23.92 11.3867 23.8933ZM40.3313 0.746668H47.7179V23.1467H40.3313V15.04H31.6379V23.1467H24.2513V0.746668H31.6379V8.85333H40.3313V0.746668ZM61.8883 23.8933C54.1817 23.8933 49.195 19.12 49.195 11.9467C49.195 4.77333 54.1817 0 61.8883 0C69.595 0 74.5817 4.77333 74.5817 11.9467C74.5817 19.12 69.595 23.8933 61.8883 23.8933ZM61.8883 17.52C64.8217 17.52 67.2483 15.4933 67.2483 11.9467C67.2483 8.4 64.8217 6.37333 61.8883 6.37333C58.955 6.37333 56.5283 8.4 56.5283 11.9467C56.5283 15.4933 58.955 17.52 61.8883 17.52ZM76.0638 23.1467V0.746668H88.7838C94.8904 0.746668 98.5171 3.46667 98.5171 9.49333C98.5171 15.52 94.8904 18.24 88.8104 18.24H83.4504V23.1467H76.0638ZM83.4504 12.1067H88.1438C89.9304 12.1067 91.0771 11.2267 91.0771 9.49333C91.0771 7.76 89.9304 6.88 88.1704 6.88H83.4504V12.1067ZM102.213 23.5733C100.213 23.5733 98.5325 21.92 98.5325 19.9467C98.5325 17.9733 100.213 16.32 102.213 16.32C104.213 16.32 105.893 17.9733 105.893 19.9467C105.893 21.92 104.213 23.5733 102.213 23.5733ZM119.938 23.8933C112.391 23.8933 107.351 19.12 107.351 11.9467C107.351 4.77333 112.391 0 119.938 0C125.405 0 131.005 2.4 131.751 9.97333H124.711C124.098 7.52 122.365 6.37333 119.938 6.37333C117.005 6.37333 114.685 8.56 114.685 11.9467C114.685 15.3333 117.005 17.52 119.938 17.52C122.365 17.52 124.098 16.3733 124.711 13.8667H131.751C131.005 21.4933 125.458 23.8933 119.938 23.8933ZM145.795 23.8933C138.088 23.8933 133.101 19.12 133.101 11.9467C133.101 4.77333 138.088 0 145.795 0C153.501 0 158.488 4.77333 158.488 11.9467C158.488 19.12 153.501 23.8933 145.795 23.8933ZM145.795 17.52C148.728 17.52 151.155 15.4933 151.155 11.9467C151.155 8.4 148.728 6.37333 145.795 6.37333C142.861 6.37333 140.435 8.4 140.435 11.9467C140.435 15.4933 142.861 17.52 145.795 17.52Z" 
                fill="black"
              />
            </svg>
          </Link>
          
          {/* Navigation */}
          <div className="flex justify-between items-center shrink-0 gap-4 lg:gap-6">
            <button 
              onClick={() => navigate('/products')}
              className="text-[16px] lg:text-[18px] hover:text-gray-600 transition-colors px-3 lg:px-4 py-2 font-medium"
            >
              Shop
            </button>
            <button 
              onClick={() => navigate('/sale')}
              className="text-[16px] lg:text-[18px] hover:text-gray-600 transition-colors px-3 lg:px-4 py-2 font-medium"
            >
              On Sale
            </button>
            <button 
              onClick={() => navigate('/new-arrivals')}
              className="text-[16px] lg:text-[18px] hover:text-gray-600 transition-colors px-3 lg:px-4 py-2 font-medium"
            >
              New Arrivals
            </button>
            <button 
              onClick={() => navigate('/brands')}
              className="text-[16px] lg:text-[18px] hover:text-gray-600 transition-colors px-3 lg:px-4 py-2 font-medium"
            >
              Brands
            </button>
          </div>
          
          {/* Search - SIMPLE VERSION */}
          <div className="flex-1 min-w-0 max-w-[350px]">
            <form onSubmit={handleSearch}>
              <Input
                type="search"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                startIcon={
                  <Search className="h-4 w-4 text-gray-600" />
                }
                className={cn(
                  "h-10 rounded-full",
                  "border-gray-500 hover:border-gray-400 focus-visible:border-gray-500",
                  "focus-visible:ring-1 focus-visible:ring-gray-300",
                  "bg-gray-100 transition-all duration-200",
                  "placeholder:text-gray-600 text-sm"
                )}
              />
            </form>
          </div>
          
          {/* Icons */}
          <div className="flex gap-3 lg:gap-4 shrink-0 items-center">
            {/* Shopping Cart */}
            <button 
              onClick={() => navigate('/cart')}
              className="relative hover:bg-gray-100 rounded-full p-2 transition-colors"
            >
              <ShoppingCart className="w-5 h-5 lg:w-6 lg:h-6" />
              <span className="absolute -top-1 -right-1 bg-black text-white text-xs 
                             rounded-full h-5 w-5 flex items-center justify-center font-medium">
                0
              </span>
            </button>
            
            {/* User Menu */}
            <UserMenu />
          </div>
        </div>
      </div>

      {/* Mobile Header - Hidden on desktop */}
      <div className="md:hidden w-full sticky top-0 bg-white z-40 border-b">
        <div className="w-full flex justify-between items-center px-4 py-4">
          
          {/* Left Section: Menu button + Logo */}
          <div className="flex items-center gap-4">
            {/* Menu button with Drawer */}
            <Sheet>
              <SheetTrigger asChild>
                <button className="hover:bg-gray-100 rounded-full p-2 transition-colors shrink-0">
                  <Menu className="w-6 h-6" />
                </button>
              </SheetTrigger>
              
              {/* Drawer Content */}
              <SheetContent side="left" className="w-[280px] sm:w-[320px] p-0 bg-white">
                <SheetHeader className="p-6 border-b">
                  <SheetTitle className="text-left text-xl font-bold">Menu</SheetTitle>
                </SheetHeader>
                
                {/* User Info Section */}
                {user ? (
                  <div className="p-4 border-b">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center text-sm font-medium">
                        {user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 border-b">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Welcome!</p>
                        <p className="text-xs text-gray-500">Sign in to your account</p>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button 
                        onClick={() => navigate('/login')}
                        className="flex-1 py-2 bg-black text-white text-sm font-medium rounded-md"
                      >
                        Sign In
                      </button>
                      <button 
                        onClick={() => navigate('/register')}
                        className="flex-1 py-2 border border-gray-300 text-sm font-medium rounded-md"
                      >
                        Sign Up
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Navigation List */}
                <nav className="py-4">
                  <button 
                    onClick={() => navigate('/shop')}
                    className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors text-left"
                  >
                    <span className="text-[16px] font-medium">Shop</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>
                  
                  <button 
                    onClick={() => navigate('/sale')}
                    className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors text-left"
                  >
                    <span className="text-[16px] font-medium">On Sale</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>
                  
                  <button 
                    onClick={() => navigate('/new')}
                    className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors text-left"
                  >
                    <span className="text-[16px] font-medium">New Arrivals</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>
                  
                  <button 
                    onClick={() => navigate('/brands')}
                    className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors text-left"
                  >
                    <span className="text-[16px] font-medium">Brands</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>
                </nav>
                
                {/* User Links (if logged in) */}
                {user && (
                  <div className="border-t py-4">
                    <button 
                      onClick={() => navigate('/profile')}
                      className="w-full flex items-center gap-3 px-6 py-3 hover:bg-gray-50 transition-colors text-left"
                    >
                      <User className="w-5 h-5" />
                      <span className="text-[15px] font-medium">My Profile</span>
                    </button>
                    
                    <button 
                      onClick={() => navigate('/orders')}
                      className="w-full flex items-center gap-3 px-6 py-3 hover:bg-gray-50 transition-colors text-left"
                    >
                      <ShoppingBag className="w-5 h-5" />
                      <span className="text-[15px] font-medium">My Orders</span>
                    </button>
                    
                    <button 
                      onClick={() => navigate('/wishlist')}
                      className="w-full flex items-center gap-3 px-6 py-3 hover:bg-gray-50 transition-colors text-left"
                    >
                      <Heart className="w-5 h-5" />
                      <span className="text-[15px] font-medium">Wishlist</span>
                    </button>
                  </div>
                )}
                
                {/* Cart Section */}
                <div className="border-t mt-4 pt-4 px-6">
                  <button 
                    onClick={() => navigate('/cart')}
                    className="flex items-center gap-3 w-full px-2 py-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span className="text-[15px] font-medium">My Cart</span>
                    <span className="ml-auto bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      0
                    </span>
                  </button>
                </div>
                
                {/* Logout Button (if logged in) */}
                {user && (
                  <div className="px-6 py-4 border-t">
                    <button 
                      onClick={async () => {
                        const { logout } = useAuth();
                        await logout();
                      }}
                      className="w-full py-3 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors font-medium"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </SheetContent>
            </Sheet>
            
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <svg 
                width="100" 
                height="15" 
                viewBox="0 0 159 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="cursor-pointer hover:opacity-80 transition-opacity"
              >
                <path d="M11.3867 23.8933C3.65333 23.8667 2.08616e-07 21.4667 0.186667 15.6533H6.82667C6.90667 17.1733 8.18667 18.1067 11.3867 18.1333C14.2133 18.16 15.52 17.36 15.52 16.32C15.52 15.6 15.12 14.8533 12.9333 14.5333L10.0533 14.08C5.81333 13.3867 0.72 12.88 0.72 7.14667C0.72 2.72 4.32 0 11.44 0C17.8667 0 22.3467 1.78667 22.2133 8.18667H15.6267C15.36 6.69333 14.1067 5.76 11.28 5.76C8.82667 5.76 7.81333 6.50667 7.81333 7.52C7.81333 8.16 8.21333 8.93333 9.92 9.2L12.2933 9.6C16.7467 10.3467 22.8533 10.48 22.8533 16.6133C22.8533 21.4933 19.0667 23.92 11.3867 23.8933ZM40.3313 0.746668H47.7179V23.1467H40.3313V15.04H31.6379V23.1467H24.2513V0.746668H31.6379V8.85333H40.3313V0.746668ZM61.8883 23.8933C54.1817 23.8933 49.195 19.12 49.195 11.9467C49.195 4.77333 54.1817 0 61.8883 0C69.595 0 74.5817 4.77333 74.5817 11.9467C74.5817 19.12 69.595 23.8933 61.8883 23.8933ZM61.8883 17.52C64.8217 17.52 67.2483 15.4933 67.2483 11.9467C67.2483 8.4 64.8217 6.37333 61.8883 6.37333C58.955 6.37333 56.5283 8.4 56.5283 11.9467C56.5283 15.4933 58.955 17.52 61.8883 17.52ZM76.0638 23.1467V0.746668H88.7838C94.8904 0.746668 98.5171 3.46667 98.5171 9.49333C98.5171 15.52 94.8904 18.24 88.8104 18.24H83.4504V23.1467H76.0638ZM83.4504 12.1067H88.1438C89.9304 12.1067 91.0771 11.2267 91.0771 9.49333C91.0771 7.76 89.9304 6.88 88.1704 6.88H83.4504V12.1067ZM102.213 23.5733C100.213 23.5733 98.5325 21.92 98.5325 19.9467C98.5325 17.9733 100.213 16.32 102.213 16.32C104.213 16.32 105.893 17.9733 105.893 19.9467C105.893 21.92 104.213 23.5733 102.213 23.5733ZM119.938 23.8933C112.391 23.8933 107.351 19.12 107.351 11.9467C107.351 4.77333 112.391 0 119.938 0C125.405 0 131.005 2.4 131.751 9.97333H124.711C124.098 7.52 122.365 6.37333 119.938 6.37333C117.005 6.37333 114.685 8.56 114.685 11.9467C114.685 15.3333 117.005 17.52 119.938 17.52C122.365 17.52 124.098 16.3733 124.711 13.8667H131.751C131.005 21.4933 125.458 23.8933 119.938 23.8933ZM145.795 23.8933C138.088 23.8933 133.101 19.12 133.101 11.9467C133.101 4.77333 138.088 0 145.795 0C153.501 0 158.488 4.77333 158.488 11.9467C158.488 19.12 153.501 23.8933 145.795 23.8933ZM145.795 17.52C148.728 17.52 151.155 15.4933 151.155 11.9467C151.155 8.4 148.728 6.37333 145.795 6.37333C142.861 6.37333 140.435 8.4 140.435 11.9467C140.435 15.4933 142.861 17.52 145.795 17.52Z" 
                  fill="black"
                />
              </svg>
            </Link>
          </div>
          
          {/* Right Section: 3 Icons */}
          <div className="flex gap-2 shrink-0 items-center">
            {/* Search Icon - SIMPLE VERSION */}
            <button 
              onClick={handleSearch}
              className="hover:bg-gray-100 rounded-full p-2 transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
            
            {/* Cart Icon with Counter */}
            <button 
              onClick={() => navigate('/cart')}
              className="relative hover:bg-gray-100 rounded-full p-2 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-black text-white text-xs 
                             rounded-full h-5 w-5 flex items-center justify-center font-medium">
                0
              </span>
            </button>
            
            {/* User Icon */}
            <UserMenu />
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;