// 📁 src/pages/admin/EditProductPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader } from 'lucide-react';
import ProductForm from '../../components/admin/ProductForm';
import productService from '../../services/productAdminService';
import type { Product } from '../../types/products.types';

const EditProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    if (!id) return;
    
    setIsLoading(true);
    try {
      const response = await productService.getProductById(parseInt(id));
      setProduct(response.data);
    } catch (error) {
      console.error('Failed to fetch product:', error);
      navigate('/admin/products');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    if (!id) return;
    
    setIsSubmitting(true);
    try {
      await productService.updateProduct(parseInt(id), formData);
      navigate('/admin/products');
    } catch (error: any) {
      alert(error.message || 'Failed to update product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/products');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-lg font-medium text-gray-900">Product not found</h2>
        <button
          onClick={() => navigate('/admin/products')}
          className="mt-4 text-blue-600 hover:text-blue-800"
        >
          Go back to products
        </button>
      </div>
    );
  }

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
        <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
        <p className="text-gray-600 mt-1">Editing: {product.name}</p>
      </div>

      <div className="bg-white rounded-lg border shadow-sm p-6">
        <ProductForm
          mode="edit"
          initialData={product}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};

export default EditProductPage;