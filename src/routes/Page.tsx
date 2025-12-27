// 📁 app/products/page.tsx
import { FilterProvider } from '@/context/FilterContext';
import CategorySidebar from "../components/productdatails/CategorySidebar";
import Footer from "../components/ui/Footer";
import Subscribe from "../components/ui/Subscribe";
import ProductsGrid from '../components/porducts/ProductsGrid';

export default function ProductsPage() {
  return (
    // 👇 لف كل المكونات بـ FilterProvider
    <FilterProvider>
      <div className="min-h-screen bg-gray-50">
        <main className="container mx-auto px-4 sm:px-6 py-4 md:py-6">
          <div className="flex flex-col lg:flex-row gap-6 md:gap-6">
            {/* Sidebar - الآن تقدر تستخدم useFilters */}
            <div className="lg:w-1/4">
              <CategorySidebar />
            </div>
            
            {/* Products Grid */}
            <div className="lg:w-3/4">
              <ProductsGrid />
            </div>
          </div>
        </main>
        <Subscribe />
        <Footer />
      </div>
    </FilterProvider>
  );
}