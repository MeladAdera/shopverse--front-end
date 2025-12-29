// src/lib/authService.ts
import api from './axios';
import type { AuthResponse, LoginCredentials, RegisterData, User } from '../types/auth.types';

class AuthService {
  // Register new user
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post('/auth/register', data);
    this.setAuthData(response.data);
    return response.data;
  }

  // Login user
 async login(credentials: LoginCredentials): Promise<AuthResponse> {
  console.log('=== 🔍 DEBUG LOGIN START ===');
  
  try {
    // 1. أرسل الطلب
    console.log('📤 Sending login request...');
    const response = await api.post('/auth/login', credentials);
    
    // 2. شوف الـ response كامل
    console.log('📥 Full response:', response);
    console.log('📊 Response status:', response.status);
    console.log('📦 Response data:', response.data);
    console.log('🎯 Response.data.data:', response.data?.data);
    
    // 3. تأكد من البنية
    if (!response.data) {
      console.error('❌ ERROR: No response.data');
      throw new Error('Server returned empty response');
    }
    
    if (!response.data.data) {
      console.error('❌ ERROR: No data property in response');
      console.error('Available keys:', Object.keys(response.data));
      throw new Error('Invalid response structure');
    }
    
    // 4. خذ البيانات من المكان الصحيح
    const authData = response.data.data;
    console.log('✅ Auth data extracted:', authData);
    
    // 5. خزن البيانات
    console.log('💾 Storing to localStorage...');
    this.setAuthData(authData);
    
    console.log('=== ✅ DEBUG LOGIN END ===');
    return authData;
    
  } catch (error: any) {
    console.error('🔥 LOGIN ERROR:', error);
    console.error('Error response:', error.response?.data);
    throw error;
  }
}

  // Logout user
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearAuthData();
      window.location.href = '/login';
    }
  }

  // Get user profile
  async getProfile(): Promise<User> {
    const response = await api.get('/auth/profile');
    return response.data.user;
  }

  // Refresh token
  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await api.post('/auth/refresh-token', { refreshToken });
    this.setAuthData(response.data);
    return response.data;
  }

  // Helper methods
 setAuthData(data: any): void {
  console.log('💾 setAuthData received:', data);
  
  // تحقق من البيانات
  if (!data) {
    console.error('❌ ERROR: setAuthData received null/undefined');
    return;
  }
  
  // خذ التوكنات بأي شكل
  const accessToken = data.accessToken || data.access_token;
  const refreshToken = data.refreshToken || data.refresh_token;
  const user = data.user || {};
  
  console.log('🔑 Extracted:', {
    accessToken: accessToken ? '✅ (has value)' : '❌ (undefined)',
    refreshToken: refreshToken ? '✅ (has value)' : '❌ (undefined)',
    userEmail: user.email || '❌ (no email)'
  });
  
  // تحقق من التوكن الأساسي
  if (!accessToken) {
    console.error('❌ CRITICAL: No access token found in:', data);
    throw new Error('Authentication failed: No access token');
  }
  
  // خزن
  localStorage.setItem('access_token', accessToken);
  if (refreshToken) {
    localStorage.setItem('refresh_token', refreshToken);
  }
  localStorage.setItem('user', JSON.stringify(user));
  
  // تأكد من التخزين
  console.log('📝 localStorage after save:', {
    access_token: localStorage.getItem('access_token')?.substring(0, 20) + '...',
    user: localStorage.getItem('user')
  });
}

  clearAuthData(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }

  getAuthData(): {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
  } {
    const userStr = localStorage.getItem('user');
    return {
      user: userStr ? JSON.parse(userStr) : null,
      accessToken: localStorage.getItem('access_token'),
      refreshToken: localStorage.getItem('refresh_token'),
    };
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }
}

export default new AuthService();