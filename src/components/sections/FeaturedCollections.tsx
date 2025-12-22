import React from 'react';
import { featuredSvg } from '@/components/svg/titleSvgs';
import { Link } from 'react-router-dom';

interface FeaturedCollectionsProps {
  titleSvg?: React.ReactNode;
}

const FeaturedCollections: React.FC<FeaturedCollectionsProps> = ({ 
  titleSvg = featuredSvg() 
}) => {
  // بيانات المجموعات المميزة مع روابط التصنيفات
  const collections = [
    {
      id: 1,
      title: "Summer Collection",
      image: "/image copy 2.png",
      categoryId: 6, // clothes
      description: "أحدث تشكيلة صيفية"
    },
    {
      id: 2,
      title: "Men's Fashion",
      image: "/image copy 3.png",
      categoryId: 5, // electronics
      description: "موضة رجالية عصرية"
    },
    {
      id: 3,
      title: "Jackets",
      image: "/image.png",
      categoryId: 6, // clothes
      description: "سترات وأنواع الجواكت"
    },
    {
      id: 4,
      title: "Winter Collection",
      image: "/image copy.png",
      categoryId: 3, // home
      description: "تشكيلة شتوية دافئة"
    }
  ];

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
            <Link 
              to={`/category/${collections[0].categoryId}`}
              className="md:flex-3 h-[200px] sm:h-[250px] md:h-[350px] rounded-xl overflow-hidden group relative"
            >
              <img 
                src={collections[0].image} 
                alt={collections[0].title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <div className="text-white">
                  <h3 className="text-xl font-bold mb-2">{collections[0].title}</h3>
                  <p className="text-sm opacity-90">{collections[0].description}</p>
                  <span className="inline-block mt-3 text-sm font-medium border-b border-white">
                    تصفح المنتجات →
                  </span>
                </div>
              </div>
            </Link>
            
            {/* Small Photo */}
            <Link 
              to={`/category/${collections[1].categoryId}`}
              className="md:flex-2 h-[200px] sm:h-[250px] md:h-[350px] rounded-xl overflow-hidden group relative"
            >
              <img 
                src={collections[1].image} 
                alt={collections[1].title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <div className="text-white">
                  <h3 className="text-lg font-bold mb-1">{collections[1].title}</h3>
                  <p className="text-xs opacity-90">{collections[1].description}</p>
                </div>
              </div>
            </Link>
          </div>
          
          {/* Second Row */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            {/* Small Photo */}
            <Link 
              to={`/category/${collections[2].categoryId}`}
              className="md:flex-2 h-[200px] sm:h-[250px] md:h-[350px] rounded-xl overflow-hidden group relative"
            >
              <img 
                src={collections[2].image} 
                alt={collections[2].title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <div className="text-white">
                  <h3 className="text-lg font-bold mb-1">{collections[2].title}</h3>
                  <p className="text-xs opacity-90">{collections[2].description}</p>
                </div>
              </div>
            </Link>
            
            {/* Big Photo */}
            <Link 
              to={`/category/${collections[3].categoryId}`}
              className="md:flex-3 h-[200px] sm:h-[250px] md:h-[350px] rounded-xl overflow-hidden group relative"
            >
              <img 
                src={collections[3].image} 
                alt={collections[3].title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <div className="text-white">
                  <h3 className="text-xl font-bold mb-2">{collections[3].title}</h3>
                  <p className="text-sm opacity-90">{collections[3].description}</p>
                  <span className="inline-block mt-3 text-sm font-medium border-b border-white">
                    تصفح المنتجات →
                  </span>
                </div>
              </div>
            </Link>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollections;