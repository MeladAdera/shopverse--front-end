// 📁 pages/Sale.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tag, Zap, TrendingUp } from 'lucide-react';
import ProductCard from "@/components/porducts/ProductCard";
import { productService } from '@/services/product.service';
import ImageService from '@/lib/imageService';
import { Skeleton } from '@/components/ui/skeleton';
import Typewriter from 'typewriter-effect';


function Sale() {
  const navigate = useNavigate();
  
  // حالة البيانات
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // جلب منتجات التخفيضات
  const fetchSaleProducts = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🔄 جلب منتجات التخفيضات...');
      
      // استخدام service للحصول على المنتجات الأكثر مبيعاً
      const saleProducts = await productService.getProducts({
        sort: 'popular',
        limit: 100 // جلب كمية جيدة
      });
      
      console.log('✅ منتجات التخفيضات:', saleProducts.length);
      
      // تحويل الصور باستخدام ImageService
      const transformedProducts = ImageService.transformProducts(saleProducts);
      
      // إضافة معلومات التخفيض الوهمية
      const productsWithDiscount = transformedProducts.map((product, index) => {
        // حساب تخفيض بناءً على المبيعات والترتيب
        let discount = 10; // تخفيض أساسي
        
        // زيادة التخفيض حسب المبيعات
        if (product.sales_count > 100) discount = 40;
        else if (product.sales_count > 50) discount = 30;
        else if (product.sales_count > 20) discount = 20;
        else if (product.sales_count > 10) discount = 15;
        
        // زيادة التخفيض للمنتجات الأولى في القائمة
        if (index < 5) discount += 5;
        
        // لا تتجاوز 50%
        discount = Math.min(discount, 50);
        
        // حساب السعر بعد التخفيض
        const salePrice = product.price * (1 - discount / 100);
        const savings = product.price - salePrice;
        
        return {
          ...product,
          discount_percentage: discount,
          sale_price: salePrice.toFixed(2),
          original_price: product.price,
          savings: savings.toFixed(2),
          is_on_sale: true,
          badge: discount >= 30 ? 'HOT' : discount >= 20 ? 'SALE' : 'OFF'
        };
      });
      
      // ترتيب حسب أعلى تخفيض
      const sortedProducts = productsWithDiscount.sort((a, b) => 
        b.discount_percentage - a.discount_percentage
      );
      
      setProducts(sortedProducts);
      
    } catch (err: any) {
      console.error('❌ خطأ في جلب منتجات التخفيضات:', err);
      setError(err.message || 'حدث خطأ في تحميل المنتجات');
    } finally {
      setIsLoading(false);
    }
  };
  
  // جلب البيانات عند التحميل
  useEffect(() => {
    fetchSaleProducts();
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
  
  // حساب إجمالي التوفير
  const totalSavings = products.reduce((sum, product) => {
    return sum + parseFloat(product.savings || 0);
  }, 0);
  
  // حساب متوسط التخفيض
  const averageDiscount = products.length > 0 
    ? (products.reduce((sum, product) => sum + product.discount_percentage, 0) / products.length).toFixed(1)
    : '0';
  
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header - نفس تنسيق NewArrivals ولكن باللون الأحمر */}
      <div className="bg-linear-to-r from-red-50 to-white py-12 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 rounded-full">
                  <Tag className="w-6 h-6 text-red-600" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Sale & Discounts</h1>
              </div>
             <div className="text-gray-600 text-lg h-8">
  <Typewriter
    options={{
      strings: [
        'Amazing deals and discounts on our best-selling products.',
        'Limited time offers! Hurry up before they run out.',
        'Up to 50% OFF on top brands.',
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
                <div className="text-2xl font-bold text-red-600">{products.length}</div>
                <div className="text-sm text-gray-500">Products on Sale</div>
              </div>
              <div className="h-10 w-px bg-gray-200"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  ${totalSavings.toFixed(0)}
                </div>
                <div className="text-sm text-gray-500">Total Savings</div>
              </div>
            </div>
          </div>
          
          {/* Stats Bar - نفس التنسيق */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <Tag className="w-5 h-5 text-red-600" />
                <div>
                  <div className="text-sm text-gray-600">Average Discount</div>
                  <div className="font-semibold">
                    {averageDiscount}% OFF
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-yellow-600" />
                <div>
                  <div className="text-sm text-gray-600">Best Discount</div>
                  <div className="font-semibold">
                    {products.length > 0 ? `${products[0]?.discount_percentage}% OFF` : 'Loading...'}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <div>
                  <div className="text-sm text-gray-600">Top Selling Brand</div>
                  <div className="font-semibold">
                    {products.length > 0 ? products[0]?.brand || 'Various' : 'Loading...'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content - نفس تنسيق NewArrivals */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading State */}
        {isLoading && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Loading Sale Products...</h2>
              <p className="text-gray-600">Finding the best discounts for you</p>
            </div>
            {renderSkeleton()}
          </div>
        )}
        
        {/* Error State */}
        {error && !isLoading && (
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-8 inline-block">
              <h3 className="text-xl font-semibold text-red-800 mb-2">Error Loading Sale Products</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={fetchSaleProducts}
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
              <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Sale Products Available</h3>
              <p className="text-gray-600">Check back later for new discounts!</p>
            </div>
          </div>
        )}
        
        {/* Products Grid */}
        {!isLoading && !error && products.length > 0 && (
          <div className="space-y-8">
            {/* Products Count */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Discounted Products</h2>
                <p className="text-gray-600">
                  Showing <span className="font-bold">{products.length}</span> products with discounts up to{' '}
                  <span className="font-bold text-red-600">
                    {products.length > 0 ? `${products[0]?.discount_percentage}% OFF` : '0% OFF'}
                  </span>
                </p>
              </div>
              <div className="text-sm text-gray-500">
                Sorted by: <span className="font-semibold text-red-600">Highest Discount</span>
              </div>
            </div>
            
            {/* Products Grid - استخدام نفس ProductCard */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div 
                  key={product.id} 
                  onClick={() => handleProductClick(product.id)}
                  className="cursor-pointer relative"
                >
                  {/* استخدام نفس ProductCard */}
                  <ProductCard product={product} />
                  
                  {/* إضافة شارة التخفيض على المنتجات */}
                  <div className="absolute top-3 left-3">
                    <span className={`text-white text-xs font-bold px-3 py-1 rounded-full ${
                      product.badge === 'HOT' 
                        ? 'bg-red-500' 
                        : product.badge === 'SALE' 
                        ? 'bg-orange-500' 
                        : 'bg-green-500'
                    }`}>
                      {product.discount_percentage}% OFF
                    </span>
                  </div>
                  
                  {/* عرض السعر الأصلي والسعر المخفض */}
                  <div className="absolute bottom-20 left-3 right-3">
                    <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded">
                      <span className="text-lg font-bold text-red-600">
                        ${product.sale_price}
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        ${product.original_price}
                      </span>
                      <span className="text-xs text-green-600 font-bold">
                        Save ${product.savings}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Info Box */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mt-8">
              <div className="flex items-center gap-4">
                <Tag className="w-8 h-8 text-red-600" />
                <div>
                  <h3 className="font-semibold text-red-800">About Our Sale</h3>
                  <p className="text-red-700 text-sm mt-1">
                    Our sale prices are automatically calculated based on product popularity, 
                    customer ratings, and sales performance. The more popular a product is, 
                    the bigger the discount you get!
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

export default Sale;