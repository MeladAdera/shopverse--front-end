// 📁 src/App.tsx
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from "./components/ui/header/Header";
import Homepage from "./routes/Homepage";
import ProductPage from "./routes/producDatails";
import Page from "./routes/Page";
import CartPage from "./routes/Cartpage";
import AllReviewsPage from './routes/AllReviewsPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import OrdersPage from '@/pages/admin/OrdersPage'; 
import ProtectedRoute from './components/layout/ProtectedRoute';
import CheckoutPage from '@/pages/client/CheckoutPage'; 
import ToastProvider from '@/providers/ToastProvider';

// 🆕 استيراد مكونات الإدارة
import { AdminRoute } from './components/admin/AdminRoute';
import AdminLayout from './components/layout/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsersPage from './pages/admin/UsersPage';
import AdminOrdersPage from '@/pages/admin/adminOrdersPage';
import AdminCategoriesPage from './pages/admin/CategoriesPage';
import UserDetailsPage from './pages/admin/UserDetailsPage';
import OrderbyPage from './pages/admin/OrderById';
import NewArrivals from '@/pages/client/NewArrivals';
import OrderConfirmationPage from './pages/client/OrderConfirmationPage';
import AdminProductsPage from './pages/admin/ProductsPage';
import CreateProductPage from './pages/admin/CreateProductPage';
import EditProductPage from './pages/admin/EditProductPage';
import AdminProductDetailsPage from './pages/admin/ProductDetailsPage';
import Brands from './pages/Brands';
import BrandProducts from './pages/BrandProducts';
import Sale from './pages/Sale';

function App() {
  
 
  return (
    <AuthProvider>
      <div className="min-h-screen">
        {/* 🆕 Header يظهر فقط للمستخدمين العاديين */}
        <Routes>
          <Route path="/*" element={<MainApp />} />
          <Route path="/admin/*" element={<AdminApp />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

// 🆕 التطبيق الرئيسي للمستخدمين العاديين
const MainApp = () => {
  return (
    <>
      <Header />
      <ToastProvider />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/products" element={<Page />} />
        <Route path="/product/:id/reviews" element={<AllReviewsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} /> 
        <Route path="/new-arrivals" element={<NewArrivals />} />
        <Route path="/brands" element={<Brands />} />
                <Route path="/brands/:brandName" element={<BrandProducts />} />
                                <Route path="/sale" element={<Sale />} />




        
        {/* Protected Routes */}
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/orders" 
          element={
            <ProtectedRoute>
              <OrdersPage /> 
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/user/:id" 
          element={
            <ProtectedRoute>
              <UserDetailsPage /> 
            </ProtectedRoute>
          } 
        />
         <Route 
          path="/orders/:id" 
          element={
            <ProtectedRoute>
              <OrderConfirmationPage /> 
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/wishlist" 
          element={
            <ProtectedRoute>
              <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold">My Wishlist</h1>
                <p className="text-gray-600 mt-4">Your wishlist items will appear here.</p>
              </div>
            </ProtectedRoute>
          } 
        />
      </Routes>
    </>
  );
};

// 🆕 التطبيق الإداري (بدون Header عادي)
const AdminApp = () => {
  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
        <Route path="categories" element={<AdminCategoriesPage />} />
        <Route path="users/:id" element={<UserDetailsPage />} />

<Route path="orders/:id" element={<OrderbyPage />} />
<Route path="products" element={<AdminProductsPage />} />
        <Route path="products/:id" element={<AdminProductDetailsPage />} />

        <Route path="products/create" element={<CreateProductPage />} />
        <Route path="products/:id/edit" element={<EditProductPage />} />



      </Route>
    </Routes>
  );
};

export default App;


