import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/Home';
import ProductsPage from './pages/ProductsPage';
// import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
// import RegisterPage from './pages/RegisterPage'
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
       { path: 'login', element: <LoginPage /> }, // ← تحديث
      { path: 'products', element: <ProductsPage /> },
      { path: 'cart', element: <CartPage /> },
      // { path: 'register', element: <RegisterPage /> }, // ← جديد
    ],
  },
]);


export default router;