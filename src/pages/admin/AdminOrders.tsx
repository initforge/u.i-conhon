import React, { useState } from 'react';
import { mockOrders, mockUsers, mockThais, mockAnimals } from '../../mock-data/mockData';
import AdminPageWrapper, { AdminCard, StatusBadge, AdminButton } from '../../components/AdminPageWrapper';
import Portal from '../../components/Portal';

interface OrderDetailModalProps {
  order: typeof mockOrders[0];
  onClose: () => void;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ order, onClose }) => {
  const user = mockUsers.find((u) => u.id === order.userId);
  const thai = mockThais.find((t) => t.id === order.thaiId);

  return (
    <Portal>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[95vh] sm:max-h-[90vh] overflow-y-auto my-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200" style={{ backgroundColor: '#faf8f5' }}>
            <div className="flex items-center gap-2">
              <span className="text-xl">🛒</span>
              <div>
                <h3 className="font-bold" style={{ color: '#3d3428' }}>Chi tiết đơn hàng</h3>
                <p className="text-xs" style={{ color: '#9a8c7a' }}>#{order.id}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Order Info */}
          <div className="p-4 border-b border-gray-100" style={{ backgroundColor: '#fefcf9' }}>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-500">Khách hàng:</span>
                <div className="font-medium" style={{ color: '#3d3428' }}>{user?.zaloName || 'N/A'}</div>
              </div>
              <div>
                <span className="text-gray-500">Số điện thoại:</span>
                <div className="font-medium text-blue-600">{user?.phone || 'N/A'}</div>
              </div>
              <div>
                <span className="text-gray-500">Thai:</span>
                <div className="font-medium" style={{ color: '#3d3428' }}>{thai?.name || 'N/A'}</div>
              </div>
              <div>
                <span className="text-gray-500">Thời gian mua:</span>
                <div className="font-medium" style={{ color: '#3d3428' }}>
                  {new Date(order.createdAt).toLocaleString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
              <div>
                <span className="text-gray-500">Trạng thái:</span>
                <div className="mt-0.5">
                  <StatusBadge
                    status={
                      order.status === 'completed' ? 'success'
                        : order.status === 'paid' ? 'info'
                          : 'warning'
                    }
                  >
                    {order.status === 'completed' ? 'Hoàn tất'
                      : order.status === 'paid' ? 'Đã thanh toán'
                        : 'Chờ thanh toán'}
                  </StatusBadge>
                </div>
              </div>
            </div>

            {/* Thông tin tài khoản */}
            {user?.bankAccount && (
              <div className="mt-3 p-3 rounded-lg" style={{ backgroundColor: '#f0f9ff' }}>
                <div className="text-xs font-medium text-blue-700 mb-2">💳 Tài khoản ngân hàng</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-500">Ngân hàng:</span>
                    <span className="ml-1 font-medium text-gray-700">{user.bankAccount.bankName}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">STK:</span>
                    <span className="ml-1 font-medium text-gray-700">{user.bankAccount.accountNumber}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500">Chủ TK:</span>
                    <span className="ml-1 font-medium text-gray-700">{user.bankAccount.accountHolder}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Items List - Cart Style */}
          <div className="p-4 max-h-[300px] overflow-y-auto">
            <h4 className="text-sm font-medium mb-3" style={{ color: '#6b5c4c' }}>
              Danh sách con vật ({order.items.length} con)
            </h4>
            <div className="space-y-3">
              {order.items.map((item) => {
                const animal = mockAnimals.find((a) => a.id === item.animalId);
                return (
                  <div
                    key={item.animalId}
                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-100"
                    style={{ backgroundColor: '#faf8f5' }}
                  >
                    {/* Animal Image/Icon */}
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-xl"
                      style={{ backgroundColor: '#fee2e2' }}
                    >
                      🐾
                    </div>

                    {/* Animal Info */}
                    <div className="flex-1">
                      <div className="font-bold text-sm" style={{ color: '#991b1b' }}>
                        {animal?.name || 'N/A'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {item.price.toLocaleString('vi-VN')}đ x {item.quantity}
                      </div>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right">
                      <div className="font-bold" style={{ color: '#991b1b' }}>
                        {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Total */}
          <div className="p-4 border-t border-gray-200" style={{ backgroundColor: '#faf8f5' }}>
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium" style={{ color: '#6b5c4c' }}>Tổng cộng:</span>
              <span className="text-2xl font-bold" style={{ color: '#991b1b' }}>
                {order.total.toLocaleString('vi-VN')}đ
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="p-4 border-t border-gray-100 flex gap-2">
            <AdminButton variant="secondary" onClick={onClose} className="flex-1">
              Đóng
            </AdminButton>
          </div>
        </div>
      </div>
    </Portal>
  );
};

const AdminOrders: React.FC = () => {
  const [selectedThai, setSelectedThai] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSession, setSelectedSession] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<typeof mockOrders[0] | null>(null);

  // Only show paid and completed orders
  const paidOrders = mockOrders.filter((order) =>
    order.status === 'paid' || order.status === 'completed'
  );

  const filteredOrders = paidOrders.filter((order) => {
    if (selectedThai !== 'all' && order.thaiId !== selectedThai) return false;
    if (selectedDate) {
      const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
      if (orderDate !== selectedDate) return false;
    }
    // Lọc theo buổi
    if (selectedSession !== 'all') {
      const hour = new Date(order.createdAt).getHours();
      if (selectedSession === 'sang' && (hour < 7 || hour >= 12)) return false;
      if (selectedSession === 'chieu' && (hour < 12 || hour >= 18)) return false;
      if (selectedSession === 'toi' && (hour < 18 || hour >= 22)) return false;
    }
    return true;
  });

  return (
    <AdminPageWrapper
      title="Quản lý đơn hàng"
      subtitle="Đơn hàng đã thanh toán"
      icon="📦"
    >
      {/* Filters */}
      <AdminCard>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: '#9a8c7a' }}>
              Lọc theo ngày
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-200"
              style={{ border: '1px solid #e8e4df' }}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: '#9a8c7a' }}>
              Lọc theo Thai
            </label>
            <div className="flex flex-wrap gap-2 p-1 bg-amber-50 rounded-xl">
              <button
                onClick={() => setSelectedThai('all')}
                className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all ${selectedThai === 'all'
                  ? 'bg-white shadow-md text-amber-700'
                  : 'text-amber-600 hover:bg-amber-100'
                  }`}
              >
                Tất cả
              </button>
              {mockThais.map((thai) => (
                <button
                  key={thai.id}
                  onClick={() => setSelectedThai(thai.id)}
                  className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all ${selectedThai === thai.id
                    ? 'bg-white shadow-md text-amber-700'
                    : 'text-amber-600 hover:bg-amber-100'
                    }`}
                >
                  {thai.name}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-end">
            <div
              className="w-full px-4 py-3 rounded-lg flex items-center justify-between"
              style={{ backgroundColor: '#faf8f5' }}
            >
              <span className="text-sm" style={{ color: '#9a8c7a' }}>Kết quả</span>
              <span className="text-lg font-semibold" style={{ color: '#3d3428' }}>
                {filteredOrders.length} đơn
              </span>
            </div>
          </div>
        </div>

        {/* Session Filter */}
        <div className="mt-4">
          <label className="block text-xs font-medium mb-2" style={{ color: '#9a8c7a' }}>
            Lọc theo buổi
          </label>
          <div className="flex flex-wrap gap-2 p-1 bg-purple-50 rounded-xl">
            <button
              onClick={() => setSelectedSession('all')}
              className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all ${selectedSession === 'all'
                ? 'bg-white shadow-md text-purple-700'
                : 'text-purple-600 hover:bg-purple-100'
                }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setSelectedSession('sang')}
              className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all ${selectedSession === 'sang'
                ? 'bg-white shadow-md text-purple-700'
                : 'text-purple-600 hover:bg-purple-100'
                }`}
            >
              ☀️ Sáng
            </button>
            <button
              onClick={() => setSelectedSession('chieu')}
              className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all ${selectedSession === 'chieu'
                ? 'bg-white shadow-md text-purple-700'
                : 'text-purple-600 hover:bg-purple-100'
                }`}
            >
              🌤️ Chiều
            </button>
            {/* Chỉ An Nhơn có buổi tối */}
            {selectedThai === 'thai-an-nhon' && (
              <button
                onClick={() => setSelectedSession('toi')}
                className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all ${selectedSession === 'toi'
                  ? 'bg-white shadow-md text-purple-700'
                  : 'text-purple-600 hover:bg-purple-100'
                  }`}
              >
                🌙 Tối
              </button>
            )}
          </div>
        </div>
      </AdminCard>

      {/* Orders Table */}
      <AdminCard noPadding>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: '#faf8f5' }}>
                <th className="text-left p-4 text-xs font-medium uppercase tracking-wider" style={{ color: '#9a8c7a' }}>ID</th>
                <th className="text-left p-4 text-xs font-medium uppercase tracking-wider" style={{ color: '#9a8c7a' }}>Người mua</th>
                <th className="text-left p-4 text-xs font-medium uppercase tracking-wider" style={{ color: '#9a8c7a' }}>Thai</th>
                <th className="text-left p-4 text-xs font-medium uppercase tracking-wider" style={{ color: '#9a8c7a' }}>Con vật</th>
                <th className="text-right p-4 text-xs font-medium uppercase tracking-wider" style={{ color: '#9a8c7a' }}>Tổng tiền</th>
                <th className="text-center p-4 text-xs font-medium uppercase tracking-wider" style={{ color: '#9a8c7a' }}>Trạng thái</th>
                <th className="text-center p-4 text-xs font-medium uppercase tracking-wider" style={{ color: '#9a8c7a' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const user = mockUsers.find((u) => u.id === order.userId);
                const thai = mockThais.find((t) => t.id === order.thaiId);
                return (
                  <tr key={order.id} style={{ borderBottom: '1px solid #f0ece6' }}>
                    <td className="p-4">
                      <span className="text-xs font-mono" style={{ color: '#9a8c7a' }}>
                        {order.id.slice(0, 8)}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-xs"
                          style={{ backgroundColor: '#f5f2ed', color: '#6b5c4c' }}
                        >
                          {(user?.zaloName || 'U').charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm" style={{ color: '#3d3428' }}>{user?.zaloName}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm" style={{ color: '#6b5c4c' }}>{thai?.name}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {order.items.slice(0, 2).map((item) => {
                          const animal = mockAnimals.find((a) => a.id === item.animalId);
                          const itemTotal = item.price * item.quantity;
                          return (
                            <span
                              key={item.animalId}
                              className="px-2 py-0.5 rounded text-xs"
                              style={{ backgroundColor: '#f5f2ed', color: '#6b5c4c' }}
                            >
                              {animal?.name}: {itemTotal.toLocaleString('vi-VN')}đ
                            </span>
                          );
                        })}
                        {order.items.length > 2 && (
                          <span className="text-xs" style={{ color: '#9a8c7a' }}>+{order.items.length - 2}</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <span className="text-sm font-medium" style={{ color: '#a5673f' }}>
                        {order.total.toLocaleString('vi-VN')} đ
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <StatusBadge
                        status={
                          order.status === 'completed' ? 'success'
                            : order.status === 'paid' ? 'info'
                              : 'warning'
                        }
                      >
                        {order.status === 'completed' ? 'Hoàn tất'
                          : order.status === 'paid' ? 'Đã TT'
                            : 'Chờ TT'}
                      </StatusBadge>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors"
                        style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}
                      >
                        👁️ Chi tiết
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <span className="text-3xl mb-3 block">📭</span>
            <p className="text-sm" style={{ color: '#9a8c7a' }}>Không có đơn hàng nào</p>
          </div>
        )}
      </AdminCard>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </AdminPageWrapper>
  );
};

export default AdminOrders;
