// src/services/product.service.ts
import { api } from '@/lib/api-client'; // ✅ استيراد getImageUrl
import type { ProductsResponse, Product, ProductApiResponse } from '@/types/product';

export const productService = {
   getProductById: async (productId: number | string): Promise<Product> => {
    try {
      const response = await api.get<ProductApiResponse>(`/products/${productId}`);
      
      if (!response.data?.success) {
        throw new Error(response.data?.message || 'Product not found');
      }
      
      const product = response.data.data;
      
      // 🔧 **إصلاح مسارات الصور**
      if (product.image_urls && Array.isArray(product.image_urls)) {
        product.image_urls = product.image_urls.map(img => {
          // تحويل uploads إلى public
          if (img && img.includes('/uploads/')) {
            return img.replace('/uploads/', '/public/');
          }
          return img;
        });
      }
      
      console.log('✅ [productService] المنتج بعد الإصلاح:', {
        id: product.id,
        name: product.name,
        image_urls: product.image_urls
      });
      
      return product;
    } catch (error) {
      console.error('❌ [productService] خطأ:', error);
      throw error;
    }
  },
  getProductsByCategory: async (categoryId: number): Promise<Product[]> => {
    console.log('🔍 Getting products for category:', categoryId);
    
    try {
      const products = await productService.getProducts({
        category_id: categoryId
      });
      
      console.log('✅ Found', products.length, 'products for category', categoryId);
      return products;
    } catch (error) {
      console.error('❌ Error getting products by category:', error);
      throw error;
    }
  },
  
  getProducts: async (params?: any): Promise<Product[]> => {
    console.log('🔍 Getting products with params:', params);
    
    try {
      const response = await api.get<ProductsResponse>('/products', { params });
      if (!response.data?.data?.products) {
        console.warn('⚠️ No products in response');
        return [];
      }
      
      const products = response.data.data.products;
      console.log('✅ Retrieved', products.length, 'products');
      
      if (products.length > 0) {
        console.log('📝 Sample product:', {
          id: products[0].id,
          name: products[0].name,
          price: products[0].price,
          category: products[0].category_name
        });
      }
      
      return products;
    } catch (error) {
      console.error('❌ Error fetching products:', error);
      throw error;
    }
  },

   // 1. الحصول على منتجات علامة تجارية محددة
  getProductsByBrand: async (brand: string, params?: any): Promise<Product[]> => {
    console.log('🔍 Getting products for brand:', brand);
    
    try {
      const response = await api.get<ProductsResponse>(`/products/brand/${brand}`, { params });
      
      if (!response.data?.success) {
        throw new Error(response.data?.message || 'Brand not found');
      }
      
      const products = response.data.data.products || [];
      console.log(`✅ Found ${products.length} products for brand ${brand}`);
      
      return products;
    } catch (error) {
      console.error('❌ Error getting products by brand:', error);
      throw error;
    }
  },

  // 2. الحصول على جميع العلامات التجارية المتاحة
  getAvailableBrands: async (): Promise<string[]> => {
    console.log('🔍 Getting available brands...');
    
    try {
      // الطريقة 1: استخدام endpoint خاص إذا كان موجوداً
      // const response = await api.get('/products/filter-options');
      
      // الطريقة 2: الحصول من المنتجات
      const products = await productService.getProducts({ limit: 1000 });
      
      const brandsSet = new Set<string>();
      products.forEach(product => {
        if (product.brand && product.brand.trim()) {
          brandsSet.add(product.brand.trim());
        }
      });
      
      const brands = Array.from(brandsSet).sort();
      console.log('✅ Found brands:', brands);
      
      return brands;
    } catch (error) {
      console.error('❌ Error getting available brands:', error);
      return ['adidas', 'nike']; // قيم افتراضية للاختبار
    }
  },

  // 3. الحصول على إحصائيات العلامات التجارية
  getBrandsStats: async (): Promise<Array<{
    name: string;
    productCount: number;
    totalSales: number;
    averageRating: number;
    latestProduct?: Product;
  }>> => {
    console.log('🔍 Getting brands statistics...');
    
    try {
      const products = await productService.getProducts({ limit: 1000 });
      
      const brandMap = new Map<string, {
        productCount: number;
        totalSales: number;
        totalRating: number;
        ratingCount: number;
        latestProduct?: Product;
      }>();
      
      // تحليل البيانات
      products.forEach(product => {
        if (!product.brand || !product.brand.trim()) return;
        
        const brandName = product.brand.trim();
        const current = brandMap.get(brandName) || {
          productCount: 0,
          totalSales: 0,
          totalRating: 0,
          ratingCount: 0,
          latestProduct: undefined
        };
        
        current.productCount++;
        current.totalSales += product.sales_count || 0;
        current.totalRating += product.average_rating || 0;
        current.ratingCount += (product.average_rating > 0 ? 1 : 0);
        
        // تحديث أحدث منتج
        if (!current.latestProduct || 
            new Date(product.created_at) > new Date(current.latestProduct.created_at)) {
          current.latestProduct = product;
        }
        
        brandMap.set(brandName, current);
      });
      
      // تحويل إلى مصفوفة
      const brandsStats = Array.from(brandMap.entries()).map(([name, data]) => ({
        name,
        productCount: data.productCount,
        totalSales: data.totalSales,
        averageRating: data.ratingCount > 0 ? data.totalRating / data.ratingCount : 0,
        latestProduct: data.latestProduct
      }));
      
      // ترتيب حسب عدد المنتجات
      brandsStats.sort((a, b) => b.productCount - a.productCount);
      
      console.log('✅ Brands statistics calculated:', brandsStats.length, 'brands');
      return brandsStats;
    } catch (error) {
      console.error('❌ Error calculating brands stats:', error);
      throw error;
    }
  },

  // 4. الحصول على أفضل العلامات التجارية (أعلى مبيعات)
  getTopBrands: async (limit: number = 10): Promise<Array<{
    name: string;
    productCount: number;
    totalSales: number;
    averageRating: number;
  }>> => {
    console.log('🔍 Getting top brands, limit:', limit);
    
    try {
      const brandsStats = await productService.getBrandsStats();
      
      // ترتيب حسب المبيعات
      const topBrands = brandsStats
        .sort((a, b) => b.totalSales - a.totalSales)
        .slice(0, limit);
      
      console.log('✅ Top brands retrieved:', topBrands.length);
      return topBrands;
    } catch (error) {
      console.error('❌ Error getting top brands:', error);
      throw error;
    }
  },

  // 5. البحث في العلامات التجارية
  searchBrands: async (query: string): Promise<string[]> => {
    console.log('🔍 Searching brands for:', query);
    
    try {
      const brands = await productService.getAvailableBrands();
      
      const filteredBrands = brands.filter(brand =>
        brand.toLowerCase().includes(query.toLowerCase())
      );
      
      console.log('✅ Brands search results:', filteredBrands.length);
      return filteredBrands;
    } catch (error) {
      console.error('❌ Error searching brands:', error);
      return [];
    }
  },

  // الدوال المساعدة الموجودة
  getNewArrivals: async (limit: number = 4): Promise<any[]> => {
    console.log('🔍 Getting new arrivals, limit:', limit);
    
    try {
      const products = await productService.getProducts({
        sort: 'newest',
        limit
      });
      
      console.log('✅ New arrivals:', products.length);
      
      return products.map(product => ({
        id: product.id,
        name: product.name,
        category: product.category_name,
        image: product.image_urls?.[0] || '/placeholder.jpg',
        price: `$${product.price}`,
        rating: product.average_rating || 4.5,
        ratingStars: '★'.repeat(Math.round(product.average_rating || 4.5)) + 
                    '☆'.repeat(5 - Math.round(product.average_rating || 4.5))
      }));
    } catch (error) {
      console.error('❌ Error getting new arrivals:', error);
      throw error;
    }
  },

  getTopSelling: async (limit: number = 4): Promise<any[]> => {
    console.log('🔍 Getting top selling, limit:', limit);
    
    try {
      const products = await productService.getProducts({
        sort: 'popular',
        limit
      });
      
      console.log('✅ Top selling:', products.length);
      
      return products.map(product => ({
        id: product.id,
        name: product.name,
        category: product.category_name,
        image: product.image_urls?.[0] || '/placeholder.jpg',
        price: `$${product.price}`,
        rating: product.average_rating || 4.5,
        ratingStars: '★'.repeat(Math.round(product.average_rating || 4.5)) + 
                    '☆'.repeat(5 - Math.round(product.average_rating || 4.5))
      }));
    } catch (error) {
      console.error('❌ Error getting top selling:', error);
      throw error;
    }
  },

};