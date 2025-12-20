// app/cart/page.tsx
"use client";

import { useState } from "react";
import CartItemCard from "../components/cart/CartItemCard";
import OrderSummary from "../components/cart/OrderSummary";
import EmptyCart from "../components/cart/EmptyCart";
import Subscribe from "../components/ui/Subscribe";
import Footer from "../components/ui/Footer";

// بيانات مطابقة للصورة
const mockCartItems = [
  {
    id: 1,
    name: "Gradient Graphic T-shirt",
    price: 145.00,
    originalPrice: 160.00,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop",
    size: "Large",
    color: "White",
    quantity: 1,
    category: "T-shirts"
  },
  {
    id: 2,
    name: "Checkered Shirt",
    price: 180.00,
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=500&fit=crop",
    size: "Medium",
    color: "Red",
    quantity: 1,
    category: "Shirts"
  },
  {
    id: 3,
    name: "Skinny Fit Jeans",
    price: 240.00,
    originalPrice: 260.00,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=500&fit=crop",
    size: "Large",
    color: "Blue",
    quantity: 1,
    category: "Jeans"
  },
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState(mockCartItems);

  // حسابات مطابقة للصورة
  const subtotal = 565; // حسب الصورة: 145 + 180 + 240 = 565
  const discount = 113; // 20% من 565
  const deliveryFee = 15;
  const total = 467; // 565 - 113 + 15 = 467

  const handleUpdateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      setCartItems(items => items.filter(item => item.id !== itemId));
    } else {
      setCartItems(items => items.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const handleRemoveItem = (itemId: number) => {
    setCartItems(items => items.filter(item => item.id !== itemId));
  };

  if (cartItems.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* العنوان */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">YOUR CART</h1>
        
        </div>

        {/* المحتوى الرئيسي */}
        <div className="flex flex-col  lg:flex-row gap-8">
          {/* قائمة المنتجات */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {cartItems.map((item) => (
                <CartItemCard
                  key={item.id}
                  item={item}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={handleRemoveItem}
                />
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
        <Subscribe/>
        <Footer/>
      </div>
    </div>
  );
}