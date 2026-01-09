// 📁 src/services/productService.ts
import api from '../lib/axios';
import type {
  ProductsListResponse,
  SingleProductResponse,
  UpdateProductRequest,
  DeleteProductResponse,
  CreateProductResponse,
  ProductFilters} from '../types/products.types';

class ProductAdminService {
  private baseUrl = '/products';
  
  /**
   * 📦 الحصول على المنتجات مع التصفية
   */
  async getProducts(
    page: number = 1,
    limit: number = 10,
    filters?: ProductFilters
  ): Promise<ProductsListResponse> {
    try {
      const params: any = {
        page,
        limit,
        ...filters
      };

      // تنظيف القيم الفارغة
      Object.keys(params).forEach(key => {
        if (params[key] === undefined || params[key] === '') {
          delete params[key];
        }
      });

      const response = await api.get(this.baseUrl, { params });
      console.log('📦 Products response:', response.data);
      
      return response.data;
      
    } catch (error) {
      console.error('❌ Error fetching products:', error);
      throw error;
    }
  }

  /**
   * 📦 الحصول على منتج محدد
   */
  async getProductById(productId: number): Promise<SingleProductResponse> {
    try {
      const response = await api.get(`${this.baseUrl}/${productId}`);
      console.log('📦 Product details:', response.data);
      
      return response.data;
      
    } catch (error) {
      console.error('❌ Error fetching product:', error);
      throw error;
    }
  }

  /**
   * ➕ إنشاء منتج جديد (مع رفع الصور)
   */
  async createProduct(productData: FormData): Promise<CreateProductResponse> {
    try {
      const response = await api.post(this.baseUrl, productData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('✅ Product created:', response.data);
      
      return response.data;
      
    } catch (error: any) {
      console.error('❌ Error creating product:', error);
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('فشل إنشاء المنتج');
      }
    }
  }

  /**
   * ✏️ تحديث منتج موجود
   */
  async updateProduct(
    productId: number,
    productData: FormData | UpdateProductRequest
  ): Promise<SingleProductResponse> {
    try {
      let response;
      
      if (productData instanceof FormData) {
        // إذا كان FormData (به صور)
        response = await api.put(`${this.baseUrl}/${productId}`, productData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        // إذا كان JSON (بدون صور)
        response = await api.put(`${this.baseUrl}/${productId}`, productData);
      }
      
      console.log('✅ Product updated:', response.data);
      
      return response.data;
      
    } catch (error: any) {
      console.error('❌ Error updating product:', error);
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('فشل تحديث المنتج');
      }
    }
  }

  /**
   * 🗑️ حذف منتج
   */
  async deleteProduct(productId: number): Promise<DeleteProductResponse> {
    try {
      const response = await api.delete(`${this.baseUrl}/${productId}`);
      console.log('✅ Product deleted:', response.data);
      
      return response.data;
      
    } catch (error: any) {
      console.error('❌ Error deleting product:', error);
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('فشل حذف المنتج');
      }
    }
  }

  /**
   * 🔄 تحديث مخزون المنتج
   */
  async updateStock(
    productId: number,
    stock: number
  ): Promise<SingleProductResponse> {
    try {
      const response = await api.put(`${this.baseUrl}/${productId}/stock`, { stock });
      console.log('✅ Product stock updated:', response.data);
      
      return response.data;
      
    } catch (error) {
      console.error('❌ Error updating stock:', error);
      throw error;
    }
  }

  /**
   * 📊 الحصول على إحصائيات المنتجات
   */
  async getProductStats(): Promise<any> {
    try {
      const response = await api.get(`${this.baseUrl}/stats`);
      console.log('📊 Product stats:', response.data);
      
      return response.data;
      
    } catch (error) {
      console.error('❌ Error fetching product stats:', error);
      throw error;
    }
  }

  /**
   * ⭐ تحديث حالة المنتج (نشط/غير نشط)
   */
  async updateProductStatus(
    productId: number,
    active: boolean
  ): Promise<SingleProductResponse> {
    try {
      const response = await api.put(`${this.baseUrl}/${productId}/status`, { active });
      console.log('✅ Product status updated:', response.data);
      
      return response.data;
      
    } catch (error: any) {
      console.error('❌ Error updating product status:', error);
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('فشل تحديث حالة المنتج');
      }
    }
  }

  /**
   * 🔍 البحث المتقدم في المنتجات
   */
  async advancedSearch(filters: {
    colors?: string[];
    sizes?: string[];
    brands?: string[];
    genders?: string[];
    seasons?: string[];
    materials?: string[];
    min_price?: number;
    max_price?: number;
    category_id?: number;
    page?: number;
    limit?: number;
  }): Promise<ProductsListResponse> {
    try {
      const response = await api.post(`${this.baseUrl}/advanced-search`, filters);
      console.log('🔍 Advanced search results:', response.data);
      
      return response.data;
      
    } catch (error) {
      console.error('❌ Error in advanced search:', error);
      throw error;
    }
  }

  /**
   * 📊 الحصول على أفضل المنتجات مبيعاً
   */
  async getTopSelling(limit: number = 10): Promise<any> {
    try {
      const response = await api.get(`${this.baseUrl}/top-selling?limit=${limit}`);
      console.log('📊 Top selling products:', response.data);
      
      return response.data;
      
    } catch (error) {
      console.error('❌ Error fetching top selling:', error);
      throw error;
    }
  }

  /**
   * 🏷️ الحصول على المنتجات حسب الفئة
   */
  async getProductsByCategory(categoryId: number): Promise<ProductsListResponse> {
    try {
      const response = await api.get(`${this.baseUrl}/category/${categoryId}`);
      console.log('🏷️ Products by category:', response.data);
      
      return response.data;
      
    } catch (error) {
      console.error('❌ Error fetching products by category:', error);
      throw error;
    }
  }

  /**
   * 🔧 تحويل FormData إلى JSON (مساعد)
   */
  convertFormDataToJSON(formData: FormData): Record<string, any> {
    const data: Record<string, any> = {};
    
    formData.forEach((value, key) => {
      // تجاهل الملفات
      if (!(value instanceof File)) {
        data[key] = value;
      }
    });
    
    return data;
  }

  /**
   * 🖼️ تحديث صور المنتج فقط
   */
  async updateProductImages(
    productId: number,
    images: File[]
  ): Promise<SingleProductResponse> {
    try {
      const formData = new FormData();
      
      // إضافة كل صورة كملف منفصل
      images.forEach((image) => {
        formData.append(`images`, image);
      });
      
      const response = await api.put(
        `${this.baseUrl}/${productId}/images`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      console.log('✅ Product images updated:', response.data);
      
      return response.data;
      
    } catch (error: any) {
      console.error('❌ Error updating product images:', error);
      throw error;
    }
  }
}

export default new ProductAdminService();