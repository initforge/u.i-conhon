import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSocialTasks } from '../contexts/SocialTaskContext';

// Using emoji icons instead of lucide-react

const SocialTasksPage: React.FC = () => {
    const { allTasksCompleted, completeTask, tasks: contextTasks } = useSocialTasks();
    const navigate = useNavigate();

    const [localTasks, setLocalTasks] = useState([
        { id: 'zalo-friend', name: '🌟 Kết bạn Zalo với Nguyễn Ngọc Tuân', completed: false, type: 'one-time', icon: '💬', isZalo: true },
        { id: 'facebook-follow', name: 'Theo dõi Facebook Cổ Nhơn An Nhơn', completed: false, type: 'one-time', icon: '📘' },
        { id: 'youtube-subscribe', name: 'Đăng ký YouTube Cậu Ba Họ Nguyễn', completed: false, type: 'one-time', icon: '📺' },
        { id: 'facebook-like', name: 'Like bài viết mới nhất', completed: false, type: 'daily', icon: '👍' },
        { id: 'facebook-share', name: 'Share bài viết mới nhất', completed: false, type: 'daily', icon: '🔗' },
    ]);

    const handleTaskClick = (taskId: string, url: string) => {
        window.open(url, '_blank');
        // Simulate task completion (in real app, this would be verified)
        setTimeout(() => {
            setLocalTasks(localTasks.map(t => t.id === taskId ? { ...t, completed: true } : t));
            // Also mark in context
            const contextTask = contextTasks.find(t => t.id.includes(taskId.split('-')[0]));
            if (contextTask) {
                completeTask(contextTask.id);
            }
        }, 2000);
    };

    const handleVerify = () => {
        const allCompleted = localTasks.every(t => t.completed);
        if (allCompleted) {
            // Mark all context tasks as completed
            contextTasks.forEach(t => completeTask(t.id));
            navigate('/user');
        }
    };

    const completedCount = localTasks.filter(t => t.completed).length;
    const progress = (completedCount / localTasks.length) * 100;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-tet-red-700 mb-2">Nhiệm vụ mạng xã hội</h1>
                <p className="text-gray-600 mb-6">
                    Hoàn thành tất cả nhiệm vụ để mở khóa tính năng mua con vật
                </p>

                {/* ⚠️ CRITICAL ZALO PRIVACY WARNING - Very Prominent */}
                <div className="mb-8 p-0 rounded-2xl overflow-hidden shadow-lg border-4 border-red-500">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4">
                        <div className="flex items-center gap-3">
                            <span className="text-4xl animate-pulse">⚠️</span>
                            <div>
                                <h2 className="text-xl font-bold">LƯU Ý CỰC KỲ QUAN TRỌNG!</h2>
                                <p className="text-red-100 text-sm">Đọc kỹ trước khi thực hiện nhiệm vụ Zalo</p>
                            </div>
                        </div>
                    </div>
                    {/* Content */}
                    <div className="bg-red-50 p-5">
                        <div className="space-y-4">
                            <div className="flex items-start gap-3 p-4 bg-white rounded-xl border-2 border-red-200">
                                <span className="text-3xl">📱</span>
                                <div>
                                    <h3 className="font-bold text-red-800 text-lg mb-1">TẮT CHẾ ĐỘ RIÊNG TƯ ZALO</h3>
                                    <p className="text-red-700">
                                        Sau khi kết bạn Zalo, vui lòng <strong className="underline">TẮT CHẾ ĐỘ RIÊNG TƯ</strong> để admin có thể liên hệ khi bạn trúng thưởng!
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white p-4 rounded-xl border-2 border-amber-300">
                                <h4 className="font-bold text-amber-800 mb-2">📋 Câu chuyện thực tế:</h4>
                                <div className="text-sm text-gray-700 space-y-2 italic">
                                    <p>💬 "Có người trúng mà không liên hệ được..."</p>
                                    <p>💬 "Em lục tin nhắn tìm gần <strong className="text-red-600">3 tiếng đồng hồ</strong> mới ra người trúng"</p>
                                    <p>💬 "Gọi cả ngày trời không được - máy báo <strong className="text-red-600">chế độ riêng tư</strong>"</p>
                                    <p>💬 "Qua ngày sau gọi lại nói ngày qua em say quá không biết gì luôn 😭"</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 p-3 bg-green-100 rounded-lg border border-green-300">
                                <span className="text-2xl">✅</span>
                                <p className="text-green-800 font-medium">
                                    Hãy bật nhận tin nhắn từ người lạ / tắt chế độ riêng tư để admin dễ dàng liên hệ khi bạn TRÚNG THƯỞNG!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="card mb-8">
                    <div className="flex items-center justify-between mb-3">
                        <span className="font-semibold">Tiến độ hoàn thành</span>
                        <span className="text-tet-red-600 font-bold">{completedCount}/{localTasks.length}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-tet-red-500 to-tet-red-600 h-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Tasks List */}
                <div className="space-y-4 mb-8">
                    {localTasks.map((task) => (
                        <div
                            key={task.id}
                            className={`card ${task.completed ? 'bg-green-50 border-green-200' : 'bg-white'}`}
                        >
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0 mt-1 text-2xl">
                                    {task.completed ? '✅' : '⭕'}
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <span className="text-xl">{task.icon}</span>
                                        <h3 className="font-bold text-lg">{task.name}</h3>
                                        {task.type === 'daily' && (
                                            <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded">
                                                Hàng ngày
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-sm text-gray-600 mb-3">
                                        {task.type === 'daily'
                                            ? 'Nhiệm vụ này cần làm lại mỗi lần đăng nhập'
                                            : 'Chỉ cần làm một lần'}
                                    </p>

                                    {!task.completed && (
                                        <button
                                            onClick={() => {
                                                const urls: { [key: string]: string } = {
                                                    'zalo-friend': 'https://zalo.me/0332697909',
                                                    'facebook-follow': 'https://facebook.com',
                                                    'youtube-subscribe': 'https://youtube.com/@caubahonguyenxunau3140?si=HvJ9wVQsKVIu1BR8',
                                                    'facebook-like': 'https://facebook.com',
                                                    'facebook-share': 'https://facebook.com',
                                                };
                                                handleTaskClick(task.id, urls[task.id]);
                                            }}
                                            className="btn-primary flex items-center space-x-2"
                                        >
                                            <span>Thực hiện nhiệm vụ</span>
                                            <span>↗️</span>
                                        </button>
                                    )}

                                    {task.completed && (
                                        <div className="flex items-center space-x-2 text-green-600">
                                            <span>✅</span>
                                            <span className="text-sm font-semibold">Đã hoàn thành</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Status Card */}
                <div className="card">
                    {allTasksCompleted || completedCount === localTasks.length ? (
                        <div className="text-center py-6">
                            <span className="text-5xl block mb-4">🔓</span>
                            <h3 className="text-xl font-bold text-green-700 mb-2">
                                Chúc mừng! Bạn đã hoàn thành tất cả nhiệm vụ
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Bạn có thể bắt đầu chơi và mua con vật ngay bây giờ
                            </p>
                            <div className="flex justify-center space-x-4">
                                <Link to="/user" className="btn-secondary">
                                    Về Dashboard
                                </Link>
                                <Link to="/user/mua-hang" className="btn-primary">
                                    Chơi ngay
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-6">
                            <span className="text-5xl block mb-4">🔒</span>
                            <h3 className="text-xl font-bold text-gray-700 mb-2">
                                Chưa thể mua con vật
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Vui lòng hoàn thành tất cả {localTasks.length} nhiệm vụ để mở khóa tính năng mua hàng
                            </p>
                            <button
                                onClick={handleVerify}
                                className="btn-primary"
                                disabled={completedCount < localTasks.length}
                            >
                                Xác nhận hoàn thành
                            </button>
                        </div>
                    )}
                </div>

                {/* Info Box */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-bold text-blue-900 mb-2">📌 Lưu ý quan trọng</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Nhiệm vụ "Hàng ngày" cần làm lại mỗi lần đăng nhập</li>
                        <li>• Sau khi click vào nút, hệ thống sẽ mở trang mới để bạn thực hiện</li>
                        <li>• Hoàn thành xong thì quay lại trang này để xác nhận</li>
                        <li>• Chỉ khi hoàn thành tất cả mới có thể mua con vật</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default SocialTasksPage;
