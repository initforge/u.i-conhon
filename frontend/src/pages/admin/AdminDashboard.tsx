import React, { useState, useEffect } from 'react';
import { ANIMALS_AN_NHON, ANIMALS_HOAI_NHON } from '../../constants/animalData';
import { getAdminStats, AdminStats } from '../../services/api';
import { THAIS } from '../../types';

// Helper để lấy thông tin con vật từ central data
const getAnimalInfo = (order: number, thaiId: string) => {
  const animals = thaiId === 'hoai-nhon' ? ANIMALS_HOAI_NHON : ANIMALS_AN_NHON;
  const animal = animals.find(a => a.order === order);
  return animal ? { name: animal.name, alias: animal.alias } : { name: `Con ${order}`, alias: '' };
};

const AdminDashboard: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedThai, setSelectedThai] = useState('all');
  const [selectedSession, setSelectedSession] = useState('all');

  // API data states
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const thaiId = selectedThai !== 'all' ? selectedThai : undefined;
        const sessionType = selectedSession !== 'all' ? selectedSession : undefined;
        const date = timeFilter === 'by-date' && selectedDate ? selectedDate : undefined;
        const data = await getAdminStats(thaiId, sessionType, date);
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
        setError('Không thể tải dữ liệu thống kê');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [selectedThai, selectedSession, selectedDate]);

  // Format top animals with info from central data
  const formatAnimals = (animals: AdminStats['top_animals']) => {
    return animals.map((a, idx) => ({
      rank: idx + 1,
      order: a.animal_order,
      ...getAnimalInfo(a.animal_order, selectedThai),
      count: Number(a.total_qty) || 0,
      amount: Number(a.total_amount) || 0,
    }));
  };

  const topBought = stats?.top_animals ? formatAnimals(stats.top_animals) : [];
  const leastBought = stats?.bottom_animals ? formatAnimals(stats.bottom_animals) : [];

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
          {THAIS.map((thai) => (
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
            onClick={() => setSelectedSession('morning')}
            className={`px-3 py-1.5 rounded-lg font-semibold text-sm transition-all ${selectedSession === 'morning'
              ? 'bg-white shadow-md text-purple-700'
              : 'text-purple-600 hover:bg-purple-100'
              }`}
          >
            ☀️ Sáng
          </button>
          <button
            onClick={() => setSelectedSession('afternoon')}
            className={`px-3 py-1.5 rounded-lg font-semibold text-sm transition-all ${selectedSession === 'afternoon'
              ? 'bg-white shadow-md text-purple-700'
              : 'text-purple-600 hover:bg-purple-100'
              }`}
          >
            🌤️ Chiều
          </button>
          <button
            onClick={() => setSelectedSession('evening')}
            className={`px-3 py-1.5 rounded-lg font-semibold text-sm transition-all ${selectedSession === 'evening'
              ? 'bg-white shadow-md text-purple-700'
              : 'text-purple-600 hover:bg-purple-100'
              }`}
          >
            🌙 Tối
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center mb-8">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* Stats Cards */}
      {!loading && !error && stats && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Doanh thu hôm nay</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {stats.revenue_today.toLocaleString()}đ
                  </p>
                </div>
                <div className="text-4xl">💰</div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Tổng đơn hàng</p>
                  <p className="text-3xl font-bold text-gray-800">{stats.total_orders}</p>
                </div>
                <div className="text-4xl">📦</div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Đơn hôm nay</p>
                  <p className="text-3xl font-bold text-gray-800">{stats.orders_today}</p>
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
              {topBought.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>Chưa có dữ liệu</p>
                </div>
              ) : (
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
                      <div className="flex-1 min-w-0">
                        <span className="font-medium text-gray-800">{animal.name}</span>
                        {animal.alias && <span className="text-xs text-gray-500 ml-1">"{animal.alias}"</span>}
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="font-bold text-green-600 block">{animal.amount.toLocaleString('vi-VN')}đ</span>
                        <span className="text-xs text-gray-500">{animal.count} lượt</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Top 5 mua ít */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
                <span>❄️</span>
                <span>Top 5 mua ít nhất</span>
              </h2>
              {leastBought.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>Chưa có dữ liệu</p>
                </div>
              ) : (
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
                      <div className="flex-1 min-w-0">
                        <span className="font-medium text-gray-800">{animal.name}</span>
                        {animal.alias && <span className="text-xs text-gray-500 ml-1">"{animal.alias}"</span>}
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="font-bold text-red-600 block">
                          {animal.amount === 0 ? 'Chưa mua' : `${animal.amount.toLocaleString('vi-VN')}đ`}
                        </span>
                        {animal.count > 0 && (
                          <span className="text-xs text-gray-500">{animal.count} lượt</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Empty State when no data and not loading */}
      {!loading && !error && !stats && (
        <div className="bg-gray-50 rounded-xl p-12 text-center">
          <p className="text-gray-500 text-lg">Chưa có dữ liệu thống kê</p>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
