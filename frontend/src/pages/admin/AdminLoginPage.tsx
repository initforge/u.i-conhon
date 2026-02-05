import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AdminLoginPage: React.FC = () => {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!phone || !password) {
            setError('Vui lòng nhập đầy đủ thông tin');
            return;
        }

        setLoading(true);
        try {
            const loggedInUser = await login(phone, password);
            if (loggedInUser) {
                // Check role from returned user immediately (no race condition)
                if (loggedInUser.role === 'admin') {
                    navigate('/admin');
                } else {
                    setError('Tài khoản không có quyền Admin');
                }
            } else {
                setError('Số điện thoại hoặc mật khẩu không đúng');
            }
        } catch {
            setError('Lỗi kết nối server');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen bg-gradient-to-b from-red-50 to-yellow-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full mb-4 shadow-lg">
                        <span className="text-3xl">🔐</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">Quản trị viên</h1>
                    <p className="text-gray-500 mt-2">Đăng nhập để quản lý hệ thống</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-300 rounded-lg text-red-700 text-sm">
                            ⚠️ {error}
                        </div>
                    )}

                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">
                            Số điện thoại Admin
                        </label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
                            placeholder="Nhập số điện thoại"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 font-medium mb-2">
                            Mật khẩu
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
                            placeholder="Nhập mật khẩu"
                            required
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg font-bold hover:from-amber-600 hover:to-amber-700 transition-all shadow-md"
                        disabled={loading}
                    >
                        {loading ? '⏳ Đang đăng nhập...' : '🔓 Đăng nhập'}
                    </button>
                </form>

                {/* Footer */}
                <p className="text-center text-gray-400 mt-6 text-sm">
                    Chỉ dành cho quản trị viên hệ thống
                </p>
            </div>
        </div>
    );
};

export default AdminLoginPage;
