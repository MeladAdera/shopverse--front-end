// 📁 src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../lib/authService';
import type { 
  User, 
  LoginCredentials, 
  RegisterData,
  AuthResponse 
} from '../types/auth.types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  // 🛠️ إصلاح نوع دالة login لترجع Promise<AuthResponse>
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  register: (data: RegisterData) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  clearError: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { user: storedUser } = authService.getAuthData();
      if (storedUser) {
        try {
          const freshUser = await authService.getProfile();
          setUser(freshUser);
        } catch (profileError) {
          console.log('Token expired, clearing auth data');
          authService.clearAuthData();
          setUser(null);
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
      authService.clearAuthData();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // 🛠️ إصلاح نوع الإرجاع
  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('🔐 Starting login process...');
      const response = await authService.login(credentials);
      console.log('✅ Login successful, user:', response.user);
      
      if (!response.user.role) {
        console.warn('⚠️ No role in user data, defaulting to "user"');
        response.user.role = 'user';
      }
      
      setUser(response.user);
      return response; // 🛠️ إرجاع الـ response
    } catch (err: any) {
      console.error('❌ Login error:', err);
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          'Login failed. Please check your credentials.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // 🛠️ إصلاح نوع الإرجاع
  const register = async (data: RegisterData): Promise<AuthResponse> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.register(data);
      setUser(response.user);
      return response; // 🛠️ إرجاع الـ response
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        localStorage.setItem('user', JSON.stringify({ ...parsedUser, ...userData }));
      }
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        isAdmin,
        isAuthenticated,
        login,
        register,
        logout,
        clearError,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 🛠️ إصلاح الـ hook الأساسي
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};