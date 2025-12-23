// 📁 app/page.tsx (أو Homepage.tsx)
import React, { useState, useEffect } from 'react';

// المكونات
import HeroSection from '@/components/sections/HeroSection';
import BrandsSection from '@/components/sections/BrandsSection';
import Galliry from '@/components/ui/Galliry';
import FeaturedCollections from '@/components/sections/FeaturedCollections';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import Subscribe from '@/components/ui/Subscribe';
import Footer from '@/components/ui/Footer';

// البيانات الوهمية
import { testimonials } from '@/data/testimonials';
import { topSellingSvg, newArrivalsSvg, featuredSvg, testimonialsSvg } from '@/components/svg/titleSvgs';

// المكونات المساعدة
import { StarRating } from '@/components/ui/StarRating';
import PaymentIcons from '@/components/ui/PaymentIcons';

// Service مباشرة
import { productService } from '@/services/product.service';
import { Skeleton } from '@/components/ui/skeleton';

const Homepage: React.FC = () => {
  // حالة البيانات
  const [newArrivalsData, setNewArrivalsData] = useState<any[]>([]);
  const [topSellingData, setTopSellingData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // جلب البيانات
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🔄 جلب بيانات الصفحة الرئيسية...');
      
      // جلب البيانات من Service مباشرة
      const [newArrivals, topSelling] = await Promise.all([
        productService.getNewArrivals(4),
        productService.getTopSelling(4)
      ]);
      
      console.log('✅ تم جلب البيانات:', {
        newArrivals: newArrivals.length,
        topSelling: topSelling.length
      });
      
      setNewArrivalsData(newArrivals);
      setTopSellingData(topSelling);
      
    } catch (err: any) {
      console.error('❌ خطأ في جلب البيانات:', err);
      setError(err.message || 'حدث خطأ في تحميل البيانات');
    } finally {
      setIsLoading(false);
    }
  };

  // جلب البيانات عند التحميل
  useEffect(() => {
    fetchData();
  }, []);

  // Skeleton للتحميل
  const renderSkeletonGrid = () => (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="h-48 md:h-80 w-full rounded-lg" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );

  // حالة الخطأ
  if (error && !isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-red-50 rounded-lg">
          <h3 className="text-lg font-semibold text-red-700 mb-2">⚠️ خطأ في تحميل البيانات</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchData}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <HeroSection />

      {/* Brands Section */}
      <BrandsSection />

      {/* Top Selling Products */}
      <section className="px-4 md:px-8 py-8 bg-white">
        {isLoading ? (
          renderSkeletonGrid()
        ) : (
          <Galliry 
            titleSvg={topSellingSvg()}
            apiProducts={topSellingData}
            StarRating={StarRating}
          />
        )}
      </section>

      {/* New Arrivals */}
      <section className="px-4 md:px-8 py-8 bg-white">
        {isLoading ? (
          renderSkeletonGrid()
        ) : (
          <Galliry 
            titleSvg={newArrivalsSvg()}
            apiProducts={newArrivalsData}
            StarRating={StarRating}
          />
        )}
      </section>

      {/* Featured Collections */}
      <FeaturedCollections 
        titleSvg={featuredSvg()}
      />

      {/* Testimonials */}
      <TestimonialsSection 
        titleSvg={testimonialsSvg()}
        testimonials={testimonials}
        StarRating={StarRating}
      />

      {/* Newsletter */}
      <Subscribe />

      {/* Footer */}
      <Footer />

      {/* Payment Section */}
      <section className="bg-white py-8 px-4 md:px-8 border-t border-gray-300">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center mb-8">
            <div className="w-full max-w-5xl border-t border-gray-300" />
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-gray-600 text-sm">
              <p>Shop.co © 2000-2023, All Rights Reserved</p>
            </div>
            
            <PaymentIcons />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;