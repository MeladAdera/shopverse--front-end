// src/lib/imageService.ts

class ImageService {
  private static BASE_URL = 'http://localhost:5000';
  
  static transformImageUrl(imagePath: string | undefined): string {
    if (!imagePath) return `${this.BASE_URL}/placeholder.jpg`;
    
    // إذا كان الرابط كاملاً
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // تحويل من uploads إلى public
    if (imagePath.includes('/uploads/')) {
      return `${this.BASE_URL}${imagePath.replace('/uploads/', '/public/')}`;
    }
    
    // إضافة BASE_URL للمسارات النسبية
    if (imagePath.startsWith('/')) {
      return `${this.BASE_URL}${imagePath}`;
    }
    
    return `${this.BASE_URL}/${imagePath}`;
  }
  
  static transformProduct(apiProduct: any): any {
    // معالجة السعر
    const price = typeof apiProduct.price === 'number' 
      ? apiProduct.price 
      : parseFloat(apiProduct.price) || 0;
    
    const originalPrice = apiProduct.original_price 
      ? (typeof apiProduct.original_price === 'number'
        ? apiProduct.original_price
        : parseFloat(apiProduct.original_price) || undefined)
      : undefined;
    
    // الخصم
    const discount = apiProduct.discount_percentage || undefined;
    
    // الصورة
    const imageUrls = apiProduct.image_urls || [];
    const mainImage = imageUrls[0] || apiProduct.image ;
    
    return {
      id: apiProduct.id,
      name: apiProduct.name,
      price: price,
      originalPrice: originalPrice,
      category: apiProduct.category_name || apiProduct.category,
      image: this.transformImageUrl(mainImage),
      rating: apiProduct.average_rating || apiProduct.rating || 0,
      discount: discount
    };
  }
  
  static transformProducts(apiProducts: any[]): any[] {
    if (!Array.isArray(apiProducts)) return [];
    return apiProducts.map(product => this.transformProduct(product));
  }
}

export default ImageService;