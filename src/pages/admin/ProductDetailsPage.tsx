// 📁 src/pages/admin/ProductDetailsPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Eye, 
  Package, 
  BarChart, 
  Calendar, 
  Tag,
  ShoppingBag,
  DollarSign,
  Layers,
  Users,
  Star,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
  RefreshCw
} from 'lucide-react';
import productAdminService from '../../services/productAdminService';
import type { Product } from '../../types/products.types';

const AdminProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);

  // جلب بيانات المنتج
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError('Product ID is missing');
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await productAdminService.getProductById(parseInt(id));
        setProduct(response.data);
      } catch (err: any) {
        console.error('Error fetching product:', err);
        setError(err.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // دالة تحديث البيانات
  const refreshProduct = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const response = await productAdminService.getProductById(parseInt(id));
      setProduct(response.data);
    } catch (err: any) {
      console.error('Error refreshing product:', err);
    } finally {
      setLoading(false);
    }
  };

  // دالة الحذف
  const handleDelete = async () => {
    if (!product) return;
    
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${product.name}"?\nThis action cannot be undone.`
    );
    
    if (!confirmDelete) return;
    
    setIsDeleting(true);
    try {
      await productAdminService.deleteProduct(product.id);
      navigate('/admin/products');
    } catch (err: any) {
      alert(err.message || 'Failed to delete product');
      setIsDeleting(false);
    }
  };

  // دالة تغيير حالة المنتج
  const toggleProductStatus = async () => {
    if (!product) return;
    
    const confirmToggle = window.confirm(
      `Are you sure you want to ${product.active ? 'deactivate' : 'activate'} "${product.name}"?`
    );
    
    if (!confirmToggle) return;
    
    setIsTogglingStatus(true);
    try {
      await productAdminService.updateProductStatus(product.id, !product.active);
      
      // تحديث البيانات المحلية مباشرة
      setProduct({
        ...product,
        active: !product.active
      });
      
    } catch (err: any) {
      alert(err.message || 'Failed to update product status');
    } finally {
      setIsTogglingStatus(false);
    }
  };

  // دالة تحديث المخزون
  const updateStock = async (newStock: number) => {
    if (!product) return;
    
    if (newStock < 0) {
      alert('Stock cannot be negative');
      return;
    }
    
    try {
      await productAdminService.updateStock(product.id, newStock);
      
      // تحديث البيانات المحلية
      setProduct({
        ...product,
        stock: newStock
      });
      
      alert('Stock updated successfully');
    } catch (err: any) {
      alert(err.message || 'Failed to update stock');
    }
  };

  // دالة الحصول على رابط الصورة
  const getImageUrl = (imagePath: string): string => {
    const BASE_URL = 'http://localhost:5000';
    
    if (!imagePath) {
      return '/placeholder.jpg';
    }
    
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // إذا كان المسار يبدأ بـ /public/
    if (imagePath.startsWith('/public/')) {
      return `${BASE_URL}${imagePath}`;
    }
    
    // إذا كان المسار يبدأ بـ /
    if (imagePath.startsWith('/')) {
      return `${BASE_URL}${imagePath}`;
    }
    
    // افتراض أنها في مجلد public
    return `${BASE_URL}/public/${imagePath}`;
  };

  // عرض حالة التحميل
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-medium text-gray-900">Loading Product Details</h3>
          <p className="text-gray-600">Please wait...</p>
        </div>
      </div>
    );
  }

  // عرض حالة الخطأ
  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg border shadow-sm p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The product you are looking for does not exist or has been deleted.'}</p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate('/admin/products')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Go Back to Products
            </button>
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header مع أزرار التحكم */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/admin/products')}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Products
              </button>
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Product Details</h1>
                <p className="text-gray-600 text-sm mt-1">
                  ID: {product.id} • Created: {new Date(product.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {/* زر تحديث البيانات */}
              <button
                onClick={refreshProduct}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-2 transition-colors"
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              
              {/* زر المعاينة للعامة */}
              <button
                onClick={() => navigate(`/product/${product.id}`)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Eye className="h-4 w-4" />
                View Public Page
              </button>
              
              {/* زر التعديل */}
              <button
                onClick={() => navigate(`/admin/products/${product.id}/edit`)}
                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Edit className="h-4 w-4" />
                Edit Product
              </button>
              
              {/* زر تغيير الحالة */}
              <button
                onClick={toggleProductStatus}
                disabled={isTogglingStatus}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  product.active
                    ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                    : 'bg-green-100 text-green-800 hover:bg-green-200'
                }`}
              >
                {isTogglingStatus ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                    Updating...
                  </>
                ) : product.active ? (
                  <>
                    <XCircle className="h-4 w-4" />
                    Deactivate
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Activate
                  </>
                )}
              </button>
              
              {/* زر الحذف */}
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* محتوى الصفحة الرئيسي */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* العمود الأول: المعلومات الأساسية (يشغل 2/3) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* كارت المعلومات الأساسية */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        product.active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.active ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </div>
                    <p className="text-gray-600">{product.description}</p>
                  </div>
                </div>
              </div>
              
              {/* الشبكة المميزة */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* السعر */}
                <div className="bg-linear-to-br from-blue-50 to-blue-100 p-4  rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-600 rounded-lg">
                      <DollarSign className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Price</div>
                      <div className="text-2xl font-bold text-gray-900 ">${product.price.toFixed(2)}</div>
                    </div>
                  </div>
                </div>
                
                {/* المخزون */}
                <div className="bg-linear-to-br from-green-50 to-green-100 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-green-600 rounded-lg">
                      <Layers className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Stock</div>
                      <div className={`text-2xl font-bold ${
                        product.stock === 0 ? 'text-red-600' : 
                        product.stock < 10 ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {product.stock}
                      </div>
                    </div>
                  </div>
                  {product.stock < 10 && product.stock > 0 && (
                    <div className="text-xs text-yellow-700 bg-yellow-50 px-2 py-1 rounded mt-2">
                      ⚠️ Low stock
                    </div>
                  )}
                  {product.stock === 0 && (
                    <div className="text-xs text-red-700 bg-red-50 px-2 py-1 rounded mt-2">
                      ⚠️ Out of stock
                    </div>
                  )}
                </div>
                
                {/* المبيعات */}
                <div className="bg-linear-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-purple-600 rounded-lg">
                      <ShoppingBag className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Sales</div>
                      <div className="text-2xl font-bold text-gray-900">{product.sales_count || 0}</div>
                    </div>
                  </div>
                </div>
                
                {/* التقييم */}
                <div className="bg-linear-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-yellow-600 rounded-lg">
                      <Star className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Rating</div>
                      <div className="flex items-center gap-1">
                        <span className="text-2xl font-bold text-gray-900">
                          {product.average_rating ? product.average_rating.toFixed(1) : '0.0'}
                        </span>
                        <span className="text-sm text-gray-600">/5</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* معلومات الفئة */}
              <div className="p-6 border-t border-gray-100">
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Category & Details
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <div className="text-xs text-gray-500">Category</div>
                    <div className="font-medium">{product.category_name || `Category ${product.category_id}`}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Color</div>
                    <div className="font-medium flex items-center gap-2">
                      <div 
                        className="h-3 w-3 rounded-full" 
                        style={{ 
                          backgroundColor: product.color === 'أحمر' ? '#EF4444' : 
                                        product.color === 'أزرق' ? '#3B82F6' :
                                        product.color === 'أخضر' ? '#10B981' :
                                        product.color === 'أسود' ? '#000000' :
                                        product.color === 'أبيض' ? '#FFFFFF' : '#6B7280'
                        }}
                      ></div>
                      {product.color || 'Not set'}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Size</div>
                    <div className="font-medium">{product.size || 'Not set'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Brand</div>
                    <div className="font-medium">{product.brand || 'Not set'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* كارت إحصائيات المبيعات والمراجعات */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <BarChart className="h-5 w-5" />
                Analytics & Statistics
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-gray-600">Total Sales</div>
                    <ShoppingBag className="h-4 w-4 text-gray-400" />
                  </div>
                  <div className="text-2xl font-bold">{product.sales_count || 0}</div>
                  <div className="text-xs text-gray-500 mt-1">Lifetime sales</div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-gray-600">Reviews</div>
                    <Users className="h-4 w-4 text-gray-400" />
                  </div>
                  <div className="text-2xl font-bold">{product.review_count || 0}</div>
                  <div className="text-xs text-gray-500 mt-1">Customer reviews</div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-gray-600">Average Rating</div>
                    <Star className="h-4 w-4 text-gray-400" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-2xl font-bold">
                      {product.average_rating ? product.average_rating.toFixed(1) : '0.0'}
                    </div>
                    <div className="text-sm text-gray-600">out of 5</div>
                  </div>
                  <div className="flex mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.average_rating || 0) 
                            ? 'text-yellow-400 fill-yellow-400' 
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h4 className="font-medium text-gray-700 mb-3">Quick Actions</h4>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => updateStock(product.stock + 10)}
                    className="px-4 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg text-sm font-medium"
                  >
                    Add 10 to Stock
                  </button>
                  <button
                    onClick={() => updateStock(product.stock - 10)}
                    disabled={product.stock < 10}
                    className="px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg text-sm font-medium disabled:opacity-50"
                  >
                    Remove 10 from Stock
                  </button>
                  <button
                    onClick={() => {
                      const newStock = prompt('Enter new stock quantity:', product.stock.toString());
                      if (newStock && !isNaN(parseInt(newStock))) {
                        updateStock(parseInt(newStock));
                      }
                    }}
                    className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg text-sm font-medium"
                  >
                    Set Custom Stock
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* العمود الثاني: الصور والمعلومات الجانبية (يشغل 1/3) */}
          <div className="space-y-6">
            
            {/* كارت الصور */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Product Images ({product.image_urls.length})
                </h3>
              </div>
              
              <div className="p-6">
<div className="space-y-4">
  {product.image_urls.length === 0 ? (
    <div className="text-center py-8">
      <ImageIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
      <p className="text-gray-500">No images uploaded</p>
    </div>
  ) : (
    <>
      {/* الصورة الرئيسية - محسنة للشاشات الصغيرة */}
      <div className="relative rounded-lg overflow-hidden h-48 md:h-64 lg:h-48">
        <img
          src={getImageUrl(product.image_urls[0])}
          alt="Main product image"
          className="w-full h-full object-contain"
          onError={(e) => {
            e.currentTarget.src = '/placeholder.jpg';
          }}
        />
        <div className="absolute top-2 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
          Main Image
        </div>
      </div>
      
      {/* الصور المصغرة - محسنة للاستجابة */}
      {product.image_urls.length > 1 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-2 gap-2">
          {product.image_urls.slice(1).map((imageUrl, index) => (
            <div 
              key={index + 1} 
              className="relative rounded-lg overflow-hidden bg-gray-100 aspect-square"
            >
              <img
                src={getImageUrl(imageUrl)}
                alt={`Product image ${index + 2}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.jpg';
                }}
              />
              <div className="absolute top-1 right-1 bg-black/70 text-white text-xs px-1 py-0.5 rounded">
                {index + 2}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )}
</div>
                
                <button
                  onClick={() => navigate(`/admin/products/${product.id}/edit`)}
                  className="w-full mt-4 px-4 py-3 border-2 border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-lg text-gray-700 flex items-center justify-center gap-2 transition-colors"
                >
                  <ImageIcon className="h-4 w-4" />
                  Edit Images
                </button>
              </div>
            </div>
            
            {/* كارت المعلومات الفنية */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="font-bold text-lg mb-4">Technical Specifications</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Gender</span>
                  </div>
                  <span className="font-medium capitalize">{product.gender || 'Not set'}</span>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Season</span>
                  <span className="font-medium capitalize">{product.season || 'Not set'}</span>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Material</span>
                  <span className="font-medium">{product.material || 'Not set'}</span>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Style</span>
                  <span className="font-medium">{product.style || 'Not set'}</span>
                </div>
              </div>
            </div>
            
            {/* كارت التواريخ */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Timeline & History
              </h3>
              
              <div className="space-y-4">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Created Date</div>
                  <div className="font-medium">
                    {new Date(product.created_at).toLocaleString()}
                  </div>
                </div>
                
                {product.updated_at && (
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Last Updated</div>
                    <div className="font-medium">
                      {new Date(product.updated_at).toLocaleString()}
                    </div>
                  </div>
                )}
                
                <div className="pt-4 border-t border-gray-100">
                  <div className="text-xs text-gray-500 mb-2">Product Age</div>
                  <div className="font-medium">
                    {Math.floor((new Date().getTime() - new Date(product.created_at).getTime()) / (1000 * 60 * 60 * 24))} days old
                  </div>
                </div>
              </div>
            </div>
            
            {/* كارت الإجراءات السريعة */}
            <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 p-6">
              <h3 className="font-bold text-lg mb-4 text-blue-900">Quick Actions</h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => navigate(`/admin/products/create?duplicate=${product.id}`)}
                  className="w-full px-4 py-3 bg-white hover:bg-blue-50 border border-blue-200 text-blue-700 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <Package className="h-4 w-4" />
                  Duplicate Product
                </button>
                
                <button
                  onClick={() => navigate(`/admin/orders?product=${product.id}`)}
                  className="w-full px-4 py-3 bg-white hover:bg-blue-50 border border-blue-200 text-blue-700 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <ShoppingBag className="h-4 w-4" />
                  View Related Orders
                </button>
                
                <button
                  onClick={() => navigate(`/product/${product.id}/reviews`)}
                  className="w-full px-4 py-3 bg-white hover:bg-blue-50 border border-blue-200 text-blue-700 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <Star className="h-4 w-4" />
                  Manage Reviews
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* ملاحظات إضافية في الأسفل */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Package className="h-5 w-5 text-yellow-700" />
            </div>
            <div>
              <h4 className="font-medium text-yellow-800">Admin Notes</h4>
              <p className="text-yellow-700 text-sm mt-1">
                This page displays all product information for administrative purposes. 
                Changes made here affect the public store. Use with caution.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProductDetailsPage;