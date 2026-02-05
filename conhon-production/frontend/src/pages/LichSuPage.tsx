import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getMyOrders, Order } from '../services/api';

// Thai names constant
const THAI_NAMES: Record<string, string> = {
    'an-nhon': 'Thai An Nhơn',
    'nhon-phong': 'Thai Nhơn Phong',
    'hoai-nhon': 'Thai Hoài Nhơn'
};

const LichSuPage: React.FC = () => {
    const { user } = useAuth();
    const [filterThai, setFilterThai] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch orders from API
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const thaiId = filterThai !== 'all' ? filterThai : undefined;
                const status = filterStatus !== 'all' ? filterStatus : undefined;

                const response = await getMyOrders({ thaiId, status });
                setOrders(response.orders || []);
                setError(null);
            } catch (err: unknown) {
                console.error('Error fetching orders:', err);
                setError('Không thể tải danh sách đơn hàng');
                setOrders([]);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchOrders();
        } else {
            setLoading(false);
        }
    }, [user, filterThai, filterStatus]);

    const getThaiName = (thaiId: string) => {
        return THAI_NAMES[thaiId] || thaiId;
    };

    const getSessionTypeName = (type: string) => {
        const names: Record<string, string> = {
            'morning': 'Sáng',
            'afternoon': 'Chiều',
            'evening': 'Tối'
        };
        return names[type] || type;
    };

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            pending: 'bg-yellow-100 text-yellow-800',
            paid: 'bg-blue-100 text-blue-800',
            won: 'bg-green-100 text-green-800',
            lost: 'bg-gray-100 text-gray-600',
            cancelled: 'bg-red-100 text-red-800',
            expired: 'bg-gray-100 text-gray-500',
        };
        const labels: Record<string, string> = {
            pending: 'Chờ TT',
            paid: 'Đã TT',
            won: 'Trúng 🎉',
            lost: 'Không trúng',
            cancelled: 'Đã hủy',
            expired: 'Hết hạn',
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
                {labels[status] || status}
            </span>
        );
    };

    const formatDate = (dateStr: string) => {
        try {
            return new Date(dateStr).toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return dateStr;
        }
    };

    return (
        <div className="container mx-auto px-4 py-6 max-w-4xl">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">📋 Lịch sử đơn hàng</h1>
                <p className="text-gray-500">Xem lại các đơn hàng bạn đã đặt</p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Theo Thai</label>
                        <select
                            value={filterThai}
                            onChange={(e) => setFilterThai(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-200"
                        >
                            <option value="all">Tất cả</option>
                            <option value="an-nhon">Thai An Nhơn</option>
                            <option value="nhon-phong">Thai Nhơn Phong</option>
                            <option value="hoai-nhon">Thai Hoài Nhơn</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-200"
                        >
                            <option value="all">Tất cả</option>
                            <option value="pending">Chờ thanh toán</option>
                            <option value="paid">Đã thanh toán</option>
                            <option value="won">Trúng</option>
                            <option value="lost">Không trúng</option>
                            <option value="cancelled">Đã hủy</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Loading state */}
            {loading && (
                <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
                    <div className="animate-spin text-4xl mb-4">🔄</div>
                    <p className="text-gray-500">Đang tải...</p>
                </div>
            )}

            {/* Error state */}
            {error && !loading && (
                <div className="bg-red-50 rounded-xl p-4 mb-6 border border-red-100">
                    <p className="text-red-600">⚠️ {error}</p>
                </div>
            )}

            {/* Empty state */}
            {!loading && !error && orders.length === 0 && (
                <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
                    <div className="text-4xl mb-4">📭</div>
                    <p className="text-gray-500 mb-4">Chưa có đơn hàng nào</p>
                    <Link
                        to="/user/mua-con-vat"
                        className="inline-block px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700"
                    >
                        Đặt tịch ngay
                    </Link>
                </div>
            )}

            {/* Orders list */}
            {!loading && orders.length > 0 && (
                <div className="space-y-4">
                    {orders.map(order => (
                        <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            {/* Order header */}
                            <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-b">
                                <div className="flex items-center gap-3">
                                    <span className="font-mono text-sm text-gray-600">#{order.id.slice(-8)}</span>
                                    {getStatusBadge(order.status)}
                                </div>
                                <span className="text-sm text-gray-500">{formatDate(order.created_at)}</span>
                            </div>

                            {/* Order body */}
                            <div className="p-4">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <p className="font-medium text-gray-800">{getThaiName(order.thai_id || '')}</p>
                                        <p className="text-sm text-gray-500">
                                            {getSessionTypeName(order.session_type || '')}
                                            {order.lunar_label && ` - ${order.lunar_label}`}
                                        </p>
                                    </div>
                                    <p className="text-lg font-bold text-red-600">
                                        {order.total.toLocaleString('vi-VN')}đ
                                    </p>
                                </div>

                                {/* Action */}
                                <Link
                                    to={`/user/hoa-don/${order.id}`}
                                    className="block w-full text-center py-2 border border-red-200 text-red-600 rounded-lg font-medium hover:bg-red-50 transition"
                                >
                                    Xem chi tiết
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Summary */}
            {!loading && orders.length > 0 && (
                <div className="mt-6 bg-gradient-to-r from-red-50 to-yellow-50 rounded-xl p-4 border border-red-100">
                    <div className="flex items-center justify-between">
                        <span className="text-gray-700">Tổng số đơn:</span>
                        <span className="font-bold text-gray-800">{orders.length} đơn</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                        <span className="text-gray-700">Tổng chi tiêu:</span>
                        <span className="font-bold text-red-600">
                            {orders.reduce((sum, o) => sum + o.total, 0).toLocaleString('vi-VN')}đ
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LichSuPage;
