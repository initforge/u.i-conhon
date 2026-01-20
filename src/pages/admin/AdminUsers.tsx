import React, { useState } from 'react';
import { mockUsers, mockOrders, mockThais, mockAnimals } from '../../mock-data/mockData';
import AdminPageWrapper, { AdminCard, StatusBadge, StatCard, AdminButton } from '../../components/AdminPageWrapper';

const AdminUsers: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const [selectedThai, setSelectedThai] = useState('all');

    const thaiOptions = [
        { id: 'all', name: 'Tất cả', color: 'gray' },
        { id: 'thai-an-nhon', name: 'Thai An Nhơn', color: 'green' },
        { id: 'thai-nhon-phong', name: 'Thai Nhơn Phong', color: 'yellow' },
        { id: 'thai-hoai-nhon', name: 'Thai Hoài Nhơn', color: 'blue' },
    ];

    const users = mockUsers.filter((u) => u.role === 'user');

    // Filter users by Thai based on their orders
    const getUserThai = (userId: string) => {
        const userOrders = mockOrders.filter((o) => o.userId === userId);
        if (userOrders.length === 0) return null;
        return userOrders[0].thaiId;
    };

    const filteredUsers = users.filter((user) => {
        const search = searchTerm.toLowerCase();
        const matchesSearch = user.name.toLowerCase().includes(search) ||
            user.zaloName.toLowerCase().includes(search) ||
            user.phone.includes(search);

        if (!matchesSearch) return false;
        if (selectedThai === 'all') return true;

        const userThai = getUserThai(user.id);
        return userThai === selectedThai;
    });

    const getUserStats = (userId: string) => {
        const userOrders = mockOrders.filter((o) => o.userId === userId);
        const totalSpent = userOrders.reduce((sum, o) => sum + o.total, 0);
        const paidOrders = userOrders.filter((o) => o.status === 'paid' || o.status === 'completed');
        return { totalOrders: userOrders.length, paidOrders: paidOrders.length, totalSpent };
    };

    const getThaiName = (thaiId: string) => mockThais.find(t => t.id === thaiId)?.name || thaiId;
    const totalRevenue = mockOrders.reduce((sum, o) => sum + o.total, 0);
    const usersWithOrders = users.filter((u) => mockOrders.some((o) => o.userId === u.id)).length;

    return (
        <AdminPageWrapper
            title="Quản lý người dùng"
            subtitle="Xem thông tin và hoạt động của người chơi"
            icon="👥"
            actions={<AdminButton variant="secondary">📥 Xuất dữ liệu</AdminButton>}
        >
            {/* Thai Tabs */}
            <div className="mb-6">
                <div className="flex flex-wrap gap-2 p-1 bg-gray-100 rounded-xl">
                    {thaiOptions.map((thai) => (
                        <button
                            key={thai.id}
                            onClick={() => setSelectedThai(thai.id)}
                            className={`flex-1 min-w-[100px] px-3 py-2 rounded-lg font-semibold text-sm transition-all ${selectedThai === thai.id
                                ? 'bg-white shadow-md text-amber-700'
                                : 'text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            <span className={`w-2 h-2 rounded-full inline-block mr-2 ${thai.color === 'green' ? 'bg-green-500' :
                                thai.color === 'yellow' ? 'bg-yellow-500' :
                                    thai.color === 'blue' ? 'bg-blue-500' : 'bg-gray-400'
                                }`}></span>
                            {thai.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                <StatCard label="Tổng người dùng" value={filteredUsers.length} icon="👤" />
                <StatCard label="Đã đặt tịch" value={usersWithOrders} icon="🛒" />
                <StatCard label="Tổng doanh thu" value={`${(totalRevenue / 1000000).toFixed(1)}M`} icon="💰" />
            </div>

            {/* Search */}
            <AdminCard>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2" style={{ color: '#9a8c7a' }}>🔍</span>
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên, Zalo, hoặc số điện thoại..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-200"
                        style={{ border: '1px solid #e8e4df' }}
                    />
                </div>
            </AdminCard>

            {/* Table */}
            <AdminCard noPadding>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr style={{ backgroundColor: '#faf8f5' }}>
                                <th className="text-left p-4 text-xs font-medium uppercase" style={{ color: '#9a8c7a' }}>Người dùng</th>
                                <th className="text-left p-4 text-xs font-medium uppercase" style={{ color: '#9a8c7a' }}>SĐT</th>
                                <th className="text-right p-4 text-xs font-medium uppercase" style={{ color: '#9a8c7a' }}>Tịch</th>
                                <th className="text-right p-4 text-xs font-medium uppercase" style={{ color: '#9a8c7a' }}>Tổng tiền</th>
                                <th className="text-center p-4 text-xs font-medium uppercase" style={{ color: '#9a8c7a' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => {
                                const stats = getUserStats(user.id);
                                return (
                                    <tr key={user.id} style={{ borderBottom: '1px solid #f0ece6' }}>
                                        <td className="p-4">
                                            <div className="flex items-center space-x-3">
                                                <div
                                                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium"
                                                    style={{ backgroundColor: '#f5f2ed', color: '#6b5c4c' }}
                                                >
                                                    {user.zaloName.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium" style={{ color: '#3d3428' }}>{user.zaloName}</p>
                                                    <p className="text-xs" style={{ color: '#9a8c7a' }}>{user.name}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm" style={{ color: '#6b5c4c' }}>{user.phone}</td>
                                        <td className="p-4 text-right">
                                            <span className="text-sm" style={{ color: '#6b5c4c' }}>{stats.totalOrders}</span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <span className="text-sm font-medium" style={{ color: '#a5673f' }}>
                                                {stats.totalSpent.toLocaleString('vi-VN')} đ
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <button
                                                onClick={() => setSelectedUser(selectedUser === user.id ? null : user.id)}
                                                className="p-2 rounded-lg transition-colors"
                                                style={{ backgroundColor: '#faf8f5' }}
                                            >
                                                👁️
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </AdminCard>

            {/* Modal */}
            {selectedUser && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-lg w-full max-h-[80vh] overflow-y-auto shadow-xl">
                        <div className="p-5 border-b" style={{ borderColor: '#f0ece6' }}>
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold" style={{ color: '#3d3428' }}>Chi tiết người dùng</h2>
                                <button onClick={() => setSelectedUser(null)} className="text-xl" style={{ color: '#9a8c7a' }}>✕</button>
                            </div>
                        </div>
                        <div className="p-5">
                            {(() => {
                                const user = users.find((u) => u.id === selectedUser);
                                if (!user) return null;
                                const userOrders = mockOrders.filter((o) => o.userId === user.id);
                                const stats = getUserStats(user.id);

                                return (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-3 p-4 rounded-lg" style={{ backgroundColor: '#faf8f5' }}>
                                            <div><p className="text-xs" style={{ color: '#9a8c7a' }}>Zalo</p><p className="text-sm font-medium">{user.zaloName}</p></div>
                                            <div><p className="text-xs" style={{ color: '#9a8c7a' }}>SĐT</p><p className="text-sm font-medium">{user.phone}</p></div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-3">
                                            <div className="p-3 rounded-lg text-center" style={{ backgroundColor: '#faf8f5' }}>
                                                <p className="text-lg font-semibold" style={{ color: '#3d3428' }}>{stats.totalOrders}</p>
                                                <p className="text-xs" style={{ color: '#9a8c7a' }}>Tổng tịch</p>
                                            </div>
                                            <div className="p-3 rounded-lg text-center" style={{ backgroundColor: '#ecf5ec' }}>
                                                <p className="text-lg font-semibold" style={{ color: '#3d7a3d' }}>{stats.paidOrders}</p>
                                                <p className="text-xs" style={{ color: '#9a8c7a' }}>Đã TT</p>
                                            </div>
                                            <div className="p-3 rounded-lg text-center" style={{ backgroundColor: '#fef8ec' }}>
                                                <p className="text-base font-semibold" style={{ color: '#9a7a2d' }}>{(stats.totalSpent / 1000).toFixed(0)}k</p>
                                                <p className="text-xs" style={{ color: '#9a8c7a' }}>Tổng tiền</p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium mb-2" style={{ color: '#6b5c4c' }}>Lịch sử tịch</p>
                                            <div className="space-y-2 max-h-60 overflow-y-auto">
                                                {userOrders.slice(0, 5).map((order) => {
                                                    // Get animal names from order items
                                                    const animalNames = order.items.map((item) => {
                                                        const animal = mockAnimals.find((a) => a.id === item.animalId);
                                                        return animal?.name || 'N/A';
                                                    }).join(', ');
                                                    return (
                                                        <div key={order.id} className="p-2 rounded" style={{ backgroundColor: '#faf8f5' }}>
                                                            <div className="flex justify-between items-center mb-1">
                                                                <span className="text-xs font-medium" style={{ color: '#6b5c4c' }}>{getThaiName(order.thaiId)}</span>
                                                                <div className="flex items-center gap-1">
                                                                    <span className="text-xs font-medium" style={{ color: '#a5673f' }}>{order.total.toLocaleString('vi-VN')} đ</span>
                                                                    <StatusBadge status={order.status === 'completed' ? 'success' : order.status === 'paid' ? 'info' : 'warning'}>
                                                                        {order.status === 'completed' ? '✓' : order.status === 'paid' ? 'TT' : '⏳'}
                                                                    </StatusBadge>
                                                                </div>
                                                            </div>
                                                            <p className="text-xs" style={{ color: '#991b1b' }}>
                                                                🐾 {animalNames}
                                                            </p>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>
                    </div>
                </div>
            )}
        </AdminPageWrapper>
    );
};

export default AdminUsers;
