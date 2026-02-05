import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const UserNavHeader: React.FC = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const menuItems = [
        { path: '/mua-con-vat', label: '🛒 Mua hàng', icon: '🛒' },
        { path: '/ket-qua', label: '🎁 Kết quả', icon: '🎁' },
        { path: '/cong-dong', label: '👥 Cộng đồng', icon: '👥' },
        { path: '/thong-tin-ca-nhan', label: '👤 Thông tin', icon: '👤' },
        { path: '/ho-tro', label: '📞 Hỗ trợ', icon: '📞' },
    ];

    const isActive = (path: string) => location.pathname === path;

    if (!isAuthenticated) return null;

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <img src="/assets/logo-moi.jpg" alt="Logo" className="h-10 w-10" />
                        <span className="font-bold text-red-700 hidden md:block">Cổ Nhơn</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-1">
                        {menuItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${isActive(item.path)
                                    ? 'bg-red-100 text-red-700'
                                    : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {/* User Info */}
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600 hidden md:block">
                            Xin chào, <strong>{user?.name}</strong>
                        </span>
                        <button
                            onClick={logout}
                            className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium"
                        >
                            Đăng xuất
                        </button>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2"
                        >
                            {isMenuOpen ? '✕' : '☰'}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden pb-4 border-t">
                        {menuItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsMenuOpen(false)}
                                className={`block px-4 py-3 font-medium transition-colors ${isActive(item.path)
                                    ? 'bg-red-100 text-red-700'
                                    : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default UserNavHeader;
