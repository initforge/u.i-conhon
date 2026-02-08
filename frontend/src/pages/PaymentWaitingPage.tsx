import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderDetail, cancelOrder } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { getAnimalName } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Format money with dots: 10000 -> 10.000
const formatMoney = (amount: number | string): string => {
    const num = typeof amount === 'string' ? parseInt(amount, 10) : amount;
    if (isNaN(num)) return '0';
    return num.toLocaleString('vi-VN');
};

const PaymentWaitingPage: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const { token } = useAuth();


    const [order, setOrder] = useState<any>(null);
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState<string>('pending');
    const [now, setNow] = useState(Date.now());
    const [cancelling, setCancelling] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Tick every second for countdown
    useEffect(() => {
        const timer = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Fetch order details
    useEffect(() => {
        if (!orderId) return;
        const fetchOrder = async () => {
            try {
                setLoading(true);
                const data = await getOrderDetail(orderId);
                setOrder(data.order);
                setItems(data.items || []);
                setStatus(data.order.status);
                setError(null);
            } catch (err) {
                console.error('Error fetching order:', err);
                setError('Không thể tải thông tin đơn hàng');
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [orderId]);

    // SSE subscription for real-time status updates
    useEffect(() => {
        if (!orderId || !token || status !== 'pending') return;

        const sseUrl = `${API_BASE}/orders/${orderId}/status/stream`;

        // EventSource doesn't support custom headers, so we pass token via query
        // Actually, we need to use fetch-based SSE since we need auth header
        const controller = new AbortController();

        const connectSSE = async () => {
            try {
                const response = await fetch(sseUrl, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'text/event-stream',
                    },
                    signal: controller.signal,
                });

                if (!response.ok || !response.body) return;

                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let buffer = '';

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split('\n');
                    buffer = lines.pop() || '';

                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            try {
                                const data = JSON.parse(line.slice(6));
                                if (data.status && data.status !== 'pending') {
                                    setStatus(data.status);
                                    if (data.status === 'paid') {
                                        setShowSuccess(true);
                                    }
                                }
                            } catch { }
                        }
                    }
                }
            } catch (err: any) {
                if (err.name !== 'AbortError') {
                    console.error('SSE error:', err);
                }
            }
        };

        connectSSE();

        return () => {
            controller.abort();
        };
    }, [orderId, token, status]);

    // Countdown calculation
    const getCountdown = () => {
        if (!order?.payment_expires) return null;
        const diff = new Date(order.payment_expires).getTime() - now;
        if (diff <= 0) return { expired: true, mins: 0, secs: 0, text: 'Hết hạn', percent: 0 };
        const totalSeconds = Math.floor(diff / 1000);
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        // 15 min = 900s total
        const percent = Math.min(100, (totalSeconds / 900) * 100);
        return { expired: false, mins, secs, text: `${mins}:${secs.toString().padStart(2, '0')}`, percent };
    };

    const handleCancel = async () => {
        if (!orderId || !confirm('Bạn có chắc muốn hủy đơn hàng này?')) return;
        setCancelling(true);
        try {
            await cancelOrder(orderId);
            setStatus('expired');
        } catch (err) {
            console.error('Cancel error:', err);
            alert('Không thể hủy đơn hàng');
        } finally {
            setCancelling(false);
        }
    };

    const countdown = getCountdown();

    // Auto-expire AND cancel PayOS link when countdown hits 0
    useEffect(() => {
        if (countdown?.expired && status === 'pending' && orderId) {
            setStatus('expired');
            // Actually cancel the order + PayOS link on the backend
            cancelOrder(orderId).catch(err => {
                console.error('Auto-cancel on expiry failed:', err);
            });
        }
    }, [countdown?.expired, status, orderId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center">
                <div className="animate-spin text-4xl">⏳</div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
                    <div className="text-4xl mb-4">❌</div>
                    <p className="text-gray-600 mb-4">{error || 'Đơn hàng không tồn tại'}</p>
                    <Link to="/user/lich-su" className="text-red-600 font-semibold hover:underline">
                        ← Quay lại lịch sử
                    </Link>
                </div>
            </div>
        );
    }

    // ====== SUCCESS STATE ======
    if (showSuccess || status === 'paid') {
        return (
            <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden text-center">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8">
                        <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                            <span className="text-6xl">✅</span>
                        </div>
                        <h1 className="text-2xl font-bold text-white">Thanh toán thành công!</h1>
                        <p className="text-green-100 mt-2">Đơn hàng đã được xác nhận</p>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="bg-green-50 rounded-xl p-4">
                            <p className="text-lg font-bold text-green-700">{formatMoney(order.total)}đ</p>
                            <p className="text-sm text-green-600 mt-1">Mã đơn: #{orderId?.slice(-8)}</p>
                        </div>
                        <div className="space-y-2 pt-2">
                            <Link
                                to={`/user/hoa-don/${orderId}`}
                                className="block w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition"
                            >
                                🧾 Xem hóa đơn
                            </Link>
                            <Link
                                to="/user/mua-con-vat"
                                className="block w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition"
                            >
                                🛒 Tiếp tục mua
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ====== EXPIRED/CANCELLED STATE ======
    if (status === 'expired' || status === 'cancelled') {
        return (
            <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden text-center">
                    <div className="bg-gradient-to-r from-red-500 to-red-600 p-8">
                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-5xl">{status === 'expired' ? '⏰' : '❌'}</span>
                        </div>
                        <h1 className="text-2xl font-bold text-white">
                            {status === 'expired' ? 'Đơn hàng đã hết hạn' : 'Đơn hàng đã hủy'}
                        </h1>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-left">
                            <p className="text-sm text-yellow-800">
                                <strong>💡 Lưu ý:</strong> Hạn mức con vật đã được hoàn lại.
                                Bạn có thể đặt đơn mới bất cứ lúc nào.
                            </p>
                        </div>
                        <div className="space-y-2 pt-2">
                            <Link
                                to="/user/mua-con-vat"
                                className="block w-full py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition"
                            >
                                🛒 Đặt đơn mới
                            </Link>
                            <Link
                                to="/user/lich-su"
                                className="block w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition"
                            >
                                📋 Xem lịch sử
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ====== PENDING STATE (main view) ======
    return (
        <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white p-4">
            <div className="max-w-md mx-auto space-y-4">

                {/* Countdown Header */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className={`p-6 text-center ${countdown?.expired ? 'bg-red-500' : 'bg-gradient-to-r from-amber-500 to-orange-500'}`}>
                        <p className="text-white/80 text-sm font-medium mb-1">Thời gian thanh toán còn lại</p>
                        <div className="text-5xl font-mono font-bold text-white tracking-wider">
                            {countdown ? countdown.text : '--:--'}
                        </div>
                        <p className="text-white/70 text-xs mt-2">
                            Đơn hàng sẽ tự hủy khi hết thời gian
                        </p>
                    </div>

                    {/* Progress bar */}
                    {countdown && !countdown.expired && (
                        <div className="h-2 bg-gray-200">
                            <div
                                className="h-full transition-all duration-1000 ease-linear"
                                style={{
                                    width: `${countdown.percent}%`,
                                    backgroundColor: countdown.percent > 30 ? '#f59e0b' : countdown.percent > 10 ? '#ef4444' : '#991b1b',
                                }}
                            />
                        </div>
                    )}
                </div>

                {/* Order Details */}
                <div className="bg-white rounded-2xl shadow-lg p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-xs text-gray-400">Mã đơn hàng</p>
                            <p className="font-mono font-bold text-gray-800">#{orderId?.slice(-8)}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-400">Tổng tiền</p>
                            <p className="text-xl font-bold text-red-600">{formatMoney(order.total)}đ</p>
                        </div>
                    </div>

                    <div className="border-t pt-3 space-y-2">
                        {items.map((item: any, idx: number) => (
                            <div key={idx} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <span className="w-7 h-7 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-xs font-bold">
                                        {item.animal_order}
                                    </span>
                                    <span className="text-gray-700 font-medium text-sm">
                                        {getAnimalName(item.animal_order)}
                                    </span>
                                    {item.quantity > 1 && (
                                        <span className="text-xs text-gray-400">x{item.quantity}</span>
                                    )}
                                </div>
                                <span className="text-sm font-semibold text-gray-700">
                                    {formatMoney(item.subtotal)}đ
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                    {order.payment_url && (
                        <a
                            href={order.payment_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full text-center py-4 bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-2xl font-bold text-lg hover:from-yellow-600 hover:to-amber-600 transition-all shadow-lg"
                        >
                            💳 Mở trang thanh toán
                        </a>
                    )}

                    <button
                        onClick={handleCancel}
                        disabled={cancelling}
                        className="block w-full text-center py-3 border-2 border-red-200 text-red-500 rounded-2xl font-semibold hover:bg-red-50 transition disabled:opacity-50"
                    >
                        {cancelling ? '⏳ Đang hủy...' : '✕ Hủy đơn hàng'}
                    </button>
                </div>

                {/* SSE indicator */}
                <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    Đang theo dõi trạng thái thanh toán...
                </div>

                {/* Back link */}
                <div className="text-center">
                    <Link to="/user/lich-su" className="text-sm text-gray-500 hover:text-gray-700">
                        ← Quay lại lịch sử đơn hàng
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PaymentWaitingPage;
