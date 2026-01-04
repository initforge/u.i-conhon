import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import ProfileForm from '../components/ProfileForm';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-red-600">Vui lòng đăng nhập</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-tet-red-700 mb-8">Tài khoản</h1>
        
        <div className="card mb-6">
          <h2 className="text-xl font-bold mb-4">Thông tin cá nhân</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Tên Zalo:</span>
              <span className="font-semibold">{user.zaloName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tên hiển thị:</span>
              <span className="font-semibold">{user.name}</span>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-gray-600">
              <p className="font-semibold mb-1">Lưu ý:</p>
              <p>• Tên Zalo của bạn sẽ được hiển thị công khai trên website</p>
              <p>• Số điện thoại chỉ Admin mới thấy được</p>
            </div>
          </div>
        </div>

        <ProfileForm />
      </div>
    </div>
  );
};

export default ProfilePage;

