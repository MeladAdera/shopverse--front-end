// 📁 src/pages/admin/UserDetailsPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Calendar, 
  Shield,
  CheckCircle, 
  XCircle,
  Edit,
  ArrowLeft,
  AlertCircle,
  ShoppingBag,  // 🆕 إضافة هذا
  DollarSign,   // 🆕 إضافة هذا
  MessageSquare // 🆕 إضافة هذا
} from 'lucide-react';
import adminService from '../../services/admin.service';
import type { 
  AdminUser, 
  ApiResponse 
} from '../../types/admin.types';

const UserDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
   console.log('🔍 useParams id:', id);
  console.log('🔍 window.location:', window.location.pathname);
  console.log('🔍 Full URL:', window.location.href);
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  // جلب بيانات المستخدم - ✅ الإصلاح هنا
  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // ✅ التصحيح: التحقق من أن الـ ID موجود وصالح
      if (!id) {
        throw new Error('User ID is required');
      }
      
      const userId = parseInt(id);
      
      // ✅ التحقق إذا كان الرقم صالحاً
      if (isNaN(userId) || userId <= 0) {
        throw new Error(`Invalid user ID: ${id}`);
      }

      console.log('👤 Fetching user with ID:', userId);
      const response: ApiResponse<AdminUser> = await adminService.getUserById(userId);
      
      console.log('👤 User response:', response.data);
      setUser(response.data);
      
    } catch (err: any) {
      console.error('❌ Error fetching user:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load user');
      setUser(null); // ✅ إعادة تعيين user إلى null في حالة الخطأ
    } finally {
      setLoading(false);
    }
  };

  // تحديث حالة المستخدم
  const handleToggleStatus = async () => {
    if (!user) return;

    try {
      setUpdating(true);
      const newStatus = !user.active;
      
      console.log('🔄 Toggling user status:', { userId: user.id, newStatus });
      await adminService.updateUserStatus(user.id, newStatus);
      
      // تحديث الـ UI مباشرة
      setUser({ ...user, active: newStatus });
      
    } catch (err: any) {
      console.error('❌ Error updating user status:', err);
      setError(err.response?.data?.message || err.message || 'Failed to update user status');
    } finally {
      setUpdating(false);
    }
  };

  // تحرير المستخدم
  const handleEditUser = () => {
    if (!user) return;
    
    // يمكنك فتح نموذج التحرير أو الانتقال لصفحة التحرير
    alert(`Edit user: ${user.name}`);
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  // عرض التحميل
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="bg-white rounded-xl p-8 shadow-sm border">
              <div className="h-32 bg-gray-100 rounded mb-6"></div>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-6 bg-gray-100 rounded mb-4"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // عرض الخطأ
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate('/admin/users')}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Users
          </button>
          
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-center">
              <AlertCircle className="text-red-500 mr-3" size={24} />
              <div>
                <h3 className="text-lg font-bold text-red-800">Error Loading User</h3>
                <p className="text-red-600 mt-1">{error}</p>
                <button
                  onClick={fetchUser}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // إذا لم يتم العثور على المستخدم
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate('/admin/users')}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Users
          </button>
          
          <div className="bg-white rounded-xl p-8 text-center shadow-sm border">
            <User className="h-16 w-16 text-gray-400 mx-auto" />
            <h2 className="text-xl font-bold mt-4">User Not Found</h2>
            <p className="text-gray-600 mt-2">The user you're looking for doesn't exist.</p>
            <button
              onClick={() => navigate('/admin/users')}
              className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Browse All Users
            </button>
          </div>
        </div>
      </div>
    );
  }

  // تنسيق التاريخ
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/admin/users')}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Users
          </button>
          
          <div className="flex space-x-3">
            <button
              onClick={handleToggleStatus}
              disabled={updating}
              className={`px-4 py-2 rounded-lg flex items-center ${
                user.active
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              } disabled:opacity-50`}
            >
              {updating ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Processing...
                </>
              ) : user.active ? (
                <>
                  <XCircle className="h-4 w-4 mr-2" />
                  Deactivate User
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Activate User
                </>
              )}
            </button>
            
            <button
              onClick={handleEditUser}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit User
            </button>
          </div>
        </div>

        {/* User Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden mb-6">
          <div className="p-8">
            <div className="flex items-center">
              <div className="bg-blue-100 p-4 rounded-full">
                <User className="h-12 w-12 text-blue-600" />
              </div>
              <div className="ml-6">
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <div className="flex items-center mt-2 space-x-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    user.role === 'admin' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    <Shield className="inline h-3 w-3 mr-1" />
                    {user.role === 'admin' ? 'Administrator' : 'User'}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    user.active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {user.active ? (
                      <CheckCircle className="inline h-3 w-3 mr-1" />
                    ) : (
                      <XCircle className="inline h-3 w-3 mr-1" />
                    )}
                    {user.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information Card */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center">
              <User className="h-5 w-5 mr-2 text-gray-600" />
              Basic Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500">Full Name</label>
                <p className="font-medium">{user.name}</p>
              </div>
              
              <div>
                <label className="text-sm text-gray-500 flex items-center">
                  <Mail className="h-3 w-3 mr-1" />
                  Email Address
                </label>
                <p className="font-medium">{user.email}</p>
              </div>
              
              <div>
                <label className="text-sm text-gray-500">User Role</label>
                <div className="flex items-center">
                  <Shield className={`h-4 w-4 mr-2 ${
                    user.role === 'admin' ? 'text-purple-600' : 'text-blue-600'
                  }`} />
                  <span className={`font-medium ${
                    user.role === 'admin' ? 'text-purple-700' : 'text-blue-700'
                  }`}>
                    {user.role === 'admin' ? 'Administrator' : 'Regular User'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Account Details Card */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-gray-600" />
              Account Details
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500">Account Status</label>
                <div className="flex items-center">
                  {user.active ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 mr-2" />
                  )}
                  <span className={`font-medium ${
                    user.active ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {user.active ? 'Active Account' : 'Deactivated Account'}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {user.active 
                    ? 'User can log in and use the system' 
                    : 'User cannot log in until account is reactivated'}
                </p>
              </div>
              
              <div>
                <label className="text-sm text-gray-500">Member Since</label>
                <p className="font-medium">{formatDate(user.created_at)}</p>
              </div>
              
              {user.updated_at && (
                <div>
                  <label className="text-sm text-gray-500">Last Updated</label>
                  <p className="font-medium">{formatDate(user.updated_at)}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-blue-50 p-6 rounded-xl border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">Orders Placed</p>
                <p className="text-2xl font-bold mt-2">0</p>
              </div>
              <div className="bg-white p-3 rounded-full">
                <ShoppingBag className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 p-6 rounded-xl border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">Total Spending</p>
                <p className="text-2xl font-bold mt-2">$0.00</p>
              </div>
              <div className="bg-white p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 p-6 rounded-xl border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600">Reviews Written</p>
                <p className="text-2xl font-bold mt-2">0</p>
              </div>
              <div className="bg-white p-3 rounded-full">
                <MessageSquare className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsPage;