import React, { useState, useEffect } from 'react';
import { THAIS, getAnimalName } from '../../types';
import { getAdminOrders, getAdminOrderDetail, AdminOrder, AdminOrderDetail, AdminOrderItem } from '../../services/api';
import AdminPageWrapper, { AdminCard, StatusBadge, AdminButton } from '../../components/AdminPageWrapper';
import Portal from '../../components/Portal';
import Pagination from '../../components/Pagination';

interface OrderDetailModalProps {
  order: AdminOrderDetail;
  items: AdminOrderItem[];
  onClose: () => void;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ order, items, onClose }) => {
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
                <p className="text-xs" style={{ color: '#9a8c7a' }}>#{order.id.slice(0, 8)}</p>
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
                <div className="font-medium" style={{ color: '#3d3428' }}>{order.zalo || order.user_name || 'N/A'}</div>
              </div>
              <div>
                <span className="text-gray-500">Số điện thoại:</span>
                <div className="font-medium text-blue-600">{order.user_phone || 'N/A'}</div>
              </div>
              <div>
                <span className="text-gray-500">Thai:</span>
                <div className="font-medium" style={{ color: '#3d3428' }}>
                  {THAIS.find(t => t.id === order.thai_id)?.name || order.thai_id}
                </div>
              </div>
              <div>
                <span className="text-gray-500">Thời gian mua:</span>
                <div className="font-medium" style={{ color: '#3d3428' }}>
                  {new Date(order.created_at).toLocaleString('vi-VN', {
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
                      order.status === 'won' ? 'success'
                        : order.status === 'paid' ? 'info'
                          : order.status === 'lost' ? 'error'
                            : 'warning'
                    }
                  >
                    {order.status === 'won' ? 'Thắng'
                      : order.status === 'paid' ? 'Đã thanh toán'
                        : order.status === 'lost' ? 'Thua'
                          : 'Chờ thanh toán'}
                  </StatusBadge>
                </div>
              </div>
            </div>

            {/* Thông tin tài khoản */}
            {order.bank_account && (
              <div className="mt-3 p-3 rounded-lg" style={{ backgroundColor: '#f0f9ff' }}>
                <div className="text-xs font-medium text-blue-700 mb-2">💳 Tài khoản ngân hàng</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-500">Ngân hàng:</span>
                    <span className="ml-1 font-medium text-gray-700">{order.bank_code}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">STK:</span>
                    <span className="ml-1 font-medium text-gray-700">{order.bank_account}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500">Chủ TK:</span>
                    <span className="ml-1 font-medium text-gray-700">{order.bank_holder}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Items List - Cart Style */}
          <div className="p-4 max-h-[300px] overflow-y-auto">
            <h4 className="text-sm font-medium mb-3" style={{ color: '#6b5c4c' }}>
              Danh sách con vật ({items.length} con)
            </h4>
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
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
                      {getAnimalName(item.animal_order)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.unit_price.toLocaleString('vi-VN')}đ x {item.quantity}
                    </div>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right">
                    <div className="font-bold" style={{ color: '#991b1b' }}>
                      {item.subtotal.toLocaleString('vi-VN')}đ
                    </div>
                  </div>
                </div>
              ))}
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
  const [selectedOrder, setSelectedOrder] = useState<{ order: AdminOrderDetail; items: AdminOrderItem[] } | null>(null);

  // API states
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Pagination state
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const ITEMS_PER_PAGE = 20;

  // Fetch orders when filters change
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        const filters: { date?: string; thai_id?: string; session_type?: string; status?: string; page?: number; limit?: number } = {
          page,
          limit: ITEMS_PER_PAGE
        };
        if (selectedDate) filters.date = selectedDate;
        if (selectedThai !== 'all') filters.thai_id = selectedThai;
        if (selectedSession !== 'all') filters.session_type = selectedSession;
        // Only show paid/won/lost orders
        // Backend should handle this by default

        const response = await getAdminOrders(filters);
        // Filter to only paid, won, lost orders (completed payments)
        const filteredOrders = (response.orders || []).filter(o =>
          ['paid', 'won', 'lost'].includes(o.status)
        );
        setOrders(filteredOrders);
        setTotal(response.total || 0);
      } catch (err: unknown) {
        console.error('Error fetching orders:', err);
        setError('Không thể tải danh sách đơn hàng');
        setOrders([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [selectedThai, selectedDate, selectedSession, page]);

  // Handle order click - fetch detail
  const handleOrderClick = async (orderId: string) => {
    try {
      setLoadingDetail(true);
      const response = await getAdminOrderDetail(orderId);
      setSelectedOrder({
        order: response.order,
        items: response.items || []
      });
    } catch (err: unknown) {
      console.error('Error fetching order detail:', err);
      alert('Không thể tải chi tiết đơn hàng');
    } finally {
      setLoadingDetail(false);
    }
  };

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
            <div className="overflow-x-auto">
              <div className="flex gap-1 sm:gap-2 p-1 bg-amber-50 rounded-xl min-w-max">
                <button
                  onClick={() => setSelectedThai('all')}
                  className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg font-semibold text-xs sm:text-sm transition-all whitespace-nowrap ${selectedThai === 'all'
                    ? 'bg-white shadow-md text-amber-700'
                    : 'text-amber-600 hover:bg-amber-100'
                    }`}
                >
                  Tất cả
                </button>
                {THAIS.map((thai) => (
                  <button
                    key={thai.id}
                    onClick={() => setSelectedThai(thai.id)}
                    className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg font-semibold text-xs sm:text-sm transition-all whitespace-nowrap ${selectedThai === thai.id
                      ? 'bg-white shadow-md text-amber-700'
                      : 'text-amber-600 hover:bg-amber-100'
                      }`}
                  >
                    {thai.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-end">
            <div
              className="w-full px-4 py-3 rounded-lg flex items-center justify-between"
              style={{ backgroundColor: '#faf8f5' }}
            >
              <span className="text-sm" style={{ color: '#9a8c7a' }}>Kết quả</span>
              <span className="text-lg font-semibold" style={{ color: '#3d3428' }}>
                {loading ? '...' : `${orders.length} đơn`}
              </span>
            </div>
          </div>
        </div>

        {/* Session Filter */}
        <div className="mt-4">
          <label className="block text-xs font-medium mb-2" style={{ color: '#9a8c7a' }}>
            Lọc theo buổi
          </label>
          <div className="flex flex-wrap gap-1 sm:gap-2 p-1 bg-purple-50 rounded-xl">
            <button
              onClick={() => setSelectedSession('all')}
              className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg font-semibold text-xs sm:text-sm transition-all ${selectedSession === 'all'
                ? 'bg-white shadow-md text-purple-700'
                : 'text-purple-600 hover:bg-purple-100'
                }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setSelectedSession('morning')}
              className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg font-semibold text-xs sm:text-sm transition-all ${selectedSession === 'morning'
                ? 'bg-white shadow-md text-purple-700'
                : 'text-purple-600 hover:bg-purple-100'
                }`}
            >
              ☀️ Sáng
            </button>
            <button
              onClick={() => setSelectedSession('afternoon')}
              className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg font-semibold text-xs sm:text-sm transition-all ${selectedSession === 'afternoon'
                ? 'bg-white shadow-md text-purple-700'
                : 'text-purple-600 hover:bg-purple-100'
                }`}
            >
              🌤️ Chiều
            </button>
            {/* Chỉ An Nhơn có buổi tối */}
            {selectedThai === 'thai-an-nhon' && (
              <button
                onClick={() => setSelectedSession('evening')}
                className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg font-semibold text-xs sm:text-sm transition-all ${selectedSession === 'evening'
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

      {/* Error State */}
      {error && (
        <AdminCard>
          <div className="text-center py-8">
            <span className="text-3xl mb-3 block">⚠️</span>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </AdminCard>
      )}

      {/* Orders Table */}
      <AdminCard noPadding>
        {loading ? (
          <div className="text-center py-12">
            <span className="text-3xl mb-3 block animate-spin">⏳</span>
            <p className="text-sm" style={{ color: '#9a8c7a' }}>Đang tải...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: '#faf8f5' }}>
                  <th className="text-left p-3 text-xs font-medium uppercase hidden lg:table-cell" style={{ color: '#9a8c7a' }}>ID</th>
                  <th className="text-left p-3 text-xs font-medium uppercase" style={{ color: '#9a8c7a' }}>Người mua</th>
                  <th className="text-left p-3 text-xs font-medium uppercase hidden md:table-cell" style={{ color: '#9a8c7a' }}>Thai</th>
                  <th className="text-left p-3 text-xs font-medium uppercase hidden sm:table-cell" style={{ color: '#9a8c7a' }}>Ngày</th>
                  <th className="text-right p-3 text-xs font-medium uppercase" style={{ color: '#9a8c7a' }}>Tiền</th>
                  <th className="text-center p-3 text-xs font-medium uppercase" style={{ color: '#9a8c7a' }}>TT</th>
                  <th className="text-center p-3 text-xs font-medium uppercase" style={{ color: '#9a8c7a' }}></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const thai = THAIS.find((t) => t.id === order.thai_id);
                  return (
                    <tr key={order.id} style={{ borderBottom: '1px solid #f0ece6' }}>
                      <td className="p-3 hidden lg:table-cell">
                        <span className="text-xs font-mono" style={{ color: '#9a8c7a' }}>
                          {order.id.slice(0, 8)}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                            style={{ backgroundColor: '#f5f2ed', color: '#6b5c4c' }}
                          >
                            {(order.user_name || 'U').charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <span className="text-sm truncate" style={{ color: '#3d3428' }}>{order.user_name}</span>
                            <div className="text-xs truncate" style={{ color: '#9a8c7a' }}>{order.user_phone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 hidden md:table-cell">
                        <span className="text-sm" style={{ color: '#6b5c4c' }}>{thai?.name || order.thai_id}</span>
                      </td>
                      <td className="p-3 hidden sm:table-cell">
                        <span className="text-sm" style={{ color: '#6b5c4c' }}>
                          {new Date(order.created_at).toLocaleDateString('vi-VN')}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <span className="text-sm font-medium" style={{ color: '#a5673f' }}>
                          {order.total.toLocaleString('vi-VN')}đ
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <StatusBadge
                          status={
                            order.status === 'won' ? 'success'
                              : order.status === 'paid' ? 'info'
                                : order.status === 'lost' ? 'error'
                                  : 'warning'
                          }
                        >
                          {order.status === 'won' ? '✓'
                            : order.status === 'paid' ? 'TT'
                              : order.status === 'lost' ? '✕'
                                : '...'}
                        </StatusBadge>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleOrderClick(order.id)}
                          disabled={loadingDetail}
                          className="p-2 text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
                          style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}
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
        )}

        {!loading && orders.length === 0 && !error && (
          <div className="text-center py-12">
            <span className="text-3xl mb-3 block">📭</span>
            <p className="text-sm" style={{ color: '#9a8c7a' }}>Không có đơn hàng nào</p>
          </div>
        )}

        {/* Pagination */}
        {!loading && orders.length > 0 && (
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


      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder.order}
          items={selectedOrder.items}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </AdminPageWrapper>
  );
};

export default AdminOrders;
