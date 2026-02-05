import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSocialTasks } from '../contexts/SocialTaskContext';
import { THAIS, Order } from '../types';
// Note: Install lucide-react or use emoji icons

const UserDashboard: React.FC = () => {
    const { user } = useAuth();
    const { allTasksCompleted } = useSocialTasks();
    // TODO: Fetch orders from API instead of mock data
    const orders: Order[] = [];

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <h1 className="text-2xl font-bold text-red-600">Vui lòng đăng nhập</h1>
                <Link to="/dang-nhap" className="btn-primary mt-4 inline-block">
                    Đăng nhập
                </Link>
            </div>
        );
    }

    const userOrders = orders.filter((o) => o.userId === user.id);
    const recentOrders = userOrders.slice(0, 5);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-tet-red-700 mb-2">
                        Xin chào, {user.zalo}!
                    </h1>
                    <p className="text-gray-600">Chào mừng bạn đến với Cổ Nhơn Online</p>
                </div>

                {/* Social Tasks Status */}
                <div className="card mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold">Nhiệm vụ mạng xã hội</h2>
                        <Link to="/nhiem-vu" className="text-tet-red-600 hover:underline flex items-center space-x-1">
                            <span>Xem chi tiết →</span>
                        </Link>
                    </div>

                    {allTasksCompleted ? (
                        <div className="flex items-center space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <span className="text-green-600 text-2xl">✅</span>
                            <div>
                                <p className="font-semibold text-green-700">Đã hoàn thành tất cả nhiệm vụ!</p>
                                <p className="text-sm text-green-600">Bạn có thể bắt đầu chơi ngay</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <span className="text-yellow-600 text-2xl">⚠️</span>
                            <div>
                                <p className="font-semibold text-yellow-700">Chưa hoàn thành nhiệm vụ</p>
                                <p className="text-sm text-yellow-600">Vui lòng hoàn thành nhiệm vụ để mua con vật</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <Link
                        to={allTasksCompleted ? "/chon-thai" : "/nhiem-vu"}
                        className="card hover:shadow-lg transition-shadow bg-gradient-to-br from-tet-red-500 to-tet-red-600 text-white"
                    >
                        <span className="text-3xl mb-3 block">🛒</span>
                        <h3 className="font-bold text-lg mb-1">Chơi ngay</h3>
                        <p className="text-sm opacity-90">
                            {allTasksCompleted ? "Chọn Thai và mua con vật" : "Hoàn thành nhiệm vụ trước"}
                        </p>
                    </Link>

                    <Link
                        to="/cau-thai"
                        className="card hover:shadow-lg transition-shadow bg-gradient-to-br from-blue-500 to-blue-600 text-white"
                    >
                        <span className="text-3xl mb-3 block">📝</span>
                        <h3 className="font-bold text-lg mb-1">Câu thai</h3>
                        <p className="text-sm opacity-90">Xem câu thai hôm nay</p>
                    </Link>

                    <Link
                        to="/ket-qua"
                        className="card hover:shadow-lg transition-shadow bg-gradient-to-br from-green-500 to-green-600 text-white"
                    >
                        <span className="text-3xl mb-3 block">🎯</span>
                        <h3 className="font-bold text-lg mb-1">Kết quả</h3>
                        <p className="text-sm opacity-90">Xem kết quả xổ số</p>
                    </Link>

                    <Link
                        to="/don-hang-cua-toi"
                        className="card hover:shadow-lg transition-shadow bg-gradient-to-br from-purple-500 to-purple-600 text-white"
                    >
                        <span className="text-3xl mb-3 block">📋</span>
                        <h3 className="font-bold text-lg mb-1">Đơn hàng</h3>
                        <p className="text-sm opacity-90">Lịch sử mua hàng</p>
                    </Link>
                </div>

                {/* Thai Status */}
                <div className="card mb-8">
                    <h2 className="text-xl font-bold mb-4">Thai đang mở</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {THAIS.map((thai) => (
                            <div key={thai.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                <h3 className="font-bold text-lg mb-2">{thai.name}</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-gray-500">🕐</span>
                                        <span className="text-gray-600">
                                            {thai.times.join(', ')}
                                        </span>
                                    </div>
                                    <Link
                                        to={allTasksCompleted ? `/thai/${thai.id}` : "/nhiem-vu"}
                                        className="btn-primary w-full mt-2 text-center block"
                                    >
                                        Chọn Thai này
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="card">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold">Đơn hàng gần đây</h2>
                        <Link to="/don-hang-cua-toi" className="text-tet-red-600 hover:underline flex items-center space-x-1">
                            <span>Xem tất cả →</span>
                        </Link>
                    </div>

                    {recentOrders.length > 0 ? (
                        <div className="space-y-3">
                            {recentOrders.map((order) => (
                                <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold">#{order.id}</p>
                                            <p className="text-sm text-gray-600">{THAIS.find(t => t.id === order.thaiId)?.name || order.thaiId}</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {order.items.length} con vật
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-tet-red-600">
                                                {order.total.toLocaleString('vi-VN')} đ
                                            </p>
                                            <span
                                                className={`text-xs px-2 py-1 rounded mt-1 inline-block ${order.status === 'completed'
                                                    ? 'bg-green-100 text-green-700'
                                                    : order.status === 'paid'
                                                        ? 'bg-blue-100 text-blue-700'
                                                        : 'bg-yellow-100 text-yellow-700'
                                                    }`}
                                            >
                                                {order.status === 'completed'
                                                    ? 'Hoàn tất'
                                                    : order.status === 'paid'
                                                        ? 'Đã thanh toán'
                                                        : 'Chờ thanh toán'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-500">
                            <span className="text-5xl block mb-4 opacity-50">🛒</span>
                            <p>Bạn chưa có đơn hàng nào</p>
                            <Link to="/chon-thai" className="btn-primary mt-4 inline-block">
                                Bắt đầu chơi ngay
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
