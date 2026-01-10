// 📁 src/components/admin/ProductsTable.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom'; // ⭐ إضافة useNavigate
import { Edit, Trash2, Eye, Package, Image as ImageIcon } from 'lucide-react';
import type { Product } from '../../types/products.types';

interface ProductsTableProps {
  products: Product[];
  loading: boolean;
  onViewProduct: (product: Product) => void;
  // ⭐ نزيل onEditProduct من الـ props
  onDeleteProduct: (product: Product) => void;
  onPageChange: (page: number) => void;
  currentPage: number;
  totalPages: number;
}

const ProductsTable: React.FC<ProductsTableProps> = ({
  products,
  loading,
  // ⭐ لا نمرر onEditProduct بعد الآن
  onDeleteProduct,
  onPageChange,
  currentPage,
  totalPages,
}) => {
  const navigate = useNavigate(); // ⭐ استخدام useNavigate

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  const getStockColor = (stock: number) => {
    if (stock === 0) return 'bg-red-100 text-red-800';
    if (stock < 10) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  // ⭐ دالة جديدة للتعديل باستخدام navigate
  const handleEditProduct = (product: Product) => {
    navigate(`/admin/products/${product.id}/edit`);
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!loading && products.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">No products found</h3>
        <p className="text-gray-500 mt-1">No products in the database yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 shrink-0">
                      {product.image_urls && product.image_urls.length > 0 ? (
                        <img
                          src={`http://localhost:5000${product.image_urls[0]}`}
                          alt={product.name}
                          className="h-10 w-10 object-cover rounded"
                        />
                      ) : (
                        <div className="h-10 w-10 bg-gray-100 rounded flex items-center justify-center">
                          <ImageIcon className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {product.description.substring(0, 50)}...
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-900">
                    {product.category_name || `Category ${product.category_id}`}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {formatPrice(product.price)}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStockColor(product.stock)}`}>
                    {product.stock}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-medium">
                  <div className="flex space-x-2">
                   <button
  onClick={() => navigate(`/admin/products/${product.id}`)}
  className="text-blue-600 hover:text-blue-900"
  title="View Details"
>
  <Eye className="h-4 w-4" />
</button>
                    {/* ⭐ التحديث هنا: استخدام handleEditProduct بدلاً من onEditProduct */}
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="text-green-600 hover:text-green-900"
                      title="Edit Product"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDeleteProduct(product)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete Product"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
          <div className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded text-sm disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsTable;