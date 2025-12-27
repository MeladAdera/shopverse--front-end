"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter, ChevronDown, ChevronUp, RefreshCwOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useFilters } from '@/context/FilterContext';
import { categoryService } from '@/services/category.service';

function CategorySidebar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { setFilters } = useFilters();
  
  const [categories, setCategories] = useState<any[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState('');
  
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("");
  const [priceRange, setPriceRange] = useState({ min: 50, max: 200 });
  
  const [showCategories, setShowCategories] = useState(true);
  const [showPrice, setShowPrice] = useState(true);
  const [showColors, setShowColors] = useState(true);
  const [showSize, setShowSize] = useState(true);
  const [showDressStyle, setShowDressStyle] = useState(true);

  // 🆕 جلب التصنيفات الحقيقية من API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        console.log('🔄 جلب التصنيفات من API...');
        const data = await categoryService.getCategories();
        setCategories(data);
        setCategoriesError('');
        console.log('✅ تم جلب', data.length, 'تصنيف');
      } catch (error: any) {
        console.error('❌ خطأ في جلب التصنيفات:', error);
        setCategoriesError('فشل في تحميل التصنيفات');
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // قراءة الفلاتر من URL عند التحميل
  useEffect(() => {
    console.log('📥 [CategorySidebar] قراءة الفلاتر من URL...');
    
    const categoryFromURL = searchParams.get('category');
    const categoryIdFromURL = searchParams.get('category_id');
    const colorFromURL = searchParams.get('color');
    const sizeFromURL = searchParams.get('size');
    const styleFromURL = searchParams.get('style');
    const minPriceFromURL = searchParams.get('min_price');
    const maxPriceFromURL = searchParams.get('max_price');
    
    if (categoryIdFromURL) {
      setSelectedCategoryId(categoryIdFromURL);
      console.log('🏷️ قراءة category_id من URL:', categoryIdFromURL);
      
      const category = categories.find(cat => cat.id.toString() === categoryIdFromURL);
      if (category) {
        setSelectedCategory(category.name);
      }
    } else if (categoryFromURL) {
      setSelectedCategory(categoryFromURL);
      console.log('🏷️ قراءة التصنيف من URL (اسم):', categoryFromURL);
      
      const category = categories.find(cat => cat.name === categoryFromURL);
      if (category) {
        setSelectedCategoryId(category.id.toString());
      }
    }
    
    if (colorFromURL) {
      const colorCapitalized = colorFromURL.charAt(0).toUpperCase() + colorFromURL.slice(1);
      setSelectedColor(colorCapitalized);
      console.log('🎨 قراءة اللون من URL:', colorCapitalized);
    }
    
    if (sizeFromURL) {
      setSelectedSize(sizeFromURL);
      console.log('📏 قراءة المقاس من URL:', sizeFromURL);
    }
    
    if (styleFromURL) {
      const styleCapitalized = styleFromURL.charAt(0).toUpperCase() + styleFromURL.slice(1);
      setSelectedStyle(styleCapitalized);
      console.log('👔 قراءة النمط من URL:', styleCapitalized);
    }
    
    if (minPriceFromURL || maxPriceFromURL) {
      const min = minPriceFromURL ? parseInt(minPriceFromURL) : 0;
      const max = maxPriceFromURL ? parseInt(maxPriceFromURL) : 500;
      setPriceRange({ min, max });
      console.log('💰 قراءة السعر من URL:', min, '-', max);
    }
  }, [searchParams, categories]);

  // وظيفة toggle للتصنيفات
  const toggleCategory = (category: any) => {
    if (selectedCategoryId === category.id.toString()) {
      // إذا كان نفس التصنيف مختاراً، قم بإلغاء التحديد
      console.log('🏷️ إلغاء تحديد التصنيف:', category.name);
      setSelectedCategory("");
      setSelectedCategoryId("");
    } else {
      // إذا كان تصنيفاً مختلفاً، حدده
      console.log('🏷️ تحديد التصنيف:', category.name, 'ID:', category.id);
      setSelectedCategory(category.name);
      setSelectedCategoryId(category.id.toString());
    }
  };

  // وظيفة toggle للألوان
  const toggleColor = (colorName: string) => {
    if (selectedColor === colorName) {
      // إذا كان نفس اللون مختاراً، قم بإلغاء التحديد
      console.log('🎨 إلغاء تحديد اللون:', colorName);
      setSelectedColor("");
    } else {
      // إذا كان لوناً مختلفاً، حدده
      console.log('🎨 تحديد اللون:', colorName);
      setSelectedColor(colorName);
    }
  };

  // وظيفة toggle للمقاسات
  const toggleSize = (size: string) => {
    if (selectedSize === size) {
      // إذا كان نفس المقاس مختاراً، قم بإلغاء التحديد
      console.log('📏 إلغاء تحديد المقاس:', size);
      setSelectedSize("");
    } else {
      // إذا كان مقاساً مختلفاً، حدده
      console.log('📏 تحديد المقاس:', size);
      setSelectedSize(size);
    }
  };

  // وظيفة toggle للنمط
  const toggleStyle = (style: string) => {
    if (selectedStyle === style) {
      // إذا كان نفس النمط مختاراً، قم بإلغاء التحديد
      console.log('👔 إلغاء تحديد النمط:', style);
      setSelectedStyle("");
    } else {
      // إذا كان نمطاً مختلفاً، حدده
      console.log('👔 تحديد النمط:', style);
      setSelectedStyle(style);
    }
  };

  const handleApplyFilter = () => {
    console.log("🚀 [CategorySidebar] تطبيق الفلاتر وتحديث URL...");
    console.log("🏷️ التصنيف (الاسم):", selectedCategory);
    console.log("🏷️ التصنيف (ID):", selectedCategoryId);
    console.log("🎨 اللون:", selectedColor);
    console.log("📏 المقاس:", selectedSize);
    console.log("👔 النمط:", selectedStyle);
    console.log("💰 السعر:", priceRange);
    
    setFilters({
      category: selectedCategory,
      category_id: selectedCategoryId,
      color: selectedColor,
      size: selectedSize,
      style: selectedStyle,
      priceRange: {
        min: priceRange.min,
        max: priceRange.max
      }
    });
    
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev.toString());
      
      if (selectedCategoryId) {
        newParams.set('category_id', selectedCategoryId);
        newParams.delete('category');
      } else if (selectedCategory) {
        newParams.set('category', selectedCategory);
        newParams.delete('category_id');
      } else {
        newParams.delete('category_id');
        newParams.delete('category');
      }
      
      if (selectedColor) {
        newParams.set('color', selectedColor.toLowerCase());
      } else {
        newParams.delete('color');
      }
      
      if (selectedSize) {
        newParams.set('size', selectedSize);
      } else {
        newParams.delete('size');
      }
      
      if (selectedStyle) {
        newParams.set('style', selectedStyle.toLowerCase());
      } else {
        newParams.delete('style');
      }
      
      newParams.set('min_price', priceRange.min.toString());
      newParams.set('max_price', priceRange.max.toString());
      
      console.log('🔗 URL تم تحديثه إلى:', newParams.toString());
      return newParams;
    });
    
    setIsOpen(false);
  };

  const handleResetFilters = () => {
    console.log("🧹 [CategorySidebar] إعادة تعيين الفلاتر ومسح URL...");
    
    setSelectedCategory("");
    setSelectedCategoryId("");
    setSelectedColor("");
    setSelectedSize("");
    setSelectedStyle("");
    setPriceRange({ min: 50, max: 200 });
    
    setFilters({
      category: "",
      category_id: "",
      color: "",
      size: "",
      style: "",
      priceRange: { min: 0, max: 500 }
    });
    
    setSearchParams(new URLSearchParams());
  };

  // التحقق إذا كان هناك فلاتر في URL
  const hasURLFilters = searchParams.toString().length > 0;

  const FiltersContent = () => (
    <div className="space-y-4 p-4 md:p-4">
    
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Filters</h2>
        <div className="flex items-center gap-2">
          <button 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            onClick={handleResetFilters}
            title="Reset all filters"
          >
            <RefreshCwOff />
          </button>
        </div>
      </div>

      {/* Categories Section - معدلة لاستخدام toggle */}
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
            {/* حالة التحميل */}
            {categoriesLoading && (
              <div className="flex items-center justify-center py-2">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span className="text-sm">Loading categories...</span>
              </div>
            )}
            
            {/* حالة الخطأ */}
            {categoriesError && !categoriesLoading && (
              <div className="text-red-500 text-sm py-2">
                {categoriesError}
              </div>
            )}
            
            {/* عرض التصنيفات الحقيقية مع toggle */}
            {!categoriesLoading && categories.length > 0 && categories.map((category) => (
              <div 
                key={category.id} 
                className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                onClick={() => toggleCategory(category)}
              >
                <div className="flex items-center gap-2">
                  <span className={`text-gray-700 ${selectedCategoryId === category.id.toString() ? 'font-semibold text-black' : ''}`}>
                    {category.name}
                  </span>
                  {category.productCount > 0 && (
                    <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                      {category.productCount}
                    </span>
                  )}
                </div>
                <div className={`h-5 w-5 rounded-full border ${selectedCategoryId === category.id.toString() ? 'bg-black border-black' : 'border-gray-300'}`}>
                  {selectedCategoryId === category.id.toString() && (
                    <div className="h-2 w-2 bg-white rounded-full m-auto mt-1.5" />
                  )}
                </div>
              </div>
            ))}
            
            {/* خيار "All Categories" مع toggle */}
            {!categoriesLoading && (
              <div 
                className="flex items-center justify-between pt-2 mt-2 border-t cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                onClick={() => {
                  setSelectedCategory("");
                  setSelectedCategoryId("");
                }}
              >
                <span className={`text-gray-700 ${selectedCategory === "" ? 'font-semibold text-black' : ''}`}>
                  All Categories
                </span>
                <div className={`h-5 w-5 rounded-full border ${selectedCategory === "" ? 'bg-black border-black' : 'border-gray-300'}`}>
                  {selectedCategory === "" && (
                    <div className="h-2 w-2 bg-white rounded-full m-auto mt-1.5" />
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Price Section */}
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
            <div className="flex gap-4">
              <input 
                type="range" 
                min="0" 
                max="500" 
                value={priceRange.min}
                className="w-full"
                onChange={(e) => {
                  const min = parseInt(e.target.value);
                  setPriceRange(prev => ({ ...prev, min }));
                }}
              />
              <input 
                type="range" 
                min="0" 
                max="500" 
                value={priceRange.max}
                className="w-full"
                onChange={(e) => {
                  const max = parseInt(e.target.value);
                  setPriceRange(prev => ({ ...prev, max }));
                }}
              />
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>${priceRange.min}</span>
              <span>${priceRange.max}</span>
            </div>
          </div>
        )}
      </div>

      {/* Colors Section - معدلة لاستخدام toggle */}
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
            {[
              { colorClass: "bg-red-500", name: "Red" },
              { colorClass: "bg-blue-500", name: "Blue" },
              { colorClass: "bg-green-500", name: "Green" },
              { colorClass: "bg-yellow-500", name: "Yellow" },
              { colorClass: "bg-purple-500", name: "Purple" },
              { colorClass: "bg-pink-500", name: "Pink" },
              { colorClass: "bg-black", name: "Black" },
              { colorClass: "bg-gray-300", name: "Gray" }
            ].map(({ colorClass, name }) => (
              <div 
                key={name}
                className={`w-8 h-8 rounded-full ${colorClass} cursor-pointer hover:scale-110 transition-transform border-2 ${selectedColor === name ? 'border-black' : 'border-gray-200'}`}
                title={name}
                onClick={() => toggleColor(name)}
              />
            ))}
            
            {/* زر لإلغاء اختيار اللون إذا كان هناك لون محدد */}
            {selectedColor && (
              <button
                className="text-xs text-gray-600 hover:text-black p-1"
                onClick={() => setSelectedColor("")}
              >
                Clear
              </button>
            )}
          </div>
        )}
      </div>

      {/* Size Section - معدلة لاستخدام toggle */}
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
                className={`px-3 py-2 border rounded-lg transition-colors text-center text-sm ${selectedSize === size ? 'bg-black text-white border-black' : 'hover:bg-gray-50 border-gray-300'}`}
                onClick={() => toggleSize(size)}
              >
                {size}
              </button>
            ))}
            
            {/* زر لإلغاء اختيار المقاس إذا كان هناك مقاس محدد */}
            {selectedSize && (
              <button
                className="col-span-2 text-sm text-gray-600 hover:text-black p-2"
                onClick={() => setSelectedSize("")}
              >
                Clear Size Selection
              </button>
            )}
          </div>
        )}
      </div>

      {/* Dress Style Section - معدلة لاستخدام toggle */}
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
              <div 
                key={style} 
                className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                onClick={() => toggleStyle(style)}
              >
                <span className={`text-gray-700 ${selectedStyle === style ? 'font-semibold text-black' : ''}`}>
                  {style}
                </span>
                <div className={`h-5 w-5 rounded-full border ${selectedStyle === style ? 'bg-black border-black' : 'border-gray-300'}`}>
                  {selectedStyle === style && (
                    <div className="h-2 w-2 bg-white rounded-full m-auto mt-1.5" />
                  )}
                </div>
              </div>
            ))}
            
            {/* زر لإلغاء اختيار النمط إذا كان هناك نمط محدد */}
            {selectedStyle && (
              <div 
                className="flex items-center justify-between pt-2 mt-2 border-t cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                onClick={() => setSelectedStyle("")}
              >
                <span className="text-gray-600">Clear Style Selection</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Apply Filter Button */}
      <div className="pt-2">
        <Button 
          className="w-full py-3 text-base font-medium bg-black text-amber-50 rounded-full hover:bg-gray-800"
          onClick={handleApplyFilter}
          disabled={categoriesLoading}
        >
          {categoriesLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            "Apply Filter"
          )}
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile & Tablet */}
      <div className="lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="">
              <div className="flex items-center gap-2">
                <Filter size={18} />
                Filters
                {hasURLFilters && (
                  <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
                )}
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