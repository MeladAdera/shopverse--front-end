// 📁 src/pages/admin/CreateProductPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ProductForm from '../../components/admin/ProductForm';
import productService from '../../services/productAdminService';

const CreateProductPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      await productService.createProduct(formData);
      navigate('/admin/products');
    } catch (error: any) {
      alert(error.message || 'Failed to create product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/products');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={handleCancel}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Create New Product</h1>
      </div>

      <div className="bg-white rounded-lg border shadow-sm p-6">
        <ProductForm
          mode="create"
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};

export default CreateProductPage;