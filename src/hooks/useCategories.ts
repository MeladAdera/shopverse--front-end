// // src/hooks/useCategories.ts
// import { useQuery } from '@tanstack/react-query';
// import { categoryService } from '@/services/category.service';

// export const useCategories = (params?: any) => {
//   return useQuery({
//     queryKey: ['categories', params],
//     queryFn: () => categoryService.getCategories(params),
//   });
// };

// export const useHomepageCategories = (limit: number = 4) => {
//   return useQuery({
//     queryKey: ['categories', 'homepage', limit],
//     queryFn: () => categoryService.getHomepageCategories(limit),
//     staleTime: 5 * 60 * 1000, // 5 دقائق
//   });
// };

// export const useCategory = (id: number) => {
//   return useQuery({
//     queryKey: ['category', id],
//     queryFn: () => categoryService.getCategoryById(id),
//     enabled: !!id, // فقط إذا كان الـ ID موجوداً
//   });
// };