import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

/**
 * PaymentSuccessPage — shown after PayOS redirects back on successful payment
 * URL: /user/thanh-toan/success?orderId=xxx
 */
const PaymentSuccessPage: React.FC = () => {
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
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden text-center">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-5xl">✅</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white">Thanh toán thành công!</h1>
                    <p className="text-green-100 mt-2">Đơn hàng đã được xác nhận</p>
                </div>

                <div className="p-6 space-y-4">
                    {orderId && (
                        <div className="bg-gray-50 rounded-xl p-4">
                            <p className="text-sm text-gray-500">Mã đơn hàng</p>
                            <p className="font-mono font-bold text-gray-800 text-lg">{orderId}</p>
                        </div>
                    )}

                    <p className="text-gray-600 text-sm">
                        Đơn hàng của bạn đã được thanh toán thành công.
                        Kết quả sẽ được cập nhật tại trang <strong>Lịch sử</strong>.
                    </p>

                    <div className="space-y-2 pt-2">
                        <Link
                            to="/user/mua-con-vat"
                            className="block w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition"
                        >
                            🛒 Tiếp tục mua
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

export default PaymentSuccessPage;
