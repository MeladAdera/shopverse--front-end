import { api } from '@/lib/api-client';

export const API_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
  'http://localhost:5000/api';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_urls: string[];
  category_id: number;
  category_name: string;
  color: string;
  size: string;
  style: string;
  brand: string;
  gender: string;
  season: string;
  material: string;
  review_count: number;
  average_rating: number;
  sales_count: number;
  active: boolean;
  created_at: string;
}

export interface ProductsResponse {
  success: boolean;
  message: string;
  data: {
    products: Product[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface FilterParams {
  category?: string;          // اسم التصنيف (للتوافق مع الإصدار القديم)
  category_id?: string;       // 🔥 ID التصنيف (الجديد)
  color?: string;           // اللون
  size?: string;            // المقاس
  style?: string;           // النمط
  brand?: string;           // الماركة
  gender?: string;          // الجنس
  season?: string;          // الموسم
  material?: string;        // المادة
  min_price?: number;       // أقل سعر
  max_price?: number;       // أعلى سعر
  search?: string;          // بحث نصي
  page?: number;            // الصفحة
  limit?: number;           // عدد العناصر
}

function filtersToRequestParams(filters: FilterParams): Record<string, string | number> {
  const params: Record<string, string | number> = {};

  if (filters.category_id && filters.category_id.trim() !== '') {
    params.category_id = filters.category_id.trim();
  } else if (filters.category && filters.category.trim() !== '') {
    params.category = filters.category.trim();
  }
  if (filters.color && filters.color.trim() !== '') {
    params.color = filters.color.toLowerCase();
  }
  if (filters.size && filters.size.trim() !== '') {
    params.size = filters.size.trim();
  }
  if (filters.style && filters.style.trim() !== '') {
    params.style = filters.style.toLowerCase();
  }
  if (filters.brand && filters.brand.trim() !== '') {
    params.brand = filters.brand.trim();
  }
  if (filters.gender && filters.gender.trim() !== '') {
    params.gender = filters.gender.toLowerCase();
  }
  if (filters.season && filters.season.trim() !== '') {
    params.season = filters.season.trim();
  }
  if (filters.material && filters.material.trim() !== '') {
    params.material = filters.material.trim();
  }
  if (filters.min_price != null && filters.min_price > 0) {
    params.min_price = filters.min_price;
  }
  if (filters.max_price != null && filters.max_price > 0) {
    params.max_price = filters.max_price;
  }
  if (filters.search && filters.search.trim() !== '') {
    params.search = filters.search.trim();
  }
  if (filters.page != null && filters.page > 0) {
    params.page = filters.page;
  }
  if (filters.limit != null && filters.limit > 0) {
    params.limit = filters.limit;
  }

  return params;
}

/**
 * جلب المنتجات مع الفلترة (يستخدم axios حتى يعمل VITE_USE_DEMO_DATA مع المحاكاة)
 */
export const fetchProductsWithFilters = async (
  filters: FilterParams
): Promise<ProductsResponse> => {
  try {
    console.log('🚀 [API] Fetching products with filters:', filters);

    const params = filtersToRequestParams(filters);
    const response = await api.get<ProductsResponse>('/products', { params });
    const data = response.data;

    console.log('✅ [API] Response received:', {
      success: data.success,
      productsCount: data.data?.products?.length || 0,
      message: data.message,
    });

    const hasFilters = Object.keys(params).length > 0;
    if (hasFilters && (!data.data?.products || data.data.products.length === 0)) {
      console.warn('⚠️ [API] No products found with filters:', filters);
    }

    return {
      success: data.success !== false,
      message: data.message || '',
      data: {
        products: data.data?.products ?? [],
        pagination: data.data?.pagination,
      },
    };
  } catch (error) {
    console.error('❌ [API] Error fetching products:', error);

    return {
      success: false,
      message: error instanceof Error ? error.message : 'Network error occurred',
      data: {
        products: [],
      },
    };
  }
};

/**
 * جلب جميع المنتجات بدون فلتر
 */
export const fetchAllProducts = async (): Promise<ProductsResponse> => {
  return fetchProductsWithFilters({});
};

/**
 * جلب منتجات بتصنيف معين (باستخدام category_id)
 */
export const fetchProductsByCategoryId = async (categoryId: string): Promise<ProductsResponse> => {
  return fetchProductsWithFilters({ category_id: categoryId });
};

/**
 * جلب منتجات بتصنيف معين (باسم التصنيف - للتوافق)
 */
export const fetchProductsByCategoryName = async (categoryName: string): Promise<ProductsResponse> => {
  return fetchProductsWithFilters({ category: categoryName });
};

/**
 * جلب منتجات بلون معين
 */
export const fetchProductsByColor = async (color: string): Promise<ProductsResponse> => {
  return fetchProductsWithFilters({ color });
};

/**
 * جلب منتجات بحجم معين
 */
export const fetchProductsBySize = async (size: string): Promise<ProductsResponse> => {
  return fetchProductsWithFilters({ size });
};

/**
 * جلب منتجات بنمط معين
 */
export const fetchProductsByStyle = async (style: string): Promise<ProductsResponse> => {
  return fetchProductsWithFilters({ style });
};

/**
 * جلب منتجات بمدى سعر معين
 */
export const fetchProductsByPriceRange = async (min: number, max: number): Promise<ProductsResponse> => {
  return fetchProductsWithFilters({ min_price: min, max_price: max });
};