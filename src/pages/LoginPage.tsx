import React from 'react';
import LoginForm from '../components/LoginForm';
import FloatingZaloButton from '../components/FloatingZaloButton';

const LoginPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12 min-h-screen flex items-center justify-center">
      <LoginForm />
      <FloatingZaloButton />
    </div>
  );
};

export default LoginPage;

