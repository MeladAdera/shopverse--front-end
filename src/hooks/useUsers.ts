// 📁 src/hooks/useUsers.ts
import { useState, useEffect, useCallback } from 'react';
import adminService from '../services/admin.service';
import type { AdminUser, ApiResponse, UsersData } from '../types/admin.types';
import type { UserFiltersUI } from '../types/filters.types';
import { convertFiltersForServer } from '../types/filters.types';

export const useUsers = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
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

  const fetchUsers = useCallback(async (page = 1, uiFilters?: UserFiltersUI) => {
    try {
      setLoading(true);
      setError(null);
      
      const serverFilters = uiFilters ? convertFiltersForServer(uiFilters) : undefined;
      const response: ApiResponse<UsersData> = await adminService.getUsers(
        page, 
        pagination.limit,
        serverFilters
      );
      
      setUsers(response.data.users || []);
      setPagination(response.data.pagination);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [pagination.limit]);

  const confirmToggleStatus = useCallback((userId: number, active: boolean) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    setUserToToggle({
      id: userId,
      active: !active,
      name: user.name
    });
    setShowConfirmModal(true);
  }, [users]);

  const handleToggleStatus = useCallback(async () => {
    if (!userToToggle) return;

    try {
      // Update UI immediately
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userToToggle.id ? { ...user, active: userToToggle.active } : user
        )
      );

      await adminService.updateUserStatus(userToToggle.id, userToToggle.active);
      
      setSuccess(
        userToToggle.active 
          ? `✅ Successfully activated ${userToToggle.name}'s account`
          : `🚫 Successfully deactivated ${userToToggle.name}'s account`
      );
      
      setTimeout(() => setSuccess(null), 5000);
      
    } catch (err: any) {
      // Revert to previous state
      fetchUsers(pagination.page, filters);
      
      if (err.response?.status === 403) {
        setError('❌ You cannot deactivate your own account');
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to update user status');
      }
    } finally {
      setShowConfirmModal(false);
      setUserToToggle(null);
    }
  }, [userToToggle, fetchUsers, pagination.page, filters]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    success,
    userToToggle,
    showConfirmModal,
    pagination,
    filters,
    fetchUsers,
    confirmToggleStatus,
    handleToggleStatus,
    setShowConfirmModal,
    setUserToToggle,
    setError,
    setSuccess
  };
};