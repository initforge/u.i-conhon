import React from 'react';

const AdminDashboard: React.FC = () => {
  // Mock data
  const stats = {
    todayRevenue: 15600000,
    totalOrders: 52,
    todayOrders: 12,
  };

  const topBought = [
    { rank: 1, name: 'Rồng', emoji: '🐉', count: 156 },
    { rank: 2, name: 'Hổ', emoji: '🐅', count: 134 },
    { rank: 3, name: 'Ngựa', emoji: '🐴', count: 98 },
    { rank: 4, name: 'Mèo', emoji: '🐱', count: 87 },
    { rank: 5, name: 'Rắn', emoji: '🐍', count: 76 },
  ];

  const leastBought = [
    { rank: 1, name: 'Tôm', emoji: '🦐', count: 3 },
    { rank: 2, name: 'Nhím', emoji: '🦔', count: 5 },
    { rank: 3, name: 'Bướm', emoji: '🦋', count: 7 },
    { rank: 4, name: 'Ong', emoji: '🐝', count: 9 },
    { rank: 5, name: 'Sóc', emoji: '🐿️', count: 11 },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Tổng quan hệ thống Cổ Nhơn</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Doanh thu hôm nay</p>
              <p className="text-3xl font-bold text-gray-800">
                {stats.todayRevenue.toLocaleString()}đ
              </p>
            </div>
            <div className="text-4xl">💰</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Tổng đơn hàng</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalOrders}</p>
            </div>
            <div className="text-4xl">📦</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Đơn hôm nay</p>
              <p className="text-3xl font-bold text-gray-800">{stats.todayOrders}</p>
            </div>
            <div className="text-4xl">📋</div>
          </div>
        </div>
      </div>

      {/* Top Animals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top 5 mua nhiều */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
            <span>🔥</span>
            <span>Top 5 mua nhiều nhất</span>
          </h2>
          <div className="space-y-3">
            {topBought.map((animal) => (
              <div
                key={animal.rank}
                className="flex items-center space-x-4 p-3 bg-green-50 rounded-lg"
              >
                <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${animal.rank === 1 ? 'bg-yellow-500' :
                    animal.rank === 2 ? 'bg-gray-400' :
                      animal.rank === 3 ? 'bg-orange-400' : 'bg-gray-300'
                  }`}>
                  {animal.rank}
                </span>
                <span className="text-2xl">{animal.emoji}</span>
                <span className="flex-1 font-medium text-gray-800">{animal.name}</span>
                <span className="font-bold text-green-600">{animal.count} lượt</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top 5 mua ít */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
            <span>❄️</span>
            <span>Top 5 mua ít nhất</span>
          </h2>
          <div className="space-y-3">
            {leastBought.map((animal) => (
              <div
                key={animal.rank}
                className="flex items-center space-x-4 p-3 bg-red-50 rounded-lg"
              >
                <span className="w-8 h-8 rounded-full flex items-center justify-center font-bold bg-red-200 text-red-700">
                  {animal.rank}
                </span>
                <span className="text-2xl">{animal.emoji}</span>
                <span className="flex-1 font-medium text-gray-800">{animal.name}</span>
                <span className="font-bold text-red-600">{animal.count} lượt</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
