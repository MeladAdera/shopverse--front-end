// 📁 components/products/ProductsGrid.tsx (Updated)
import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Grid, List, ArrowUpDown } from "lucide-react";
import ProductCard from "./ProductCard";
import { PaginationWrapper } from "./PaginationWrapper";
import { useFilteredData } from '@/hooks/useFilteredData';
import ImageService from '@/lib/imageService';

// Define sort options type
type SortOption = 'popular' | 'price-low-high' | 'price-high-low' | 'name-a-z' | 'name-z-a' | 'newest';

function ProductsGrid() {
  const { id } = useParams<{ id?: string }>();
  const categoryId = id ? parseInt(id) : undefined;
  
  // 🎯 Use the integrated hook
  const { 
    products: filteredProducts, 
    filters,
    getFilterSummary
  } = useFilteredData();
  
  // 🎯 Pagination & View state
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [itemsPerPage, setItemsPerPage] = useState(9);
  
  // 🎯 Sorting state
  const [sortOption, setSortOption] = useState<SortOption>('popular');

  // 🔄 Fetch data based on filters
  useEffect(() => {
    console.log('🔍 [ProductsGrid] Effect triggered:', { 
      categoryId, 
      filters,
      sortOption,
      productsCount: filteredProducts.length 
    });
    
    // Reset to first page when filters or sorting change
    setCurrentPage(1);
  }, [categoryId, filters, filteredProducts.length, sortOption]);

  // 📄 Transform images
  const transformedProducts = ImageService.transformProducts(filteredProducts);
  
  // 🎯 Apply sorting to products
  const sortedProducts = useMemo(() => {
    console.log('🔄 Sorting products with option:', sortOption);
    
    // Create a copy to avoid mutating original array
    const productsToSort = [...transformedProducts];
    
    switch (sortOption) {
      case 'price-low-high':
        return productsToSort.sort((a, b) => a.price - b.price);
      
      case 'price-high-low':
        return productsToSort.sort((a, b) => b.price - a.price);
      
      case 'name-a-z':
        return productsToSort.sort((a, b) => a.name.localeCompare(b.name));
      
      case 'name-z-a':
        return productsToSort.sort((a, b) => b.name.localeCompare(a.name));
      
      case 'newest':
        // Assuming you have a createdAt field
        return productsToSort.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
      
      case 'popular':
      default:
        // For popular, you might have a rating or sales count field
        // Fallback to default order (as returned by API)
        return productsToSort;
    }
  }, [transformedProducts, sortOption]);

  // 📄 Calculate pagination based on SORTED products
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

  // 🎯 Handle sort change
  const handleSortChange = (value: string) => {
    setSortOption(value as SortOption);
  };

  // 🔄 Change page
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // 🔄 Reload data

  // Active filters information
  const activeFilters = getFilterSummary();
  const hasCategoryId = !!categoryId;

  // ... rest of loading, error, and no products states remain the same ...

  return (
    <div className="space-y-8">
      {/* Header with filter information */}
      <div className="space-y-4">
        {/* Active filters display */}
        {activeFilters.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-blue-800">🎯 Active Filters</h3>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                {activeFilters.length} filter(s)
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

        {/* Title and statistics */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold">
              {hasCategoryId ? `Category Products` : 'All Products'}
              {filters.category && <span className="text-gray-600"> - {filters.category}</span>}
            </h2>
            <p className="text-gray-600">
              Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, sortedProducts.length)} 
              of {sortedProducts.length} products
              {activeFilters.length > 0 && ' (filtered)'}
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
            
            {/* Sort Dropdown - UPDATED */}
            <div className="relative">
              <select 
                value={sortOption}
                onChange={(e) => handleSortChange(e.target.value)}
                className="border rounded-lg px-3 py-2 appearance-none bg-white cursor-pointer min-w-[180px]"
              >
                <option value="popular">Sort by: Most Popular</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="name-a-z">Name: A to Z</option>
                <option value="name-z-a">Name: Z to A</option>
                <option value="newest">Newest Arrivals</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <ArrowUpDown size={16} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid - using sortedProducts */}
      <div className={viewMode === "grid" 
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        : "space-y-6"
      }>
        {currentProducts.map((product: any) => {
          // 🔍 Check product data
          console.log('📦 [ProductsGrid] Rendering product:', {
            id: product.id,
            name: product.name,
            price: product.price,
            typeOfId: typeof product.id
          });

          if (!product.id) {
            console.warn('⚠️ [ProductsGrid] Product without ID:', product);
            return null;
          }

          return viewMode === "grid" ? (
            <ProductCard key={product.id} product={product} />
          ) : (
            // 🔧 For list view
            <div 
              key={product.id} 
              className="bg-white p-6 rounded-lg shadow border hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => {
                console.log('🖱️ Clicked product from list:', product.id);
              }}
            >
              <div className="flex gap-4">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-32 h-32 object-cover rounded"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.jpg';
                  }}
                />
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-2 hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-xl font-semibold mb-1">${product.price}</p>
                  <p className="text-sm text-gray-500 mb-3">{product.category}</p>
                  <p className="text-gray-700 line-clamp-2">{product.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {sortedProducts.length > itemsPerPage && (
        <PaginationWrapper
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={sortedProducts.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={setItemsPerPage}
        />
      )}
    </div>
  );
}

export default ProductsGrid;