import React from 'react';
import { Button } from '@/components/ui/button';
import LogoSvg from '@/components/svg/LogoSvg';

const HeroSection: React.FC = () => {
  const stats = [
    { value: "200+", label: "International Brands" },
    { value: "2,000+", label: "High-Quality Products" },
    { value: "30,000+", label: "Happy Customers" },
  ];

  return (
    <section className="w-full px-4 md:px-8 py-6 md:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 items-center max-w-7xl mx-auto">
        
        {/* Left side - المحتوى */}
        <div className="flex flex-col justify-between gap-4 md:gap-8">
          {/* Logo */}
          <div className="w-full max-w-[300px] md:max-w-[552px] mx-auto lg:mx-0">
            <LogoSvg />
          </div>
          
          {/* Hero Text */}
          <div className="text-center lg:text-left">
            <p className="text-lg md:text-2xl lg:text-3xl font-medium text-gray-800 leading-relaxed">
              Browse through our diverse range of meticulously crafted garments, designed
            </p>
            <span className="text-base md:text-xl text-gray-600">
              to bring out your individuality and cater to your sense of style
            </span>
          </div>
          
          {/* CTA Button */}
          <div className="flex justify-center lg:justify-start">
            <Button 
              variant="outline" 
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-black text-white font-bold border-2 border-black hover:bg-gray-800 transition-colors text-base md:text-[22px] px-6 md:px-12 py-3 md:py-6"
            >
              shopNow
            </Button>
          </div>
          
          {/* Stats Section */}
          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 md:gap-10 mt-4">
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col items-center sm:items-start">
                <span className="text-2xl md:text-3xl font-bold text-black">{stat.value}</span>
                <span className="text-gray-600 text-sm md:text-base">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Right side - الصورة */}
        <div className="order-1 lg:order-2">
          <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]">
            <img 
              src="/ecommerce.png" 
              alt="Fashion model"
              className="w-full h-full object-cover rounded-xl md:rounded-2xl"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;