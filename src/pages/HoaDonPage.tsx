import React from 'react';
import { Link, useParams } from 'react-router-dom';

const HoaDonPage: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();

    // Mock order data
    const order = {
        id: orderId || 'HD-123456',
        date: new Date().toLocaleDateString('vi-VN'),
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        thai: 'Thai An Nhơn',
        items: [
            { id: '1', name: 'Chuột', emoji: '🐭', price: 30000, quantity: 1 },
            { id: '2', name: 'Rồng', emoji: '🐉', price: 30000, quantity: 2 },
        ],
        status: 'Đã thanh toán'
    };
    const totalPrice = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleScreenshot = () => {
        // Mock screenshot functionality
        alert('Đã chụp ảnh hóa đơn! (Mock)');
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-8 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Success Banner */}
                <div className="text-center mb-8">
                    <div className="text-7xl mb-4">🎉</div>
                    <h1 className="text-3xl font-bold text-green-700 mb-2">Thanh toán thành công!</h1>
                    <p className="text-gray-600">Cảm ơn bạn đã tham gia Cổ Nhơn</p>
                </div>

                {/* Invoice Card */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
                    {/* Header */}
                    <div className="bg-red-600 text-white p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold">HÓA ĐƠN</h2>
                                <p className="text-red-100 text-sm">{order.thai}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold">{order.id}</p>
                                <p className="text-red-100 text-sm">{order.date} - {order.time}</p>
                            </div>
                        </div>
                    </div>

                    {/* Items */}
                    <div className="p-6">
                        <h3 className="font-bold text-gray-800 mb-4">Danh sách con vật:</h3>
                        <div className="space-y-3 mb-6">
                            {order.items.map((item, index) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between py-2 border-b border-gray-100"
                                >
                                    <div className="flex items-center space-x-3">
                                        <span className="text-gray-400 text-sm">{index + 1}.</span>
                                        <span className="text-2xl">{item.emoji}</span>
                                        <span className="font-medium text-gray-800">{item.name}</span>
                                        <span className="text-gray-500">x{item.quantity}</span>
                                    </div>
                                    <span className="font-semibold">
                                        {(item.price * item.quantity).toLocaleString()}đ
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Total */}
                        <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                            <span className="text-lg font-bold text-gray-800">TỔNG CỘNG:</span>
                            <span className="text-2xl font-bold text-red-600">
                                {totalPrice.toLocaleString()}đ
                            </span>
                        </div>

                        {/* Status */}
                        <div className="mt-4 text-center">
                            <span className="inline-flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-700 rounded-full font-semibold">
                                <span>✅</span>
                                <span>{order.status}</span>
                            </span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                    <button
                        onClick={handleScreenshot}
                        className="w-full py-4 bg-blue-600 text-white rounded-xl text-lg font-bold hover:bg-blue-700 flex items-center justify-center space-x-2"
                    >
                        <span>📸</span>
                        <span>Chụp ảnh hóa đơn</span>
                    </button>
                    <Link
                        to="/mua-con-vat"
                        className="block w-full py-4 bg-red-600 text-white text-center rounded-xl text-lg font-bold hover:bg-red-700"
                    >
                        🛒 Mua tiếp
                    </Link>
                    <Link
                        to="/"
                        className="block w-full py-3 text-center border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50"
                    >
                        🏠 Về trang chủ
                    </Link>
                </div>

                {/* Info */}
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800 text-center">
                        📌 Kết quả sẽ được công bố vào <strong>18h30</strong> hàng ngày
                    </p>
                </div>
            </div>
        </div>
    );
};

export default HoaDonPage;
