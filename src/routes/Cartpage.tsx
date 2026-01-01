// app/cart/page.tsx
"use client";

import { useState, useEffect } from "react";
import CartItemCard from "../components/cart/CartItemCard";
import OrderSummary from "../components/cart/OrderSummary";
import EmptyCart from "../components/cart/EmptyCart";
import Subscribe from "../components/ui/Subscribe";
import Footer from "../components/ui/Footer";
import { useCart } from "@/hooks/useCart";

// 🔧 دالة جديدة صحيحة
const getFullImageUrl = (imagePath: string | undefined): string => {
  if (!imagePath) return '/placeholder.jpg';
  
  // إذا كان رابط كامل
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  const BASE_URL = 'http://localhost:5000';
  
  
  // الحل 1: إذا كان المسار يحتوي على uploads، حوله إلى public
  if (imagePath.includes('/uploads/')) {
    const correctedPath = imagePath.replace('/uploads/', '/public/');
    console.log('🔄 تحويل uploads إلى public:', { original: imagePath, corrected: correctedPath });
    return `${BASE_URL}${correctedPath}`;
  }
  
  // الحل 2: إذا كان المسار يبدأ بـ /، أضف BASE_URL
  if (imagePath.startsWith('/')) {
    return `${BASE_URL}${imagePath}`;
  }
  
  // أي حالة أخرى
  return `${BASE_URL}/${imagePath}`;
};

export default function CartPage() {
  const { 
    cart, 
    isLoading, 
    error, 
    updateCartItem, 
    removeFromCart, 
    refreshCart,
    cartItemsCount 
  } = useCart();
  
  const [localLoading, setLocalLoading] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<any[]>([]);

  // تحويل بيانات API إلى تنسيق مكون CartItemCard
  useEffect(() => {
    if (cart?.items) {
      console.log('🔍 تحقق من الصور:', cart.items[0]);
      
      const formattedItems = cart.items.map(item => {
        const mainImage = item.product_images?.[0];
        
        // ⚡ تطبيق التصحيح هنا
        let imageUrl = getFullImageUrl(mainImage);
        
        // 🔍 اختبر الرابط
        console.log('🔗 رابط الصورة:', {
          original: mainImage,
          backendPath: 'backend/public/products/...',
          finalUrl: imageUrl
        });
        
        return {
          id: item.id,
          name: item.product_name,
          price: parseFloat(item.product_price),
          originalPrice: undefined,
          image: imageUrl, // ⚡ هذا هو الرابط الصحيح
          size: 'Large',
          color: 'Default',
          quantity: item.quantity,
          category: 'Product'
        };
      });
      
      setCartItems(formattedItems);
    }
  }, [cart]);

  const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
    setLocalLoading(`update-${itemId}`);
    try {
      const result = await updateCartItem(itemId, newQuantity);
      if (result.success) {
        // تحديث البيانات المحلية
        setCartItems(prev => prev.map(item => 
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        ));
      }
    } finally {
      setLocalLoading(null);
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    if (window.confirm('هل تريد حذف هذا المنتج من السلة؟')) {
      setLocalLoading(`remove-${itemId}`);
      try {
        const result = await removeFromCart(itemId);
        if (result.success) {
          // تحديث البيانات المحلية
          setCartItems(prev => prev.filter(item => item.id !== itemId));
        }
      } finally {
        setLocalLoading(null);
      }
    }
  };

  // إذا كان في حالة تحميل
  if (isLoading && !cart) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل السلة...</p>
        </div>
      </div>
    );
  }

  // إذا كان هناك خطأ
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="mb-4">❌ {error}</p>
          <button 
            onClick={() => refreshCart()}
            className="bg-black text-white px-4 py-2 rounded"
          >
            حاول مرة أخرى
          </button>
        </div>
      </div>
    );
  }

  // إذا كانت السلة فارغة
  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <EmptyCart />
          <Subscribe />
          <Footer />
        </div>
      </div>
    );
  }

  // حسابات الطلب من البيانات الحقيقية
  const subtotal = cart.total_price || 0;
  const discount = 0; // إذا كان لديك خصومات
  const deliveryFee = 15; // يمكن أن يكون من API
  const total = subtotal - discount + deliveryFee;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* العنوان */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">YOUR CART</h1>
          <p className="text-gray-600 mt-2">
            {cartItemsCount} item{cartItemsCount > 1 ? 's' : ''} in cart
          </p>
        </div>

        {/* المحتوى الرئيسي */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* قائمة المنتجات */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {cartItems.map((item) => (
                <div key={item.id} className="relative">
                  {localLoading === `update-${item.id}` || localLoading === `remove-${item.id}` ? (
                    <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                    </div>
                  ) : null}
                  
                  <CartItemCard
                    item={item}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemove={handleRemoveItem}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* ملخص الطلب */}
          <div className="lg:w-1/3">
            <OrderSummary
              subtotal={subtotal}
              discount={discount}
              deliveryFee={deliveryFee}
              total={total}
            />
          </div>
        </div>
        
        <Subscribe />
        <Footer />
      </div>
    </div>
  );
}