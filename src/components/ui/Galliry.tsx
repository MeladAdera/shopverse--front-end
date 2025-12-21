// src/components/ui/Galliry.tsx
import React from 'react';
import type { Product } from '@/types';

// تعريف Props للمكونات
interface ProductCardProps {
  product: Product;
  StarRating?: React.ComponentType<{ rating: number }>;
}

interface GalliryProps {
  titleSvg: React.ReactNode;  // أي عنصر React (مثل SVG)
  products?: Product[];        // اختياري، قيمة افتراضية []
  StarRating?: React.ComponentType<{ rating: number }>; // مكون النجوم الاختياري
}

function ProductCard({ product, StarRating }: ProductCardProps) {
  return (
    <div className="group cursor-pointer">
      <div className="relative overflow-hidden rounded-lg bg-gray-100">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-48 md:h-80 object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {product.discount && (
          <div className="absolute top-2 right-2 md:top-3 md:right-3 bg-red-500 text-white px-2 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-bold">
            {product.discount}
          </div>
        )}
      </div>
      
      <div className="mt-3 md:mt-4 space-y-1 md:space-y-2">
        <p className="text-xs md:text-sm text-gray-500">{product.category}</p>
        <h3 className="font-semibold text-sm md:text-base text-gray-800 line-clamp-2">{product.name}</h3>
        
        {/* استخدام مكون النجوم إذا تم تمريره */}
        <div className="flex items-center gap-1">
          {StarRating ? (
            <StarRating rating={product.rating} />
          ) : (
            <div className="flex items-center">
              <div className="flex text-yellow-400 text-sm md:text-base">
                {'★'.repeat(Math.floor(product.rating))}
                {'☆'.repeat(5 - Math.floor(product.rating))}
              </div>
              <span className="text-xs md:text-sm text-gray-500 ml-1">({product.rating})</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-base md:text-xl font-bold text-gray-900">${product.price}</span>
          {product.originalPrice && (
            <span className="text-xs md:text-sm text-gray-500 line-through">${product.originalPrice}</span>
          )}
        </div>
      </div>
    </div>
  );
}

function Galliry({ 
  titleSvg, 
  products = [],
  StarRating 
}: GalliryProps) {
  return (
    <section className="px-4 md:px-8 py-8 bg-white">
      {/* Section title */}
      <div className="flex justify-center items-center py-6 md:py-10">
        <div className="w-full max-w-[300px] md:max-w-[401px]">
          {titleSvg}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
        {products.map((product) => (
          <div 
            key={product.id} 
            className="group cursor-pointer"
          >
            <ProductCard product={product} StarRating={StarRating} />
          </div>
        ))}
      </div>
      
      {/* View All Button */}
      <div className="text-center py-6 md:py-8">
        <button className="px-6 md:px-8 py-2 md:py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors font-semibold text-sm md:text-base">
          View All 
        </button>
      </div>
    </section>
  );
}

export default Galliry;