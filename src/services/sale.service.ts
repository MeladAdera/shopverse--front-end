// 📁 src/services/sale.service.ts
import { api } from '@/lib/api-client';
import { productService } from './product.service';

export const saleService = {
  /**
   * 1. الحصول على منتجات التخفيضات (بناءً على sales_count)
   */
  getSaleProducts: async (params?: any): Promise<any[]> => {
    console.log('🔍 Getting sale products...');
    
    try {
      // نستخدم معامل sort='popular' الذي يستخدم sales_count
      const products = await productService.getProducts({
        ...params,
        sort: 'popular',
        limit: params?.limit || 20
      });
      
      console.log(`✅ Found ${products.length} potential sale products`);
      
      // إضافة معلومات التخفيض
      return saleService.addSaleInfo(products);
    } catch (error) {
      console.error('❌ Error getting sale products:', error);
      return [];
    }
  },

  /**
   * 2. الحصول على أفضل الصفقات (أعلى تخفيضات)
   */
  getBestDeals: async (limit: number = 12): Promise<any[]> => {
    console.log('🔍 Getting best deals...');
    
    try {
      const products = await productService.getProducts({
        sort: 'popular',
        limit: limit * 2 // نجلب أكثر للتصفية
      });
      
      // إضافة معلومات التخفيض
      const productsWithSaleInfo = saleService.addSaleInfo(products);
      
      // ترتيب حسب أعلى تخفيض
      const bestDeals = productsWithSaleInfo
        .sort((a, b) => b.discount_percentage - a.discount_percentage)
        .slice(0, limit);
      
      console.log(`✅ Best deals calculated: ${bestDeals.length} products`);
      return bestDeals;
    } catch (error) {
      console.error('❌ Error getting best deals:', error);
      return [];
    }
  },

  /**
   * 3. الحصول على المنتجات الأكثر مبيعاً (على خصم)
   */
  getTopSellingOnSale: async (limit: number = 8): Promise<any[]> => {
    console.log('🔍 Getting top selling on sale...');
    
    try {
      // نستخدم الـ endpoint الموجود لديك: /products/top-selling
      const response = await api.get<any>('/products/top-selling', {
        params: { limit: limit * 2 }
      });
      
      let products = [];
      
      if (response.data?.success && response.data?.data?.products) {
        products = response.data.data.products;
      } else {
        // إذا لم يعمل endpoint top-selling، نستخدم الطريقة البديلة
        products = await productService.getProducts({
          sort: 'popular',
          limit: limit * 2
        });
      }
      
      console.log(`✅ Top selling products: ${products.length}`);
      
      // إضافة معلومات التخفيض مع تخفيضات أكبر للمنتجات الأكثر مبيعاً
      const topSellingWithSale = products.map(product => {
        const baseDiscount = saleService.calculateDiscount(product);
        // زيادة التخفيض للمنتجات الأكثر مبيعاً
        const extraDiscount = product.sales_count > 50 ? 15 : 0;
        const totalDiscount = Math.min(baseDiscount + extraDiscount, 60);
        
        return {
          ...product,
          is_on_sale: true,
          discount_percentage: totalDiscount,
          original_price: product.price,
          sale_price: product.price * (1 - totalDiscount / 100),
          savings: product.price * (totalDiscount / 100),
          tag: '🔥 Best Seller',
          badge: 'Top Seller'
        };
      });
      
      return topSellingWithSale.slice(0, limit);
    } catch (error) {
      console.error('❌ Error getting top selling on sale:', error);
      return [];
    }
  },

  /**
   * 4. الحصول على المنتجات الجديدة (على خصم)
   */
  getNewArrivalsOnSale: async (limit: number = 8): Promise<any[]> => {
    console.log('🔍 Getting new arrivals on sale...');
    
    try {
      // نستخدم last_days للحصول على المنتجات الجديدة
      const products = await productService.getProducts({
        last_days: 30,
        sort: 'newest',
        limit: limit * 2
      });
      
      console.log(`✅ New arrivals: ${products.length}`);
      
      // إضافة معلومات التخفيض للمنتجات الجديدة
      const newArrivalsWithSale = products.map(product => {
        const baseDiscount = saleService.calculateDiscount(product);
        // تخفيض خاص للمنتجات الجديدة (15-25%)
        const newArrivalDiscount = Math.floor(Math.random() * 10) + 15;
        const totalDiscount = Math.min(baseDiscount + newArrivalDiscount, 50);
        
        return {
          ...product,
          is_on_sale: true,
          discount_percentage: totalDiscount,
          original_price: product.price,
          sale_price: product.price * (1 - totalDiscount / 100),
          savings: product.price * (totalDiscount / 100),
          tag: '🆕 New Arrival',
          badge: 'New',
          is_new: true
        };
      });
      
      return newArrivalsWithSale.slice(0, limit);
    } catch (error) {
      console.error('❌ Error getting new arrivals on sale:', error);
      return [];
    }
  },

  /**
   * 5. الحصول على تخفيضات فلاش (محدودة الوقت)
   */
  getFlashSale: async (): Promise<{
    products: any[];
    timeLeft: string;
    totalSavings: number;
  }> => {
    console.log('🔍 Getting flash sale...');
    
    try {
      // نختار 6 منتجات عشوائياً لتكون في فلاش سيل
      const allProducts = await productService.getProducts({ limit: 50 });
      const shuffled = [...allProducts].sort(() => Math.random() - 0.5);
      const flashProducts = shuffled.slice(0, 6);
      
      // إضافة معلومات فلاش سيل
      const flashSaleProducts = flashProducts.map(product => {
        // تخفيضات عالية للفلاش سيل (40-70%)
        const flashDiscount = Math.floor(Math.random() * 30) + 40;
        
        // حساب المخزون المتبقي
        const itemsLeft = Math.floor(Math.random() * 40) + 10;
        
        return {
          ...product,
          is_flash_sale: true,
          discount_percentage: flashDiscount,
          original_price: product.price,
          sale_price: product.price * (1 - flashDiscount / 100),
          savings: product.price * (flashDiscount / 100),
          tag: '⚡ Flash Sale',
          badge: 'Flash',
          items_left: itemsLeft,
          sale_end_time: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 ساعة
          progress_percentage: (itemsLeft / 50) * 100
        };
      });
      
      // حساب إجمالي التوفير
      const totalSavings = flashSaleProducts.reduce((sum, product) => {
        return sum + product.savings;
      }, 0);
      
      console.log('✅ Flash sale created with', flashSaleProducts.length, 'products');
      
      return {
        products: flashSaleProducts,
        timeLeft: '23:59:59',
        totalSavings: Math.round(totalSavings)
      };
    } catch (error) {
      console.error('❌ Error creating flash sale:', error);
      return {
        products: [],
        timeLeft: '00:00:00',
        totalSavings: 0
      };
    }
  },

  /**
   * 6. حساب التخفيض بناءً على معايير المنتج
   */
  calculateDiscount: (product: any): number => {
    let discount = 10; // تخفيض أساسي
    
    // زيادة التخفيض حسب المبيعات
    if (product.sales_count > 100) discount += 25;
    else if (product.sales_count > 50) discount += 20;
    else if (product.sales_count > 20) discount += 15;
    else if (product.sales_count > 10) discount += 10;
    
    // زيادة التخفيض حسب التقييم
    if (product.average_rating >= 4.5) discount += 10;
    else if (product.average_rating >= 4.0) discount += 5;
    
    // زيادة التخفيض حسب المخزون
    if (product.stock > 100) discount += 10;
    else if (product.stock > 50) discount += 5;
    
    // لا تتجاوز 60%
    return Math.min(discount, 60);
  },

  /**
   * 7. إضافة معلومات التخفيض للمنتجات
   */
  addSaleInfo: (products: any[]): any[] => {
    return products.map(product => {
      const discount = saleService.calculateDiscount(product);
      
      return {
        ...product,
        is_on_sale: discount > 10, // يعتبر على تخفيض إذا كان أكثر من 10%
        discount_percentage: discount,
        original_price: product.price,
        sale_price: product.price * (1 - discount / 100),
        savings: product.price * (discount / 100),
        tag: discount >= 30 ? '🔥 Hot Deal' : 
             discount >= 20 ? '🎯 Great Deal' : 
             '🏷️ On Sale'
      };
    });
  },

  /**
   * 8. الحصول على إحصائيات التخفيضات
   */
  getSaleStats: async (): Promise<{
    totalProducts: number;
    totalSavings: number;
    averageDiscount: number;
    categoriesOnSale: string[];
    brandsOnSale: string[];
  }> => {
    console.log('🔍 Getting sale statistics...');
    
    try {
      const saleProducts = await saleService.getSaleProducts({ limit: 100 });
      
      const stats = {
        totalProducts: saleProducts.length,
        totalSavings: Math.round(
          saleProducts.reduce((sum, product) => sum + product.savings, 0)
        ),
        averageDiscount: Math.round(
          saleProducts.reduce((sum, product) => sum + product.discount_percentage, 0) / 
          Math.max(saleProducts.length, 1)
        ),
        categoriesOnSale: [] as string[],
        brandsOnSale: [] as string[]
      };
      
      // جمع الفئات والعلامات التجارية الفريدة
      const categoriesSet = new Set<string>();
      const brandsSet = new Set<string>();
      
      saleProducts.forEach(product => {
        if (product.category_name) categoriesSet.add(product.category_name);
        if (product.brand) brandsSet.add(product.brand);
      });
      
      stats.categoriesOnSale = Array.from(categoriesSet);
      stats.brandsOnSale = Array.from(brandsSet);
      
      console.log('✅ Sale stats calculated:', stats);
      return stats;
    } catch (error) {
      console.error('❌ Error calculating sale stats:', error);
      return {
        totalProducts: 0,
        totalSavings: 0,
        averageDiscount: 0,
        categoriesOnSale: [],
        brandsOnSale: []
      };
    }
  }
};