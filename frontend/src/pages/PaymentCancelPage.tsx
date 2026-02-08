import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

/**
 * PaymentCancelPage — shown after PayOS redirects back on cancelled/failed payment
 * URL: /user/thanh-toan/cancel?orderId=xxx
 */
const PaymentCancelPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('orderId');
    const [countdown, setCountdown] = useState(10);

    // Auto-redirect after 10s
    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    window.location.href = '/user/mua-con-vat';
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden text-center">
                <div className="bg-gradient-to-r from-red-500 to-red-600 p-8">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-5xl">❌</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white">Thanh toán bị hủy</h1>
                    <p className="text-red-100 mt-2">Đơn hàng chưa được thanh toán</p>
                </div>

                <div className="p-6 space-y-4">
                    {orderId && (
                        <div className="bg-gray-50 rounded-xl p-4">
                            <p className="text-sm text-gray-500">Mã đơn hàng</p>
                            <p className="font-mono font-bold text-gray-800 text-lg">{orderId}</p>
                        </div>
                    )}

                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-left">
                        <p className="text-sm text-yellow-800">
                            <strong>💡 Lưu ý:</strong> Đơn hàng chưa thanh toán sẽ tự hết hạn sau 15 phút.
                            Hạn mức con vật sẽ được hoàn lại tự động khi đơn hết hạn.
                        </p>
                    </div>

                    <div className="space-y-2 pt-2">
                        <Link
                            to="/user/mua-con-vat"
                            className="block w-full py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition"
                        >
                            🛒 Quay lại mua hàng
                        </Link>
                        <Link
                            to="/user/lich-su"
                            className="block w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition"
                        >
                            📋 Xem lịch sử đơn hàng
                        </Link>
                    </div>

                    <p className="text-xs text-gray-400">
                        Tự động quay lại sau {countdown}s...
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PaymentCancelPage;
