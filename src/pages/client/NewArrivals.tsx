// 📁 pages/NewArrivals.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Calendar, TrendingUp } from 'lucide-react';
import ProductCard from "../../components/porducts/ProductCard";
import { productService } from '@/services/product.service';
import ImageService from '@/lib/imageService';
import { Skeleton } from '@/components/ui/skeleton';
import Typewriter from 'typewriter-effect';


function NewArrivals() {
  const navigate = useNavigate();
  
  // حالة البيانات
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // جلب المنتجات الجديدة
  const fetchNewArrivals = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🔄 جلب المنتجات الجديدة...');
      
      // استخدام service للحصول على المنتجات الجديدة مع sort='newest'
      const newArrivals = await productService.getProducts({
        sort: 'newest',
        limit: 100 // جلب كمية جيدة
      });
      
      console.log('✅ المنتجات الجديدة:', newArrivals.length);
      
      // تحويل الصور باستخدام ImageService
      const transformedProducts = ImageService.transformProducts(newArrivals);
      
      setProducts(transformedProducts);
      
    } catch (err: any) {
      console.error('❌ خطأ في جلب المنتجات الجديدة:', err);
      setError(err.message || 'حدث خطأ في تحميل المنتجات');
    } finally {
      setIsLoading(false);
    }
  };
  
  // جلب البيانات عند التحميل
  useEffect(() => {
    fetchNewArrivals();
  }, []);
  
  // معالجة نقر المنتج
  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
  };
  
  // Skeleton للتحميل
  const renderSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="h-64 w-full rounded-lg" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
  
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header */}
      <div className="bg-linear-to-r from-blue-50 to-white py-12 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">New Arrivals</h1>
              </div>
              <div className="text-gray-600 text-lg h-8">
  <Typewriter
    options={{
      strings: [
        'Welcome to our new arrivals section .',
        'Where style meets innovation .',
        'Fresh products added every day .',
        'Special discounts just for you! 🎯'
      ],
      autoStart: true,
      loop: true,
      delay: 50,
      deleteSpeed: 30,
    }}
  />
</div>
            </div>

            <div className="flex items-center gap-6 bg-white p-4 rounded-xl shadow-sm border">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{products.length}</div>
                <div className="text-sm text-gray-500">Total Products</div>
              </div>
              <div className="h-10 w-px bg-gray-200"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">24h</div>
                <div className="text-sm text-gray-500">Updated</div>
              </div>
            </div>
          </div>
          
          {/* Stats Bar */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="text-sm text-gray-600">Latest Arrival</div>
                  <div className="font-semibold">
                    {products.length > 0 ? products[0].name : 'Loading...'}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <div>
                  <div className="text-sm text-gray-600">Daily Updates</div>
                  <div className="font-semibold">New products added daily</div>
                </div>
              </div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-purple-600" />
                <div>
                  <div className="text-sm text-gray-600">Sort Order</div>
                  <div className="font-semibold">Newest First</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading State */}
        {isLoading && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Loading New Arrivals...</h2>
              <p className="text-gray-600">Fetching the latest products for you</p>
            </div>
            {renderSkeleton()}
          </div>
        )}
        
        {/* Error State */}
        {error && !isLoading && (
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-8 inline-block">
              <h3 className="text-xl font-semibold text-red-800 mb-2">Error Loading New Arrivals</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={fetchNewArrivals}
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
        
        {/* Empty State */}
        {!isLoading && !error && products.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 inline-block">
              <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No New Arrivals Yet</h3>
              <p className="text-gray-600">Check back soon for new products!</p>
            </div>
          </div>
        )}
        
        {/* Products Grid */}
        {!isLoading && !error && products.length > 0 && (
          <div className="space-y-8">
            {/* Products Count */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Latest Products</h2>
                <p className="text-gray-600">
                  Showing <span className="font-bold">{products.length}</span> new arrival products
                </p>
              </div>
              <div className="text-sm text-gray-500">
                Sorted by: <span className="font-semibold text-blue-600">Newest First</span>
              </div>
            </div>
            
            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div 
                  key={product.id} 
                  onClick={() => handleProductClick(product.id)}
                  className="cursor-pointer"
                >
                  {/* إضافة شارة "New" على المنتجات الجديدة */}
                  <div className="relative">
                    <ProductCard product={product} />
                    {/* Badge for new arrivals */}
                    <div className="absolute top-3 left-3">
                      <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        NEW
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
              <div className="flex items-center gap-4">
                <Calendar className="w-8 h-8 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-blue-800">About New Arrivals</h3>
                  <p className="text-blue-700 text-sm mt-1">
                    This page displays our latest products sorted by arrival date. 
                    New products are added regularly, so check back often!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default NewArrivals;