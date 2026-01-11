import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Crown, 
  TrendingUp, 
  Star, 
  Award, 
  Filter, 
  Search, 
  Tag, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import ProductCard from "@/components/porducts/ProductCard";
import { productService } from '@/services/product.service';
import ImageService from '@/lib/imageService';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

// تعريف نوع العلامة التجارية
interface BrandInfo {
  name: string;
  productCount: number;
  totalSales: number;
  averageRating: number;
  latestProduct?: any;
  imageUrl?: string;
}

function Brands() {
  const navigate = useNavigate();
  
  // حالات البيانات
  const [brands, setBrands] = useState<BrandInfo[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'products' | 'sales' | 'rating'>('products');
  
  // جلب جميع العلامات التجارية والمنتجات
  const fetchBrandsData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🔄 جلب بيانات العلامات التجارية...');
      
      // 1. جلب كل المنتجات
      const products = await productService.getProducts({ limit: 100 });
      console.log('✅ المنتجات المحملة:', products.length);
      
      // تحويل الصور
      const transformedProducts = ImageService.transformProducts(products);
      setAllProducts(transformedProducts);
      
      // 2. تحليل العلامات التجارية من المنتجات
      const brandMap = new Map<string, BrandInfo>();
      
      products.forEach(product => {
        if (!product.brand) return;
        
        const brandName = product.brand.toLowerCase();
        
        if (!brandMap.has(brandName)) {
          brandMap.set(brandName, {
            name: product.brand,
            productCount: 0,
            totalSales: 0,
            averageRating: 0,
            latestProduct: null
          });
        }
        
        const brand = brandMap.get(brandName)!;
        brand.productCount++;
        brand.totalSales += product.sales_count || 0;
        
        // حساب متوسط التقييم بشكل صحيح
        if (product.average_rating && product.average_rating > 0) {
          brand.averageRating = ((brand.averageRating * (brand.productCount - 1)) + product.average_rating) / brand.productCount;
        }
        
        // حفظ أحدث منتج للعلامة التجارية
        if (!brand.latestProduct || new Date(product.created_at) > new Date(brand.latestProduct.created_at)) {
          brand.latestProduct = product;
        }
      });
      
      // تحويل الخريطة إلى مصفوفة
      let brandsArray = Array.from(brandMap.values());
      
      // ترتيب حسب الخيار المحدد
      switch(sortBy) {
        case 'sales':
          brandsArray.sort((a, b) => b.totalSales - a.totalSales);
          break;
        case 'rating':
          brandsArray.sort((a, b) => b.averageRating - a.averageRating);
          break;
        case 'products':
        default:
          brandsArray.sort((a, b) => b.productCount - a.productCount);
      }
      
      // أخذ أفضل 10 علامات تجارية
      brandsArray = brandsArray.slice(0, 10);
      
      setBrands(brandsArray);
      
      // 3. جلب المنتجات الأكثر مبيعاً
      const topSelling = await productService. getTopSelling(8);
      const transformedTopSelling = ImageService.transformProducts(topSelling);
      setTopProducts(transformedTopSelling);
      
    } catch (err: any) {
      console.error('❌ خطأ في جلب بيانات العلامات التجارية:', err);
      setError(err.message || 'حدث خطأ في تحميل البيانات');
    } finally {
      setIsLoading(false);
    }
  };
  
  // جلب البيانات عند التحميل أو تغيير الترتيب
  useEffect(() => {
    fetchBrandsData();
  }, [sortBy]);
  
  // تصفية العلامات التجارية حسب البحث
  const filteredBrands = brands.filter(brand =>
    brand.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // معالجة نقر العلامة التجارية
  const handleBrandClick = (brandName: string) => {
    navigate(`/brands/${brandName.toLowerCase()}`);
  };
  
  // معالجة نقر المنتج
  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
  };
  
  // Skeleton للتحميل
  const renderBrandsSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
      {[...Array(10)].map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="h-40 w-full rounded-lg" />
          <Skeleton className="h-6 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-1/2 mx-auto" />
        </div>
      ))}
    </div>
  );
  
  // Skeleton للمنتجات
  const renderProductsSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="h-64 w-full rounded-lg" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
  
  // إحصائيات
  const totalProducts = allProducts.length;
  const totalBrands = brands.length;
  const totalSales = brands.reduce((sum, brand) => sum + brand.totalSales, 0);
  const topBrand = brands[0];
  
  return (
    <div className="min-h-screen bg-white">
{/* في صفحة Brands.tsx */}
{/* Hero Header */}
<div className="bg-linear-to-r from-purple-50 via-white to-blue-50 py-12 border-b">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex flex-col lg:flex-row justify-between items-center gap-8"> {/* تغيير هنا */}
      <div className="flex-1 w-full lg:w-auto">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-linear-to-rrom-purple-100 to-pink-100 rounded-full">
            <Crown className="w-8 h-8 text-purple-600" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 text-center lg:text-left">
              Shop by Brand
            </h1>
            <p className="text-gray-600 mt-2 text-center lg:text-left">
              Discover premium collections from top fashion brands
            </p>
          </div>
        </div>
        
        {/* Search Bar - توسيط على الموبايل */}
        <div className="mt-6 max-w-xl mx-auto lg:mx-0">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search brands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Stats Card - توسيط على الموبايل */}
      <div className=" lg:w-auto flex justify-center">
        <div className="bg-white p-6 rounded-2xl shadow-lg border w-full max-w-sm">
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{totalBrands}</div>
              <div className="text-sm text-gray-500 mt-1">Brands</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{totalProducts}</div>
              <div className="text-sm text-gray-500 mt-1">Products</div>
            </div>
            <div className="text-center col-span-2">
              <div className="text-3xl font-bold text-green-600">{totalSales}</div>
              <div className="text-sm text-gray-500 mt-1">Total Sales</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    {/* Stats Cards - توسيط على الموبايل */}
    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-linear-to-r from-purple-50 to-pink-50 p-5 rounded-xl border">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white rounded-lg shadow-sm">
            <Award className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <div className="text-sm text-gray-600">Top Brand</div>
            <div className="font-bold text-lg">
              {topBrand ? topBrand.name : 'Loading...'}
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-linear-to-r from-blue-50 to-cyan-50 p-5 rounded-xl border">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white rounded-lg shadow-sm">
            <TrendingUp className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <div className="text-sm text-gray-600">Most Products</div>
            <div className="font-bold text-lg">
              {topBrand ? `${topBrand.productCount} items` : 'Loading...'}
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-linear-to-r from-green-50 to-emerald-50 p-5 rounded-xl border">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white rounded-lg shadow-sm">
            <Star className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <div className="text-sm text-gray-600">Highest Rated</div>
            <div className="font-bold text-lg">
              {brands.length > 0 
                ? `${Math.max(...brands.map(b => b.averageRating)).toFixed(1)}★` 
                : 'Loading...'}
            </div>
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
          <div className="space-y-12">
            <div>
              <h2 className="text-2xl font-bold mb-4">Loading Brands...</h2>
              <p className="text-gray-600">Discovering the best brands for you</p>
              {renderBrandsSkeleton()}
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-4">Loading Top Products...</h2>
              {renderProductsSkeleton()}
            </div>
          </div>
        )}
        
        {/* Error State */}
        {error && !isLoading && (
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-xl p-8 inline-block">
              <Crown className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-red-800 mb-2">Error Loading Brands</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={fetchBrandsData}
                className="px-6 py-2 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
        
        {/* Empty State */}
        {!isLoading && !error && brands.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 inline-block">
              <Crown className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Brands Found</h3>
              <p className="text-gray-600">Start adding products with brands to see them here!</p>
            </div>
          </div>
        )}
        
        {/* Brands Section */}
        {!isLoading && !error && brands.length > 0 && (
          <div className="space-y-8">
            {/* Brands Header */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Featured Brands</h2>
                <p className="text-gray-600 mt-1">
                  Showing <span className="font-bold text-purple-600">{filteredBrands.length}</span> premium brands
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Filter className="w-4 h-4 text-gray-500" />
                <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                  <button
                    onClick={() => setSortBy('products')}
                    className={`px-3 py-1 text-sm rounded ${sortBy === 'products' ? 'bg-white shadow' : ''}`}
                  >
                    Most Products
                  </button>
                  <button
                    onClick={() => setSortBy('sales')}
                    className={`px-3 py-1 text-sm rounded ${sortBy === 'sales' ? 'bg-white shadow' : ''}`}
                  >
                    Top Sales
                  </button>
                  <button
                    onClick={() => setSortBy('rating')}
                    className={`px-3 py-1 text-sm rounded ${sortBy === 'rating' ? 'bg-white shadow' : ''}`}
                  >
                    Highest Rated
                  </button>
                </div>
              </div>
            </div>
            
            {/* Brands Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {filteredBrands.map((brand, index) => (
                <div
                  key={brand.name}
                  onClick={() => handleBrandClick(brand.name)}
                  className="group cursor-pointer bg-white border border-gray-200 rounded-xl p-5 hover:shadow-xl hover:border-purple-300 transition-all duration-300"
                >
                  {/* Brand Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        index === 0 ? 'bg-yellow-100 text-yellow-800' :
                        index === 1 ? 'bg-gray-100 text-gray-800' :
                        index === 2 ? 'bg-orange-100 text-orange-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        <Tag className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-lg">{brand.name}</span>
                    </div>
                    
                    {index < 3 && (
                      <Badge className={
                        index === 0 ? 'bg-yellow-500 text-white' :
                        index === 1 ? 'bg-gray-500 text-white' :
                        'bg-orange-500 text-white'
                      }>
                        #{index + 1}
                      </Badge>
                    )}
                  </div>
                  
                  {/* Brand Stats */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Products</span>
                      <span className="font-semibold">{brand.productCount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Sales</span>
                      <span className="font-semibold">{brand.totalSales}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Rating</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-semibold">{brand.averageRating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Latest Product Preview */}
                  {brand.latestProduct && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="text-xs text-gray-500 mb-2">Latest Product</div>
                      <div className="flex items-center gap-3">
                       
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">{brand.latestProduct.name}</div>
                          <div className="text-xs text-gray-500">${brand.latestProduct.price}</div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* View Button */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <button className="w-full py-2 bg-linear-to-r from-purple-50 to-white text-purple-600 rounded-lg border border-purple-200 hover:from-purple-100 hover:to-white transition-all group-hover:from-purple-100">
                      View Collection
                      <ChevronRight className="w-4 h-4 inline ml-1" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Top Selling Products */}
            {topProducts.length > 0 && (
              <div className="mt-12 pt-8 border-t">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Top Selling Products</h2>
                    <p className="text-gray-600 mt-1">Best sellers from all brands</p>
                  </div>
                  <button 
                    onClick={() => navigate('/products?sort=popular')}
                    className="text-purple-600 hover:text-purple-800 font-medium flex items-center gap-1"
                  >
                    View All
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {topProducts.slice(0, 4).map((product) => (
                    <div 
                      key={product.id} 
                      onClick={() => handleProductClick(product.id)}
                      className="cursor-pointer group"
                    >
                      <div className="relative">
                        <ProductCard product={product} />
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-linear-to-r from-orange-500 to-red-500 text-white">
                            🔥 Hot
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Info Section */}
            <div className="mt-8 bg-linear-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-2xl p-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-purple-900 mb-3">Why Shop by Brand?</h3>
                  <ul className="space-y-3 text-purple-800">
                    <li className="flex items-center gap-3">
                      <Sparkles className="w-5 h-5 text-purple-600" />
                      <span>Consistent quality and design standards</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Award className="w-5 h-5 text-purple-600" />
                      <span>Trusted brands with proven customer satisfaction</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Tag className="w-5 h-5 text-purple-600" />
                      <span>Cohesive collections that match perfectly</span>
                    </li>
                  </ul>
                </div>
                <div className="md:w-48">
                  <div className="bg-white p-4 rounded-xl shadow-sm">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600">{brands.length}</div>
                      <div className="text-sm text-gray-600 mt-1">Premium Brands</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Brands;