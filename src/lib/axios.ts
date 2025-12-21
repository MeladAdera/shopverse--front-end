// src/lib/axios.ts
import axios from 'axios';

// إنشاء instance مخصص
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 ثواني
});

// Request interceptor لإضافة التوكن
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor للتعامل مع الأخطاء
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // إذا كان الخطأ 401 (غير مصرح) ولم نجرّب من قبل
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // محاولة تجديد التوكن
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh-token`,
          { refreshToken }
        );

        const { accessToken } = response.data;
        localStorage.setItem('access_token', accessToken);

        // إعادة المحاولة بالتوكن الجديد
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // إذا فشل تجديد التوكن، ننقل إلى صفحة الدخول
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        
        // إعادة توجيه إلى صفحة الدخول إذا كنا في المتصفح
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      }
    }

    // التعامل مع أخطاء أخرى
    if (error.response) {
      // خطأ من السيرفر
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      // لم تصل الطلبية للسيرفر
      console.error('Network Error:', error.message);
    } else {
      // خطأ في إعداد الطلب
      console.error('Request Error:', error.message);
    }

    return Promise.reject(error);
  }
);

// دالة مساعدة لتحميل الصور
export const getImageUrl = (path: string): string => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${import.meta.env.VITE_BASE_URL}${path}`;
};