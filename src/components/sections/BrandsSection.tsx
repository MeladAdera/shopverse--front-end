// src/components/sections/BrandsSection.tsx
import React from 'react';
import { 
  Brand1Svg, 
  Brand2Svg, 
  Brand3Svg, 
  Brand4Svg, 
  Brand5Svg 
} from '@/components/svg/BrandSvgs';

const BrandsSection: React.FC = () => {
  const brands = [
    { id: 1, svg: <Brand1Svg />, className: "w-32 md:w-40" },
    { id: 2, svg: <Brand2Svg />, className: "w-20 md:w-28" },
    { id: 3, svg: <Brand3Svg />, className: "w-28 md:w-40" },
    { id: 4, svg: <Brand4Svg />, className: "w-28 md:w-40" },
    { id: 5, svg: <Brand5Svg />, className: "w-32 md:w-48" },
  ];

  return (
    <div className="bg-black py-6 px-4">
      <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12 max-w-6xl mx-auto">
        {brands.map((brand) => (
          <div key={brand.id} className={brand.className}>
            {brand.svg}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrandsSection;