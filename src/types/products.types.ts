// 📁 src/types/products.types.ts

// ⭐ واجهة الاستجابة العامة من API (مطابقة للهيكل الحقيقي)
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  timestamp?: string;
  data: T;
}

// ⭐ نوع المنتج الأساسي (بناءً على الـ Response الحقيقي)
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_urls: string[]; // ✅ تأكدنا أنها مصفوفة
  category_id: number;
  category_name?: string; // ✅ تأتي من join
  active: boolean;
  created_at: string;
  review_count: number; // ✅ وجدنا هذا الحقل
  average_rating: number; // ✅ وجدنا هذا الحقل
  
  // 🔥 الحقول الجديدة للفلترة
  color: string;
  size: string;
  style: string;
  brand: string;
  gender: 'men' | 'women' | 'unisex' | 'boys' | 'girls';
  season: 'spring' | 'summer' | 'autumn' | 'winter' | 'all';
  material: string;
  sales_count: number;
  
  // ⚠️ updated_at قد لا تأتي في الـ response
  updated_at?: string;
}

// ⭐ البيانات الداخلية للمنتجات (تأتي داخل data)
export interface ProductsData {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ⭐ نوع طلب إنشاء منتج (لـ FormData)
// ⚠️ ملاحظة: هذا النوع للـ FormData، ليس للـ JSON
export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  stock: number;
  category_id: number;
  color?: string;
  size?: string;
  style?: string;
  brand?: string;
  gender?: 'men' | 'women' | 'unisex' | 'boys' | 'girls';
  season?: 'spring' | 'summer' | 'autumn' | 'winter' | 'all';
  material?: string;
  // ⚠️ images ستتم إضافتها كملفات في FormData
}

// ⭐ نوع طلب تحديث منتج
export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  category_id?: number;
  color?: string;
  size?: string;
  style?: string;
  brand?: string;
  gender?: 'men' | 'women' | 'unisex' | 'boys' | 'girls';
  season?: 'spring' | 'summer' | 'autumn' | 'winter' | 'all';
  material?: string;
  // ⚠️ images ستتم إضافتها كملفات إذا كانت جديدة
}

// ⭐ فلاتر المنتجات (بناءً على الـ Controller)
export interface ProductFilters {
  // الفلاتر الأساسية
  page?: number;
  limit?: number;
  search?: string;
  category_id?: number;
  min_price?: number;
  max_price?: number;
  in_stock?: boolean;
  
  // فلاتر التصفية المتقدمة
  color?: string;
  size?: string;
  brand?: string;
  gender?: string;
  season?: string;
  material?: string;
  style?: string;
  
  // التصنيف
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'popular';
  
  // للاحصائيات
  last_days?: number;
  min_sales?: number;
  
  // الفلاتر الإضافية التي قد تأتي من الـ Controller
  created_after?: string;
  created_before?: string;
  offset?: number;
}

// ⭐ أنواع الاستجابة للمنتجات
export type ProductsListResponse = ApiResponse<ProductsData>;
export type SingleProductResponse = ApiResponse<Product>;
export type DeleteProductResponse = ApiResponse<{ id: number }>; // ✅ بناءً على استجابة الحذف المحتملة

// ⭐ إحصائيات المنتجات
export interface ProductStats {
  total_products: number;
  in_stock: number;
  out_of_stock: number;
  inactive_products: number;
  total_sales: number;
  // قد تأتي حقول إضافية
}

// ⭐ خيارات القوائم المنسدلة
export const GENDER_OPTIONS = [
  { value: 'men', label: 'رجال' },
  { value: 'women', label: 'نساء' },
  { value: 'unisex', label: 'للجنسين' },
  { value: 'boys', label: 'أولاد' },
  { value: 'girls', label: 'بنات' }
] as const;

export const SEASON_OPTIONS = [
  { value: 'spring', label: 'الربيع' },
  { value: 'summer', label: 'الصيف' },
  { value: 'autumn', label: 'الخريف' },
  { value: 'winter', label: 'الشتاء' },
  { value: 'all', label: 'جميع المواسم' }
] as const;

export const SIZE_OPTIONS = [
  { value: 'XS', label: 'XS' },
  { value: 'S', label: 'S' },
  { value: 'M', label: 'M' },
  { value: 'L', label: 'L' },
  { value: 'XL', label: 'XL' },
  { value: 'XXL', label: 'XXL' },
  { value: 'XXXL', label: 'XXXL' },
  { value: 'ONE SIZE', label: 'مقاس واحد' }
];

export const COLORS = [
  { value: 'أحمر', label: 'أحمر' },
  { value: 'أزرق', label: 'أزرق' },
  { value: 'أخضر', label: 'أخضر' },
  { value: 'أسود', label: 'أسود' },
  { value: 'أبيض', label: 'أبيض' },
  { value: 'رمادي', label: 'رمادي' },
  { value: 'بني', label: 'بني' },
  { value: 'زهري', label: 'زهري' },
  { value: 'أصفر', label: 'أصفر' },
  { value: 'برتقالي', label: 'برتقالي' },
  { value: 'بنفسجي', label: 'بنفسجي' }
];

// ⭐ نوع المنتج للنماذج (Form)
export interface ProductFormData {
  name: string;
  description: string;
  price: string; // string للتعامل مع الـ input
  stock: string; // string للتعامل مع الـ input
  category_id: string;
  color: string;
  size: string;
  style: string;
  brand: string;
  gender: string;
  season: string;
  material: string;
  images: File[]; // ملفات جديدة
  existingImages?: string[]; // صور موجودة (للتحديث فقط)
}

// ⭐ نوع الاستجابة لإنشاء منتج (بناءً على الـ response الحقيقي)
export type CreateProductResponse = ApiResponse<{
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_urls: string[];
  category_id: number;
  active: boolean;
  created_at: string;
  review_count: number;
  average_rating: number;
  color: string;
  size: string;
  style: string;
  brand: string;
  gender: string;
  season: string;
  material: string;
  sales_count: number;
}>;