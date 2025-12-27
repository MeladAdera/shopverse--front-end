import { api } from '@/lib/api-client';

// الـ interface الأصلي من الـ API
export interface APICategory {
  id: number;
  name: string;
  image_url: string;
  created_at: string;
  products_count: string;
}

// الـ interface للاستخدام في الـ Frontend
export interface UICategory {
  id: number | string;
  name: string;
  value: string;
  label: string;
  productCount: number;
  image_url?: string;
  created_at?: string;
  products_count?: string;
}

export interface CategoriesResponse {
  success: boolean;
  message: string;
  timestamp: string;
  data: {
    categories: APICategory[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export const categoryService = {
  // جلب جميع التصنيفات من الـ API
  async getCategories(): Promise<UICategory[]> {
    try {
      console.log('🔍 Fetching categories from API...');
      
      const response = await api.get<CategoriesResponse>('/admin/categories', {
        params: { limit: 50 }
      });

      console.log('✅ Categories API response received');

      if (!response.data?.data?.categories) {
        console.warn('⚠️ No categories in response');
        return [];
      }

      const categories = response.data.data.categories;
      console.log(`✅ Retrieved ${categories.length} categories`);
      
      // تحويل من APICategory إلى UICategory
      const formattedCategories: UICategory[] = categories.map((category: APICategory) => ({
        id: category.id,
        name: category.name,
        value: category.id.toString(),
        label: category.name,
        productCount: parseInt(category.products_count || '0'),
        products_count: category.products_count,
        image_url: category.image_url,
        created_at: category.created_at
      }));

      console.log('📝 Sample category:', formattedCategories[0]);
      return formattedCategories;

    } catch (error: any) {
      console.error('❌ Error fetching categories:', error);
      
      // إرجاع مصفوفة فارغة في حالة الخطأ
      console.log('🔄 Returning empty array due to error');
      return [];
    }
  },

  // جلب تصنيف معين
  async getCategoryById(id: string | number): Promise<UICategory | null> {
    try {
      const categories = await categoryService.getCategories();
      const idStr = id.toString();
      const category = categories.find(cat => cat.id.toString() === idStr);
      return category || null;
    } catch (error) {
      console.error('❌ Error getting category by id:', error);
      return null;
    }
  },

  // البحث في التصنيفات
  async searchCategories(query: string): Promise<UICategory[]> {
    try {
      const categories = await categoryService.getCategories();
      const filteredCategories = categories.filter(cat => 
        cat.name.toLowerCase().includes(query.toLowerCase())
      );
      return filteredCategories;
    } catch (error) {
      console.error('❌ Error searching categories:', error);
      return [];
    }
  }
};