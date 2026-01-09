export const API_BASE_URL = 'http://localhost:5000/api';

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

/**
 * جلب المنتجات مع الفلترة
 */
export const fetchProductsWithFilters = async (
  filters: FilterParams
): Promise<ProductsResponse> => {
  try {
    console.log('🚀 [API] Fetching products with filters:', filters);
    
    // بناء query parameters
    const queryParams = new URLSearchParams();
    
    // 🔥 الأسبقية: نرسل category_id إذا كان موجوداً، وإلا category
    if (filters.category_id && filters.category_id.trim() !== '') {
      queryParams.append('category_id', filters.category_id);
      console.log(`🔗 Adding category_id to query: ${filters.category_id}`);
    } 
    // 🔥 دعم للإصدار القديم
    else if (filters.category && filters.category.trim() !== '') {
      queryParams.append('category', filters.category);
      console.log(`🔗 Adding category to query: ${filters.category}`);
    }
    
    if (filters.color && filters.color.trim() !== '') {
      queryParams.append('color', filters.color.toLowerCase());
      console.log(`🔗 Adding color to query: ${filters.color}`);
    }
    
    if (filters.size && filters.size.trim() !== '') {
      queryParams.append('size', filters.size);
      console.log(`🔗 Adding size to query: ${filters.size}`);
    }
    
    if (filters.style && filters.style.trim() !== '') {
      queryParams.append('style', filters.style.toLowerCase());
      console.log(`🔗 Adding style to query: ${filters.style}`);
    }
    
    if (filters.brand && filters.brand.trim() !== '') {
      queryParams.append('brand', filters.brand);
      console.log(`🔗 Adding brand to query: ${filters.brand}`);
    }
    
    if (filters.gender && filters.gender.trim() !== '') {
      queryParams.append('gender', filters.gender.toLowerCase());
      console.log(`🔗 Adding gender to query: ${filters.gender}`);
    }
    
    if (filters.season && filters.season.trim() !== '') {
      queryParams.append('season', filters.season);
      console.log(`🔗 Adding season to query: ${filters.season}`);
    }
    
    if (filters.material && filters.material.trim() !== '') {
      queryParams.append('material', filters.material);
      console.log(`🔗 Adding material to query: ${filters.material}`);
    }
    
    if (filters.min_price && filters.min_price > 0) {
      queryParams.append('min_price', filters.min_price.toString());
      console.log(`🔗 Adding min_price to query: ${filters.min_price}`);
    }
    
    if (filters.max_price && filters.max_price > 0) {
      queryParams.append('max_price', filters.max_price.toString());
      console.log(`🔗 Adding max_price to query: ${filters.max_price}`);
    }
    
    if (filters.search && filters.search.trim() !== '') {
      queryParams.append('search', filters.search);
      console.log(`🔗 Adding search to query: ${filters.search}`);
    }
    
    // إضافة pagination إذا احتاج
    if (filters.page && filters.page > 0) {
      queryParams.append('page', filters.page.toString());
      console.log(`🔗 Adding page to query: ${filters.page}`);
    }
    
    if (filters.limit && filters.limit > 0) {
      queryParams.append('limit', filters.limit.toString());
      console.log(`🔗 Adding limit to query: ${filters.limit}`);
    }
    
    const queryString = queryParams.toString();
    const url = `${API_BASE_URL}/products${queryString ? `?${queryString}` : ''}`;
    
    console.log('🌐 [API] Final Request URL:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ [API] HTTP error details:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: ProductsResponse = await response.json();
    
    console.log('✅ [API] Response received:', {
      success: data.success,
      productsCount: data.data?.products?.length || 0,
      message: data.message,
      hasFilters: queryString.length > 0
    });
    
    // 🔥 تسجيل تحذير إذا كانت النتائج فارغة مع وجود فلاتر
    if (queryString.length > 0 && (!data.data?.products || data.data.products.length === 0)) {
      console.warn('⚠️ [API] No products found with filters:', filters);
    }
    
    return data;
    
  } catch (error) {
    console.error('❌ [API] Error fetching products:', error);
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Network error occurred',
      data: {
        products: []
      }
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