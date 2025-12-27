// 📁 components/products/ProductsGrid.tsx (تم التصحيح)
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Grid, List } from "lucide-react";
import ProductCard from "./ProductCard";
import { PaginationWrapper } from "./PaginationWrapper";
import { useFilteredData } from '@/hooks/useFilteredData';
import ImageService from '@/lib/imageService';

function ProductsGrid() {
  const { id } = useParams<{ id?: string }>();
  const categoryId = id ? parseInt(id) : undefined;
  
  // 🎯 استخدم الهوك المدمج
  const { 
    products: filteredProducts, 
    loading, 
    error, 
    filters,
    getFilterSummary
  } = useFilteredData();
  
  // 🎯 Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [itemsPerPage, setItemsPerPage] = useState(9);

  // 🔄 جلب البيانات بناءً على الفلاتر
  useEffect(() => {
    console.log('🔍 [ProductsGrid] Effect triggered:', { 
      categoryId, 
      filters,
      productsCount: filteredProducts.length 
    });
    
    // لا نحتاج لجلب البيانات يدوياً، useFilteredData سيفعلها تلقائياً
  }, [categoryId, filters, filteredProducts.length]);

  // 📄 تحويل الصور بعد الجلب
  const transformedProducts = ImageService.transformProducts(filteredProducts);
  
  // 📄 حساب الصفحات
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = transformedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(transformedProducts.length / itemsPerPage);

  // 🔄 تغيير الصفحة
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // 🔄 إعادة تحميل البيانات
  const handleRetry = () => {
    console.log('🔄 طلب إعادة تحميل البيانات');
    // يمكن إضافة وظيفة إعادة الجلب هنا إذا لزم
  };

  // معلومات الفلاتر النشطة
  const activeFilters = getFilterSummary();
  const hasCategoryId = !!categoryId;

  // ⏳ التحميل
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-black mb-4"></div>
          <p className="text-gray-600">جاري تحميل المنتجات...</p>
        </div>
      </div>
    );
  }

  // ❌ خطأ
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 inline-block">
          <h3 className="text-xl font-semibold text-red-800 mb-2">حدث خطأ</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            حاول مرة أخرى
          </button>
        </div>
      </div>
    );
  }

  // 📭 لا توجد منتجات
  if (transformedProducts.length === 0 && !loading) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 inline-block">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">لا توجد منتجات</h3>
          <p className="text-gray-600">
            {hasCategoryId || activeFilters.length > 0 
              ? "لا توجد منتجات تطابق الفلاتر المحددة" 
              : "لم يتم العثور على أي منتجات"
            }
          </p>
          <button
            onClick={handleRetry}
            className="mt-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            تحديث
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header مع معلومات الفلاتر */}
      <div className="space-y-4">
        {/* معلومات الفلاتر النشطة */}
        {activeFilters.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-blue-800">🎯 الفلاتر المطبقة</h3>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                {activeFilters.length} فلتر
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {activeFilters.map((filter, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-white border border-blue-300 text-blue-700 text-sm rounded-full"
                >
                  {filter}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* العنوان والإحصائيات */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold">
              {hasCategoryId ? `منتجات التصنيف` : 'جميع المنتجات'}
              {filters.category && <span className="text-gray-600"> - {filters.category}</span>}
            </h2>
            <p className="text-gray-600">
              عرض {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, transformedProducts.length)} 
              من أصل {transformedProducts.length} منتج
              {activeFilters.length > 0 && ' (مفلتر)'}
            </p>
          </div>
          
          <div className="flex gap-3">
            {/* View Toggle */}
            <div className="flex border rounded-lg">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${viewMode === "grid" ? "bg-black text-white" : "bg-white"}`}
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${viewMode === "list" ? "bg-black text-white" : "bg-white"}`}
              >
                <List size={18} />
              </button>
            </div>
            
            {/* Sort */}
            <select className="border rounded-lg px-3 py-2">
              <option>ترتيب حسب: الأكثر شيوعاً</option>
              <option>السعر: من الأقل إلى الأعلى</option>
              <option>السعر: من الأعلى إلى الأقل</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className={viewMode === "grid" 
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        : "space-y-6"
      }>
        {currentProducts.map((product: any) => (
          viewMode === "grid" ? (
            <ProductCard key={product.id} product={product} />
          ) : (
            <div key={product.id} className="bg-white p-6 rounded-lg shadow border hover:shadow-md transition-shadow">
              <div className="flex gap-4">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-32 h-32 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-xl font-semibold mb-1">${product.price}</p>
                  <p className="text-sm text-gray-500 mb-3">{product.category}</p>
                  <p className="text-gray-700 line-clamp-2">{product.description}</p>
                </div>
              </div>
            </div>
          )
        ))}
      </div>

      {/* Pagination */}
      {transformedProducts.length > itemsPerPage && (
        <PaginationWrapper
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={transformedProducts.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={setItemsPerPage}
        />
      )}

    </div>
  );
}

export default ProductsGrid