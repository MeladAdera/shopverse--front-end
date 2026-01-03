// 📁 src/types/filters.types.ts
export interface UserFilters {
  search?: string;
  role?: 'user' | 'admin';
  active?: boolean;
}

export interface UserFiltersUI {
  search: string;
  role: 'all' | 'user' | 'admin';
  status: 'all' | 'active' | 'inactive';
}

// دالة لتحويل الفلاتر من UI إلى Server
export const convertFiltersForServer = (filters: UserFiltersUI): UserFilters => {
  const serverFilters: UserFilters = {};
  
  if (filters.search) {
    serverFilters.search = filters.search;
  }
  
  if (filters.role !== 'all') {
    serverFilters.role = filters.role;
  }
  
  if (filters.status !== 'all') {
    serverFilters.active = filters.status === 'active';
  }
  
  return serverFilters;
};