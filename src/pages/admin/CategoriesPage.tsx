// 📁 src/pages/admin/CategoriesPage.tsx
import React, { useEffect, useState } from 'react';
import { 
  Folder, 
  FolderPlus, 
  Edit, 
  Trash2, 
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Image as ImageIcon
} from 'lucide-react';
import adminService from '../../services/admin.service';
import type { 
  Category, 
  ApiResponse,
  CategoriesData,
  CreateCategoryRequest,
  UpdateCategoryRequest
} from '../../types/admin.types';

const AdminCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  });

  // حالات النموذج
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  
  const [formData, setFormData] = useState<CreateCategoryRequest>({
    name: '',
    image_url: ''
  });

  // 📂 جلب الفئات
  const fetchCategories = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📂 Fetching categories page:', page);
      const response: ApiResponse<CategoriesData> = await adminService.getCategories(page, pagination.limit);
      
      console.log('📂 Categories data:', response.data);
      
      setCategories(response.data.categories || []);
      setPagination(response.data.pagination);
      
    } catch (err: any) {
      console.error('❌ Error fetching categories:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // 📂 إنشاء فئة جديدة
  const handleCreateCategory = async () => {
    try {
      if (!formData.name.trim()) {
        setError('Category name is required');
        return;
      }

      console.log('📤 Creating category:', formData);
      const response: ApiResponse<Category> = await adminService.createCategory(formData);
      
      console.log('✅ Created category:', response.data);
      
      setSuccess(response.message);
      setShowCreateModal(false);
      setFormData({ name: '', image_url: '' });
      
      // إعادة تحميل القائمة
      fetchCategories(pagination.page);
      
      // إخفاء رسالة النجاح بعد 5 ثواني
      setTimeout(() => setSuccess(null), 5000);
      
    } catch (err: any) {
      console.error('❌ Error creating category:', err);
      setError(err.response?.data?.message || err.message || 'Failed to create category');
    }
  };

  // 📂 تحديث فئة
  const handleUpdateCategory = async () => {
    if (!selectedCategory) return;

    try {
      console.log('📤 Updating category:', selectedCategory.id, formData);
      const response: ApiResponse<Category> = await adminService.updateCategory(
        selectedCategory.id, 
        formData as UpdateCategoryRequest
      );
      
      console.log('✅ Updated category:', response.data);
      
      setSuccess(response.message);
      setShowEditModal(false);
      setSelectedCategory(null);
      setFormData({ name: '', image_url: '' });
      
      // تحديث القائمة
      fetchCategories(pagination.page);
      
    } catch (err: any) {
      console.error('❌ Error updating category:', err);
      setError(err.response?.data?.message || err.message || 'Failed to update category');
    }
  };

  // 📂 حذف فئة
  const handleDeleteCategory = async (categoryId: number) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    try {
      console.log('🗑️ Deleting category:', categoryId);
      const response = await adminService.deleteCategory(categoryId);
      
      console.log('✅ Delete response:', response);
      setSuccess(response.message);
      
      // تحديث القائمة
      fetchCategories(pagination.page);
      
    } catch (err: any) {
      console.error('❌ Error deleting category:', err);
      setError(err.response?.data?.message || err.message || 'Failed to delete category');
    }
  };

  // 📂 فتح نموذج التعديل
  const openEditModal = (category: Category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      image_url: category.image_url
    });
    setShowEditModal(true);
  };

  // 📂 تغيير الصفحة
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchCategories(newPage);
    }
  };

  // 📂 إعادة تعيين النموذج
  const resetForm = () => {
    setFormData({ name: '', image_url: '' });
    setSelectedCategory(null);
  };

  return (
    <div className="space-y-6">
      {/* العنوان والأزرار */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories Management</h1>
          <p className="text-gray-600 mt-1">
            Total Categories: <span className="font-bold">{pagination.total}</span>
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => fetchCategories(pagination.page)}
            disabled={loading}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <FolderPlus className="h-4 w-4 mr-2" />
            Add Category
          </button>
        </div>
      </div>

      {/* رسائل النجاح */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center">
            <CheckCircle className="text-green-500 mr-3" size={24} />
            <div>
              <h3 className="text-lg font-bold text-green-800">Success</h3>
              <p className="text-green-600 mt-1">{success}</p>
            </div>
          </div>
        </div>
      )}

      {/* رسائل الخطأ */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center">
            <AlertCircle className="text-red-500 mr-3" size={24} />
            <div>
              <h3 className="text-lg font-bold text-red-800">Error</h3>
              <p className="text-red-600 mt-1">{error}</p>
              <button
                onClick={() => setError(null)}
                className="mt-2 text-sm text-red-700 hover:text-red-900"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* جدول الفئات */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {loading && categories.length === 0 ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading categories...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-center">
            <Folder className="h-12 w-12 text-gray-400 mx-auto" />
            <p className="mt-4 text-gray-600">No categories found</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create First Category
            </button>
          </div>
        ) : (
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
                          onClick={() => openEditModal(category)}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
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
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="border-t px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {categories.length} of {pagination.total} categories
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-3 py-1">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create Category Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">Create New Category</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Electronics"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL
                  </label>
                  <input
                    type="text"
                    value={formData.image_url}
                    onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/image.jpg"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter a valid image URL or leave empty for default
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateCategory}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Category
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {showEditModal && selectedCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">
                Edit Category: {selectedCategory.name}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL
                  </label>
                  <input
                    type="text"
                    value={formData.image_url}
                    onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateCategory}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Update Category
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategoriesPage;