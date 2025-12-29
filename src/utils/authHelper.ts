// src/utils/authHelper.ts
export const authHelper = {
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('access_token');
    if (!token) return false;
    
    try {
      // Decode JWT token to check expiry
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(window.atob(base64));
      
      // Check if token is expired
      const isExpired = payload.exp * 1000 < Date.now();
      if (isExpired) {
        // Auto-clear expired token
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error decoding token:', error);
      // Clear invalid token
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      return false;
    }
  },
  
  getToken: (): string | null => {
    return localStorage.getItem('access_token');
  },
  
  getUser: (): any => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
  
  logout: (redirectTo: string = '/login'): void => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    window.location.href = redirectTo;
  },
  
  requireAuth: (redirectTo: string = '/login'): boolean => {
    if (!authHelper.isAuthenticated()) {
      window.location.href = `${redirectTo}?redirect=${encodeURIComponent(window.location.pathname)}`;
      return false;
    }
    return true;
  },
  
  // Optional: Token refresh helper
  refreshToken: async (): Promise<boolean> => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        authHelper.logout();
        return false;
      }
      
      const response = await fetch('http://localhost:5000/api/auth/refresh-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });
      
      if (!response.ok) {
        authHelper.logout();
        return false;
      }
      
      const data = await response.json();
      localStorage.setItem('access_token', data.accessToken);
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      authHelper.logout();
      return false;
    }
  }
};