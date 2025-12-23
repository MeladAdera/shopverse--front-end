// 📁 app/products/components/ProductsGrid.tsx
import { useState, useEffect } from "react";
import { Grid, List } from "lucide-react";
import ProductCard from "./ProductCard";
import { PaginationWrapper } from "./PaginationWrapper";
import { useParams } from 'react-router-dom';
import ImageService from '@/lib/imageService';
import { productService } from '@/services/product.service';

function ProductsGrid() {
  const { id } = useParams<{ id?: string }>();
  const categoryId = id ? parseInt(id) : undefined;
  
  // 🎯 State للبيانات والتحميل
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 🎯 Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [itemsPerPage, setItemsPerPage] = useState(9);

  // 🔄 جلب البيانات مباشرة من Service
  const fetchProducts = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🔄 جلب المنتجات...', { categoryId });
      
      let fetchedProducts: any[] = [];
      
      if (categoryId) {
        // استدعاء Service مباشرة
        fetchedProducts = await productService.getProductsByCategory(categoryId);
      } else {
        // جلب كل المنتجات
        fetchedProducts = await productService.getProducts();
      }
      
      // تحويل الصور باستخدام ImageService
      const transformedProducts = ImageService.transformProducts(fetchedProducts);
      setProducts(transformedProducts);
      
      console.log('✅ تم جلب المنتجات:', transformedProducts.length);
      
    } catch (err: any) {
      console.error('❌ خطأ في جلب المنتجات:', err);
      setError(err.message || 'حدث خطأ في جلب المنتجات');
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 📥 جلب البيانات عند التحميل أو تغيير التصنيف
  useEffect(() => {
    fetchProducts();
  }, [categoryId]);

  // 📄 حساب الصفحات
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  // 🔄 تغيير الصفحة
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // 🔄 إعادة تحميل البيانات
  const handleRetry = () => {
    fetchProducts();
  };

  // ⏳ التحميل
  if (isLoading) {
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
  if (products.length === 0 && !isLoading) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 inline-block">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">لا توجد منتجات</h3>
          <p className="text-gray-600">
            {categoryId 
              ? "لا توجد منتجات في هذه الفئة" 
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
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">
            {categoryId ? `منتجات التصنيف` : 'جميع المنتجات'}
          </h2>
          <p className="text-gray-600">
            عرض {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, products.length)} 
            من أصل {products.length} منتج
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

      {/* Products Grid */}
      <div className={viewMode === "grid" 
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        : "space-y-6"
      }>
        {currentProducts.map((product: any) => (
          viewMode === "grid" ? (
            <ProductCard key={product.id} product={product} />
          ) : (
            <div key={product.id} className="bg-white p-6 rounded-lg shadow border">
              <div className="flex gap-4">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-32 h-32 object-cover rounded"
                />
                <div>
                  <h3 className="font-bold text-lg">{product.name}</h3>
                  <p className="text-gray-600">${product.price}</p>
                  <p className="text-sm text-gray-500">{product.category}</p>
                </div>
              </div>
            </div>
          )
        ))}
      </div>

      {/* Pagination */}
      {products.length > itemsPerPage && (
        <PaginationWrapper
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={products.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={setItemsPerPage}
        />
      )}
    </div>
  );
}

export default ProductsGrid;