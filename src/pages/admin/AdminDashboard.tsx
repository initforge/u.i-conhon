import React, { useState } from 'react';

const AdminDashboard: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState('this-tet');
  const [selectedDate, setSelectedDate] = useState('');

  // Mock data
  const stats = {
    todayRevenue: 15600000,
    totalOrders: 52,
    todayOrders: 12,
  };

  const topBought = [
    { rank: 1, name: 'Rồng', emoji: '🐉', count: 156, amount: 4680000 },
    { rank: 2, name: 'Hổ', emoji: '🐅', count: 134, amount: 4020000 },
    { rank: 3, name: 'Ngựa', emoji: '🐴', count: 98, amount: 2940000 },
    { rank: 4, name: 'Mèo', emoji: '🐱', count: 87, amount: 2610000 },
    { rank: 5, name: 'Rắn', emoji: '🐍', count: 76, amount: 2280000 },
  ];

  const leastBought = [
    { rank: 1, name: 'Tôm', emoji: '🦐', count: 3, amount: 90000 },
    { rank: 2, name: 'Nhím', emoji: '🦔', count: 5, amount: 150000 },
    { rank: 3, name: 'Bướm', emoji: '🦋', count: 7, amount: 210000 },
    { rank: 4, name: 'Ong', emoji: '🐝', count: 9, amount: 270000 },
    { rank: 5, name: 'Sóc', emoji: '🐿️', count: 11, amount: 330000 },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Tổng quan hệ thống Cổ Nhơn</p>
      </div>

      {/* Time Filter */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
          <button
            onClick={() => { setTimeFilter('this-tet'); setSelectedDate(''); }}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${timeFilter === 'this-tet'
              ? 'bg-white shadow-md text-amber-700'
              : 'text-gray-600 hover:bg-gray-200'
              }`}
          >
            Dịp Tết
          </button>
          <button
            onClick={() => setTimeFilter('by-date')}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${timeFilter === 'by-date'
              ? 'bg-white shadow-md text-amber-700'
              : 'text-gray-600 hover:bg-gray-200'
              }`}
          >
            Theo ngày
          </button>
          <button
            onClick={() => { setTimeFilter('all'); setSelectedDate(''); }}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${timeFilter === 'all'
              ? 'bg-white shadow-md text-amber-700'
              : 'text-gray-600 hover:bg-gray-200'
              }`}
          >
            Tất cả
          </button>
        </div>

        {/* Date Picker - only show when "Theo ngày" is selected */}
        {timeFilter === 'by-date' && (
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-200"
          />
        )}
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
                <div className="text-right">
                  <span className="font-bold text-green-600 block">{animal.count} lượt</span>
                  <span className="text-xs text-gray-500">{animal.amount.toLocaleString('vi-VN')}đ</span>
                </div>
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
                <div className="text-right">
                  <span className="font-bold text-red-600 block">{animal.count} lượt</span>
                  <span className="text-xs text-gray-500">{animal.amount.toLocaleString('vi-VN')}đ</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
