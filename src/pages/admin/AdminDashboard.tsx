import React, { useState } from 'react';
import { ANIMALS_AN_NHON } from '../../constants/animalData';

const mockThais = [
  { id: 'thai-an-nhon', name: 'Thai An Nhơn' },
  { id: 'thai-nhon-phong', name: 'Thai Nhơn Phong' },
  { id: 'thai-hoai-nhon', name: 'Thai Hoài Nhơn' },
];

// Helper để lấy thông tin con vật từ central data
const getAnimalInfo = (name: string) => {
  const animal = ANIMALS_AN_NHON.find(a => a.name === name);
  return animal ? { order: animal.order, alias: animal.alias } : { order: 0, alias: '' };
};

const AdminDashboard: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedThai, setSelectedThai] = useState('all');
  const [selectedSession, setSelectedSession] = useState('all'); // Sáng/Chiều/Tối

  // Mock data - varies by thai and session
  const getStats = () => {
    let multiplier = selectedThai === 'thai-1' ? 0.4 : selectedThai === 'thai-2' ? 0.3 : selectedThai === 'thai-3' ? 0.3 : 1;
    // Session multiplier
    if (selectedSession === 'sang') multiplier *= 0.35;
    else if (selectedSession === 'chieu') multiplier *= 0.45;
    else if (selectedSession === 'toi') multiplier *= 0.2;

    return {
      todayRevenue: Math.round(15600000 * multiplier),
      totalOrders: Math.round(52 * multiplier),
      todayOrders: Math.round(12 * multiplier),
    };
  };
  const stats = getStats();

  // Mock data sử dụng tên con vật từ central data
  const topBought = [
    { rank: 1, name: 'Rồng Bay', ...getAnimalInfo('Rồng Bay'), count: 156, amount: 4680000 },
    { rank: 2, name: 'Cọp', ...getAnimalInfo('Cọp'), count: 134, amount: 4020000 },
    { rank: 3, name: 'Ngựa', ...getAnimalInfo('Ngựa'), count: 98, amount: 2940000 },
    { rank: 4, name: 'Mèo', ...getAnimalInfo('Mèo'), count: 87, amount: 2610000 },
    { rank: 5, name: 'Rắn', ...getAnimalInfo('Rắn'), count: 76, amount: 2280000 },
  ];

  const leastBought = [
    { rank: 1, name: 'Tôm', ...getAnimalInfo('Tôm'), count: 3, amount: 90000 },
    { rank: 2, name: 'Hòn Núi', ...getAnimalInfo('Hòn Núi'), count: 5, amount: 150000 },
    { rank: 3, name: 'Bướm', ...getAnimalInfo('Bướm'), count: 7, amount: 210000 },
    { rank: 4, name: 'Ong', ...getAnimalInfo('Ong'), count: 9, amount: 270000 },
    { rank: 5, name: 'Bà Vãi', ...getAnimalInfo('Bà Vãi'), count: 11, amount: 330000 },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Tổng quan</h1>
        <p className="text-gray-600">Tổng quan hệ thống Cổ Nhơn</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        {/* Time Filter */}
        <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
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

        {/* Date Picker */}
        {timeFilter === 'by-date' && (
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-200"
          />
        )}

        {/* Thai Filter */}
        <div className="flex gap-2 p-1 bg-amber-50 rounded-xl">
          <button
            onClick={() => setSelectedThai('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold text-sm transition-all ${selectedThai === 'all'
              ? 'bg-white shadow-md text-amber-700'
              : 'text-amber-600 hover:bg-amber-100'
              }`}
          >
            Tất cả Thai
          </button>
          {mockThais.map((thai) => (
            <button
              key={thai.id}
              onClick={() => setSelectedThai(thai.id)}
              className={`px-3 py-1.5 rounded-lg font-semibold text-sm transition-all ${selectedThai === thai.id
                ? 'bg-white shadow-md text-amber-700'
                : 'text-amber-600 hover:bg-amber-100'
                }`}
            >
              {thai.name}
            </button>
          ))}
        </div>

        {/* Session Filter */}
        <div className="flex gap-2 p-1 bg-purple-50 rounded-xl">
          <button
            onClick={() => setSelectedSession('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold text-sm transition-all ${selectedSession === 'all'
              ? 'bg-white shadow-md text-purple-700'
              : 'text-purple-600 hover:bg-purple-100'
              }`}
          >
            Tất cả buổi
          </button>
          <button
            onClick={() => setSelectedSession('sang')}
            className={`px-3 py-1.5 rounded-lg font-semibold text-sm transition-all ${selectedSession === 'sang'
              ? 'bg-white shadow-md text-purple-700'
              : 'text-purple-600 hover:bg-purple-100'
              }`}
          >
            ☀️ Sáng
          </button>
          <button
            onClick={() => setSelectedSession('chieu')}
            className={`px-3 py-1.5 rounded-lg font-semibold text-sm transition-all ${selectedSession === 'chieu'
              ? 'bg-white shadow-md text-purple-700'
              : 'text-purple-600 hover:bg-purple-100'
              }`}
          >
            🌤️ Chiều
          </button>
          <button
            onClick={() => setSelectedSession('toi')}
            className={`px-3 py-1.5 rounded-lg font-semibold text-sm transition-all ${selectedSession === 'toi'
              ? 'bg-white shadow-md text-purple-700'
              : 'text-purple-600 hover:bg-purple-100'
              }`}
          >
            🌙 Tối
          </button>
        </div>
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
                <img
                  src={`/assets/conhon/${String(animal.order).padStart(2, '0')}.jpg`}
                  alt={animal.name}
                  className="w-10 h-10 rounded-lg object-cover"
                />
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
                <img
                  src={`/assets/conhon/${String(animal.order).padStart(2, '0')}.jpg`}
                  alt={animal.name}
                  className="w-10 h-10 rounded-lg object-cover"
                />
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
