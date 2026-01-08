// 📁 src/pages/CheckoutPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../../services/order.service';
import { showToast } from '../../utils/toast';

interface ShippingFormData {
  shipping_address: string;
  shipping_city: string;
  shipping_phone: string;
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ShippingFormData>({
    shipping_address: '',
    shipping_city: '',
    shipping_phone: ''
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission and order creation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.shipping_address.trim()) {
      showToast.error('Please enter your shipping address');
      return;
    }
    
    if (!formData.shipping_city.trim()) {
      showToast.error('Please enter your city');
      return;
    }

    setIsLoading(true);
    const loadingToast = showToast.loading('Creating your order...');

    try {
      // Create order through order service
      const response = await orderService.createOrder(formData);
      
      // Dismiss loading toast
      showToast.dismiss(loadingToast);
      
      if (response.success) {
        // Show success message
        showToast.success('Order created successfully!');
        
        // Redirect to order confirmation page after a short delay
        setTimeout(() => {
          navigate(`/orders/${response.data.order_id}`);
        }, 1500);
      } else {
        showToast.error(response.message || 'Failed to create order');
      }
    } catch (error: any) {
      // Dismiss loading toast
      showToast.dismiss(loadingToast);
      
      // Show error message
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'An error occurred while processing your order';
      showToast.error(errorMessage);
      
      console.error('Checkout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="checkout-page container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Shipping Address Form */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-6">Shipping Address</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Address Field */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Detailed Address *
                </label>
                <input
                  type="text"
                  name="shipping_address"
                  value={formData.shipping_address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Street, District, Building Number"
                  required
                  disabled={isLoading}
                />
              </div>

              {/* City Field */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  City *
                </label>
                <input
                  type="text"
                  name="shipping_city"
                  value={formData.shipping_city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Example: Riyadh"
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Phone Number Field */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="shipping_phone"
                  value={formData.shipping_phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+9665XXXXXXXX"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-8 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                'Confirm Order'
              )}
            </button>
          </form>
        </div>

        {/* Order Summary Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">$150.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium">$10.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Discount</span>
              <span className="font-medium text-green-600">-$15.00</span>
            </div>
            
            <hr className="my-4" />
            
            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span>$145.00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}