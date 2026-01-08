// src/hooks/useCart.ts - الإصدار النهائي المُصحح
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartService } from '../services/cart.service';
import type { CartResponse, ApiResponse, CartItem } from '../types/cart';

export function useCart() {
  const queryClient = useQueryClient();

  // 1. استعلام السلة مع معالجة الأخطاء
  const {
    data: cart,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['cart'],
    queryFn: async (): Promise<CartResponse> => {
      try {
        const response: ApiResponse<CartResponse> = await cartService.getCart();
        
        if (!response.success) {
          throw new Error(response.message || 'فشل تحميل السلة');
        }
        
        return response.data;
      } catch (error) {
        console.error('خطأ في استعلام السلة:', error);
        throw error;
      }
    },
    // إعدادات التخزين المؤقت
    staleTime: 1000 * 60 * 5, // 5 دقائق
    gcTime: 1000 * 60 * 10, // 10 دقائق للتخزين
    retry: 2,
  });

  // 2. طفرة إضافة منتج للسلة
  const addToCartMutation = useMutation({
    mutationFn: ({ productId, quantity }: { productId: number; quantity: number }) =>
      cartService.addToCart(productId, quantity),
    
    onMutate: async ({ productId, quantity }) => {
      // إلغاء الاستعلامات الحالية
      await queryClient.cancelQueries({ queryKey: ['cart'] });
      
      // حفظ النسخة القديمة للتراجع
      const previousCart = queryClient.getQueryData<CartResponse>(['cart']);
      
      // تحديث واجهة المستخدم على الفور (Optimistic Update)
      if (previousCart) {
        const tempItem: CartItem = {
          id: Date.now(), // معرف مؤقت
          product_id: productId,
          product_name: 'جاري الإضافة...',
          product_price: '0',
          product_images: [],
          product_stock: 0,
          quantity,
          item_total: 0,
          original_price: '0',
          category: '',
        };
        
        queryClient.setQueryData<CartResponse>(['cart'], {
          ...previousCart,
          items_count: previousCart.items_count + quantity,
          items: [...previousCart.items, tempItem],
        });
      }
      
      return { previousCart };
    },
    
    onError: (err, _, context) => {
      // التراجع في حالة الفشل
      if (context?.previousCart) {
        queryClient.setQueryData(['cart'], context.previousCart);
      }
      console.error('خطأ في إضافة المنتج:', err);
    },
    
    onSuccess: (response) => {
      if (response.success) {
        // استبدال البيانات المؤقتة بالحقيقية
        queryClient.setQueryData(['cart'], response.data);
        
        // إظهار رسالة نجاح
        console.log('تمت الإضافة بنجاح');
      }
    },
    
    onSettled: () => {
      // إعادة تحميل البيانات للتأكد من المزامنة
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  // 3. طفرة تحديث الكمية
  const updateCartItemMutation = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: number; quantity: number }) =>
      cartService.updateCartItem(itemId, quantity),
    
    onMutate: async ({ itemId, quantity }) => {
      await queryClient.cancelQueries({ queryKey: ['cart'] });
      const previousCart = queryClient.getQueryData<CartResponse>(['cart']);
      
      if (previousCart) {
        const updatedItems = previousCart.items.map(item => {
          if (item.id === itemId) {
            const productPrice = parseFloat(item.product_price) || 0;
            return { 
              ...item, 
              quantity, 
              item_total: productPrice * quantity 
            };
          }
          return item;
        });
        
        queryClient.setQueryData<CartResponse>(['cart'], {
          ...previousCart,
          items: updatedItems,
        });
      }
      
      return { previousCart };
    },
    
    onError: (err, _, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(['cart'], context.previousCart);
      }
      console.error('خطأ في تحديث الكمية:', err);
    },
    
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  // 4. طفرة حذف عنصر
  const removeFromCartMutation = useMutation({
    mutationFn: (itemId: number) => cartService.removeFromCart(itemId),
    
    onMutate: async (itemId) => {
      await queryClient.cancelQueries({ queryKey: ['cart'] });
      const previousCart = queryClient.getQueryData<CartResponse>(['cart']);
      
      if (previousCart) {
        const itemToRemove = previousCart.items.find(item => item.id === itemId);
        const updatedItems = previousCart.items.filter(item => item.id !== itemId);
        
        queryClient.setQueryData<CartResponse>(['cart'], {
          ...previousCart,
          items_count: previousCart.items_count - (itemToRemove?.quantity || 0),
          items: updatedItems,
        });
      }
      
      return { previousCart };
    },
    
    onError: (err, _, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(['cart'], context.previousCart);
      }
      console.error('خطأ في حذف المنتج:', err);
    },
    
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  // 5. طفرة تفريغ السلة
  const clearCartMutation = useMutation({
    mutationFn: () => cartService.clearCart(),
    
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['cart'] });
      const previousCart = queryClient.getQueryData<CartResponse>(['cart']);
      
      queryClient.setQueryData<CartResponse>(['cart'], {
        id: previousCart?.id || 0,
        user_id: previousCart?.user_id || 0,
        items: [],
        items_count: 0,
        total_price: 0,
      });
      
      return { previousCart };
    },
    
    onError: (err, _, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(['cart'], context.previousCart);
      }
      console.error('خطأ في تفريغ السلة:', err);
    },
  });

  // 6. الدوال المساعدة
  const addToCart = (productId: number, quantity: number = 1) => {
    return addToCartMutation.mutateAsync({ productId, quantity });
  };

  const updateCartItem = (itemId: number, quantity: number) => {
    return updateCartItemMutation.mutateAsync({ itemId, quantity });
  };

  const removeFromCart = (itemId: number) => {
    return removeFromCartMutation.mutateAsync(itemId);
  };

  const clearCart = () => {
    return clearCartMutation.mutateAsync();
  };

  // 7. القيم المحسوبة
  const cartItemsCount = cart?.items_count || 0;
  const cartTotal = cart?.total_price || 0;
  const cartItems = cart?.items || [];

  // 8. إرجاع الواجهة
  return {
    // الحالة
    cart,
    isLoading,
    error: error instanceof Error ? error.message : null,
    isMutating: 
      addToCartMutation.isPending ||
      updateCartItemMutation.isPending ||
      removeFromCartMutation.isPending ||
      clearCartMutation.isPending,
    
    // الدوال
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    refreshCart: refetch,
    
    // البيانات المحسوبة
    cartItemsCount,
    cartTotal,
    cartItems,
    
    // الحالات المنفصلة للتحكم في UI
    addToCartStatus: {
      isPending: addToCartMutation.isPending,
      isError: addToCartMutation.isError,
      error: addToCartMutation.error,
    },
    
    // إعادة تعيين
    resetCart: () => {
      queryClient.resetQueries({ queryKey: ['cart'] });
    },
  };
}