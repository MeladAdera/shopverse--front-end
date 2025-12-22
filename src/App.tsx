// App.tsx
import { Routes, Route } from 'react-router-dom'; // بدون BrowserRouter
import Header from "./components/ui/header/Header";
import Homepage from "./routes/Homepage";
import ProductPage from "./routes/producDatails";
import Page from "./routes/Page";
import CartPage from "./routes/Cartpage";
import { useEffect, useState } from "react";

function App() {
  const [apiStatus, setApiStatus] = useState<'testing' | 'success' | 'error'>('testing');
  const [apiError, setApiError] = useState<string>('');

  useEffect(() => {
    const testAPI = async () => {
      console.log('🔍 اختبار اتصال API...');
      
      try {
        const response = await fetch('http://localhost:5000/api/products?limit=1');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('✅ API Response:', data);
        
        if (data.success) {
          setApiStatus('success');
          console.log('🎉 اتصال API ناجح!');
        } else {
          throw new Error('API returned success: false');
        }
      } catch (error: any) {
        console.error('❌ خطأ في API:', error);
        setApiStatus('error');
        setApiError(error.message || 'Unknown error');
      }
    };
    // الصق هذا في console مباشرة
const testCategory = async (id: number) => {
  console.log(`🔍 Testing category ${id}...`);
  try {
    const response = await fetch(`http://localhost:5000/api/products?category_id=${id}`);
    const data = await response.json();
    console.log(`✅ Category ${id}:`, data.data.products.length, 'products');
    data.data.products.forEach((p: { name: any; id: any; }) => console.log(`   - ${p.name} (${p.id})`));
  } catch (error) {
    console.error(`❌ Error with category ${id}:`, error);
  }
};

// اختبر الفئات الموجودة
testCategory(6); // clothes
testCategory(5); // electronics
testCategory(3); // home

    testAPI();
  }, []);

  return (
    <div className="min-h-screen"> {/* بدون <Router> هنا */}
      {/* شريط حالة الـ API */}
      {apiStatus === 'error' && (
        <div className="bg-red-500 text-white p-3 text-center text-sm">
          ⚠️ مشكلة في اتصال API: {apiError}
          <button 
            onClick={() => window.location.reload()}
            className="ml-4 bg-white text-red-500 px-3 py-1 rounded text-xs"
          >
            إعادة تحميل
          </button>
        </div>
      )}
      
      <Header />
      
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/category/:category" element={<Page />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </div>
  );
}

export default App;