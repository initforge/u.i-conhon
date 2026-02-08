import React, { useState } from 'react';
import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSocialTasks } from '../contexts/SocialTaskContext';

const UserLayout: React.FC = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const location = useLocation();
    const { tasks, completeTask, allTasksCompleted } = useSocialTasks();

    // Countdown state for each task (10s countdown visible to user)
    const [taskCountdowns, setTaskCountdowns] = useState<{ [taskId: string]: number }>({});

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/dang-nhap" replace />;
    }

    const menuItems = [
        { path: '/user/mua-con-vat', label: 'Mua hàng', icon: '🛒' },
        { path: '/user/ket-qua', label: 'Kết quả', icon: '🎁' },
        { path: '/user/lich-su', label: 'Lịch sử', icon: '📋' },
        { path: '/user/cong-dong', label: 'Cộng đồng', icon: '👥' },
        { path: '/user/thong-tin-ca-nhan', label: 'Thông tin', icon: '👤' },
        { path: '/user/ho-tro', label: 'Hỗ trợ', icon: '📞' },
    ];

    const isActive = (path: string) => location.pathname === path;

    const handleDoTask = (taskId: string, url: string) => {
        // Prevent starting if already counting
        if (taskCountdowns[taskId] !== undefined) return;

        window.open(url, '_blank');

        // Start visible 10s countdown
        setTaskCountdowns(prev => ({ ...prev, [taskId]: 10 }));

        const interval = setInterval(() => {
            setTaskCountdowns(prev => {
                const current = prev[taskId];
                if (current === undefined || current <= 1) {
                    clearInterval(interval);
                    // Mark task as completed
                    completeTask(taskId);
                    const { [taskId]: _, ...rest } = prev;
                    return rest;
                }
                return { ...prev, [taskId]: current - 1 };
            });
        }, 1000);
    };

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

            {/* MXH Task Gate - Blocks ALL player pages until tasks are completed */}
            {!allTasksCompleted && (
                <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden max-h-[90vh] overflow-y-auto">
                        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6">
                            <div className="flex items-center space-x-3">
                                <span className="text-4xl">🔒</span>
                                <div>
                                    <h2 className="text-xl font-bold">Hoàn thành nhiệm vụ</h2>
                                    <p className="text-sm opacity-90">Để mở khóa tất cả tính năng</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <p className="text-gray-600 mb-4">
                                Bạn cần hoàn thành các nhiệm vụ dưới đây để sử dụng hệ thống.
                            </p>
                            <div className="space-y-3 mb-6">
                                {tasks.filter(t => t.required).map((task) => (
                                    <div
                                        key={task.id}
                                        className={`p-4 rounded-xl border-2 transition-all ${task.isCompleted
                                            ? 'border-green-300 bg-green-50'
                                            : 'border-gray-200 bg-gray-50'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <span className="text-2xl">
                                                    {task.isCompleted ? '✅' : task.type === 'like' ? '👍' : '🔗'}
                                                </span>
                                                <div>
                                                    <p className={`font-semibold ${task.isCompleted ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                                                        {task.name}
                                                    </p>
                                                </div>
                                            </div>
                                            {!task.isCompleted && (
                                                <button
                                                    onClick={() => handleDoTask(task.id, task.url)}
                                                    disabled={taskCountdowns[task.id] !== undefined}
                                                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all whitespace-nowrap ${taskCountdowns[task.id] !== undefined
                                                        ? 'bg-yellow-500 text-white cursor-wait animate-pulse'
                                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                                        }`}
                                                >
                                                    {taskCountdowns[task.id] !== undefined
                                                        ? '⏳ Đang xác nhận...'
                                                        : 'Thực hiện ↗'}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {/* Cảnh báo Zalo nổi bật */}
                            <div className="p-4 bg-red-100 border-2 border-red-400 rounded-xl">
                                <div className="flex items-start space-x-3">
                                    <span className="text-2xl">⚠️</span>
                                    <div>
                                        <p className="font-bold text-red-700 text-base mb-1">
                                            LƯU Ý QUAN TRỌNG VỀ ZALO
                                        </p>
                                        <p className="text-sm text-red-600">
                                            Vui lòng <strong>TẮT CHẾ ĐỘ RIÊNG TƯ</strong> trên Zalo để chúng tôi có thể liên hệ trả thưởng cho bạn!
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default UserLayout;
