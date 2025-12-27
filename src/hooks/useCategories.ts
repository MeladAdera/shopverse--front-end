import { api } from '@/lib/api-client';

export interface Category {
  id: number;
  name: string;
  image_url?: string;
  created_at?: string;
  products_count?: string | number;
}

export interface CategoriesResponse {
  success: boolean;
  message: string;
  timestamp: string;
  data: {
    categories: Category[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export const categoryService = {
  // جلب جميع التصنيفات من API
  async getCategories(): Promise<Category[]> {
    try {
      console.log('🔍 [CategoryService] جلب التصنيفات من API...');
      
      const response = await api.get<CategoriesResponse>('/admin/categories', {
        params: { limit: 50 }
      });

      if (!response.data?.data?.categories) {
        console.warn('⚠️ لا توجد تصنيفات في الرد');
        return [];
      }

      const categories = response.data.data.categories;
      console.log(`✅ تم جلب ${categories.length} تصنيف`);
      
      // عرض عينة من التصنيفات
      if (categories.length > 0) {
        console.log('📝 عينة من التصنيفات:', categories.slice(0, 3));
      }
      
      return categories;

    } catch (error: any) {
      console.error('❌ خطأ في جلب التصنيفات:', error);
      throw error;
    }
  },

  // جلب تصنيف معين بواسطة ID
  async getCategoryById(id: number): Promise<Category | null> {
    try {
      console.log(`🔍 [CategoryService] جلب التصنيف ${id}...`);
      const categories = await this.getCategories();
      return categories.find(cat => cat.id === id) || null;
    } catch (error) {
      console.error(`❌ خطأ في جلب التصنيف ${id}:`, error);
      return null;
    }
  }
};