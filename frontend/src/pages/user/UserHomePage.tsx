import React from 'react';
import { Link } from 'react-router-dom';
import { useSocialTasks } from '../../contexts/SocialTaskContext';
import { useAuth } from '../../contexts/AuthContext';

const UserHomePage: React.FC = () => {
    const { allTasksCompleted } = useSocialTasks();
    const { user } = useAuth();

    const quickActions = [
        {
            icon: '🛒',
            title: 'Mua hàng',
            description: 'Chọn con vật và tham gia chơi',
            link: '/user/mua-hang',
            color: 'from-red-500 to-red-600'
        },
        {
            icon: '🎁',
            title: 'Kết quả',
            description: 'Xem kết quả xổ số của bạn',
            link: '/user/ket-qua',
            color: 'from-orange-500 to-orange-600'
        },
        {
            icon: '📦',
            title: 'Đơn hàng',
            description: 'Quản lý đơn hàng của bạn',
            link: '/user/don-hang',
            color: 'from-blue-500 to-blue-600'
        },
        {
            icon: '📖',
            title: 'Hướng dẫn',
            description: 'Tìm hiểu cách chơi',
            link: '/user/huong-dan',
            color: 'from-green-500 to-green-600'
        },
    ];

    return (
        <div className="max-w-6xl mx-auto">
            {/* Welcome Banner */}
            <div
                className="relative overflow-hidden rounded-2xl p-8 mb-8 shadow-lg"
                style={{
                    background: 'linear-gradient(135deg, #991b1b 0%, #7f1d1d 100%)',
                }}
            >
                <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                    <img src="/assets/logo-moi.jpg" className="w-64 h-64" alt="" />
                </div>
                <div className="relative z-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                        Chào mừng, {user?.name}! 🎉
                    </h1>
                    <p className="text-red-100 text-lg">
                        Chúc bạn may mắn với Cổ Nhơn Online
                    </p>
                </div>
            </div>

            {/* Tasks Status */}
            {!allTasksCompleted && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8 rounded-lg">
                    <div className="flex items-start space-x-4">
                        <span className="text-3xl">⚠️</span>
                        <div className="flex-1">
                            <h3 className="font-bold text-yellow-800 text-lg mb-2">
                                Bạn chưa hoàn thành nhiệm vụ!
                            </h3>
                            <p className="text-yellow-700 mb-3">
                                Vui lòng hoàn thành tất cả nhiệm vụ mạng xã hội để mở khóa tính năng mua con vật.
                            </p>
                            <Link
                                to="/nhiem-vu"
                                className="inline-block px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors duration-200 font-semibold"
                            >
                                Đi đến nhiệm vụ →
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Quick Actions Grid */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Truy cập nhanh</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {quickActions.map((action, index) => (
                        <Link
                            key={index}
                            to={action.link}
                            className="group relative overflow-hidden bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                            <div className="p-6 relative z-10">
                                <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                                    {action.icon}
                                </div>
                                <h3 className="font-bold text-lg text-gray-800 mb-2 group-hover:text-red-700 transition-colors">
                                    {action.title}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    {action.description}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Tổng đơn hàng</p>
                            <p className="text-3xl font-bold text-gray-800">0</p>
                        </div>
                        <div className="text-4xl">📦</div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Đã trúng thưởng</p>
                            <p className="text-3xl font-bold text-gray-800">0</p>
                        </div>
                        <div className="text-4xl">🎁</div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Tổng tiền thưởng</p>
                            <p className="text-3xl font-bold text-gray-800">0đ</p>
                        </div>
                        <div className="text-4xl">💰</div>
                    </div>
                </div>
            </div>

            {/* Info Section */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border border-red-100">
                <h3 className="font-bold text-gray-800 text-lg mb-4 flex items-center space-x-2">
                    <span>📌</span>
                    <span>Thông tin quan trọng</span>
                </h3>
                <div className="space-y-3 text-gray-700">
                    <div className="flex items-start space-x-3">
                        <span className="text-red-500 font-bold">•</span>
                        <p>Mỗi lượt chơi có giá trị 30.000đ (1 trứng) hoặc 70.000đ (Con Trùn)</p>
                    </div>
                    <div className="flex items-start space-x-3">
                        <span className="text-red-500 font-bold">•</span>
                        <p>Kết quả xổ số được công bố vào 19h hàng ngày</p>
                    </div>
                    <div className="flex items-start space-x-3">
                        <span className="text-red-500 font-bold">•</span>
                        <p>Tiền thưởng sẽ được chuyển vào tài khoản ngân hàng của bạn</p>
                    </div>
                    <div className="flex items-start space-x-3">
                        <span className="text-red-500 font-bold">•</span>
                        <p>Vui lòng cập nhật đầy đủ thông tin ngân hàng tại mục "Thông tin cá nhân"</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserHomePage;
