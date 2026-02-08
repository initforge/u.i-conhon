import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getMyOrders, cancelOrder, Order } from '../services/api';
import { getAnimalName } from '../types';

// Thai names constant
const THAI_NAMES: Record<string, string> = {
    'an-nhon': 'Thai An Nhơn',
    'thai-an-nhon': 'Thai An Nhơn',
    'nhon-phong': 'Thai Nhơn Phong',
    'thai-nhon-phong': 'Thai Nhơn Phong',
    'hoai-nhon': 'Thai Hoài Nhơn',
    'thai-hoai-nhon': 'Thai Hoài Nhơn'
};

// Format money with dots: 10000 -> 10.000
const formatMoney = (amount: number | string): string => {
    const num = typeof amount === 'string' ? parseInt(amount, 10) : amount;
    if (isNaN(num)) return '0';
    return num.toLocaleString('vi-VN');
};

const LichSuPage: React.FC = () => {
    const { user } = useAuth();
    const [filterThai, setFilterThai] = useState('all');
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
    const [now, setNow] = useState(Date.now());

    // Tick every second for countdown
    useEffect(() => {
        const timer = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(timer);
    }, []);

    const getCountdown = (expiresAt?: string) => {
        if (!expiresAt) return null;
        const diff = new Date(expiresAt).getTime() - now;
        if (diff <= 0) return { expired: true, text: 'Hết hạn' };
        const mins = Math.floor(diff / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        return { expired: false, text: `${mins}:${secs.toString().padStart(2, '0')}` };
    };

    const handleCancel = async (orderId: string) => {
        if (!confirm('Bạn có chắc muốn hủy đơn hàng này?')) return;
        try {
            await cancelOrder(orderId);
            // Refetch orders
            const thaiId = filterThai !== 'all' ? filterThai : undefined;
            const response = await getMyOrders({ thaiId });
            setOrders(response.orders || []);
        } catch (err) {
            console.error('Cancel error:', err);
            alert('Không thể hủy đơn hàng');
        }
    };

    // Fetch orders from API
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const thaiId = filterThai !== 'all' ? filterThai : undefined;

                const response = await getMyOrders({ thaiId });
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
    }, [user, filterThai]);

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
        if (status === 'won') {
            return <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Trúng thưởng 🎉</span>;
        }
        if (status === 'lost') {
            return <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">Không trúng</span>;
        }
        if (status === 'pending') {
            return <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">⏳ Chờ thanh toán</span>;
        }
        if (status === 'expired') {
            return <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">Hết hạn</span>;
        }
        // paid là mặc định
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">Đã thanh toán</span>;
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

    const toggleExpand = (orderId: string) => {
        setExpandedOrder(prev => prev === orderId ? null : orderId);
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
                        <div key={order.id} className={`bg-white rounded-xl shadow-sm border overflow-hidden ${order.status === 'pending' ? 'border-yellow-300' : order.status === 'expired' ? 'border-red-200' : 'border-gray-100'}`}>
                            {/* Order header */}
                            <div className={`px-4 py-3 flex items-center justify-between border-b ${order.status === 'pending' ? 'bg-yellow-50' : 'bg-gray-50'}`}>
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
                                        {formatMoney(order.total)}đ
                                    </p>
                                </div>

                                {/* Pending order: show countdown + payment button */}
                                {order.status === 'pending' && (() => {
                                    const cd = getCountdown(order.payment_expires);
                                    return (
                                        <div className="mb-3 space-y-2">
                                            {cd && (
                                                <div className={`text-center py-1.5 rounded-lg text-sm font-medium ${cd.expired ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-700'}`}>
                                                    {cd.expired ? '⏰ Đơn hàng đã hết hạn thanh toán' : `⏱️ Còn ${cd.text} để thanh toán`}
                                                </div>
                                            )}
                                            {(!cd || !cd.expired) && (
                                                <Link
                                                    to={`/user/thanh-toan/${order.id}`}
                                                    className="block w-full text-center py-2 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600 transition"
                                                >
                                                    💳 Thanh toán ngay
                                                </Link>
                                            )}
                                            <button
                                                onClick={() => handleCancel(order.id)}
                                                className="block w-full text-center py-2 border border-red-200 text-red-500 rounded-lg font-medium hover:bg-red-50 transition text-sm"
                                            >
                                                ✕ Hủy đơn hàng
                                            </button>
                                        </div>
                                    );
                                })()}

                                {/* Expand/collapse order items */}
                                {order.items && order.items.length > 0 && (
                                    <>
                                        <button
                                            onClick={() => toggleExpand(order.id)}
                                            className="w-full text-center py-2 border border-gray-200 text-gray-600 rounded-lg font-medium hover:bg-gray-50 transition text-sm"
                                        >
                                            {expandedOrder === order.id ? '▲ Thu gọn' : `▼ Chi tiết (${order.items.length} con vật)`}
                                        </button>
                                        {expandedOrder === order.id && (
                                            <div className="mt-3 space-y-2 border-t pt-3">
                                                {order.items.map((item: any, idx: number) => (
                                                    <div key={idx} className="flex items-center justify-between text-sm py-2 px-3 bg-gray-50 rounded-lg">
                                                        <div className="flex items-center gap-2">
                                                            <span className="w-6 h-6 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-xs font-bold">
                                                                {item.animal_order}
                                                            </span>
                                                            <span className="text-gray-700 font-medium">
                                                                {getAnimalName(item.animal_order)}
                                                            </span>
                                                            {item.quantity > 1 && (
                                                                <span className="text-xs text-gray-400">x{item.quantity}</span>
                                                            )}
                                                        </div>
                                                        <span className="font-semibold text-red-600">
                                                            {formatMoney(item.amount || item.subtotal)}đ
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )}

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
                            {formatMoney(orders.reduce((sum, o) => sum + Number(o.total), 0))}đ
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LichSuPage;
