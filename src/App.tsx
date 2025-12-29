// src/App.tsx
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // ✅ Fixed import
import Header from "./components/ui/header/Header";
import Homepage from "./routes/Homepage";
import ProductPage from "./routes/producDatails";
import Page from "./routes/Page";
import CartPage from "./routes/Cartpage";
import AllReviewsPage from './routes/AllReviewsPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import ProtectedRoute from './components/layout/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen">
        <Header />
        
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/category/:id" element={<Page />} />
          <Route path="/product/:id/reviews" element={<AllReviewsPage />} />
          <Route path="/cart" element={<CartPage />} />
          
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
                <div className="container mx-auto px-4 py-8">
                  <h1 className="text-3xl font-bold">My Orders</h1>
                  <p className="text-gray-600 mt-4">Your orders will appear here.</p>
                </div>
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
      </div>
    </AuthProvider>
  );
}

export default App;