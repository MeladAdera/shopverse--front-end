// src/pages/Profile.tsx
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold">
            {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
          </div>
          <div>
            <h2 className="text-2xl font-semibold">{user?.name}</h2>
            <p className="text-gray-600">{user?.email}</p>
            <p className="text-sm text-gray-500 mt-1">
              Member since: {new Date(user?.createdAt || '').toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Account Details</h3>
            <div className="space-y-2">
              <div>
                <label className="text-sm text-gray-500">Full Name</label>
                <p className="font-medium">{user?.name}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Email Address</label>
                <p className="font-medium">{user?.email}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50">
                View Order History
              </button>
              <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50">
                Manage Addresses
              </button>
              <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50">
                Payment Methods
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;