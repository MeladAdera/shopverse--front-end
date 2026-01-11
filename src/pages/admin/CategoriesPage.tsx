// 📁 src/pages/admin/CategoriesPage.tsx
import React, { useEffect, useState } from 'react'; // Add useState
import { FolderPlus } from 'lucide-react';
import { useCategories } from '../../hooks/useCategories';
import CategoriesTable from '../../components/admin/CategoriesTable';
import CategoryFormModal from '../../components/admin/CategoryFormModal';
import AlertMessage from '../../components/ui/AlertMessage';

const AdminCategoriesPage: React.FC = () => {
  const {
    categoriesQuery,
    createCategoryMutation,
    updateCategoryMutation,
    deleteCategoryMutation,
    selectedCategory,
    showCreateModal,
    showEditModal,
    formData,
    setShowCreateModal,
    setShowEditModal,
    setSelectedCategory,
    setFormData,
    resetForm,
  } = useCategories();

  // Local state for success messages
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);

  // Extract data from query
  const { 
    data: categoriesData, 
    isLoading: loading, 
    error: queryError,
    refetch: fetchCategories 
  } = categoriesQuery;
  
  const categories = categoriesData?.categories || [];
  const pagination = categoriesData?.pagination || { 
    page: 1, 
    limit: 10, 
    total: 0, 
    totalPages: 1 
  };

  // Listen for mutation successes
  useEffect(() => {
    if (createCategoryMutation.isSuccess) {
      setSuccessMessage('Category created successfully!');
      setTimeout(() => setSuccessMessage(null), 5000);
    }
  }, [createCategoryMutation.isSuccess]);

  useEffect(() => {
    if (updateCategoryMutation.isSuccess) {
      setSuccessMessage('Category updated successfully!');
      setTimeout(() => setSuccessMessage(null), 5000);
    }
  }, [updateCategoryMutation.isSuccess]);

  useEffect(() => {
    if (deleteCategoryMutation.isSuccess) {
      setSuccessMessage('Category deleted successfully!');
      setTimeout(() => setSuccessMessage(null), 5000);
    }
  }, [deleteCategoryMutation.isSuccess]);

  // Handle create category
  const handleCreateCategory = async () => {
    if (!formData.name.trim()) {
      alert('Category name is required');
      return;
    }

    try {
      await createCategoryMutation.mutateAsync(formData);
    } catch (err) {
      // Error is handled in the mutation
    }
  };

  // Handle update category
  const handleUpdateCategory = async () => {
    if (!selectedCategory) return;

    try {
      await updateCategoryMutation.mutateAsync({
        id: selectedCategory.id,
        data: formData
      });
    } catch (err) {
      // Error is handled in the mutation
    }
  };

  // Handle delete category - with confirmation modal
  const openDeleteConfirm = (categoryId: number) => {
    setCategoryToDelete(categoryId);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;

    try {
      await deleteCategoryMutation.mutateAsync(categoryToDelete);
      setDeleteConfirmOpen(false);
      setCategoryToDelete(null);
    } catch (err) {
      // Error is handled in the mutation
      setDeleteConfirmOpen(false);
      setCategoryToDelete(null);
    }
  };

  // Open edit modal
  const openEditModal = (category: any) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      image_url: category.image_url || ''
    });
    setShowEditModal(true);
  };

  // Change page
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchCategories();
    }
  };

  // Close modals
  const closeModals = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    resetForm();
  };

  // Get mutation states
  const isCreating = createCategoryMutation.isPending;
  const isUpdating = updateCategoryMutation.isPending;
  const isDeleting = deleteCategoryMutation.isPending;
  
  const createError = createCategoryMutation.error;
  const updateError = updateCategoryMutation.error;
  const deleteError = deleteCategoryMutation.error;

  return (
    <div className="space-y-6">
      {/* Title and buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories Management</h1>
          <p className="text-gray-600 mt-1">
            Total Categories: <span className="font-bold">{pagination.total}</span>
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
       
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <FolderPlus className="h-4 w-4 mr-2" />
            Add Category
          </button>
        </div>
      </div>

      {/* SUCCESS Messages */}
      {successMessage && (
        <AlertMessage
          type="success"
          title="Success"
          message={successMessage}
          onClose={() => setSuccessMessage(null)}
        />
      )}

      {/* ERROR Messages */}
      {queryError && (
        <AlertMessage
          type="error"
          title="Error"
          message={queryError.message}
          onClose={() => {}}
        />
      )}
      
      {createError && (
        <AlertMessage
          type="error"
          title="Create Error"
          message={createError.message}
          onClose={() => createCategoryMutation.reset()}
        />
      )}
      
      {updateError && (
        <AlertMessage
          type="error"
          title="Update Error"
          message={updateError.message}
          onClose={() => updateCategoryMutation.reset()}
        />
      )}
      
      {deleteError && (
        <AlertMessage
          type="error"
          title="Delete Error"
          message={deleteError.message}
          onClose={() => deleteCategoryMutation.reset()}
        />
      )}

      {/* Categories table */}
      <CategoriesTable
        categories={categories}
        loading={loading || isDeleting}
        onEdit={openEditModal}
        onDelete={openDeleteConfirm} // Changed to open confirmation modal
        onPageChange={handlePageChange}
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        totalItems={pagination.total}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4 text-gray-900">
                Confirm Deletion
              </h3>
              
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this category? This action cannot be undone.
              </p>

              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => {
                    setDeleteConfirmOpen(false);
                    setCategoryToDelete(null);
                  }}
                  disabled={isDeleting}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteCategory}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center disabled:opacity-50"
                >
                  {isDeleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Deleting...
                    </>
                  ) : (
                    'Delete Category'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create modal */}
      <CategoryFormModal
        isOpen={showCreateModal}
        isEditing={false}
        formData={formData}
        onSubmit={handleCreateCategory}
        onClose={closeModals}
        onFormChange={setFormData}
        isLoading={isCreating}
      />

      {/* Edit modal */}
      <CategoryFormModal
        isOpen={showEditModal}
        isEditing={true}
        categoryName={selectedCategory?.name}
        formData={formData}
        onSubmit={handleUpdateCategory}
        onClose={closeModals}
        onFormChange={setFormData}
        isLoading={isUpdating}
      />
    </div>
  );
};

export default AdminCategoriesPage;