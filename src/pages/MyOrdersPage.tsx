import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { mockOrders, mockThais, mockAnimals } from '../mock-data/mockData';

// Using emoji icons instead of lucide-react

const MyOrdersPage: React.FC = () => {
    const { user } = useAuth();
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [filterThai, setFilterThai] = useState<string>('all');

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

    const userOrders = mockOrders.filter((o) => o.userId === user.id);

    const filteredOrders = userOrders.filter((order) => {
        if (filterStatus !== 'all' && order.status !== filterStatus) return false;
        if (filterThai !== 'all' && order.thaiId !== filterThai) return false;
        return true;
    });

    const stats = {
        total: userOrders.length,
        pending: userOrders.filter((o) => o.status === 'pending').length,
        paid: userOrders.filter((o) => o.status === 'paid').length,
        completed: userOrders.filter((o) => o.status === 'completed').length,
        totalSpent: userOrders.reduce((sum, o) => sum + o.total, 0),
    };

    // Helper to get animal name from animalId
    const getAnimalName = (animalId: string) => {
        const animal = mockAnimals.find(a => a.id === animalId);
        return animal?.name || animalId;
    };

    // Helper to get thai name from thaiId
    const getThaiName = (thaiId: string) => {
        const thai = mockThais.find(t => t.id === thaiId);
        return thai?.name || thaiId;
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-tet-red-700 mb-8">Đơn hàng của tôi</h1>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                        <h3 className="text-sm font-semibold mb-2">Tổng đơn hàng</h3>
                        <p className="text-3xl font-bold">{stats.total}</p>
                    </div>
                    <div className="card bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
                        <h3 className="text-sm font-semibold mb-2">Chờ thanh toán</h3>
                        <p className="text-3xl font-bold">{stats.pending}</p>
                    </div>
                    <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
                        <h3 className="text-sm font-semibold mb-2">Đã thanh toán</h3>
                        <p className="text-3xl font-bold">{stats.paid}</p>
                    </div>
                    <div className="card bg-gradient-to-br from-tet-red-500 to-tet-red-600 text-white">
                        <h3 className="text-sm font-semibold mb-2">Tổng chi tiêu</h3>
                        <p className="text-2xl font-bold">{stats.totalSpent.toLocaleString('vi-VN')} đ</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="card mb-6">
                    <div className="flex items-center space-x-2 mb-4">
                        <span className="text-xl">🔍</span>
                        <h2 className="font-bold text-lg">Bộ lọc</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Trạng thái
                            </label>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tet-red-500 focus:border-transparent"
                            >
                                <option value="all">Tất cả</option>
                                <option value="pending">Chờ thanh toán</option>
                                <option value="paid">Đã thanh toán</option>
                                <option value="completed">Hoàn tất</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Thai
                            </label>
                            <select
                                value={filterThai}
                                onChange={(e) => setFilterThai(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tet-red-500 focus:border-transparent"
                            >
                                <option value="all">Tất cả</option>
                                <option value="thai-an-nhon">Thai An Nhơn</option>
                                <option value="thai-nhon-phong">Thai Nhơn Phong</option>
                                <option value="thai-hoai-nhon">Thai Hoài Nhơn</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Orders List */}
                <div className="space-y-4">
                    {filteredOrders.length > 0 ? (
                        filteredOrders.map((order) => (
                            <div key={order.id} className="card hover:shadow-lg transition-shadow">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <span className="text-2xl">📄</span>
                                            <div>
                                                <h3 className="font-bold text-lg">Đơn hàng #{order.id}</h3>
                                                <p className="text-sm text-gray-600">{getThaiName(order.thaiId)}</p>
                                            </div>
                                        </div>

                                        <div className="ml-9 space-y-1">
                                            <p className="text-sm text-gray-600">
                                                <span className="font-semibold">Số lượng:</span> {order.items.length} con vật
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                <span className="font-semibold">Tổng tiền:</span>{' '}
                                                <span className="text-tet-red-600 font-bold">
                                                    {order.total.toLocaleString('vi-VN')} đ
                                                </span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <span
                                            className={`px-4 py-2 rounded-lg font-semibold ${order.status === 'completed'
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

                                        <Link
                                            to={`/hoa-don/${order.id}`}
                                            className="btn-secondary flex items-center space-x-2"
                                        >
                                            <span>👁️</span>
                                            <span>Xem</span>
                                        </Link>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <p className="text-sm font-semibold text-gray-700 mb-2">Con vật đã mua:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {order.items.map((item, idx) => (
                                            <span
                                                key={idx}
                                                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                                            >
                                                {getAnimalName(item.animalId)} ({item.quantity}x)
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="card text-center py-12">
                            <span className="text-5xl block mb-4 text-gray-400">📄</span>
                            <h3 className="text-xl font-bold text-gray-700 mb-2">
                                Không tìm thấy đơn hàng
                            </h3>
                            <p className="text-gray-600 mb-6">
                                {userOrders.length === 0
                                    ? 'Bạn chưa có đơn hàng nào'
                                    : 'Không có đơn hàng nào phù hợp với bộ lọc'}
                            </p>
                            {userOrders.length === 0 && (
                                <Link to="/chon-thai" className="btn-primary inline-block">
                                    Bắt đầu chơi ngay
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyOrdersPage;
