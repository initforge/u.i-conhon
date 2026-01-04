import React, { useState } from 'react';

interface Order {
    id: string;
    user: string;
    phone: string;
    thai: string;
    items: { name: string; emoji: string; quantity: number }[];
    total: number;
    status: 'pending' | 'paid' | 'completed';
    date: string;
    time: string;
}

const mockOrders: Order[] = [
    {
        id: 'HD-001',
        user: 'Nguyễn Văn A',
        phone: '0901234567',
        thai: 'Thai An Nhơn',
        items: [
            { name: 'Rồng', emoji: '🐉', quantity: 2 },
            { name: 'Hổ', emoji: '🐅', quantity: 1 },
        ],
        total: 90000,
        status: 'paid',
        date: '04/01/2025',
        time: '10:30',
    },
    {
        id: 'HD-002',
        user: 'Trần Thị B',
        phone: '0912345678',
        thai: 'Thai Nhơn Phong',
        items: [
            { name: 'Mèo', emoji: '🐱', quantity: 3 },
        ],
        total: 90000,
        status: 'completed',
        date: '04/01/2025',
        time: '09:15',
    },
    {
        id: 'HD-003',
        user: 'Lê Văn C',
        phone: '0923456789',
        thai: 'Thai Hoài Nhơn',
        items: [
            { name: 'Ngựa', emoji: '🐴', quantity: 1 },
            { name: 'Rắn', emoji: '🐍', quantity: 2 },
        ],
        total: 90000,
        status: 'pending',
        date: '04/01/2025',
        time: '08:45',
    },
];

const AdminDonHang: React.FC = () => {
    const [orders] = useState<Order[]>(mockOrders);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold">Chờ xử lý</span>;
            case 'paid':
                return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">Đã thanh toán</span>;
            case 'completed':
                return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">Hoàn thành</span>;
            default:
                return null;
        }
    };

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Quản lý Đơn hàng</h1>
                <p className="text-gray-600">Danh sách tất cả đơn hàng trong hệ thống</p>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Mã đơn</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Người mua</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Thai</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Tổng tiền</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Trạng thái</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Thời gian</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {orders.map((order) => (
                            <tr
                                key={order.id}
                                onClick={() => setSelectedOrder(order)}
                                className="hover:bg-gray-50 cursor-pointer transition-colors"
                            >
                                <td className="px-6 py-4 font-semibold text-blue-600">{order.id}</td>
                                <td className="px-6 py-4">
                                    <div>
                                        <p className="font-medium text-gray-800">{order.user}</p>
                                        <p className="text-sm text-gray-500">{order.phone}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-700">{order.thai}</td>
                                <td className="px-6 py-4 font-semibold text-red-600">{order.total.toLocaleString()}đ</td>
                                <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                                <td className="px-6 py-4 text-gray-500">{order.date} - {order.time}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Order Detail Modal */}
            {selectedOrder && (
                <>
                    <div
                        className="fixed inset-0 bg-black/50 z-50"
                        onClick={() => setSelectedOrder(null)}
                    />
                    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl z-50 w-full max-w-lg">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-800">Chi tiết đơn hàng</h2>
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="p-2 hover:bg-gray-100 rounded-full"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Mã đơn:</span>
                                    <span className="font-bold text-blue-600">{selectedOrder.id}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Người mua:</span>
                                    <span className="font-medium">{selectedOrder.user}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">SĐT:</span>
                                    <span className="font-medium">{selectedOrder.phone}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Thai:</span>
                                    <span className="font-medium">{selectedOrder.thai}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Thời gian:</span>
                                    <span>{selectedOrder.date} - {selectedOrder.time}</span>
                                </div>

                                <div className="border-t pt-4">
                                    <p className="text-gray-500 mb-2">Danh sách con vật:</p>
                                    <div className="space-y-2">
                                        {selectedOrder.items.map((item, idx) => (
                                            <div key={idx} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-xl">{item.emoji}</span>
                                                    <span>{item.name}</span>
                                                </div>
                                                <span>x{item.quantity}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="border-t pt-4 flex justify-between items-center">
                                    <span className="text-lg font-bold">Tổng cộng:</span>
                                    <span className="text-2xl font-bold text-red-600">{selectedOrder.total.toLocaleString()}đ</span>
                                </div>

                                <div className="flex justify-center">
                                    {getStatusBadge(selectedOrder.status)}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminDonHang;
