import React from 'react';
import LoginForm from '../components/LoginForm';
import FloatingZaloButton from '../components/FloatingZaloButton';
import { useSystemConfig } from '../contexts/SystemConfigContext';

const LoginPage: React.FC = () => {
  const { isSystemActive, maintenanceMessage, loading } = useSystemConfig();

  // Show maintenance overlay when system is OFF
  if (!loading && !isSystemActive) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden border-2 border-amber-200">
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-6 text-center">
            <div className="text-5xl mb-3">🔧</div>
            <h1 className="text-2xl font-bold">Hệ thống đang bảo trì</h1>
          </div>
          <div className="p-6 text-center">
            <p className="text-gray-700 mb-4 text-lg">{maintenanceMessage}</p>
            <p className="text-sm text-gray-500">
              Vui lòng quay lại sau. Xin cảm ơn!
            </p>
          </div>
        </div>
        <FloatingZaloButton />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen flex items-center justify-center">
      <LoginForm />
      <FloatingZaloButton />
    </div>
  );
};

export default LoginPage;

