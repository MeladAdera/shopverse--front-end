// 📁 src/hooks/useCategories.ts
import { useState } from 'react';
import { 
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryResult,
  type UseMutationResult
} from '@tanstack/react-query';
import adminService from '../services/admin.service';
import type { 
  Category, 
  ApiResponse,
  CategoriesData,
  CreateCategoryRequest,
  UpdateCategoryRequest
} from '../types/admin.types';


interface UseCategoriesReturn {
  // Query states
  categoriesQuery: UseQueryResult<CategoriesData, Error>;
  
  // Mutation states
  createCategoryMutation: UseMutationResult<ApiResponse<Category>, Error, CreateCategoryRequest>;
  updateCategoryMutation: UseMutationResult<ApiResponse<Category>, Error, { id: number; data: UpdateCategoryRequest }>;
  deleteCategoryMutation: UseMutationResult<ApiResponse<void>, Error, number>;
  
  // Local state
  selectedCategory: Category | null;
  showCreateModal: boolean;
  showEditModal: boolean;
  formData: CreateCategoryRequest;
  
  // Actions
  setShowCreateModal: (show: boolean) => void;
  setShowEditModal: (show: boolean) => void;
  setSelectedCategory: (category: Category | null) => void;
  setFormData: (data: CreateCategoryRequest) => void;
  resetForm: () => void;
  
  // Helper functions
  refetchCategories: () => Promise<CategoriesData>;
}

export const useCategories = (limit = 10): UseCategoriesReturn => {
  const queryClient = useQueryClient();
  
  // Local state for UI
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState<CreateCategoryRequest>({
    name: '',
    image_url: ''
  });

  // Query keys
  const categoriesQueryKey = ['categories'];
  const categoryDetailKey = (id: number) => ['category', id];

  // Fetch categories query
  const categoriesQuery = useQuery<CategoriesData, Error>({
    queryKey: categoriesQueryKey,
    queryFn: async ({ }) => {
      const response: ApiResponse<CategoriesData> = await adminService.getCategories(1, limit);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (cache time)
  });

  // Create category mutation
  const createCategoryMutation = useMutation<
    ApiResponse<Category>,
    Error,
    CreateCategoryRequest
  >({
    mutationFn: adminService.createCategory,
    onSuccess: (response) => {
      // Invalidate and refetch categories query
      queryClient.invalidateQueries({ queryKey: categoriesQueryKey });
      
      // Reset form and close modal
      resetForm();
      setShowCreateModal(false);
      
      // Show success message (you can use toast or alert)
      console.log('✅ Category created:', response.message);
    },
    onError: (error) => {
      console.error('❌ Create category error:', error);
      // Handle error (show toast, etc.)
    },
  });

  // Update category mutation
  const updateCategoryMutation = useMutation<
    ApiResponse<Category>,
    Error,
    { id: number; data: UpdateCategoryRequest }
  >({
    mutationFn: ({ id, data }) => adminService.updateCategory(id, data),
    onSuccess: (response, variables) => {
      // Update specific category in cache
      queryClient.setQueryData<CategoriesData>(
        categoriesQueryKey,
        (oldData) => {
          if (!oldData) return oldData;
          
          return {
            ...oldData,
            categories: oldData.categories.map(category =>
              category.id === variables.id
                ? { ...category, ...variables.data, updated_at: new Date().toISOString() }
                : category
            ),
          };
        }
      );
      
      // Also update individual category query if it exists
      queryClient.setQueryData(
        categoryDetailKey(variables.id),
        response.data
      );
      
      // Reset form and close modal
      resetForm();
      setShowEditModal(false);
      
      console.log('✅ Category updated:', response.message);
    },
    onError: (error) => {
      console.error('❌ Update category error:', error);
    },
  });

  // Delete category mutation
  const deleteCategoryMutation = useMutation<
    ApiResponse<void>,
    Error,
    number
  >({
    mutationFn: adminService.deleteCategory,
    onSuccess: (response, id) => {
      // Remove from cache
      queryClient.setQueryData<CategoriesData>(
        categoriesQueryKey,
        (oldData) => {
          if (!oldData) return oldData;
          
          return {
            ...oldData,
            categories: oldData.categories.filter(category => category.id !== id),
            pagination: {
              ...oldData.pagination,
              total: oldData.pagination.total - 1,
            },
          };
        }
      );
      
      // Remove individual category query
      queryClient.removeQueries({ queryKey: categoryDetailKey(id) });
      
      console.log('✅ Category deleted:', response.message);
    },
    onError: (error) => {
      console.error('❌ Delete category error:', error);
    },
  });

  // Helper to refetch categories
  const refetchCategories = async () => {
    await queryClient.invalidateQueries({ queryKey: categoriesQueryKey });
    const data = await queryClient.fetchQuery({
      queryKey: categoriesQueryKey,
      queryFn: () => adminService.getCategories(1, limit).then(res => res.data),
    });
    return data;
  };

  const resetForm = () => {
    setFormData({ name: '', image_url: '' });
    setSelectedCategory(null);
  };

  return {
    // Queries
    categoriesQuery,
    
    // Mutations
    createCategoryMutation,
    updateCategoryMutation,
    deleteCategoryMutation,
    
    // Local state
    selectedCategory,
    showCreateModal,
    showEditModal,
    formData,
    
    // Actions
    setShowCreateModal,
    setShowEditModal,
    setSelectedCategory,
    setFormData,
    resetForm,
    
    // Helpers
    refetchCategories,
  };
};