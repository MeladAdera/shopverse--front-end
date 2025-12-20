"use client";

import { useState } from "react";
import { Filter, Settings, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

function CategorySidebar() {
  const [isOpen, setIsOpen] = useState(false);
  
  const [showCategories, setShowCategories] = useState(true);
  const [showPrice, setShowPrice] = useState(true);
  const [showColors, setShowColors] = useState(true);
  const [showSize, setShowSize] = useState(true);
  const [showDressStyle, setShowDressStyle] = useState(true);

  const FiltersContent = () => (
    <div className="space-y-4 p-4 md:p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Filters</h2>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <Settings size={18} className="text-gray-600" />
        </button>
      </div>

      {/* Categories Section - السهم على اليمين */}
      <div className="border-b pb-4">
        <div className="flex justify-between items-center w-full mb-3">
          <h3 className="font-semibold text-lg">Categories</h3>
          <button onClick={() => setShowCategories(!showCategories)}>
            {showCategories ? 
              <ChevronUp size={20} className="text-gray-500" /> : 
              <ChevronDown size={20} className="text-gray-500" />
            }
          </button>
        </div>
        
        {showCategories && (
          <div className="space-y-3 text-gray-700">
            {["T-shirts", "Shorts", "Shirts", "Hoodie", "Jeans"].map((item) => (
              <div key={item} className="flex items-center justify-between">
                <span className="text-gray-700">{item}</span>
                <input 
                  type="checkbox" 
                  className="h-5 w-5 rounded border-gray-300 text-black focus:ring-black" 
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Price Section - السهم على اليمين */}
      <div className="border-b pb-4">
        <div className="flex justify-between items-center w-full mb-3">
          <h3 className="font-semibold text-lg">Price</h3>
          <button onClick={() => setShowPrice(!showPrice)}>
            {showPrice ? 
              <ChevronUp size={20} className="text-gray-500" /> : 
              <ChevronDown size={20} className="text-gray-500" />
            }
          </button>
        </div>
        
        {showPrice && (
          <div className="space-y-4 pt-1">
            <input type="range" min="50" max="200" className="w-full" />
            <div className="flex justify-between text-sm text-gray-600">
              <span>$50</span>
              <span>$200</span>
            </div>
          </div>
        )}
      </div>

      {/* Colors Section - السهم على اليمين */}
      <div className="border-b pb-4">
        <div className="flex justify-between items-center w-full mb-3">
          <h3 className="font-semibold text-lg">Colors</h3>
          <button onClick={() => setShowColors(!showColors)}>
            {showColors ? 
              <ChevronUp size={20} className="text-gray-500" /> : 
              <ChevronDown size={20} className="text-gray-500" />
            }
          </button>
        </div>
        
        {showColors && (
          <div className="flex gap-2 flex-wrap pt-1">
            {["bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500", 
              "bg-purple-500", "bg-pink-500", "bg-black", "bg-gray-300"].map((color) => (
              <div 
                key={color} 
                className={`w-8 h-8 rounded-full ${color} cursor-pointer hover:scale-110 transition-transform border border-gray-200`}
                title={color.replace('bg-', '').replace('-500', '')}
              />
            ))}
          </div>
        )}
      </div>

      {/* Size Section - السهم على اليمين */}
      <div className="border-b pb-4">
        <div className="flex justify-between items-center w-full mb-3">
          <h3 className="font-semibold text-lg">Size</h3>
          <button onClick={() => setShowSize(!showSize)}>
            {showSize ? 
              <ChevronUp size={20} className="text-gray-500" /> : 
              <ChevronDown size={20} className="text-gray-500" />
            }
          </button>
        </div>
        
        {showSize && (
          <div className="grid grid-cols-2 gap-2 pt-1">
            {["XXS", "XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL", "5XL"].map((size) => (
              <button 
                key={size} 
                className="px-3 py-2 border rounded-lg hover:bg-gray-50 transition-colors text-center text-sm"
              >
                {size}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Dress Style Section - السهم على اليمين */}
      <div className="border-b pb-4">
        <div className="flex justify-between items-center w-full mb-3">
          <h3 className="font-semibold text-lg">Dress Style</h3>
          <button onClick={() => setShowDressStyle(!showDressStyle)}>
            {showDressStyle ? 
              <ChevronUp size={20} className="text-gray-500" /> : 
              <ChevronDown size={20} className="text-gray-500" />
            }
          </button>
        </div>
        
        {showDressStyle && (
          <div className="space-y-3 text-gray-700 pt-1">
            {["Casual", "Formal", "Party", "Gym"].map((style) => (
              <div key={style} className="flex items-center justify-between">
                <span className="text-gray-700">{style}</span>
                <input 
                  type="checkbox" 
                  className="h-5 w-5 rounded border-gray-300 text-black focus:ring-black" 
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Apply Filter Button - بعرض القسم */}
      <div className="pt-2">
        <Button 
          className="w-full py-3 text-base font-medium bg-black text-amber-50 rounded-full"
          onClick={() => setIsOpen(false)}
        >
          Apply Filter
        </Button>
      </div>
    </div>
  );

  return (
    <>
       {/* Mobile & Tablet */}
    <div className="lg:hidden"> {/* كان md:hidden */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="">
            <div className="flex items-center gap-2">
              <Filter size={18} />
              Filters
            </div>
            
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:w-[380px] md:w-[400px] overflow-y-auto bg-white">
          <FiltersContent />
        </SheetContent>
      </Sheet>
    </div>

    {/* Desktop & Large Tablets */}
    <aside className="hidden lg:block w-64 xl:w-72 border rounded-xl bg-white p-6 h-fit sticky top-24 shadow-sm">
      <FiltersContent />
    </aside>
    </>
  );
}

export default CategorySidebar;