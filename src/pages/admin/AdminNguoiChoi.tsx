import React from 'react';

interface Player {
    id: string;
    name: string;
    phone: string;
    totalSpent: number;
    ordersCount: number;
    lastActive: string;
}

const mockPlayers: Player[] = [
    { id: '1', name: 'Nguyễn Văn A', phone: '0901234567', totalSpent: 2700000, ordersCount: 90, lastActive: '04/01/2025' },
    { id: '2', name: 'Trần Thị B', phone: '0912345678', totalSpent: 1500000, ordersCount: 50, lastActive: '04/01/2025' },
    { id: '3', name: 'Lê Văn C', phone: '0923456789', totalSpent: 900000, ordersCount: 30, lastActive: '03/01/2025' },
    { id: '4', name: 'Phạm Thị D', phone: '0934567890', totalSpent: 600000, ordersCount: 20, lastActive: '03/01/2025' },
    { id: '5', name: 'Hoàng Văn E', phone: '0945678901', totalSpent: 300000, ordersCount: 10, lastActive: '02/01/2025' },
    { id: '6', name: 'Đỗ Thị F', phone: '0956789012', totalSpent: 150000, ordersCount: 5, lastActive: '02/01/2025' },
    { id: '7', name: 'Vũ Văn G', phone: '0967890123', totalSpent: 90000, ordersCount: 3, lastActive: '01/01/2025' },
    { id: '8', name: 'Bùi Thị H', phone: '0978901234', totalSpent: 60000, ordersCount: 2, lastActive: '01/01/2025' },
];

const AdminNguoiChoi: React.FC = () => {
    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Quản lý Người chơi</h1>
                <p className="text-gray-600">Danh sách người chơi trong hệ thống</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
                    <p className="text-sm text-gray-500 mb-1">Tổng người chơi</p>
                    <p className="text-3xl font-bold text-gray-800">{mockPlayers.length}</p>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
                    <p className="text-sm text-gray-500 mb-1">Tổng doanh thu</p>
                    <p className="text-3xl font-bold text-gray-800">
                        {mockPlayers.reduce((sum, p) => sum + p.totalSpent, 0).toLocaleString()}đ
                    </p>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
                    <p className="text-sm text-gray-500 mb-1">Tổng đơn hàng</p>
                    <p className="text-3xl font-bold text-gray-800">
                        {mockPlayers.reduce((sum, p) => sum + p.ordersCount, 0)}
                    </p>
                </div>
            </div>

            {/* Players Table */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">#</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Tên</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">SĐT</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Tổng tiền đã chơi</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Số đơn</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Hoạt động cuối</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {mockPlayers.map((player, index) => (
                            <tr key={player.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-gray-500">{index + 1}</td>
                                <td className="px-6 py-4 font-medium text-gray-800">{player.name}</td>
                                <td className="px-6 py-4 text-gray-600">{player.phone}</td>
                                <td className="px-6 py-4 font-semibold text-red-600">{player.totalSpent.toLocaleString()}đ</td>
                                <td className="px-6 py-4 text-gray-700">{player.ordersCount}</td>
                                <td className="px-6 py-4 text-gray-500">{player.lastActive}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminNguoiChoi;
