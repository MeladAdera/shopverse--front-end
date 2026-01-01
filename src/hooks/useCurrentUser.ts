// src/hooks/useCurrentUser.ts
import { useState, useEffect } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
}

export function useCurrentUser() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCurrentUser = () => {
      try {
        const userData = localStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          setCurrentUser(user);
        }
      } catch (error) {
        console.error('❌ Error loading current user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCurrentUser();
    
    // 🔥 الاستماع لتغييرات localStorage (اختياري)
    const handleStorageChange = () => {
      loadCurrentUser();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return { 
    currentUser, 
    isLoading,
    userId: currentUser?.id 
  };
}