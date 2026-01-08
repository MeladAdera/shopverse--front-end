// src/hooks/useCurrentUser.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
  avatar?: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

// مفاتيح Queries
export const userKeys = {
  all: ['user'] as const,
  current: () => [...userKeys.all, 'current'] as const,
  profile: (id: number) => [...userKeys.all, 'profile', id] as const,
};

export function useCurrentUser() {
  const queryClient = useQueryClient();

  // Query لجلب المستخدم الحالي من localStorage
  const {
    data: currentUser,
    isLoading,
    error,
    refetch: refreshUser,
  } = useQuery({
    queryKey: userKeys.current(),
    queryFn: async () => {
      console.log('🔍 [useCurrentUser] جلب بيانات المستخدم...');
      
      try {
        const userData = localStorage.getItem('user');
        if (!userData) {
          throw new Error('لا يوجد مستخدم مسجل دخول');
        }

        const user = JSON.parse(userData) as User;
        
        // التحقق من صحة بيانات المستخدم
        if (!user.id || !user.email) {
          throw new Error('بيانات المستخدم غير صالحة');
        }

        console.log('✅ تم جلب بيانات المستخدم:', { id: user.id, name: user.name });
        return user;
      } catch (err) {
        console.error('❌ خطأ في جلب بيانات المستخدم:', err);
        throw err;
      }
    },
    retry: 1,
    staleTime: 1000 * 60 * 30, // 30 دقيقة (بيانات المستخدم نادراً ما تتغير)
    gcTime: 1000 * 60 * 60, // ساعة واحدة
    refetchOnWindowFocus: false, // لا تجلب تلقائياً عند التركيز
  });

  // Mutation لتسجيل الدخول
  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      console.log('🔐 [useCurrentUser] تسجيل الدخول...');
      
      // محاكاة API call - استبدل هذا بال API الحقيقي
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data: AuthResponse = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      // حفظ في localStorage
      localStorage.setItem('user', JSON.stringify(data.data.user));
      localStorage.setItem('token', data.data.token);

      return data.data.user;
    },
    onSuccess: (user) => {
      console.log('✅ تم تسجيل الدخول:', user.name);
      
      // تحديث query المستخدم الحالي
      queryClient.setQueryData(userKeys.current(), user);
      
      // إبطال queries الأخرى المرتبطة بالمستخدم إذا لزم الأمر
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
    onError: (error: Error) => {
      console.error('❌ خطأ في تسجيل الدخول:', error);
    },
  });

  // Mutation لتسجيل الخروج
  const logoutMutation = useMutation({
    mutationFn: async () => {
      console.log('🚪 [useCurrentUser] تسجيل الخروج...');
      
      // محاكاة API call - استبدل هذا بال API الحقيقي
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      // مسح البيانات من localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
    onSuccess: () => {
      console.log('✅ تم تسجيل الخروج');
      
      // مسح بيانات المستخدم من cache
      queryClient.setQueryData(userKeys.current(), null);
      queryClient.removeQueries({ queryKey: userKeys.all });
      
      // إبطال queries أخرى قد تعتمد على المستخدم
      queryClient.invalidateQueries({ queryKey: ['cart'] }); // مثال: السلة
      queryClient.invalidateQueries({ queryKey: ['orders'] }); // مثال: الطلبات
    },
    onError: (error: Error) => {
      console.error('❌ خطأ في تسجيل الخروج:', error);
    },
  });

  // Mutation لتحديث بيانات المستخدم
  const updateProfileMutation = useMutation({
    mutationFn: async (userData: Partial<User>) => {
      console.log('✏️ [useCurrentUser] تحديث بيانات المستخدم...');
      
      if (!currentUser) {
        throw new Error('يجب تسجيل الدخول أولاً');
      }

      // محاكاة API call - استبدل هذا بال API الحقيقي
      const response = await fetch(`/api/users/${currentUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      // تحديث localStorage
      const updatedUser = { ...currentUser, ...userData };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      return updatedUser;
    },
    onSuccess: (updatedUser) => {
      console.log('✅ تم تحديث بيانات المستخدم');
      
      // تحديث cache
      queryClient.setQueryData(userKeys.current(), updatedUser);
    },
    onError: (error: Error) => {
      console.error('❌ خطأ في تحديث بيانات المستخدم:', error);
    },
  });

  // دالة لتسجيل الدخول
  const login = async (email: string, password: string) => {
    try {
      const user = await loginMutation.mutateAsync({ email, password });
      return { success: true, user, error: undefined };
    } catch (error: any) {
      return { success: false, user: undefined, error: error.message };
    }
  };

  // دالة لتسجيل الخروج
  const logout = async () => {
    try {
      await logoutMutation.mutateAsync();
      return { success: true, error: undefined };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  // دالة لتحديث الملف الشخصي
  const updateProfile = async (userData: Partial<User>) => {
    try {
      const updatedUser = await updateProfileMutation.mutateAsync(userData);
      return { success: true, user: updatedUser, error: undefined };
    } catch (error: any) {
      return { success: false, user: undefined, error: error.message };
    }
  };

  // استماع لتغييرات localStorage (اختياري لكن مفيد)
  if (typeof window !== 'undefined') {
    // يمكنك إضافة event listener هنا إذا لزم الأمر
    // لكن TanStack Query يتعامل مع refetching تلقائياً
  }

  return {
    // الحالة
    currentUser,
    isLoading,
    error: error as Error,
    isAuthenticated: !!currentUser,
    
    // الدوال
    login,
    logout,
    updateProfile,
    refreshUser,
    
    // حالات الموتيشن
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    isUpdatingProfile: updateProfileMutation.isPending,
    
    // مساعدات
    userId: currentUser?.id,
    userName: currentUser?.name,
    userEmail: currentUser?.email,
    
    // إعادة تعيين الخطأ
    resetError: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.current() });
    },
  };
}