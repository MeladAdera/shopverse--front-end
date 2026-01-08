// 📁 src/components/admin/CategoryFormModal.tsx
import React from 'react';
import { Loader2 } from 'lucide-react';
import type { CreateCategoryRequest } from '../../types/admin.types';

interface CategoryFormModalProps {
  isOpen: boolean;
  isEditing: boolean;
  categoryName?: string;
  formData: CreateCategoryRequest;
  onSubmit: () => void;
  onClose: () => void;
  onFormChange: (data: CreateCategoryRequest) => void;
  isLoading?: boolean;
}

const CategoryFormModal: React.FC<CategoryFormModalProps> = ({
  isOpen,
  isEditing,
  categoryName,
  formData,
  onSubmit,
  onClose,
  onFormChange,
  isLoading = false
}) => {
  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onFormChange({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <h3 className="text-xl font-bold mb-4">
              {isEditing ? `Edit Category: ${categoryName}` : 'Create New Category'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  placeholder="e.g., Electronics"
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  name="image_url"
                  value={formData.image_url || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  placeholder="https://example.com/image.jpg"
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter a valid image URL or leave empty for default
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className={`px-4 py-2 text-white rounded-lg flex items-center justify-center min-w-[120px] ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : isEditing 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    {isEditing ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  isEditing ? 'Update Category' : 'Create Category'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryFormModal;