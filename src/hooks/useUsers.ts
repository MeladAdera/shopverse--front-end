// 📁 src/hooks/useUsers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useCallback } from 'react';
import adminService from '../services/admin.service';
import type { AdminUser, ApiResponse, UsersData } from '../types/admin.types';
import type { UserFiltersUI } from '../types/filters.types';
import { convertFiltersForServer } from '../types/filters.types';

export const useUsers = () => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [userToToggle, setUserToToggle] = useState<{id: number, active: boolean, name: string} | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [filters] = useState<UserFiltersUI>({
    search: '',
    role: 'all',
    status: 'all'
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  });

  // Query للمستخدمين
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['users', pagination.page, filters],
    queryFn: async () => {
      const serverFilters = convertFiltersForServer(filters);
      const response: ApiResponse<UsersData> = await adminService.getUsers(
        pagination.page, 
        pagination.limit,
        serverFilters
      );
      
      setPagination(response.data.pagination);
      return response.data.users || [];
    },
  });

  // Mutation لتغيير الحالة
  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, active }: { id: number; active: boolean }) =>
      adminService.updateUserStatus(id, active),
    onSuccess: (_, { id, active }) => {
      // تحديث cache مباشرة
      queryClient.setQueryData(['users', pagination.page, filters], (old: AdminUser[]) =>
        old.map(user => user.id === id ? { ...user, active } : user)
      );
      
      const user = data?.find(u => u.id === id);
      if (user) {
        setSuccess(
          active 
            ? `✅ تم تفعيل حساب ${user.name}`
            : `🚫 تم إيقاف حساب ${user.name}`
        );
        setTimeout(() => setSuccess(null), 5000);
      }
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || err.message || 'فشلت العملية');
      setTimeout(() => setError(null), 5000);
    },
  });

  const fetchUsers = useCallback(async (page = 1) => {
    setPagination(prev => ({ ...prev, page }));
    await refetch();
  }, [refetch]);

  const confirmToggleStatus = useCallback((userId: number, active: boolean) => {
    const user = data?.find(u => u.id === userId);
    if (!user) return;

    setUserToToggle({ id: userId, active: !active, name: user.name });
    setShowConfirmModal(true);
  }, [data]);

  const handleToggleStatus = useCallback(async () => {
    if (!userToToggle) return;
    
    await toggleStatusMutation.mutateAsync({
      id: userToToggle.id,
      active: userToToggle.active
    });
    
    setShowConfirmModal(false);
    setUserToToggle(null);
  }, [userToToggle, toggleStatusMutation]);

  return {
    // الحالة
    users: data || [],
    loading: isLoading || toggleStatusMutation.isPending,
    error,
    success,
    userToToggle,
    showConfirmModal,
    pagination,
    filters,
    
    // الدوال
    fetchUsers,
    confirmToggleStatus,
    handleToggleStatus,
    setShowConfirmModal,
    setUserToToggle,
    setError,
    setSuccess,
  };
};