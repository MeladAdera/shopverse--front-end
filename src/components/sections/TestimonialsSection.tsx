import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { testimonialsSvg } from '@/components/svg/titleSvgs';
import type { StarRatingProps } from '@/types/';

interface Testimonial {
  id: number;
  name: string;
  rating: number;
  text: string;
  verified: boolean;
}

interface TestimonialsSectionProps {
  titleSvg?: React.ReactNode;
  testimonials: Testimonial[];
  StarRating: React.ComponentType<StarRatingProps>;
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ 
  titleSvg = testimonialsSvg(), 
  testimonials, 
  StarRating 
}) => {
  return (
    <section className="px-4 md:px-8 py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        
        {/* العنوان */}
        <div className="flex justify-center my-6">
          {titleSvg}
        </div>

        {/* Carousel */}
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full"
        >
          <CarouselContent>
            {testimonials.map((testimonial) => (
              <CarouselItem 
                key={testimonial.id}
                className="md:basis-1/3 pl-4"
              >
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-full flex flex-col">
                  
                  {/* النجوم */}
                  <div className="flex justify-between items-start mb-4">
                    <StarRating rating={testimonial.rating} />
                  </div>
                  
                  {/* الاسم والنقطة السوداء */}
                  <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                    <div>
                      <h3 className="font-bold text-lg">{testimonial.name}</h3>
                    </div>
                    
                    {/* أيقونة التحقق */}
                    {testimonial.verified && (
                      <div className="flex items-center gap-1 text-green-600">
                        <svg 
                          className="h-5 w-5" 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path 
                            fillRule="evenodd" 
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                            clipRule="evenodd" 
                          />
                        </svg>
                        <span className="text-xs font-medium">Verified</span>
                      </div>
                    )}
                  </div>
                  
                  {/* النص */}
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-6 grow">
                    "{testimonial.text}"
                  </p>
                  
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          {/* أزرار التنقل */}
          <div className="flex justify-center gap-4 mt-4">
            <CarouselPrevious 
              className="relative translate-y-0 h-10 w-10 rounded-full border border-gray-300 bg-white hover:bg-gray-50 shadow-sm" 
            />
            <CarouselNext 
              className="relative translate-y-0 h-10 w-10 rounded-full border border-gray-300 bg-white hover:bg-gray-50 shadow-sm" 
            />
          </div>
        </Carousel>

      </div>
    </section>
  );
};

export default TestimonialsSection;