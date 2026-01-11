// app/cart/page.tsx
"use client";

import { useState, useEffect } from "react";
import CartItemCard from "../components/cart/CartItemCard";
import OrderSummary from "../components/cart/OrderSummary";
import EmptyCart from "../components/cart/EmptyCart";
import Subscribe from "../components/ui/Subscribe";
import Footer from "../components/ui/Footer";
import { useCart } from "@/hooks/useCart";
import { toast } from "react-hot-toast";

// 🔧 Correct image URL function
const getFullImageUrl = (imagePath: string | undefined): string => {
  if (!imagePath) return '/placeholder.jpg';
  
  // If it's already a full URL
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  const BASE_URL = 'http://localhost:5000';
  
  // Solution 1: If path contains uploads, convert to public
  if (imagePath.includes('/uploads/')) {
    const correctedPath = imagePath.replace('/uploads/', '/public/');
    console.log('🔄 Converting uploads to public:', { original: imagePath, corrected: correctedPath });
    return `${BASE_URL}${correctedPath}`;
  }
  
  // Solution 2: If path starts with /, add BASE_URL
  if (imagePath.startsWith('/')) {
    return `${BASE_URL}${imagePath}`;
  }
  
  // Any other case
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

  // Convert API data to CartItemCard format
  useEffect(() => {
    if (cart?.items) {
      console.log('🔍 Checking images:', cart.items[0]);
      
      const formattedItems = cart.items.map(item => {
        const mainImage = item.product_images?.[0];
        
        // ⚡ Apply correction here
        let imageUrl = getFullImageUrl(mainImage);
        
        // 🔍 Test the link
        console.log('🔗 Image URL:', {
          original: mainImage,
          backendPath: 'backend/public/products/...',
          finalUrl: imageUrl
        });
        
        return {
          id: item.id,
          name: item.product_name,
          price: parseFloat(item.product_price),
          originalPrice: undefined,
          image: imageUrl, // ⚡ This is the correct URL
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
        // Update local data
        setCartItems(prev => prev.map(item => 
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        ));
        toast.success('Quantity updated successfully');
      } else {
        toast.error('Failed to update quantity');
      }
    } catch (err) {
      toast.error('Error updating quantity');
      console.error(err);
    } finally {
      setLocalLoading(null);
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    // Show confirmation toast instead of window.confirm
    const removeItem = () => {
      setLocalLoading(`remove-${itemId}`);
      removeFromCart(itemId)
        .then(result => {
          if (result.success) {
            // Update local data
            setCartItems(prev => prev.filter(item => item.id !== itemId));
            toast.success('Item removed from cart');
          } else {
            toast.error('Failed to remove item');
          }
        })
        .catch(err => {
          toast.error('Error removing item');
          console.error(err);
        })
        .finally(() => {
          setLocalLoading(null);
        });
    };

    toast.custom((t) => (
      <div className={`${
        t.visible ? 'animate-enter' : 'animate-leave'
      } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">
                Remove Item
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Are you sure you want to remove this item from your cart?
              </p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-gray-200">
          <button
            onClick={() => {
              removeItem();
              toast.dismiss(t.id);
            }}
            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-red-600 hover:text-red-500 focus:outline-none"
          >
            Remove
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-600 hover:text-gray-500 focus:outline-none"
          >
            Cancel
          </button>
        </div>
      </div>
    ), {
      duration: 5000,
    });
  };

  // If loading
  if (isLoading && !cart) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading cart...</p>
        </div>
      </div>
    );
  }

  // If there's an error
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="mb-4">❌ {error}</p>
          <button 
            onClick={() => {
              refreshCart();
              toast.loading('Refreshing cart...');
            }}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // If cart is empty
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

  // Order calculations from real data
  const subtotal = cart.total_price || 0;
  const discount = 0; // If you have discounts
  const deliveryFee = 15; // Could come from API
  const total = subtotal - discount + deliveryFee;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">YOUR CART</h1>
          <p className="text-gray-600 mt-2">
            {cartItemsCount} item{cartItemsCount > 1 ? 's' : ''} in cart
          </p>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Products List */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {cartItems.map((item) => (
                <div key={item.id} className="relative">
                  {(localLoading === `update-${item.id}` || localLoading === `remove-${item.id}`) && (
                    <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                    </div>
                  )}
                  
                  <CartItemCard
                    item={item}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemove={handleRemoveItem}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
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