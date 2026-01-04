import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface DailyTask {
    id: string;
    type: 'like' | 'share';
    platform: 'facebook';
    url: string;
    description: string;
    completed: boolean;
}

const UserMuaHangPage: React.FC = () => {
    const [dailyTasks, setDailyTasks] = useState<DailyTask[]>([
        {
            id: 'daily-like',
            type: 'like',
            platform: 'facebook',
            url: 'https://facebook.com/conhonannhon/posts/123456',
            description: 'Like bài viết mới nhất',
            completed: false,
        },
        {
            id: 'daily-share',
            type: 'share',
            platform: 'facebook',
            url: 'https://facebook.com/conhonannhon/posts/123456',
            description: 'Share bài viết mới nhất',
            completed: false,
        },
    ]);

    const allTasksCompleted = dailyTasks.every(task => task.completed);

    const handleTaskClick = (taskId: string, url: string) => {
        // Open link in new tab
        window.open(url, '_blank', 'noopener,noreferrer');

        // Simulate task completion after 2 seconds
        setTimeout(() => {
            setDailyTasks(tasks =>
                tasks.map(task =>
                    task.id === taskId ? { ...task, completed: true } : task
                )
            );
        }, 2000);
    };

    const getTaskIcon = (type: string) => {
        return type === 'like' ? '👍' : '🔗';
    };

    const getTaskLabel = (type: string) => {
        return type === 'like' ? 'Like bài viết' : 'Share bài viết';
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Mua hàng - Chọn con vật</h1>
                <p className="text-gray-600">
                    Hoàn thành nhiệm vụ hàng ngày để mở khóa tính năng mua con vật
                </p>
            </div>

            {/* Daily Tasks Section */}
            {!allTasksCompleted && (
                <div className="mb-8">
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg mb-6">
                        <div className="flex items-start space-x-4">
                            <span className="text-3xl">🔒</span>
                            <div className="flex-1">
                                <h3 className="font-bold text-yellow-800 text-lg mb-2">
                                    Hoàn thành nhiệm vụ hàng ngày
                                </h3>
                                <p className="text-yellow-700 mb-3">
                                    Bạn cần Like và Share bài viết mới nhất của chúng tôi để mở khóa tính năng mua hàng.
                                    Nhiệm vụ này cần làm lại mỗi lần đăng nhập.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Tasks List */}
                    <div className="space-y-4">
                        {dailyTasks.map((task) => (
                            <div
                                key={task.id}
                                className={`bg-white rounded-xl shadow-md border-2 transition-all duration-300 ${task.completed
                                        ? 'border-green-300 bg-green-50'
                                        : 'border-gray-200 hover:border-red-300'
                                    }`}
                            >
                                <div className="p-6">
                                    <div className="flex items-start space-x-4">
                                        <div className="flex-shrink-0 mt-1 text-3xl">
                                            {task.completed ? '✅' : getTaskIcon(task.type)}
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <h3 className="font-bold text-lg text-gray-800">
                                                    {getTaskLabel(task.type)}
                                                </h3>
                                                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                                                    Hàng ngày
                                                </span>
                                            </div>

                                            <p className="text-sm text-gray-600 mb-4">
                                                {task.description} - Nhiệm vụ này cần làm lại mỗi lần đăng nhập
                                            </p>

                                            {!task.completed ? (
                                                <button
                                                    onClick={() => handleTaskClick(task.id, task.url)}
                                                    className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 font-semibold flex items-center space-x-2 shadow-md hover:shadow-lg"
                                                >
                                                    <span>{getTaskIcon(task.type)}</span>
                                                    <span>Thực hiện nhiệm vụ</span>
                                                    <span>↗️</span>
                                                </button>
                                            ) : (
                                                <div className="flex items-center space-x-2 text-green-600">
                                                    <span className="text-xl">✅</span>
                                                    <span className="font-semibold">Đã hoàn thành</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Progress Info */}
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-blue-900">Tiến độ:</span>
                            <span className="text-blue-700 font-bold">
                                {dailyTasks.filter(t => t.completed).length}/{dailyTasks.length}
                            </span>
                        </div>
                        <div className="w-full bg-blue-200 rounded-full h-3 overflow-hidden">
                            <div
                                className="bg-blue-600 h-full transition-all duration-500"
                                style={{
                                    width: `${(dailyTasks.filter(t => t.completed).length / dailyTasks.length) * 100}%`
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Shopping Section - Only shown when tasks completed */}
            {allTasksCompleted && (
                <div>
                    {/* Success Banner */}
                    <div className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-6">
                        <div className="flex items-center space-x-4">
                            <span className="text-5xl">🔓</span>
                            <div>
                                <h3 className="text-2xl font-bold text-green-800 mb-2">
                                    Chúc mừng! Bạn đã mở khóa tính năng mua hàng
                                </h3>
                                <p className="text-green-700">
                                    Bây giờ bạn có thể chọn con vật và tham gia chơi
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Shopping Options */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Option 1: Mua 1 trứng */}
                        <Link
                            to="/chon-thai"
                            className="group bg-white rounded-xl shadow-lg border-2 border-gray-200 hover:border-red-400 transition-all duration-300 overflow-hidden hover:shadow-xl transform hover:-translate-y-1"
                        >
                            <div className="p-8">
                                <div className="text-center mb-4">
                                    <span className="text-6xl block mb-4 group-hover:scale-110 transition-transform duration-300">
                                        🥚
                                    </span>
                                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                        Mua 1 Trứng
                                    </h3>
                                    <div className="text-3xl font-bold text-red-600 mb-2">
                                        30.000đ
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        Chọn 1 con vật để chơi
                                    </p>
                                </div>
                                <div className="mt-6 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg text-center font-semibold group-hover:from-red-700 group-hover:to-red-800 transition-all">
                                    Chọn ngay →
                                </div>
                            </div>
                        </Link>

                        {/* Option 2: Mua Con Trùn */}
                        <Link
                            to="/chon-thai"
                            className="group bg-white rounded-xl shadow-lg border-2 border-gray-200 hover:border-orange-400 transition-all duration-300 overflow-hidden hover:shadow-xl transform hover:-translate-y-1"
                        >
                            <div className="p-8">
                                <div className="text-center mb-4">
                                    <span className="text-6xl block mb-4 group-hover:scale-110 transition-transform duration-300">
                                        🐛
                                    </span>
                                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                        Mua Con Trùn
                                    </h3>
                                    <div className="text-3xl font-bold text-orange-600 mb-2">
                                        70.000đ
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        Gói đặc biệt với tỷ lệ thưởng cao hơn
                                    </p>
                                </div>
                                <div className="mt-6 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg text-center font-semibold group-hover:from-orange-700 group-hover:to-orange-800 transition-all">
                                    Chọn ngay →
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Info Box */}
                    <div className="mt-8 p-6 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl border border-red-100">
                        <h4 className="font-bold text-gray-800 text-lg mb-4 flex items-center space-x-2">
                            <span>📌</span>
                            <span>Thông tin quan trọng</span>
                        </h4>
                        <div className="space-y-2 text-gray-700">
                            <div className="flex items-start space-x-3">
                                <span className="text-red-500 font-bold">•</span>
                                <p>Kết quả xổ số được công bố vào 18h30 hàng ngày</p>
                            </div>
                            <div className="flex items-start space-x-3">
                                <span className="text-red-500 font-bold">•</span>
                                <p>Tiền thưởng sẽ được chuyển vào tài khoản ngân hàng của bạn</p>
                            </div>
                            <div className="flex items-start space-x-3">
                                <span className="text-red-500 font-bold">•</span>
                                <p>Mỗi lần đăng nhập cần Like/Share lại để tiếp tục mua hàng</p>
                            </div>
                            <div className="flex items-start space-x-3">
                                <span className="text-red-500 font-bold">•</span>
                                <p>Vui lòng cập nhật đầy đủ thông tin ngân hàng tại mục "Thông tin cá nhân"</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserMuaHangPage;
