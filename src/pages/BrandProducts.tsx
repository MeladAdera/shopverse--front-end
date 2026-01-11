// 📁 pages/BrandProducts.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Filter, 
  Star, 
  ShoppingBag, 
  Grid,
  List,
  ChevronDown,
  X
} from 'lucide-react';
import ProductCard from "@/components/porducts/ProductCard";
import { productService } from '@/services/product.service';
import ImageService from '@/lib/imageService';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

function BrandProducts() {
  const { brandName } = useParams<{ brandName: string }>();
  const navigate = useNavigate();
  
  // حالات البيانات
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [brandInfo, setBrandInfo] = useState<any>(null);
  
  // حالات التصفية
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc' | 'popular'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    color: '',
    size: '',
    inStock: false
  });
  const [showFilters, setShowFilters] = useState(false);
  
  // جلب منتجات العلامة التجارية
  const fetchBrandProducts = async () => {
    if (!brandName) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log(`🔄 جلب منتجات ${brandName}...`);
      
      // بناء معاملات البحث
      const params: any = {
        brand: brandName,
        sort: sortBy
      };
      
      // إضافة الفلاتر إذا كانت موجودة
      if (filters.minPrice) params.min_price = filters.minPrice;
      if (filters.maxPrice) params.max_price = filters.maxPrice;
      if (filters.color) params.color = filters.color;
      if (filters.size) params.size = filters.size;
      if (filters.inStock) params.in_stock = true;
      
      // جلب المنتجات
      const brandProducts = await productService.getProductsByBrand(brandName, params);
      console.log(`✅ منتجات ${brandName}:`, brandProducts.length);
      
      // تحويل الصور
      const transformedProducts = ImageService.transformProducts(brandProducts);
      setProducts(transformedProducts);
      
      // حساب إحصائيات العلامة التجارية
      if (brandProducts.length > 0) {
        const totalProducts = brandProducts.length;
        const totalSales = brandProducts.reduce((sum, p) => sum + (p.sales_count || 0), 0);
        const avgRating = brandProducts.reduce((sum, p) => sum + (p.average_rating || 0), 0) / totalProducts;
        const avgPrice = brandProducts.reduce((sum, p) => sum + p.price, 0) / totalProducts;
        
        setBrandInfo({
          name: brandName,
          totalProducts,
          totalSales,
          avgRating: avgRating.toFixed(1),
          avgPrice: avgPrice.toFixed(2),
          latestProduct: brandProducts[0] // أحدث منتج حسب الترتيب
        });
      }
      
    } catch (err: any) {
      console.error(`❌ خطأ في جلب منتجات ${brandName}:`, err);
      setError(err.message || 'حدث خطأ في تحميل المنتجات');
    } finally {
      setIsLoading(false);
    }
  };
  
  // جلب البيانات عند التحميل أو تغيير الفلاتر
  useEffect(() => {
    fetchBrandProducts();
  }, [brandName, sortBy, filters]);
  
  // معالجة نقر المنتج
  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
  };
  
  // تطبيق الفلاتر
  const applyFilters = () => {
    setShowFilters(false);
    fetchBrandProducts();
  };
  
  // إعادة تعيين الفلاتر
  const resetFilters = () => {
    setFilters({
      minPrice: '',
      maxPrice: '',
      color: '',
      size: '',
      inStock: false
    });
    setSortBy('newest');
  };
  
  // Skeleton للتحميل
  const renderSkeleton = () => (
    <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'space-y-6'} gap-6`}>
      {[...Array(8)].map((_, i) => (
        viewMode === 'grid' ? (
          <div key={i} className="space-y-4">
            <Skeleton className="h-64 w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ) : (
          <div key={i} className="flex gap-4 p-4 border rounded-lg">
            <Skeleton className="h-32 w-32 rounded-lg" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        )
      ))}
    </div>
  );
  
  // استخراج خيارات الفلترة الفريدة من المنتجات
  const uniqueColors = [...new Set(products.map(p => p.color).filter(Boolean))];
  const uniqueSizes = [...new Set(products.map(p => p.size).filter(Boolean))];
  
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-linear-to-r from-blue-50 to-purple-50 py-8 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <button
            onClick={() => navigate('/brands')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Brands
          </button>
          
          {/* Brand Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 capitalize">
                {brandName} Collection
              </h1>
              <p className="text-gray-600 mt-2">
                Discover all products from {brandName}
              </p>
            </div>
            
            {/* Brand Stats */}
            {brandInfo && (
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{brandInfo.totalProducts}</div>
                    <div className="text-sm text-gray-500">Products</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{brandInfo.totalSales}</div>
                    <div className="text-sm text-gray-500">Sales</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">{brandInfo.avgRating}★</div>
                    <div className="text-sm text-gray-500">Avg Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">${brandInfo.avgPrice}</div>
                    <div className="text-sm text-gray-500">Avg Price</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="text-gray-600">
              <span className="font-bold text-blue-600">{products.length}</span> products found
            </div>
            
            {/* View Toggle */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'bg-white text-gray-600'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'bg-white text-gray-600'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter className="w-4 h-4" />
              Filters
              {showFilters && <X className="w-4 h-4 ml-1" />}
            </button>
            
            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="popular">Most Popular</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
        
        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Filter Products</h3>
              <button
                onClick={resetFilters}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Reset All
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              
              {/* Color Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </label>
                <select
                  value={filters.color}
                  onChange={(e) => setFilters({...filters, color: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">All Colors</option>
                  {uniqueColors.map(color => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
              </div>
              
              {/* Size Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Size
                </label>
                <select
                  value={filters.size}
                  onChange={(e) => setFilters({...filters, size: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">All Sizes</option>
                  {uniqueSizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
              
              {/* In Stock Filter */}
              <div className="flex items-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.inStock}
                    onChange={(e) => setFilters({...filters, inStock: e.target.checked})}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">In Stock Only</span>
                </label>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={applyFilters}
                className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
        
        {/* Loading State */}
        {isLoading && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Loading {brandName} Products...</h2>
              {renderSkeleton()}
            </div>
          </div>
        )}
        
        {/* Error State */}
        {error && !isLoading && (
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-xl p-8 inline-block">
              <h3 className="text-xl font-semibold text-red-800 mb-2">Error Loading Products</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={fetchBrandProducts}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
        
        {/* Empty State */}
        {!isLoading && !error && products.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 inline-block">
              <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Products Found</h3>
              <p className="text-gray-600 mb-4">No products available for {brandName} with current filters</p>
              <button
                onClick={resetFilters}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
        
        {/* Products Grid/List */}
        {!isLoading && !error && products.length > 0 && (
          <div>
            <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'space-y-6'} gap-6`}>
              {products.map((product) => (
                viewMode === 'grid' ? (
                  <div 
                    key={product.id} 
                    onClick={() => handleProductClick(product.id)}
                    className="cursor-pointer group"
                  >
                    <ProductCard product={product} />
                  </div>
                ) : (
                  <div 
                    key={product.id}
                    onClick={() => handleProductClick(product.id)}
                    className="cursor-pointer flex gap-6 p-4 border border-gray-200 rounded-xl hover:shadow-lg transition-all group"
                  >
                    <div className="w-48 h-48 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                      {product.image_urls?.[0] && (
                        <img 
                          src={product.image_urls[0]} 
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg group-hover:text-blue-600">{product.name}</h3>
                          <p className="text-gray-600 mt-1 line-clamp-2">{product.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">${product.price}</div>
                          {product.stock <= 5 && product.stock > 0 && (
                            <Badge className="bg-red-100 text-red-800 mt-1">
                              Only {product.stock} left
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-4 flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="font-medium">{product.average_rating.toFixed(1)}</span>
                          <span className="text-gray-500 text-sm">({product.review_count} reviews)</span>
                        </div>
                        <div className="text-gray-500">•</div>
                        <div className="text-gray-600">Color: {product.color}</div>
                        <div className="text-gray-600">Size: {product.size}</div>
                      </div>
                      
                      <div className="mt-6 flex items-center justify-between">
                        <div>
                          {product.stock > 0 ? (
                            <Badge className="bg-green-100 text-green-800">In Stock</Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-800">Out of Stock</Badge>
                          )}
                        </div>
                        <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                )
              ))}
            </div>
            
            {/* Results Summary */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="bg-linear-to-r from-blue-50 to-purple-50 rounded-xl p-6">
                <h3 className="font-bold text-lg mb-4">About {brandName}</h3>
                <p className="text-gray-700">
                  Discover the complete collection from {brandName}. We offer {products.length} premium products 
                  with an average rating of {brandInfo?.avgRating} stars. From casual wear to professional gear, 
                  find everything you need from this trusted brand.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BrandProducts;