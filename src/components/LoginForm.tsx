import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginForm: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loginAsDemo } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!phone || !password) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    const success = login(phone, password);
    if (success) {
      navigate('/user/mua-con-vat');
    } else {
      setError('Số điện thoại hoặc mật khẩu không đúng');
    }
  };

  const handleDemoLogin = () => {
    loginAsDemo('user');
    navigate('/user/mua-con-vat');
  };

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="card">
        <h2 className="text-2xl font-bold text-center mb-6 text-tet-red-700">
          Đăng nhập
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-300 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Số điện thoại
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="input-field"
            placeholder="Nhập số điện thoại"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Mật khẩu
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            placeholder="Nhập mật khẩu"
            required
          />
        </div>

        <button type="submit" className="btn-primary w-full mb-4">
          Đăng nhập
        </button>

        {/* Register link */}
        <p className="text-center text-gray-600 mb-4">
          Chưa có tài khoản?{' '}
          <a href="/dang-ky" className="text-red-600 font-semibold hover:underline">
            Đăng ký ngay
          </a>
        </p>

        {/* Demo section */}
        <div className="border-t pt-4">
          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full btn-secondary"
          >
            🧪 Demo User
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;

