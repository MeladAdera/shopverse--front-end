// src/routes/Homepage.tsx
import React from 'react';

// المكونات
import HeroSection from '@/components/sections/HeroSection';
import BrandsSection from '@/components/sections/BrandsSection';
import Galliry from '@/components/ui/Galliry';
import FeaturedCollections from '@/components/sections/FeaturedCollections';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import Subscribe from '@/components/ui/Subscribe';
import Footer from '@/components/ui/Footer';

// البيانات
import { topSellingProducts, newArrivalsProducts } from '@/data/products';
import { testimonials } from '@/data/testimonials';

// SVG العناوين
import { topSellingSvg, newArrivalsSvg, featuredSvg, testimonialsSvg } from '@/components/svg/titleSvgs';

// المكونات المساعدة
import { StarRating } from '@/components/ui/StarRating';
import PaymentIcons from '@/components/ui/PaymentIcons';

const Homepage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <HeroSection />

      {/* Brands Section */}
      <BrandsSection />

      {/* Top Selling Products */}
      <Galliry 
        titleSvg={topSellingSvg()}
        products={topSellingProducts}
        StarRating={StarRating}
      />

      {/* New Arrivals */}
      <Galliry 
        titleSvg={newArrivalsSvg()}
        products={newArrivalsProducts}
        StarRating={StarRating}
      />

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