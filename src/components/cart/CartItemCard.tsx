// app/cart/components/CartItemCard.tsx
"use client";

import { Minus, Plus, Trash } from "lucide-react";
import { useState } from "react";

interface CartItem {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
  category: string;
}

interface CartItemCardProps {
  item: CartItem;
  onUpdateQuantity: (id: number, newQuantity: number) => void;
  onRemove: (id: number) => void;
}

export default function CartItemCard({ item, onUpdateQuantity, onRemove }: CartItemCardProps) {
  const [localQuantity, setLocalQuantity] = useState(item.quantity);

  const handleDecrease = () => {
    if (localQuantity > 1) {
      const newQty = localQuantity - 1;
      setLocalQuantity(newQty);
      onUpdateQuantity(item.id, newQty);
    }
  };

  const handleIncrease = () => {
    const newQty = localQuantity + 1;
    setLocalQuantity(newQty);
    onUpdateQuantity(item.id, newQty);
  };

  const handleRemove = () => {
    onRemove(item.id);
  };

  return (
    <div className="flex gap-4 p-4 bg-white border-b last:border-b-0">
      {/* الصورة */}
      <div className="w-24 h-24 md:w-28 md:h-28 bg-gray-100 rounded overflow-hidden shrink-0">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* المعلومات - كل شيء في عمود واحد */}
      <div className="flex-1">
        {/* الصف الأول: الاسم + زر الحذف */}
        <div className="flex justify-between items-start mb-2">
          {/* الاسم */}
          <h3 className="text-lg font-bold text-gray-900">
            {item.name}
          </h3>
          
          {/* زر الحذف - مقابل الاسم */}
          <button
            onClick={handleRemove}
            className="text-gray-400 hover:text-red-500"
            aria-label={`Remove ${item.name} from cart`}
          >
           <Trash />
          </button>
        </div>

        {/* الصف الثاني: المقاس واللون */}
        <div className="mb-4">
          <div className="flex flex-col   text-gray-600">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Size:</span>
              <span className="text-sm">{item.size}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Color:</span>
              <span className="text-sm">{item.color}</span>
            </div>
          </div>
        </div>

        {/* الصف الثالث: السعر + عداد الكمية */}
        <div className="flex justify-between items-center">
          {/* السعر */}
          <div className="text-right">
            <div className="text-xl font-bold text-gray-900">
              ${(item.price * localQuantity).toFixed(2)}
            </div>
            {item.originalPrice && (
              <div className="text-sm text-gray-500 line-through">
                ${item.originalPrice.toFixed(2)}
              </div>
            )}
          </div>

          {/* عداد الكمية - مقابل السعر */}
          <div className="flex items-center border border-gray-300 rounded mb:gap-2">
            <button
              onClick={handleDecrease}
              disabled={localQuantity <= 1}
              className="px-3 py-1 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Decrease quantity"
            >
              <Minus size={16} />
            </button>
            <span className="px-2 py-1 text-gray-800 min-w-10 text-center">
              {localQuantity}
            </span>
            <button
              onClick={handleIncrease}
              className="px-2 py-1 hover:bg-gray-100"
              aria-label="Increase quantity"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}