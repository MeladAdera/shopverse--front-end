// 📁 src/pages/admin/UsersPage.tsx
import React from 'react';
import { Users, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

import { useUsers } from '../../hooks/useUsers';
import UsersTable from '../../components/admin/UsersTable';

const AdminUsersPage: React.FC = () => {
  const {
    users,
    loading,
    error,
    success,
    userToToggle,
    showConfirmModal,
    pagination,
    fetchUsers,
    confirmToggleStatus,
    handleToggleStatus,
    setShowConfirmModal  } = useUsers();

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
            {pagination.totalPages > 1 && (
              <span className="ml-2 text-sm text-gray-500">
                (Page {pagination.page} of {pagination.totalPages})
              </span>
            )}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
         
        </div>
      </div>

      {/* Success Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center">
            <CheckCircle className="text-green-500 mr-3" size={24} />
            <div>
              <h3 className="text-lg font-bold text-green-800">Success</h3>
              <p className="text-green-600 mt-1">{success}</p>
            </div>
          </div>
        </div>
      )}

      {/* Error Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center">
            <AlertCircle className="text-red-500 mr-3" size={24} />
            <div>
              <h3 className="text-lg font-bold text-red-800">Error</h3>
              <p className="text-red-600 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border shadow-sm hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Active Users</p>
              <p className="text-2xl font-bold">{activeUsers}</p>
              <p className="text-xs text-gray-500 mt-1">
                {((activeUsers / users.length) * 100 || 0).toFixed(1)}% of total
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl border shadow-sm hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-green-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Administrators</p>
              <p className="text-2xl font-bold">{adminUsers}</p>
              <p className="text-xs text-gray-500 mt-1">
                {((adminUsers / users.length) * 100 || 0).toFixed(1)}% of total
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl border shadow-sm hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-red-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Inactive Users</p>
              <p className="text-2xl font-bold">{inactiveUsers}</p>
              <p className="text-xs text-gray-500 mt-1">
                {((inactiveUsers / users.length) * 100 || 0).toFixed(1)}% of total
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
        onEditUser={(user) => {
          console.log('Edit user:', user);
          alert(`Edit user feature for ${user.name} will be added soon`);
        }}
        onPageChange={(newPage) => {
          if (newPage >= 1 && newPage <= pagination.totalPages) {
            fetchUsers(newPage);
          }
        }}
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
      />

      {/* Confirmation Modal */}
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