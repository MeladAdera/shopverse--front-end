// 1. استيراد المكتبات التي نحتاجها
"use client";

// 2. نكتب المكون البسيط
export default function EmptyCart() {
  return (
    <div className="text-center py-20">
      <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
      <p className="text-gray-600 mb-8">Add some items to get started</p>
      <button className="bg-black text-white px-6 py-3 rounded">
        Start Shopping
      </button>
    </div>
  );
}