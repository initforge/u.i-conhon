import React, { useState } from 'react';
import { mockUsers, mockOrders, mockThais, mockAnimals } from '../../mock-data/mockData';
import AdminPageWrapper, { AdminCard, StatusBadge, StatCard, AdminButton } from '../../components/AdminPageWrapper';
import SearchableBankDropdown from '../../components/SearchableBankDropdown';
import Portal from '../../components/Portal';

const AdminUsers: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        name: '',
        phone: '',
        zaloName: '',
        password: '',  // New field for admin to reset password
        bankCode: 'VCB',
        bankAccount: '',
        bankAccountHolder: '',
    });

    const users = mockUsers.filter((u) => u.role === 'user');

    const filteredUsers = users.filter((user) => {
        const search = searchTerm.toLowerCase();
        const matchesSearch = user.name.toLowerCase().includes(search) ||
            user.zaloName.toLowerCase().includes(search) ||
            user.phone.includes(search);
        return matchesSearch;
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
                <Portal>
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
                        <div className="bg-white rounded-xl w-full max-w-lg max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-xl my-auto">
                            <div className="p-5 border-b" style={{ borderColor: '#f0ece6' }}>
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-semibold" style={{ color: '#3d3428' }}>
                                        {isEditing ? '✏️ Chỉnh sửa người dùng' : 'Chi tiết người dùng'}
                                    </h2>
                                    <button onClick={() => { setSelectedUser(null); setIsEditing(false); }} className="text-xl" style={{ color: '#9a8c7a' }}>✕</button>
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
                                            {/* Nút chỉnh sửa */}
                                            {!isEditing && (
                                                <button
                                                    onClick={() => {
                                                        setIsEditing(true);
                                                        setEditForm({
                                                            name: user.name,
                                                            phone: user.phone,
                                                            zaloName: user.zaloName,
                                                            password: '',  // Empty - only set if admin wants to change
                                                            bankCode: 'VCB',  // Default, should map from user data
                                                            bankAccount: user.bankAccount?.accountNumber || '',
                                                            bankAccountHolder: user.bankAccount?.accountHolder || '',
                                                        });
                                                    }}
                                                    className="w-full py-2 px-4 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 transition mb-4"
                                                >
                                                    ✏️ Chỉnh sửa thông tin
                                                </button>
                                            )}

                                            {/* Form chỉnh sửa */}
                                            {isEditing ? (
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="block text-xs font-medium mb-1" style={{ color: '#6b5c4c' }}>Họ và tên</label>
                                                        <input
                                                            type="text"
                                                            value={editForm.name}
                                                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-200"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium mb-1" style={{ color: '#6b5c4c' }}>Số điện thoại</label>
                                                        <input
                                                            type="tel"
                                                            value={editForm.phone}
                                                            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-200"
                                                        />
                                                        <p className="text-xs text-amber-600 mt-1">⚠️ Đây là cách duy nhất để đổi SĐT cho user</p>
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium mb-1" style={{ color: '#6b5c4c' }}>Zalo</label>
                                                        <input
                                                            type="text"
                                                            value={editForm.zaloName}
                                                            onChange={(e) => setEditForm({ ...editForm, zaloName: e.target.value })}
                                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-200"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium mb-1" style={{ color: '#6b5c4c' }}>🔑 Đặt lại mật khẩu</label>
                                                        <input
                                                            type="password"
                                                            value={editForm.password}
                                                            onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-200"
                                                            placeholder="Để trống nếu không đổi"
                                                        />
                                                        <p className="text-xs text-amber-600 mt-1">⚠️ Nhập mật khẩu mới nếu user quên</p>
                                                    </div>
                                                    <div className="border-t pt-4">
                                                        <p className="text-sm font-medium mb-3" style={{ color: '#6b5c4c' }}>🏦 Thông tin ngân hàng</p>
                                                        <div className="space-y-3">
                                                            <SearchableBankDropdown
                                                                value={editForm.bankCode}
                                                                onChange={(code) => setEditForm({ ...editForm, bankCode: code })}
                                                                placeholder="Chọn ngân hàng..."
                                                            />
                                                            <input
                                                                type="text"
                                                                value={editForm.bankAccount}
                                                                onChange={(e) => setEditForm({ ...editForm, bankAccount: e.target.value })}
                                                                placeholder="Số tài khoản"
                                                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-200"
                                                            />
                                                            <input
                                                                type="text"
                                                                value={editForm.bankAccountHolder}
                                                                onChange={(e) => setEditForm({ ...editForm, bankAccountHolder: e.target.value })}
                                                                placeholder="Chủ tài khoản"
                                                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-200"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2 pt-2">
                                                        <button
                                                            onClick={() => setIsEditing(false)}
                                                            className="flex-1 py-2 border rounded-lg font-medium hover:bg-gray-50"
                                                        >
                                                            Hủy
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                alert('Đã lưu thông tin! (Mock)');
                                                                setIsEditing(false);
                                                            }}
                                                            className="flex-1 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
                                                        >
                                                            💾 Lưu
                                                        </button>
                                                    </div>
                                                    {/* Nút xóa người chơi */}
                                                    <div className="border-t pt-4 mt-4">
                                                        <button
                                                            onClick={() => {
                                                                if (window.confirm(`⚠️ Bạn có chắc muốn XÓA người chơi "${user.name}"?\n\nHành động này KHÔNG THỂ hoàn tác!`)) {
                                                                    alert(`Đã xóa người chơi ${user.name}! (Mock)`);
                                                                    setSelectedUser(null);
                                                                    setIsEditing(false);
                                                                }
                                                            }}
                                                            className="w-full py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition border border-red-300"
                                                        >
                                                            🗑️ Xóa người chơi
                                                        </button>
                                                        <p className="text-xs text-center text-gray-500 mt-2">⚠️ Cẩn thận: Xóa sẽ mất toàn bộ dữ liệu</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    {/* Thông tin tài khoản ngân hàng - Hiển thị đầu tiên */}
                                                    {user.bankAccount && (
                                                        <div className="p-4 rounded-lg mb-4" style={{ backgroundColor: '#f0f9ff', border: '1px solid #bfdbfe' }}>
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <span className="text-lg">💳</span>
                                                                <p className="text-sm font-semibold text-blue-700">Tài khoản ngân hàng</p>
                                                            </div>
                                                            <div className="grid grid-cols-1 gap-2">
                                                                <div className="flex justify-between">
                                                                    <span className="text-xs text-gray-500">Ngân hàng:</span>
                                                                    <span className="text-sm font-medium text-gray-800">{user.bankAccount.bankName}</span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span className="text-xs text-gray-500">Số TK:</span>
                                                                    <span className="text-sm font-bold text-blue-700">{user.bankAccount.accountNumber}</span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span className="text-xs text-gray-500">Chủ TK:</span>
                                                                    <span className="text-sm font-medium text-gray-800">{user.bankAccount.accountHolder}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

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
                                                </>
                                            )}
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>
                    </div>
                </Portal>
            )}
        </AdminPageWrapper>
    );
};

export default AdminUsers;

