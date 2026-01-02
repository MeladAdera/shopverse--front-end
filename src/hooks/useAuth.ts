// 📁 src/hooks/useAuth.ts
import { useAuth as useBaseAuth } from '../context/AuthContext'; // 🛠️ تغيير الاسم

// 🛠️ إعادة تصدير مع تحسينات
export const useAuth = () => {
  const context = useBaseAuth(); // 🛠️ استخدام الاسم الجديد
  
  const hasRole = (role: string): boolean => context.user?.role === role;
  const isActive = (): boolean => context.user?.active !== false;
  const canAccessAdmin = context.isAdmin && context.isAuthenticated;
  
  return {
    ...context,
    hasRole,
    isActive,
    canAccessAdmin,
  };
};

