// app/cart/components/OrderSummary.tsx
"use client";

import { useState } from "react";
import { Tag } from "lucide-react";

interface OrderSummaryProps {
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
}

export default function OrderSummary({ 
  subtotal, 
  discount, 
  deliveryFee, 
  total 
}: OrderSummaryProps) {
  const [promoCode, setPromoCode] = useState("");

  const handleApplyPromo = () => {
    if (promoCode.trim()) {
      // هنا يمكن إضافة منطق تطبيق الكود
      console.log("Applying promo code:", promoCode);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      {/* العنوان */}
      <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

      {/* تفاصيل الحساب */}
      <div className="space-y-3 mb-6">
        {/* Subtotal */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
        </div>

        {/* Discount */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Discount (-20%)</span>
          <span className="font-medium text-red-600">-${discount.toFixed(2)}</span>
        </div>

        {/* Delivery Fee */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Delivery Fee</span>
          <span className="font-medium text-gray-900">${deliveryFee.toFixed(2)}</span>
        </div>
      </div>

      {/* الخط الفاصل */}
      <hr className="border-gray-200 my-6" />

      {/* الإجمالي */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Total</h3>
          <p className="text-sm text-gray-500 mt-1">Including all taxes</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">${total.toFixed(2)}</div>
          <p className="text-sm text-green-600 mt-1">You saved ${discount.toFixed(2)}</p>
        </div>
      </div>

      {/* كود الخصم */}
      <div className="mb-6">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Add promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>
          <button
            onClick={handleApplyPromo}
            disabled={!promoCode.trim()}
            className="bg-black text-white px-6 py-3 rounded-full  disabled:cursor-not-allowed"
          >
            Apply
          </button>
        </div>
      </div>

      {/* زر الدفع */}
      <button className="w-full bg-black text-white py-4 rounded-full font-semibold hover:bg-gray-800 transition-colors">
        Go to Checkout →
      </button>

      
    </div>
  );
}