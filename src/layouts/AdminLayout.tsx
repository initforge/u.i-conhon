import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminLayout: React.FC = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    React.useEffect(() => {
        if (user && user.role !== 'admin') {
            navigate('/');
        }
    }, [user, navigate]);

    if (!user || user.role !== 'admin') {
        return null;
    }

    const menuItems = [
        { path: '/admin', icon: '📊', label: 'Tổng quan', exact: true },
        { path: '/admin/don-hang', icon: '📦', label: 'Đơn hàng' },
        { path: '/admin/con-vat', icon: '🐾', label: 'Con vật' },
        { path: '/admin/nguoi-choi', icon: '👥', label: 'Người chơi' },
        { path: '/admin/bao-cao', icon: '📈', label: 'Báo cáo' },
        { path: '/admin/ket-qua', icon: '🎯', label: 'Kết quả xổ' },
        { path: '/admin/cms', icon: '💬', label: 'Quản lý cộng đồng' },
        { path: '/admin/cai-dat', icon: '⚙️', label: 'Cài đặt' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div
            className="min-h-screen transition-colors duration-500"
            style={{ backgroundColor: '#faf8f5' }}
        >
            {/* Top Header - White with Red Accent Top Border */}
            <header
                className="fixed top-0 left-0 right-0 z-30 backdrop-blur-md shadow-sm transition-all duration-300"
                style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderBottom: '1px solid #e8e4df',
                    borderTop: '4px solid #991b1b' // Tinh tế: Red accent line
                }}
            >
                <div className="flex items-center justify-between px-6 py-3">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 rounded-lg hover:bg-red-50 hover:text-red-700 lg:hidden transition-all duration-200"
                            style={{ color: '#6b5c4c' }}
                        >
                            {sidebarOpen ? '✕' : '☰'}
                        </button>
                        <div className="flex items-center space-x-3 group cursor-pointer">
                            <div className="relative group-hover:scale-105 transition-transform duration-300">
                                <img
                                    src="/assets/logo-moi.jpg"
                                    alt="Cổ Nhơn"
                                    className="h-9 w-9"
                                />
                                {/* Subtle glow effect on hover */}
                                <div className="absolute inset-0 bg-red-400 blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-full"></div>
                            </div>
                            <div>
                                <h1
                                    className="text-lg font-bold tracking-tight group-hover:text-red-800 transition-colors duration-300"
                                    style={{ color: '#3d3428', fontFamily: "'Bungee', sans-serif" }}
                                >
                                    ADMIN PANEL
                                </h1>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <Link
                            to="/"
                            className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 hover:bg-red-50 hover:text-red-700 hover:shadow-sm"
                            style={{ color: '#6b5c4c' }}
                        >
                            <span className="transform transition-transform group-hover:scale-110">🏠</span>
                            <span className="hidden sm:inline text-sm font-medium">Trang chủ</span>
                        </Link>

                        <div
                            className="flex items-center space-x-3 px-4 py-2 rounded-lg border border-transparent hover:border-red-100 hover:bg-white transition-all duration-300"
                            style={{ backgroundColor: '#f5f2ed' }}
                        >
                            <div
                                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm"
                                style={{
                                    background: 'linear-gradient(135deg, #991b1b 0%, #7f1d1d 100%)',
                                    color: 'white'
                                }}
                            >
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="hidden sm:block">
                                <p className="text-sm font-bold text-gray-800">{user.name}</p>
                                <p className="text-xs text-red-600 font-medium">Administrator</p>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="p-2 rounded-lg transition-all duration-200 hover:bg-red-100 hover:text-red-700 hover:rotate-90"
                            style={{ color: '#b8856c' }}
                            title="Đăng xuất"
                        >
                            🚪
                        </button>
                    </div>
                </div>
            </header>

            <div className="flex pt-[72px]">
                {/* Sidebar - Interactions & Active States */}
                <aside
                    className={`
                        fixed lg:sticky top-[72px] left-0 h-[calc(100vh-72px)] 
                        transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1) z-20
                        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                        ${sidebarOpen ? 'w-64' : 'lg:w-20'}
                        shadow-[1px_0_20px_rgba(0,0,0,0.02)]
                    `}
                    style={{
                        backgroundColor: 'white',
                        borderRight: '1px solid #e8e4df'
                    }}
                >
                    <nav className="p-4 space-y-1.5">
                        {menuItems.map((item) => {
                            const active = item.exact
                                ? location.pathname === item.path
                                : location.pathname.startsWith(item.path) && item.path !== '/admin';

                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`
                                        group flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200
                                        ${!sidebarOpen && 'lg:justify-center lg:px-2'}
                                        relative overflow-hidden
                                    `}
                                    style={active ? {
                                        backgroundColor: '#FEF2F2', // bg-red-50
                                        color: '#991b1b', // text-red-800
                                        fontWeight: 600,
                                        boxShadow: '0 4px 12px rgba(153, 27, 27, 0.08)'
                                    } : {
                                        color: '#6b5c4c'
                                    }}
                                    onClick={() => {
                                        if (window.innerWidth < 1024) {
                                            setSidebarOpen(false);
                                        }
                                    }}
                                >
                                    {/* Active Indicator Line */}
                                    {active && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-lg bg-red-800"></div>
                                    )}

                                    <span className={`text-xl flex-shrink-0 transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110 group-hover:text-red-600'}`}>
                                        {item.icon}
                                    </span>

                                    <span className={`text-sm tracking-wide ${!sidebarOpen && 'lg:hidden'} ${!active && 'group-hover:text-red-700'}`}>
                                        {item.label}
                                    </span>

                                    {/* Hover background effect for non-active items */}
                                    {!active && (
                                        <div className="absolute inset-0 bg-red-50 opacity-0 group-hover:opacity-40 transition-opacity duration-200 rounded-xl" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Sidebar Footer with Decoration */}
                    {sidebarOpen && (
                        <div className="absolute bottom-6 left-4 right-4">
                            <div
                                className="p-4 rounded-xl text-center relative overflow-hidden group hover:shadow-md transition-shadow duration-300"
                                style={{
                                    background: 'linear-gradient(135deg, #FFF5F5 0%, #FFF0F0 100%)',
                                    border: '1px solid #FECACA'
                                }}
                            >
                                <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/3 -translate-y-1/3 pointer-events-none">
                                    <img src="/assets/logo-moi.jpg" className="w-24 h-24" alt="" />
                                </div>
                                <span className="text-xs font-semibold text-red-800 relative z-10">🎋 Cổ Nhơn System</span>
                                <p className="text-[10px] text-red-500 mt-1 relative z-10">Version 1.0.0</p>
                            </div>
                        </div>
                    )}
                </aside>

                {/* Main Content */}
                <main
                    className="flex-1 p-6 lg:p-8 overflow-x-hidden"
                    style={{ minHeight: 'calc(100vh - 72px)' }}
                >
                    <div className="max-w-7xl mx-auto animate-fade-in-up">
                        <Outlet />
                    </div>
                </main>
            </div>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-gray-900/20 z-10 lg:hidden backdrop-blur-sm transition-opacity duration-300"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
};

export default AdminLayout;
