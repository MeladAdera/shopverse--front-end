import React, { useEffect } from 'react';

// المكونات
import HeroSection from '@/components/sections/HeroSection';
import BrandsSection from '@/components/sections/BrandsSection';
import Galliry from '@/components/ui/Galliry';
import FeaturedCollections from '@/components/sections/FeaturedCollections';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import Subscribe from '@/components/ui/Subscribe';
import Footer from '@/components/ui/Footer';

// البيانات الوهمية (للاحتياط)
import { testimonials } from '@/data/testimonials';
import { topSellingSvg, newArrivalsSvg, featuredSvg, testimonialsSvg } from '@/components/svg/titleSvgs';

// المكونات المساعدة
import { StarRating } from '@/components/ui/StarRating';
import PaymentIcons from '@/components/ui/PaymentIcons';

// API Hooks - جديد
import { useNewArrivals, useTopSelling } from '@/hooks/useProducts';
import { Skeleton } from '@/components/ui/skeleton';


const Homepage: React.FC = () => {
  // استخدام الـ hooks لتحميل البيانات الحقيقية
  const { 
    data: newArrivalsData = [], 
    isLoading: isLoadingNewArrivals,
    error: errorNewArrivals,
    refetch: refetchNewArrivals 
  } = useNewArrivals(4);
  
  const { 
    data: topSellingData = [], 
    isLoading: isLoadingTopSelling,
    error: errorTopSelling,
    refetch: refetchTopSelling 
  } = useTopSelling(4);

  // للتحقق من البيانات في console
  useEffect(() => {
    if (newArrivalsData.length > 0) {
      console.log('📦 New Arrivals loaded:', newArrivalsData);
    }
    if (topSellingData.length > 0) {
      console.log('🔥 Top Selling loaded:', topSellingData);
    }
  }, [newArrivalsData, topSellingData]);

  // حالة التحميل
  
  // حالة الخطأ
  const hasError = errorNewArrivals || errorTopSelling;

  // دالة لإعادة تحميل البيانات
  const handleRetry = () => {
    refetchNewArrivals();
    refetchTopSelling();
  };

  // عرض Skeleton أثناء التحميل
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
  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-red-50 rounded-lg">
          <h3 className="text-lg font-semibold text-red-700 mb-2">⚠️ خطأ في تحميل البيانات</h3>
          <p className="text-red-600 mb-4">
            {errorNewArrivals?.message || errorTopSelling?.message || 'حدث خطأ غير معروف'}
          </p>
          <button 
            onClick={handleRetry}
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
        <div className="flex justify-center items-center py-6 md:py-10">
          <div className="w-full max-w-[300px] md:max-w-[401px]">
          </div>
        </div>

        {isLoadingTopSelling ? (
          renderSkeletonGrid()
        ) : (
          <Galliry 
            titleSvg={topSellingSvg()}
            products={topSellingData}
            StarRating={StarRating}
          />
        )}
      </section>

      {/* New Arrivals */}
      <section className="px-4 md:px-8 py-8 bg-white">
        <div className="flex justify-center items-center py-6 md:py-10">
          <div className="w-full max-w-[300px] md:max-w-[343px]">
          </div>
        </div>

        {isLoadingNewArrivals ? (
          renderSkeletonGrid()
        ) : (
          <Galliry 
            titleSvg={newArrivalsSvg()}
            products={newArrivalsData}
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