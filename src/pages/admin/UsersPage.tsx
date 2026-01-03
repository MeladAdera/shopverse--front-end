// 📁 src/pages/admin/UsersPage.tsx
import React, { useEffect, useState } from 'react';
import { Users, UserPlus, AlertCircle, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import adminService from '../../services/admin.service';
import UsersTable from '../../components/admin/UsersTable';
import type { AdminUser, UsersListResponse } from '../../types/admin.types';
import type { UserFiltersUI } from '../../types/filters.types';
import { convertFiltersForServer } from '../../types/filters.types';

const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [userToToggle, setUserToToggle] = useState<{id: number, active: boolean, name: string} | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  // 🆕 Using UserFiltersUI instead of local Filters
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

  // Fetch users with filtering
  const fetchUsers = async (page = 1, uiFilters?: UserFiltersUI) => {
    try {
      setLoading(true);
      setError(null);
      
      // 🆕 Convert filters for server
      const serverFilters = uiFilters ? convertFiltersForServer(uiFilters) : undefined;
      
      const response: UsersListResponse = await adminService.getUsers(
        page, 
        pagination.limit,
        serverFilters // 🆕 Send converted filters
      );
      
      setUsers(response.users || []);
      setPagination({
        page: response.pagination.page,
        limit: response.pagination.limit,
        total: response.pagination.total,
        totalPages: response.pagination.totalPages
      });
    } catch (err: any) {
      console.error('❌ Error fetching users:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);


  // Show confirmation for status change
  const confirmToggleStatus = (userId: number, active: boolean) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    setUserToToggle({
      id: userId,
      active: !active,
      name: user.name
    });
    setShowConfirmModal(true);
  };

  // Change user status after confirmation
  const handleToggleStatus = async () => {
    if (!userToToggle) return;

    try {
      // Update UI immediately
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userToToggle.id ? { ...user, active: userToToggle.active } : user
        )
      );

      // 🆕 Use correct updateUserStatus function
      await adminService.updateUserStatus(userToToggle.id, userToToggle.active);
      
      // Show success message
      setSuccess(
        userToToggle.active 
          ? `✅ Successfully activated ${userToToggle.name}'s account`
          : `🚫 Successfully deactivated ${userToToggle.name}'s account`
      );
      
      // Hide message after 5 seconds
      setTimeout(() => setSuccess(null), 5000);
      
    } catch (err: any) {
      console.error('❌ Error updating user status:', err);
      
      // Revert to previous state
      fetchUsers(pagination.page, filters);
      
      if (err.response?.status === 403 && err.response?.data?.message?.includes('cannot block your own')) {
        setError('❌ You cannot deactivate your own account');
      } else {
        setError(err.response?.data?.message || 'Failed to update user status');
      }
    } finally {
      setShowConfirmModal(false);
      setUserToToggle(null);
    }
  };

  // Change page
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchUsers(newPage, filters);
    }
  };

  // Edit user
  const handleEditUser = (user: AdminUser) => {
    console.log('Edit user:', user);
    alert(`Edit user feature for ${user.name} will be added soon`);
  };

  // Add new user
  const handleAddUser = () => {
    alert('Add new user feature will be added soon');
  };

  // Dismiss alerts
  const dismissAlert = () => {
    setError(null);
    setSuccess(null);
  };

  // Calculate statistics
  const activeUsers = users.filter(u => u.active).length;
  const adminUsers = users.filter(u => u.role === 'admin').length;
  const inactiveUsers = users.filter(u => !u.active).length;

  return (
    <div className="space-y-6">
      {/* Title and Statistics */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
          <p className="text-gray-600 mt-1">
            Total Users: <span className="font-bold">{pagination.total}</span>
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => fetchUsers(pagination.page, filters)}
            disabled={loading}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          
          <button
            onClick={handleAddUser}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </button>
        </div>
      </div>

      {/* Success Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CheckCircle className="text-green-500 mr-3" size={24} />
              <div>
                <h3 className="text-lg font-bold text-green-800">Success</h3>
                <p className="text-green-600 mt-1">{success}</p>
              </div>
            </div>
            <button
              onClick={dismissAlert}
              className="text-green-800 hover:text-green-900 text-xl"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Error Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className="text-red-500 mr-3" size={24} />
              <div>
                <h3 className="text-lg font-bold text-red-800">Error</h3>
                <p className="text-red-600 mt-1">{error}</p>
              </div>
            </div>
            <button
              onClick={dismissAlert}
              className="text-red-800 hover:text-red-900 text-xl"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Quick Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border shadow-sm">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Active Users</p>
              <p className="text-2xl font-bold">
                {activeUsers}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl border shadow-sm">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-green-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Administrators</p>
              <p className="text-2xl font-bold">
                {adminUsers}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl border shadow-sm">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-red-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Inactive Users</p>
              <p className="text-2xl font-bold">
                {inactiveUsers}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <UsersTable
        users={users}
        loading={loading}
        onToggleStatus={confirmToggleStatus}
        onEditUser={handleEditUser}
        onPageChange={handlePageChange}
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
      />

      {/* Confirmation Modal for Status Change */}
      {showConfirmModal && userToToggle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center mb-4">
                {userToToggle.active ? (
                  <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
                ) : (
                  <XCircle className="h-8 w-8 text-red-500 mr-3" />
                )}
                <h3 className="text-xl font-bold text-gray-900">
                  {userToToggle.active ? 'Activate Account' : 'Deactivate Account'}
                </h3>
              </div>
              
              <p className="text-gray-600 mb-6">
                {userToToggle.active 
                  ? `Are you sure you want to activate "${userToToggle.name}"'s account?`
                  : `Are you sure you want to deactivate "${userToToggle.name}"'s account?`}
                
                <br /><br />
                
                {!userToToggle.active && (
                  <span className="text-red-600 font-medium">
                    ⚠️ User will be prevented from logging in until reactivated.
                  </span>
                )}
              </p>

              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleToggleStatus}
                  className={`px-6 py-2 rounded-lg text-white transition-colors ${
                    userToToggle.active 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {userToToggle.active ? 'Yes, Activate' : 'Yes, Deactivate'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;