import React, { useState, useEffect } from 'react';
import { getAdminUsers, updateAdminUser, deleteAdminUser, AdminUser } from '../../services/api';
import AdminPageWrapper, { AdminCard, StatCard, AdminButton } from '../../components/AdminPageWrapper';
import SearchableBankDropdown from '../../components/SearchableBankDropdown';
import Portal from '../../components/Portal';
import Pagination from '../../components/Pagination';

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

    // API states
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    // Pagination state
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const ITEMS_PER_PAGE = 50;

    // Fetch users on mount and when search changes
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await getAdminUsers({ search: searchTerm || undefined, page, limit: ITEMS_PER_PAGE });
                setUsers(response.users || []);
                setTotal(response.total || 0);
            } catch (err: unknown) {
                console.error('Error fetching users:', err);
                setError('Không thể tải danh sách người dùng');
                setUsers([]);
                setTotal(0);
            } finally {
                setLoading(false);
            }
        };

        // Debounce search
        const timeoutId = setTimeout(fetchUsers, 300);
        return () => clearTimeout(timeoutId);
    }, [searchTerm, page]);

    // Calculate stats from loaded users
    const usersWithOrders = users.filter((u) => u.order_count > 0).length;
    const totalOrderCount = users.reduce((sum, u) => sum + (u.order_count || 0), 0);

    // Handle save user
    const handleSaveUser = async (userId: string) => {
        try {
            setSaving(true);
            await updateAdminUser(userId, {
                name: editForm.name,
                phone: editForm.phone,
                zalo: editForm.zaloName,
                bank_code: editForm.bankCode,
                bank_account: editForm.bankAccount,
                bank_holder: editForm.bankAccountHolder,
            });

            // Refresh users list
            const response = await getAdminUsers({ search: searchTerm || undefined });
            setUsers(response.users || []);

            alert('Đã lưu thông tin thành công!');
            setIsEditing(false);
        } catch (err: unknown) {
            console.error('Error saving user:', err);
            alert('Không thể lưu thông tin. Vui lòng thử lại.');
        } finally {
            setSaving(false);
        }
    };

    // Handle delete user
    const handleDeleteUser = async (userId: string, userName: string) => {
        if (!window.confirm(`⚠️ Bạn có chắc muốn XÓA người chơi "${userName}"?\n\nHành động này KHÔNG THỂ hoàn tác!`)) {
            return;
        }

        try {
            setSaving(true);
            await deleteAdminUser(userId);

            // Refresh users list
            const response = await getAdminUsers({ search: searchTerm || undefined });
            setUsers(response.users || []);

            alert(`Đã xóa người chơi ${userName}!`);
            setSelectedUser(null);
            setIsEditing(false);
        } catch (err: unknown) {
            console.error('Error deleting user:', err);
            alert('Không thể xóa người dùng. Vui lòng thử lại.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <AdminPageWrapper
            title="Quản lý người dùng"
            subtitle="Xem thông tin và hoạt động của người chơi"
            icon="👥"
            actions={<AdminButton variant="secondary">📥 Xuất dữ liệu</AdminButton>}
        >
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                <StatCard label="Tổng người dùng" value={loading ? '...' : users.length} icon="👤" />
                <StatCard label="Đã đặt tịch" value={loading ? '...' : usersWithOrders} icon="🛒" />
                <StatCard label="Tổng đơn hàng" value={loading ? '...' : totalOrderCount} icon="📦" />
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

            {/* Error State */}
            {error && (
                <AdminCard>
                    <div className="text-center py-8">
                        <span className="text-3xl mb-3 block">⚠️</span>
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                </AdminCard>
            )}

            {/* Table */}
            <AdminCard noPadding>
                {loading ? (
                    <div className="text-center py-12">
                        <span className="text-3xl mb-3 block animate-spin">⏳</span>
                        <p className="text-sm" style={{ color: '#9a8c7a' }}>Đang tải...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[500px]">
                            <thead>
                                <tr style={{ backgroundColor: '#faf8f5' }}>
                                    <th className="text-left p-3 text-xs font-medium uppercase" style={{ color: '#9a8c7a' }}>Người chơi</th>
                                    <th className="text-left p-3 text-xs font-medium uppercase hidden sm:table-cell" style={{ color: '#9a8c7a' }}>Zalo</th>
                                    <th className="text-right p-3 text-xs font-medium uppercase" style={{ color: '#9a8c7a' }}>Đơn</th>
                                    <th className="text-center p-3 text-xs font-medium uppercase hidden md:table-cell" style={{ color: '#9a8c7a' }}>Ngày</th>
                                    <th className="text-center p-3 text-xs font-medium uppercase" style={{ color: '#9a8c7a' }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id} style={{ borderBottom: '1px solid #f0ece6' }}>
                                        <td className="p-3">
                                            <div className="flex items-center space-x-2">
                                                <div
                                                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0"
                                                    style={{ backgroundColor: '#f5f2ed', color: '#6b5c4c' }}
                                                >
                                                    {(user.name || user.zalo || 'U').charAt(0).toUpperCase()}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium truncate" style={{ color: '#3d3428' }}>{user.name || 'Chưa đặt tên'}</p>
                                                    <p className="text-xs truncate" style={{ color: '#9a8c7a' }}>📞 {user.phone}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-3 text-sm hidden sm:table-cell" style={{ color: '#6b5c4c' }}>{user.zalo || '-'}</td>
                                        <td className="p-3 text-right">
                                            <span className="text-sm" style={{ color: '#6b5c4c' }}>{user.order_count || 0}</span>
                                        </td>
                                        <td className="p-3 text-center hidden md:table-cell">
                                            <span className="text-xs" style={{ color: '#9a8c7a' }}>
                                                {new Date(user.created_at).toLocaleDateString('vi-VN')}
                                            </span>
                                        </td>
                                        <td className="p-3 text-center">
                                            <button
                                                onClick={() => setSelectedUser(selectedUser === user.id ? null : user.id)}
                                                className="p-2 rounded-lg transition-colors"
                                                style={{ backgroundColor: '#faf8f5' }}
                                            >
                                                👁️
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {!loading && users.length === 0 && !error && (
                    <div className="text-center py-12">
                        <span className="text-3xl mb-3 block">👥</span>
                        <p className="text-sm" style={{ color: '#9a8c7a' }}>Không tìm thấy người dùng nào</p>
                    </div>
                )}

                {/* Pagination */}
                {!loading && users.length > 0 && (
                    <div className="p-4 border-t" style={{ borderColor: '#f0ece6' }}>
                        <Pagination
                            currentPage={page}
                            totalPages={Math.ceil(total / ITEMS_PER_PAGE)}
                            onPageChange={(newPage) => setPage(newPage)}
                            totalItems={total}
                            itemsPerPage={ITEMS_PER_PAGE}
                        />
                    </div>
                )}
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

                                    return (
                                        <div className="space-y-4">
                                            {/* Nút chỉnh sửa */}
                                            {!isEditing && (
                                                <button
                                                    onClick={() => {
                                                        setIsEditing(true);
                                                        setEditForm({
                                                            name: user.name || '',
                                                            phone: user.phone,
                                                            zaloName: user.zalo || '',
                                                            password: '',
                                                            bankCode: user.bank_code || 'VCB',
                                                            bankAccount: user.bank_account || '',
                                                            bankAccountHolder: user.bank_holder || '',
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
                                                            disabled={saving}
                                                            className="flex-1 py-2 border rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50"
                                                        >
                                                            Hủy
                                                        </button>
                                                        <button
                                                            onClick={() => handleSaveUser(user.id)}
                                                            disabled={saving}
                                                            className="flex-1 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50"
                                                        >
                                                            {saving ? '⏳' : '💾'} Lưu
                                                        </button>
                                                    </div>
                                                    {/* Nút xóa người chơi */}
                                                    <div className="border-t pt-4 mt-4">
                                                        <button
                                                            onClick={() => handleDeleteUser(user.id, user.name)}
                                                            disabled={saving}
                                                            className="w-full py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition border border-red-300 disabled:opacity-50"
                                                        >
                                                            🗑️ Xóa người chơi
                                                        </button>
                                                        <p className="text-xs text-center text-gray-500 mt-2">⚠️ Cẩn thận: Xóa sẽ mất toàn bộ dữ liệu</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    {/* Header với tên người chơi */}
                                                    <div className="text-center mb-4">
                                                        <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center text-2xl font-bold mb-2" style={{ backgroundColor: '#991b1b', color: 'white' }}>
                                                            {(user.name || user.zalo || 'U').charAt(0).toUpperCase()}
                                                        </div>
                                                        <h3 className="text-lg font-bold" style={{ color: '#3d3428' }}>{user.name || 'Chưa đặt tên'}</h3>
                                                        <p className="text-sm text-gray-500">Ngày tham gia: {new Date(user.created_at).toLocaleDateString('vi-VN')}</p>
                                                    </div>

                                                    {/* Thông tin liên hệ */}
                                                    <div className="p-4 rounded-lg mb-4" style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <span className="text-lg">📱</span>
                                                            <p className="text-sm font-semibold text-green-700">Thông tin liên hệ</p>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-sm text-gray-600">📞 Số điện thoại:</span>
                                                                <span className="text-sm font-bold text-gray-800">{user.phone}</span>
                                                            </div>
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-sm text-gray-600">💬 Zalo:</span>
                                                                <span className="text-sm font-medium text-gray-800">{user.zalo || 'Chưa cập nhật'}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Thông tin ngân hàng */}
                                                    <div className="p-4 rounded-lg mb-4" style={{ backgroundColor: '#f0f9ff', border: '1px solid #bfdbfe' }}>
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <span className="text-lg">🏦</span>
                                                            <p className="text-sm font-semibold text-blue-700">Thông tin ngân hàng</p>
                                                        </div>
                                                        {user.bank_account ? (
                                                            <div className="space-y-2">
                                                                <div className="flex justify-between items-center">
                                                                    <span className="text-sm text-gray-600">Ngân hàng:</span>
                                                                    <span className="text-sm font-medium text-gray-800">{user.bank_code}</span>
                                                                </div>
                                                                <div className="flex justify-between items-center">
                                                                    <span className="text-sm text-gray-600">Số tài khoản:</span>
                                                                    <span className="text-sm font-bold text-blue-700">{user.bank_account}</span>
                                                                </div>
                                                                <div className="flex justify-between items-center">
                                                                    <span className="text-sm text-gray-600">Chủ tài khoản:</span>
                                                                    <span className="text-sm font-medium text-gray-800">{user.bank_holder || '-'}</span>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <p className="text-sm text-gray-500 italic">Chưa cập nhật thông tin ngân hàng</p>
                                                        )}
                                                    </div>

                                                    {/* Thống kê hoạt động */}
                                                    <div className="grid grid-cols-3 gap-3">
                                                        <div className="p-3 rounded-lg text-center" style={{ backgroundColor: '#faf8f5' }}>
                                                            <p className="text-xl font-bold" style={{ color: '#991b1b' }}>{user.order_count || 0}</p>
                                                            <p className="text-xs" style={{ color: '#9a8c7a' }}>Tổng đơn</p>
                                                        </div>
                                                        <div className="p-3 rounded-lg text-center" style={{ backgroundColor: '#ecf5ec' }}>
                                                            <p className="text-xl font-bold" style={{ color: '#3d7a3d' }}>-</p>
                                                            <p className="text-xs" style={{ color: '#9a8c7a' }}>Đã TT</p>
                                                        </div>
                                                        <div className="p-3 rounded-lg text-center" style={{ backgroundColor: '#fef8ec' }}>
                                                            <p className="text-xl font-bold" style={{ color: '#9a7a2d' }}>-</p>
                                                            <p className="text-xs" style={{ color: '#9a8c7a' }}>Tổng tiền</p>
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
