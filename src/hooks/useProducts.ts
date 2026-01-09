// 📁 src/hooks/useProducts.ts
import { useState, useCallback } from 'react';
import productService from '../services/productAdminService';
import type { Product, ProductFilters } from '../types/products.types';

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  success: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  fetchProducts: (page?: number, filters?: ProductFilters) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  setError: (error: string | null) => void;
  setSuccess: (success: string | null) => void;
}

export const useProducts = (): UseProductsReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const fetchProducts = useCallback(async (page: number = 1, filters?: ProductFilters) => {
    setLoading(true);
    setError(null);
    try {
      const response = await productService.getProducts(page, pagination.limit, filters);
      setProducts(response.data.products);
      setPagination(response.data.pagination);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, [pagination.limit]);

  const deleteProduct = async (id: number) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await productService.deleteProduct(id);
      setSuccess('Product deleted successfully');
      // Refresh the product list
      await fetchProducts(pagination.page);
    } catch (err: any) {
      setError(err.message || 'Failed to delete product');
    } finally {
      setLoading(false);
    }
  };

  return {
    products,
    loading,
    error,
    success,
    pagination,
    fetchProducts,
    deleteProduct,
    setError,
    setSuccess,
  };
};