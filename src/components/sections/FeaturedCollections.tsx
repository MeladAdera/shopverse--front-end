import React from 'react';
import { featuredSvg } from '@/components/svg/titleSvgs';

interface FeaturedCollectionsProps {
  titleSvg?: React.ReactNode;
}

const FeaturedCollections: React.FC<FeaturedCollectionsProps> = ({ titleSvg = featuredSvg() }) => {
  return (
    <section className="px-4 md:px-8 py-8 md:py-12 bg-white">
      <div className="max-w-6xl mx-auto">
        
        {/* Section Title */}
        <div className="flex justify-center items-center py-6 md:py-8 mb-6 md:mb-8">
          <div className="w-full max-w-[300px] md:max-w-[400px] lg:max-w-[684px]">
            {titleSvg}
          </div>
        </div>
        
        {/* Photo Grid */}
        <div className="space-y-4 md:space-y-6">
          
          {/* First Row */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            {/* Big Photo */}
            <div className="md:flex-3 h-[200px] sm:h-[250px] md:h-[350px] rounded-xl overflow-hidden">
              <img 
                src="/image copy 2.png" 
                alt="Summer Collection"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Small Photo */}
            <div className="md:flex-2 h-[200px] sm:h-[250px] md:h-[350px] rounded-xl overflow-hidden">
              <img 
                src="/image copy 3.png" 
                alt="Men's Fashion"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          {/* Second Row */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            {/* Small Photo */}
            <div className="md:flex-2 h-[200px] sm:h-[250px] md:h-[350px] rounded-xl overflow-hidden">
              <img 
                src="/image.png" 
                alt="Jackets"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Big Photo */}
            <div className="md:flex-3 h-[200px] sm:h-[250px] md:h-[350px] rounded-xl overflow-hidden">
              <img 
                src="/image copy.png" 
                alt="Winter Collection"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollections;