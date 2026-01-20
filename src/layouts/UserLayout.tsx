import React from 'react';
import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const UserLayout: React.FC = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const location = useLocation();

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/dang-nhap" replace />;
    }

    const menuItems = [
        { path: '/user/mua-con-vat', label: 'Mua hàng', icon: '🛒' },
        { path: '/user/ket-qua', label: 'Kết quả', icon: '🎁' },
        { path: '/user/cong-dong', label: 'Cộng đồng', icon: '👥' },
        { path: '/user/thong-tin-ca-nhan', label: 'Thông tin', icon: '👤' },
        { path: '/user/ho-tro', label: 'Hỗ trợ', icon: '📞' },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header Navigation */}
            <nav className="bg-white shadow-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    {/* Top Row */}
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link to="/" className="flex items-center space-x-2">
                            <img src="/assets/logo-moi.jpg" alt="Logo" className="h-8 w-8" />
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
                                    {item.icon} {item.label}
                                </Link>
                            ))}
                        </div>

                        {/* User Info + Logout */}
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600 hidden md:block">
                                👋 {user?.name}
                            </span>
                            <button
                                onClick={logout}
                                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium text-sm"
                            >
                                Đăng xuất
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    <div className="md:hidden flex justify-around border-t mt-2 pt-2">
                        {menuItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`text-xs text-center py-1 ${isActive(item.path)
                                    ? 'text-red-700 font-semibold'
                                    : 'text-gray-600'
                                    }`}
                            >
                                <span className="block text-lg">{item.icon}</span>
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default UserLayout;
