// 📁 frontend/src/components/admin/AdminRoute.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface AdminRouteProps {
  children: React.ReactNode;
  redirectPath?: string;
}

/**
 * 🔒 حارس مسارات الإدارة
 * يضمن أن فقط المديرين يمكنهم الوصول إلى الصفحات المحمية
 */
export const AdminRoute: React.FC<AdminRouteProps> = ({ 
  children, 
  redirectPath = '/' 
}) => {
  const location = useLocation();
  const { user, isLoading, isAdmin, isAuthenticated } = useAuth();

  // حالة التحميل
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-gray-600">جاري التحقق من الصلاحيات...</span>
      </div>
    );
  }

  // حالة: غير مسجل دخول
  if (!isAuthenticated || !user) {
    // حفظ الصفحة الحالية للعودة إليها بعد تسجيل الدخول
    return (
      <Navigate 
        to={`/login?redirect=${encodeURIComponent(location.pathname)}`} 
        replace 
        state={{ from: location }}
      />
    );
  }

  // حالة: مسجل دخول ولكن ليس مديراً
  if (!isAdmin) {
    console.warn(`⚠️ حاول المستخدم ${user.email} الوصول إلى صفحة الإدارة: ${location.pathname}`);
    
    return (
      <Navigate 
        to={redirectPath} 
        replace 
        state={{ 
          from: location,
          message: 'غير مصرح لك بالوصول إلى هذه الصفحة',
          type: 'error'
        }}
      />
    );
  }

  // حالة: الحساب غير مفعل
  if (user.active === false) {
    return (
      <Navigate 
        to="/login" 
        replace 
        state={{ 
          message: 'حسابك غير مفعل. يرجى التواصل مع الدعم',
          type: 'error'
        }}
      />
    );
  }

  // ✅ حالة: مدير مسجل دخول ومفعل
  return <>{children}</>;
};