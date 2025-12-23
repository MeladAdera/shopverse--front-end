// app/products/components/ProductCard.tsx
"use client";

import { Star, ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Product {
  id: number;
  name: string;
  price: number; // ✅ تغيير إلى number
  originalPrice?: number; // ✅ تغيير إلى number
  discount?: string;
  rating: number;
  ratingStars?: string;
  category: string;
  color?: string;
  isNew?: boolean;
  isBestSeller?: boolean;
  image: string;
}

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  // ✅ دالة لتنسيق السعر بشكل آمن
  const formatPrice = (price: number | undefined | null): string => {
    if (price === undefined || price === null || isNaN(price)) {
      return '$0.00';
    }
    return `$${price.toFixed(2)}`;
  };

  // ✅ دالة لحساب التوفير
  const calculateSavings = (): number => {
    if (!product.originalPrice || product.originalPrice <= product.price) {
      return 0;
    }
    return product.originalPrice - product.price;
  };

  const savings = calculateSavings();
  const hasDiscount = savings > 0;

  // ✅ دالة لتحميل صورة افتراضية عند الخطأ
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;
    target.style.display = 'none';
    const fallback = target.parentElement;
    if (fallback) {
      fallback.innerHTML = `
        <div class="w-full h-full flex items-center justify-center bg-gray-200">
          <div class="text-gray-400 text-center">
            <div class="text-2xl mb-2">🛍️</div>
            <div class="text-sm">${product.name}</div>
          </div>
        </div>
      `;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 group">
      {/* Product Image Container */}
      <div className="relative h-64 bg-gray-100 overflow-hidden">
        {/* صورة المنتج الحقيقية */}
        <div className="w-full h-full">
          <img
            src={product.image || "/placeholder.jpg"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={handleImageError}
          />
        </div>
        
        {/* Discount Badge */}
        {product.discount && (
          <div className="absolute top-3 left-3">
            <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              {product.discount}
            </span>
          </div>
        )}
        
        {/* New Badge */}
        {product.isNew && (
          <div className="absolute top-3 right-3">
            <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              NEW
            </span>
          </div>
        )}
        
        {/* Best Seller Badge */}
        {product.isBestSeller && (
          <div className="absolute top-12 right-3">
            <span className="bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              BEST SELLER
            </span>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button size="sm" className="bg-white text-black hover:bg-gray-100 shadow-md">
            <ShoppingCart size={16} className="mr-2" />
            أضف إلى السلة
          </Button>
          <Button size="sm" variant="outline" className="bg-white shadow-md">
            <Heart size={16} />
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5">
        {/* Category */}
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs text-gray-500 uppercase tracking-wider">
            {product.category || "منتج"}
          </span>
          {product.color && (
            <span className="text-xs text-gray-500">{product.color}</span>
          )}
        </div>
        
        {/* Product Name */}
        <h3 className="font-bold text-lg mb-2 line-clamp-1 hover:text-blue-600 cursor-pointer">
          {product.name || "اسم المنتج"}
        </h3>
        
        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={
                  i < Math.floor(product.rating || 0)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            {(product.rating || 0).toFixed(1)}/5
          </span>
          {product.ratingStars && (
            <>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-yellow-400">{product.ratingStars}</span>
            </>
          )}
        </div>
        
        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-2xl">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <>
                <span className="text-gray-500 line-through text-lg">
                  {formatPrice(product.originalPrice)}
                </span>
                <span className="text-sm text-red-500 font-semibold ml-1">
                  وفر ${savings.toFixed(2)}
                </span>
              </>
            )}
          </div>
          
          {/* Quick Add Button */}
          <Button 
            size="sm" 
            className="bg-black hover:bg-gray-800 rounded-full px-4"
          >
            <ShoppingCart size={16} className="mr-2" />
            أضف
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;