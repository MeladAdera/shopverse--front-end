// axios.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    console.log('🔐 API Request:', {
      url: config.url,
      method: config.method,
      token: token ? 'Present' : 'Missing'
    });
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('📨 Token added:', token.substring(0, 20) + '...');
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('❌ API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data
    });
    
    // Handle 500 errors specially
    if (error.response?.status === 500) {
      console.error('🔧 Server error detected. Check backend logs.');
      
      // For cart endpoints, we can return empty cart
      if (error.config?.url?.includes('/cart')) {
        console.log('🛒 Returning empty cart due to server error');
        // Return a fake response to prevent UI crashes
        return Promise.resolve({
          data: {
            success: true,
            message: 'Cart loaded (fallback)',
            data: {
              id: 0,
              user_id: 0,
              items: [],
              items_count: 0,
              total_price: 0
            }
          }
        });
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;