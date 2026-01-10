// 📁 src/components/admin/ProductForm.tsx
import React, { useState, useEffect } from 'react';
import { Upload, X } from 'lucide-react';
import type { ProductFormData, Product } from '../../types/products.types';
import { GENDER_OPTIONS, SEASON_OPTIONS, SIZE_OPTIONS, COLORS } from '../../types/products.types';

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
  mode: 'create' | 'edit';
}

const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
  mode
}) => {
  // حالة النموذج
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
    stock: '',
    category_id: '',
    color: '',
    size: '',
    style: '',
    brand: '',
    gender: '',
    season: '',
    material: '',
    images: [],
    existingImages: []
  });

  // الصور المعروضة للمستخدم
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  // تهيئة البيانات الأولية
  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData({
        name: initialData.name,
        description: initialData.description,
        price: initialData.price.toString(),
        stock: initialData.stock.toString(),
        category_id: initialData.category_id.toString(),
        color: initialData.color || '',
        size: initialData.size || '',
        style: initialData.style || '',
        brand: initialData.brand || '',
        gender: initialData.gender || '',
        season: initialData.season || '',
        material: initialData.material || '',
        images: [],
        existingImages: initialData.image_urls || []
      });
      
      setExistingImages(initialData.image_urls || []);
    }
  }, [initialData, mode]);

  // دالة لمعالجة تغيير الحقول النصية
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // دالة لمعالجة رفع الصور
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: File[] = [];
    const newPreviews: string[] = [];

    // التحقق من عدد الصور
    const totalImages = formData.images.length + files.length + existingImages.length;
    if (totalImages > 3) {
      alert('لا يمكن رفع أكثر من 3 صور للمنتج');
      return;
    }

    // معالجة كل ملف
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // التحقق من نوع الملف
      if (!file.type.startsWith('image/')) {
        alert(`الملف ${file.name} ليس صورة`);
        continue;
      }

      // التحقق من حجم الملف (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(`الصورة ${file.name} كبيرة جداً (الحد الأقصى 5MB)`);
        continue;
      }

      newImages.push(file);
      
      // إنشاء معاينة للصورة
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === newImages.length) {
          setImagePreviews(prev => [...prev, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    }

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));
  };

  // دالة لحذف صورة جديدة
  const removeNewImage = (index: number) => {
    const newImages = [...formData.images];
    const newPreviews = [...imagePreviews];
    
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setFormData(prev => ({ ...prev, images: newImages }));
    setImagePreviews(newPreviews);
  };

  // دالة لحذف صورة موجودة
  const removeExistingImage = (index: number) => {
    const newExisting = [...existingImages];
    newExisting.splice(index, 1);
    setExistingImages(newExisting);
  };

  // دالة إرسال النموذج
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // التحقق من البيانات
    if (!formData.name.trim()) {
      alert('اسم المنتج مطلوب');
      return;
    }
    
    if (!formData.price || parseFloat(formData.price) <= 0) {
      alert('السعر يجب أن يكون أكبر من صفر');
      return;
    }
    
    if (formData.images.length === 0 && existingImages.length === 0) {
      alert('يجب رفع صورة واحدة على الأقل');
      return;
    }

    // إنشاء FormData لإرسال البيانات
    const formDataToSend = new FormData();
    
    // إضافة الحصوص النصية
    formDataToSend.append('name', formData.name);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('stock', formData.stock);
    formDataToSend.append('category_id', formData.category_id);
    
    // إضافة الحقول الاختيارية إذا كانت موجودة
    if (formData.color) formDataToSend.append('color', formData.color);
    if (formData.size) formDataToSend.append('size', formData.size);
    if (formData.style) formDataToSend.append('style', formData.style);
    if (formData.brand) formDataToSend.append('brand', formData.brand);
    if (formData.gender) formDataToSend.append('gender', formData.gender);
    if (formData.season) formDataToSend.append('season', formData.season);
    if (formData.material) formDataToSend.append('material', formData.material);
    
    // إضافة الصور الجديدة
    formData.images.forEach(image => {
      formDataToSend.append('images', image);
    });

    // إضافة الصور الموجودة (للتحديث فقط)
    if (mode === 'edit' && existingImages.length > 0) {
      existingImages.forEach((url, index) => {
        formDataToSend.append(`image_urls[${index}]`, url);
      });
    }

    try {
      await onSubmit(formDataToSend);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      {/* عنوان النموذج */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          {mode === 'create' ? 'Create New Product' : 'Edit Product'}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          Cancel
        </button>
      </div>

      {/* الحقول الأساسية */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* الاسم */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
            placeholder="Enter product name"
          />
        </div>

        {/* السعر */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price *
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
            min="0.01"
            step="0.01"
            placeholder="0.00"
          />
        </div>

        {/* المخزون */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Stock *
          </label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
            min="0"
            placeholder="0"
          />
        </div>

        {/* الفئة */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category ID *
          </label>
          <input
            type="number"
            name="category_id"
            value={formData.category_id}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
            min="1"
            placeholder="1"
          />
        </div>
      </div>

      {/* الوصف */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description *
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
          placeholder="Enter product description"
        />
      </div>

      {/* الحقول المنسدلة */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* الجنس */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Gender</option>
            {GENDER_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* الموسم */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Season
          </label>
          <select
            name="season"
            value={formData.season}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Season</option>
            {SEASON_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* المقاس */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Size
          </label>
          <select
            name="size"
            value={formData.size}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Size</option>
            {SIZE_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* الحقول النصية الإضافية */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* اللون */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Color
          </label>
          <select
            name="color"
            value={formData.color}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Color</option>
            {COLORS.map(color => (
              <option key={color.value} value={color.value}>
                {color.label}
              </option>
            ))}
          </select>
        </div>

        {/* الماركة */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Brand
          </label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter brand"
          />
        </div>

        {/* النمط */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Style
          </label>
          <input
            type="text"
            name="style"
            value={formData.style}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter style"
          />
        </div>
      </div>

      {/* المادة */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Material
        </label>
        <input
          type="text"
          name="material"
          value={formData.material}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter material (cotton, polyester, etc.)"
        />
      </div>

      {/* قسم رفع الصور */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Product Images (1-3 images) *
        </label>
        
        <div className="mt-2">
          {/* معاينة الصور الموجودة (للتحديث فقط) */}
          {mode === 'edit' && existingImages.length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Existing Images:</p>
              <div className="flex flex-wrap gap-2">
                {existingImages.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={`http://localhost:5000${url}`}
                      alt={`Existing ${index}`}
                      className="h-24 w-24 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* معاينة الصور الجديدة */}
          {imagePreviews.length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">New Images:</p>
              <div className="flex flex-wrap gap-2">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={preview}
                      alt={`Preview ${index}`}
                      className="h-24 w-24 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* زر رفع الصور */}
          <label className={`inline-flex items-center px-4 py-3 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 ${formData.images.length + existingImages.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <Upload className="h-5 w-5 mr-2 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">
              {formData.images.length + existingImages.length >= 3 
                ? 'Maximum 3 images reached' 
                : 'Upload Images'}
            </span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              disabled={formData.images.length + existingImages.length >= 3}
              className="hidden"
            />
          </label>
          
          <p className="mt-2 text-sm text-gray-500">
            Upload up to 3 images. Maximum size: 5MB each. {formData.images.length + existingImages.length}/3
          </p>
        </div>
      </div>

      {/* أزرار الإرسال */}
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing...
            </>
          ) : (
            `${mode === 'create' ? 'Create' : 'Update'} Product`
          )}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;