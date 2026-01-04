import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ThanhToanPage: React.FC = () => {
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);

    // Mock cart data
    const cartItems = [
        { id: '1', name: 'Chuột', emoji: '🐭', price: 30000, quantity: 1 },
        { id: '2', name: 'Rồng', emoji: '🐉', price: 30000, quantity: 2 },
    ];
    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleConfirmPayment = () => {
        setIsProcessing(true);
        // Mock processing
        setTimeout(() => {
            navigate('/hoa-don/HD-' + Date.now());
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-red-50 to-white py-8 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Thanh toán</h1>
                    <p className="text-gray-600">Quét mã QR hoặc chuyển khoản theo thông tin bên dưới</p>
                </div>

                {/* Order Summary */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                    <h2 className="font-bold text-gray-800 mb-4">📦 Đơn hàng của bạn</h2>
                    <div className="space-y-3 mb-4">
                        {cartItems.map(item => (
                            <div key={item.id} className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <span className="text-2xl">{item.emoji}</span>
                                    <span className="text-gray-700">{item.name} x{item.quantity}</span>
                                </div>
                                <span className="font-semibold">{(item.price * item.quantity).toLocaleString()}đ</span>
                            </div>
                        ))}
                    </div>
                    <div className="border-t pt-4 flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-800">Tổng cộng:</span>
                        <span className="text-2xl font-bold text-red-600">{totalPrice.toLocaleString()}đ</span>
                    </div>
                </div>

                {/* QR Code */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                    <h2 className="font-bold text-gray-800 mb-4 text-center">📱 Quét mã QR để thanh toán</h2>
                    <div className="flex justify-center mb-4">
                        <div className="w-48 h-48 bg-gray-100 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
                            {/* Mock QR Code */}
                            <div className="text-center">
                                <span className="text-6xl block mb-2">📷</span>
                                <span className="text-sm text-gray-500">QR Code</span>
                            </div>
                        </div>
                    </div>
                    <p className="text-center text-sm text-gray-500">
                        Quét mã bằng app ngân hàng để chuyển khoản tự động
                    </p>
                </div>

                {/* Bank Info */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                    <h2 className="font-bold text-gray-800 mb-4">🏦 Thông tin chuyển khoản</h2>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Ngân hàng:</span>
                            <span className="font-semibold">Vietcombank</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Số tài khoản:</span>
                            <span className="font-semibold">1234567890</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Chủ tài khoản:</span>
                            <span className="font-semibold">CO NHON AN NHON</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Số tiền:</span>
                            <span className="font-bold text-red-600">{totalPrice.toLocaleString()}đ</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Nội dung CK:</span>
                            <span className="font-semibold text-blue-600">CONHON 0901234567</span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                    <button
                        onClick={handleConfirmPayment}
                        disabled={isProcessing}
                        className={`w-full py-4 rounded-xl text-lg font-bold transition-all ${isProcessing
                                ? 'bg-gray-400 text-gray-200'
                                : 'bg-red-600 text-white hover:bg-red-700'
                            }`}
                    >
                        {isProcessing ? (
                            <span className="flex items-center justify-center space-x-2">
                                <span className="animate-spin">⏳</span>
                                <span>Đang xử lý...</span>
                            </span>
                        ) : (
                            '✅ Tôi đã thanh toán'
                        )}
                    </button>
                    <Link
                        to="/mua-con-vat"
                        className="block w-full py-3 text-center border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50"
                    >
                        ← Quay lại
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ThanhToanPage;
