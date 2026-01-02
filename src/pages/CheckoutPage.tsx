// 📁 src/pages/CheckoutPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../services/order.service';

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
    setIsLoading(true);

    try {
      // 1. Validate form data
      if (!formData.shipping_address || !formData.shipping_city) {
        alert('Please enter address and city');
        return;
      }

      // 2. Create order through order service
      const response = await orderService.createOrder(formData);
      
      if (response.success) {
        // 3. Redirect to order confirmation page
        navigate(`/orders/${response.data.order_id}`);
      } else {
        alert('Error creating order');
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      alert(error.message || 'Payment process error occurred');
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
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Street, District, Building Number"
                  required
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
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Example: Riyadh"
                  required
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
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="+9665XXXXXXXX"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-8 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Creating Order...' : 'Confirm Order'}
            </button>
          </form>
        </div>

        {/* Order Summary Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>$150.00</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>$10.00</span>
            </div>
            <div className="flex justify-between">
              <span>Discount</span>
              <span className="text-green-600">-$15.00</span>
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