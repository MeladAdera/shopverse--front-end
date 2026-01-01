"use client";

import { Star, ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/useCart"; // Import the hook
import { useState, useEffect } from "react";

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
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
  const navigate = useNavigate();
  const { addToCart, isLoading } = useCart(); // Use the hook
  const [addedRecently, setAddedRecently] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);

  const handleProductClick = () => {
    console.log('🖱️ النقر على المنتج رقم:', product.id);
    
    if (typeof navigate === 'function') {
      navigate(`/product/${product.id}`);
    } else {
      console.error('❌ navigate ليست دالة:', navigate);
      window.location.href = `/product/${product.id}`;
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (localLoading) return;
    
    console.log(`🛒 إضافة المنتج ${product.id} إلى السلة`);
    
    setLocalLoading(true);
    setAddedRecently(false);
    
    try {
      const result = await addToCart(product.id, 1);
      
      if (result.success) {
        console.log('✅ تمت الإضافة بنجاح:', result.data);
        setAddedRecently(true);
        
        // إعادة تعيين حالة "تمت الإضافة" بعد 2 ثانية
        setTimeout(() => setAddedRecently(false), 2000);
        
        // يمكنك إضافة Toast هنا بدلاً من alert
        // toast.success(`تم إضافة ${product.name} إلى السلة`);
      } else {
        console.error('❌ فشلت الإضافة:', result.error);
        // toast.error(result.error || 'فشلت العملية');
      }
    } catch (error) {
      console.error('❌ خطأ غير متوقع:', error);
      // toast.error('حدث خطأ غير متوقع');
    } finally {
      setLocalLoading(false);
    }
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(`❤️ أضيف المنتج ${product.id} إلى المفضلة`);
  };

  const formatPrice = (price: number): string => {
    return `$${price.toFixed(2)}`;
  };

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  // إعادة تعيين حالة الإضافة إذا تغير المنتج
  useEffect(() => {
    setAddedRecently(false);
    setLocalLoading(false);
  }, [product.id]);

  return (
    <div 
      className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer"
      onClick={handleProductClick}
    >
      {/* Product Image Container */}
      <div className="relative h-64 bg-gray-100 overflow-hidden">
        <div className="w-full h-full">
          <img
            src={product.image || "/placeholder.jpg"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = '/placeholder.jpg';
            }}
          />
        </div>
        
        {/* Discount Badge */}
        {product.discount && (
          <div className="absolute top-3 left-3" onClick={(e) => e.stopPropagation()}>
            <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              {product.discount}
            </span>
          </div>
        )}
        
        {/* New Badge */}
        {product.isNew && (
          <div className="absolute top-3 right-3" onClick={(e) => e.stopPropagation()}>
            <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              جديد
            </span>
          </div>
        )}
        
        {/* Best Seller Badge */}
        {product.isBestSeller && (
          <div className="absolute top-12 right-3" onClick={(e) => e.stopPropagation()}>
            <span className="bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              الأكثر مبيعاً
            </span>
          </div>
        )}
        
        {/* Action Buttons */}
        <div 
          className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          <Button 
            size="sm" 
            className={`bg-white text-black hover:bg-gray-100 shadow-md transition-all duration-200 ${
              addedRecently ? 'bg-green-100 text-green-800 hover:bg-green-200' : ''
            }`}
            onClick={handleAddToCart}
            disabled={localLoading || isLoading}
          >
            {localLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                جاري الإضافة...
              </span>
            ) : addedRecently ? (
              <>
                <ShoppingCart size={16} className="mr-2" />
                تمت الإضافة!
              </>
            ) : (
              <>
                <ShoppingCart size={16} className="mr-2" />
                أضف إلى السلة
              </>
            )}
          </Button>
          
          <Button 
            size="sm" 
            variant="outline" 
            className="bg-white shadow-md"
            onClick={handleFavorite}
          >
            <Heart size={16} />
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs text-gray-500 uppercase tracking-wider">
            {product.category}
          </span>
          {product.color && (
            <span className="text-xs text-gray-500">{product.color}</span>
          )}
        </div>
        
        <h3 className="font-bold text-lg mb-2 line-clamp-1 hover:text-blue-600">
          {product.name}
        </h3>
        
        <div className="flex items-center gap-2 mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={
                  i < Math.floor(product.rating)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            {product.rating.toFixed(1)}/5
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-2xl">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && product.originalPrice && (
              <span className="text-gray-500 line-through text-lg">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          
          <Button 
            size="sm" 
            className={`rounded-full px-4 transition-all duration-200 ${
              addedRecently 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-black hover:bg-gray-800'
            }`}
            onClick={handleAddToCart}
            disabled={localLoading || isLoading}
          >
            {localLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
              </span>
            ) : addedRecently ? (
              <>
                <ShoppingCart size={16} className="mr-2 fill-white" />
                ✓
              </>
            ) : (
              <>
                <ShoppingCart size={16} className="mr-2" />
                أضف
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;