// 📁 src/components/cart/OrderSummary.tsx - Updated Version
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  // Handle promo code application
  const handleApplyPromo = () => {
    if (promoCode.trim()) {
      console.log("Applying promo code:", promoCode);
      // In a real application, you would call an API here
      // to validate and apply the promo code
    }
  };

  // Navigate to checkout page
  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

      {/* Price breakdown section */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Discount</span>
          <span className="font-medium text-red-600">-${discount.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Delivery Fee</span>
          <span className="font-medium">${deliveryFee.toFixed(2)}</span>
        </div>
      </div>

      <hr className="border-gray-200 my-6" />

      {/* Total amount section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-lg font-bold">Total</h3>
          <p className="text-sm text-gray-500 mt-1">Including tax</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">${total.toFixed(2)}</div>
          <p className="text-sm text-green-600 mt-1">You saved ${discount.toFixed(2)}</p>
        </div>
      </div>

      {/* Promo code input section */}
      <div className="mb-6">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Tag className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Enter promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              dir="ltr" // Changed to left-to-right for English
            />
          </div>
          <button
            onClick={handleApplyPromo}
            disabled={!promoCode.trim()}
            className="bg-gray-800 text-white px-6 py-3 rounded-full hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Apply
          </button>
        </div>
      </div>

      {/* Checkout button */}
      <button
        onClick={handleCheckout}
        className="w-full bg-blue-600 text-white py-4 rounded-full font-semibold hover:bg-blue-700 transition-colors"
      >
        Proceed to Checkout →
      </button>
    </div>
  );
}