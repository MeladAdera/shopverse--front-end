// 📁 src/components/admin/CategoriesTable.tsx
import React from 'react';
import { Folder, Edit, Trash2, Image as ImageIcon } from 'lucide-react';
import type { Category } from '../../types/admin.types';

interface CategoriesTableProps {
  categories: Category[];
  loading: boolean;
  onEdit: (category: Category) => void;
  onDelete: (id: number) => void;
  onPageChange: (page: number) => void;
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

const CategoriesTable: React.FC<CategoriesTableProps> = ({
  categories,
  loading,
  onEdit,
  onDelete,
  onPageChange,
  currentPage,
  totalPages,
  totalItems
}) => {
  if (loading && categories.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading categories...</p>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="p-8 text-center">
        <Folder className="h-12 w-12 text-gray-400 mx-auto" />
        <p className="mt-4 text-gray-600">No categories found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3 px-6 text-gray-600 font-medium">ID</th>
              <th className="text-left py-3 px-6 text-gray-600 font-medium">Name</th>
              <th className="text-left py-3 px-6 text-gray-600 font-medium">Image</th>
              <th className="text-left py-3 px-6 text-gray-600 font-medium">Created</th>
              <th className="text-left py-3 px-6 text-gray-600 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="border-b hover:bg-gray-50">
                <td className="py-4 px-6 font-medium">#{category.id}</td>
                <td className="py-4 px-6">
                  <div className="font-medium">{category.name}</div>
                </td>
                <td className="py-4 px-6">
                  {category.image_url ? (
                    <div className="flex items-center">
                      <ImageIcon className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-500 truncate max-w-xs">
                        {category.image_url}
                      </span>
                    </div>
                  ) : (
                    <span className="text-gray-400">No image</span>
                  )}
                </td>
                <td className="py-4 px-6 text-gray-500">
                  {new Date(category.created_at).toLocaleDateString()}
                </td>
                <td className="py-4 px-6">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEdit(category)}
                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(category.id)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="border-t px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {categories.length} of {totalItems} categories
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-3 py-1">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesTable;