import React, { useState } from 'react';
import { mockOrders, mockUsers, mockThais, mockAnimals } from '../../mock-data/mockData';
import AdminPageWrapper, { AdminCard, AdminTabBar, StatusBadge } from '../../components/AdminPageWrapper';

const AdminOrders: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [selectedThai, setSelectedThai] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>('');

  const filteredOrders = mockOrders.filter((order) => {
    if (activeTab !== 'all' && order.status !== activeTab) return false;
    if (selectedThai !== 'all' && order.thaiId !== selectedThai) return false;
    if (selectedDate) {
      const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
      if (orderDate !== selectedDate) return false;
    }
    return true;
  });

  const tabs = [
    { id: 'all', label: 'Tất cả', count: mockOrders.length },
    { id: 'pending', label: 'Chờ thanh toán', count: mockOrders.filter(o => o.status === 'pending').length },
    { id: 'paid', label: 'Đã thanh toán', count: mockOrders.filter(o => o.status === 'paid').length },
    { id: 'completed', label: 'Hoàn tất', count: mockOrders.filter(o => o.status === 'completed').length },
  ];

  return (
    <AdminPageWrapper
      title="Quản lý đơn hàng"
      subtitle="Theo dõi và quản lý tất cả tịch của người chơi"
      icon="📦"
    >
      {/* Filters */}
      <AdminCard>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <select
              value={selectedThai}
              onChange={(e) => setSelectedThai(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-200"
              style={{ border: '1px solid #e8e4df' }}
            >
              <option value="all">Tất cả</option>
              {mockThais.map((thai) => (
                <option key={thai.id} value={thai.id}>{thai.name}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2 flex items-end">
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
      </AdminCard>

      {/* Tabs */}
      <AdminTabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Orders Table */}
      <AdminCard noPadding>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: '#faf8f5' }}>
                <th className="text-left p-4 text-xs font-medium uppercase tracking-wider" style={{ color: '#9a8c7a' }}>ID</th>
                <th className="text-left p-4 text-xs font-medium uppercase tracking-wider" style={{ color: '#9a8c7a' }}>Người mua</th>
                <th className="text-left p-4 text-xs font-medium uppercase tracking-wider" style={{ color: '#9a8c7a' }}>Thai</th>
                <th className="text-left p-4 text-xs font-medium uppercase tracking-wider" style={{ color: '#9a8c7a' }}>Sản phẩm</th>
                <th className="text-right p-4 text-xs font-medium uppercase tracking-wider" style={{ color: '#9a8c7a' }}>Tổng tiền</th>
                <th className="text-center p-4 text-xs font-medium uppercase tracking-wider" style={{ color: '#9a8c7a' }}>Trạng thái</th>
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
                          return (
                            <span
                              key={item.animalId}
                              className="px-2 py-0.5 rounded text-xs"
                              style={{ backgroundColor: '#f5f2ed', color: '#6b5c4c' }}
                            >
                              {animal?.name}
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
    </AdminPageWrapper>
  );
};

export default AdminOrders;
