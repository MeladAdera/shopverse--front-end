// 📁 src/components/admin/UsersTable.tsx
import React, { useState, useEffect } from 'react';
import { 
  User, 
  CheckCircle, 
  XCircle, 
  Edit, 
  Shield,
  Mail,
  Calendar,
  Search,
  Filter,
  Lock,
  Unlock,
  ChevronLeft,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import type { AdminUser } from '../../types/admin.types';

interface UsersTableProps {
  users: AdminUser[];
  loading: boolean;
  onToggleStatus: (userId: number, active: boolean) => void;
  onEditUser?: (user: AdminUser) => void;
  onPageChange?: (page: number) => void;
  currentPage?: number;
  totalPages?: number;
}

const UsersTable: React.FC<UsersTableProps> = ({
  users,
  loading,
  onToggleStatus,
  onEditUser,
  onPageChange,
  currentPage = 1,
  totalPages = 1
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'user' | 'admin'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [filteredUsers, setFilteredUsers] = useState<AdminUser[]>(users);

  // Update filtering when users or filters change
  useEffect(() => {
    const filtered = users.filter(user => {
      // Search filter
      const matchesSearch = searchTerm === '' || 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Role filter
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      
      // Status filter
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'active' && user.active) ||
        (statusFilter === 'inactive' && !user.active);
      
      return matchesSearch && matchesRole && matchesStatus;
    });
    
    setFilteredUsers(filtered);
  }, [users, searchTerm, roleFilter, statusFilter]);

  // Format date to readable string
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(date);
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Get status color scheme
  const getStatusColor = (active: boolean) => {
    return active 
      ? { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' }
      : { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' };
  };

  // Get role color scheme
  const getRoleColor = (role: string) => {
    return role === 'admin' 
      ? { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' }
      : { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' };
  };

  if (loading && users.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 🔍 Search and Filter Tools */}
      <div className="bg-white p-4 rounded-xl shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-gray-900 flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            Search & Filter
          </h3>
          <div className="text-sm text-gray-600">
            Showing <span className="font-bold">{filteredUsers.length}</span> of <span className="font-bold">{users.length}</span> users
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 items-center">
              <Search size={16} className="mr-1" />
              Search by name or email
            </label>
            <input
              type="text"
              placeholder="Enter search text..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Role Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 items-center">
              <Shield size={16} className="mr-1" />
              Filter by Role
            </label>
            <div className="flex space-x-2">
              <button
                onClick={() => setRoleFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  roleFilter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setRoleFilter('user')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  roleFilter === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                User
              </button>
              <button
                onClick={() => setRoleFilter('admin')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  roleFilter === 'admin'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Admin
              </button>
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 items-center">
              <Filter size={16} className="mr-1" />
              Filter by Status
            </label>
            <div className="flex space-x-2">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter('active')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${
                  statusFilter === 'active'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Active
              </button>
              <button
                onClick={() => setStatusFilter('inactive')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${
                  statusFilter === 'inactive'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <XCircle className="h-4 w-4 mr-1" />
                Inactive
              </button>
            </div>
          </div>
        </div>

        {/* 🆕 Reset Filters */}
        {(searchTerm || roleFilter !== 'all' || statusFilter !== 'all') && (
          <div className="mt-4">
            <button
              onClick={() => {
                setSearchTerm('');
                setRoleFilter('all');
                setStatusFilter('all');
              }}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Reset all filters
            </button>
          </div>
        )}
      </div>

      {/* 📋 Users Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">User</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Email</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Role</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Registration Date</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500">
                    <User className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-4">No results found</p>
                    <p className="text-sm">Try changing your search criteria or reset filters</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const statusColor = getStatusColor(user.active);
                  const roleColor = getRoleColor(user.role);
                  
                  return (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <div className="h-10 w-10 shrink-0 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <p className="font-medium text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-500">ID: {user.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <Mail className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-gray-700">{user.email}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${roleColor.bg} ${roleColor.text} border ${roleColor.border}`}>
                          <Shield className="h-3 w-3 mr-1" />
                          {user.role === 'admin' ? 'Admin' : 'User'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <div className={`flex items-center px-3 py-1 rounded-full ${statusColor.bg} ${statusColor.text} border ${statusColor.border}`}>
                            {user.active ? (
                              <>
                                <CheckCircle className="h-4 w-4 mr-1" />
                                <span className="text-sm font-medium">Active</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="h-4 w-4 mr-1" />
                                <span className="text-sm font-medium">Inactive</span>
                              </>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                          <span>{formatDate(user.created_at)}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => onToggleStatus(user.id, user.active)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${
                              user.active
                                ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                                : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
                            }`}
                          >
                            {user.active ? (
                              <>
                                <Lock className="h-4 w-4 mr-1" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <Unlock className="h-4 w-4 mr-1" />
                                Activate
                              </>
                            )}
                          </button>
                          
                          {onEditUser && (
                            <button
                              onClick={() => onEditUser(user)}
                              className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium flex items-center border border-blue-200"
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 📄 Pagination */}
        {onPageChange && totalPages > 1 && (
          <div className="border-t border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Page <span className="font-bold">{currentPage}</span> of <span className="font-bold">{totalPages}</span>
                {' '} - {' '}
                Total <span className="font-bold">{users.length}</span> users
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg flex items-center ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </button>
                
                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => onPageChange(pageNum)}
                        className={`px-3 py-2 rounded-lg text-sm ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg flex items-center ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersTable;