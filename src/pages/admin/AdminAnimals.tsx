import React, { useState } from 'react';
import { mockAnimals } from '../../mock-data/mockData';
import AdminPageWrapper, { AdminButton } from '../../components/AdminPageWrapper';

// Data cho Hoài Nhơn (36 con)
const animalsHoaiNhon36 = [
  { id: 'hn-1', order: 1, name: 'Cá Trắng', alias: 'Chiếm Khôi', isEnabled: true, isBanned: false, purchaseLimit: 100000, purchased: 25000 },
  { id: 'hn-2', order: 2, name: 'Ốc', alias: 'Bản Quế', isEnabled: true, isBanned: false, purchaseLimit: 100000, purchased: 45000 },
  { id: 'hn-3', order: 3, name: 'Ngỗng', alias: 'Vinh Sanh', isEnabled: true, isBanned: false, purchaseLimit: 100000, purchased: 0 },
  { id: 'hn-4', order: 4, name: 'Công', alias: 'Phùng Xuân', isEnabled: true, isBanned: false, purchaseLimit: 100000, purchased: 12000 },
  { id: 'hn-5', order: 5, name: 'Trùn', alias: 'Chí Cao', isEnabled: true, isBanned: false, purchaseLimit: 100000, purchased: 0 },
  { id: 'hn-6', order: 6, name: 'Cọp', alias: 'Khôn Sơn', isEnabled: true, isBanned: false, purchaseLimit: 100000, purchased: 78000 },
  { id: 'hn-7', order: 7, name: 'Heo', alias: 'Chánh Thuận', isEnabled: true, isBanned: false, purchaseLimit: 100000, purchased: 0 },
  { id: 'hn-8', order: 8, name: 'Thỏ', alias: 'Nguyệt Bửu', isEnabled: true, isBanned: false, purchaseLimit: 100000, purchased: 33000 },
  { id: 'hn-9', order: 9, name: 'Trâu', alias: 'Hớn Vân', isEnabled: true, isBanned: false, purchaseLimit: 100000, purchased: 0 },
  { id: 'hn-10', order: 10, name: 'Rồng Bay', alias: 'Giang Tứ', isEnabled: true, isBanned: false, purchaseLimit: 100000, purchased: 50000 },
  { id: 'hn-11', order: 11, name: 'Chó', alias: 'Phước Tôn', isEnabled: true, isBanned: false, purchaseLimit: 100000, purchased: 0 },
  { id: 'hn-12', order: 12, name: 'Ngựa', alias: 'Quang Minh', isEnabled: true, isBanned: false, purchaseLimit: 100000, purchased: 22000 },
  { id: 'hn-13', order: 13, name: 'Voi', alias: 'Hữu Tài', isEnabled: true, isBanned: false, purchaseLimit: 100000, purchased: 0 },
  { id: 'hn-14', order: 14, name: 'Mèo', alias: 'Chỉ Đắc', isEnabled: true, isBanned: false, purchaseLimit: 100000, purchased: 88000 },
  { id: 'hn-15', order: 15, name: 'Chuột', alias: 'Tất Khắc', isEnabled: true, isBanned: false, purchaseLimit: 100000, purchased: 0 },
  { id: 'hn-16', order: 16, name: 'Ong', alias: 'Mậu Lâm', isEnabled: true, isBanned: false, purchaseLimit: 100000, purchased: 15000 },
  { id: 'hn-17', order: 17, name: 'Hạc', alias: 'Trọng Tiên', isEnabled: true, isBanned: false, purchaseLimit: 100000, purchased: 0 },
  { id: 'hn-18', order: 18, name: 'Kỳ Lân', alias: 'Thiên Thần', isEnabled: true, isBanned: false, purchaseLimit: 100000, purchased: 62000 },
  { id: 'hn-19', order: 19, name: 'Bướm', alias: 'Cấn Ngọc', isEnabled: true, isBanned: false, purchaseLimit: 100000, purchased: 0 },
  { id: 'hn-20', order: 20, name: 'Hòn Núi', alias: 'Trân Châu', isEnabled: true, isBanned: false, purchaseLimit: 100000, purchased: 41000 },
  { id: 'hn-21', order: 21, name: 'Én', alias: 'Thượng Chiêu', isEnabled: true, isBanned: false, purchaseLimit: 100000, purchased: 0 },
  { id: 'hn-22', order: 22, name: 'Bồ Câu', alias: 'Song Đồng', isEnabled: true, isBanned: false, purchaseLimit: 100000, purchased: 19000 },
  { id: 'hn-23', order: 23, name: 'Khỉ', alias: 'Tam Hoè', isEnabled: true, isBanned: false, purchaseLimit: 100000, purchased: 0 },
  { id: 'hn-24', order: 24, name: 'Ếch', alias: 'Hiệp Hải', isEnabled: true, isBanned: false, purchaseLimit: 100000, purchased: 55000 },
  { id: 'hn-25', order: 25, name: 'Quạ', alias: 'Cửu Quan', isEnabled: true, isBanned: false, purchaseLimit: 100000, purchased: 0 },
  { id: 'hn-26', order: 26, name: 'Rồng Nằm', alias: 'Thái Bình', isEnabled: true, isBanned: false, purchaseLimit: 100000, purchased: 30000 },
  { id: 'hn-27', order: 27, name: 'Rùa', alias: 'Hỏa Diệm', isEnabled: true, isBanned: false, purchaseLimit: 100000, purchased: 0 },
  { id: 'hn-28', order: 28, name: 'Gà', alias: 'Nhựt Thăng', isEnabled: true, isBanned: false, purchaseLimit: 100000, purchased: 47000 },
  { id: 'hn-29', order: 29, name: 'Lươn', alias: 'Địa Lương', isEnabled: true, isBanned: false, purchaseLimit: 100000, purchased: 0 },
  { id: 'hn-30', order: 30, name: 'Cá Đỏ', alias: 'Tỉnh Lợi', isEnabled: true, isBanned: false, purchaseLimit: 100000, purchased: 28000 },
  { id: 'hn-31', order: 31, name: 'Tôm', alias: 'Trường Thọ', isEnabled: true, isBanned: false, purchaseLimit: 100000, purchased: 0 },
  { id: 'hn-32', order: 32, name: 'Rắn', alias: 'Vạn Kim', isEnabled: true, isBanned: false, purchaseLimit: 100000, purchased: 66000 },
  { id: 'hn-33', order: 33, name: 'Nhện', alias: 'Thanh Tiền', isEnabled: true, isBanned: false, purchaseLimit: 100000, purchased: 0 },
  { id: 'hn-34', order: 34, name: 'Nai', alias: 'Nguyên Kiết', isEnabled: true, isBanned: false, purchaseLimit: 100000, purchased: 35000 },
  { id: 'hn-35', order: 35, name: 'Dê', alias: 'Nhứt Phẩm', isEnabled: true, isBanned: false, purchaseLimit: 100000, purchased: 0 },
  { id: 'hn-36', order: 36, name: 'Bà Vải', alias: 'An Sỹ', isEnabled: true, isBanned: false, purchaseLimit: 100000, purchased: 72000 },
];

// Tạo data cho An Nhơn / Nhơn Phong (40 con) với purchased và limit
const createAnNhonAnimals = () => mockAnimals.map(a => ({
  ...a,
  purchaseLimit: 100000,
  purchased: Math.floor(Math.random() * 80000)
}));

// Common animal type
type AnimalWithPurchase = ReturnType<typeof createAnNhonAnimals>[0];

const AdminAnimals: React.FC = () => {
  const [selectedThai, setSelectedThai] = useState('an-nhon');

  // Animals state for each Thai
  const [animalsAnNhon, setAnimalsAnNhon] = useState(createAnNhonAnimals());
  const [animalsNhonPhong, setAnimalsNhonPhong] = useState(createAnNhonAnimals());
  const [animalsHoaiNhon, setAnimalsHoaiNhon] = useState(
    animalsHoaiNhon36.map(a => ({ ...a, banReason: undefined as string | undefined }))
  );

  const thaiOptions = [
    { id: 'an-nhon', name: 'Thai An Nhơn', color: 'green', animals: 40 },
    { id: 'nhon-phong', name: 'Thai Nhơn Phong', color: 'yellow', animals: 40 },
    { id: 'hoai-nhon', name: 'Thai Hoài Nhơn', color: 'blue', animals: 36 },
  ];

  // Get current animals based on selected Thai
  const getCurrentAnimals = () => {
    switch (selectedThai) {
      case 'an-nhon': return animalsAnNhon;
      case 'nhon-phong': return animalsNhonPhong;
      case 'hoai-nhon': return animalsHoaiNhon;
      default: return animalsAnNhon;
    }
  };

  // Set animals based on selected Thai
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setCurrentAnimals = (updatedAnimals: any[]) => {
    switch (selectedThai) {
      case 'an-nhon': setAnimalsAnNhon(updatedAnimals as AnimalWithPurchase[]); break;
      case 'nhon-phong': setAnimalsNhonPhong(updatedAnimals as AnimalWithPurchase[]); break;
      case 'hoai-nhon': setAnimalsHoaiNhon(updatedAnimals); break;
    }
  };

  const animals = getCurrentAnimals();
  const bannedCount = animals.filter((a) => a.isBanned).length;

  const updateAnimal = (id: string, updates: Partial<typeof animals[0]>) => {
    const updatedAnimals = animals.map((a) => (a.id === id ? { ...a, ...updates } : a));
    setCurrentAnimals(updatedAnimals);
  };

  const toggleBan = (id: string, reason?: string) => {
    const animal = animals.find((a) => a.id === id);
    if (!animal) return;

    if (animal.isBanned) {
      updateAnimal(id, { isBanned: false, banReason: undefined });
    } else {
      updateAnimal(id, { isBanned: true, banReason: reason || 'Không có lý do' });
    }
  };

  return (
    <AdminPageWrapper
      title="Quản lý con vật"
      subtitle={`Cấu hình hạn mức và trạng thái - ${thaiOptions.find(t => t.id === selectedThai)?.animals} con`}
      icon="🐾"
      actions={
        <AdminButton variant="primary">
          💾 Lưu thay đổi
        </AdminButton>
      }
    >
      {/* Thai Tabs */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 p-1 bg-gray-100 rounded-xl">
          {thaiOptions.map((thai) => (
            <button
              key={thai.id}
              onClick={() => setSelectedThai(thai.id)}
              className={`flex-1 min-w-[120px] px-4 py-3 rounded-lg font-semibold text-sm transition-all ${selectedThai === thai.id
                ? 'bg-white shadow-md text-amber-700'
                : 'text-gray-600 hover:bg-gray-200'
                }`}
            >
              <span className={`w-2 h-2 rounded-full inline-block mr-2 ${thai.color === 'green' ? 'bg-green-500' :
                thai.color === 'yellow' ? 'bg-yellow-500' : 'bg-blue-500'
                }`}></span>
              {thai.name}
              <span className="ml-1 text-xs text-gray-400">({thai.animals} con)</span>
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div
        className="flex items-center justify-between p-4 rounded-xl mb-6"
        style={{ backgroundColor: '#faf8f5', border: '1px solid #e8e4df' }}
      >
        <div className="flex items-center space-x-3">
          <span className="text-xl">⛔</span>
          <div>
            <p className="text-sm" style={{ color: '#6b5c4c' }}>Con vật đang cấm</p>
            <p className="text-lg font-semibold" style={{ color: '#3d3428' }}>
              {bannedCount} con
              <span className="text-xs text-gray-500 ml-2">(không giới hạn)</span>
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-xl">🐾</span>
          <div>
            <p className="text-sm" style={{ color: '#6b5c4c' }}>Tổng con vật</p>
            <p className="text-lg font-semibold" style={{ color: '#3d3428' }}>{animals.length}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-xl">✅</span>
          <div>
            <p className="text-sm" style={{ color: '#6b5c4c' }}>Đang hoạt động</p>
            <p className="text-lg font-semibold" style={{ color: '#3d3428' }}>
              {animals.filter(a => !a.isBanned && a.isEnabled).length}
            </p>
          </div>
        </div>
      </div>

      {/* Animal Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {animals.map((animal) => {
          const remaining = animal.purchaseLimit - animal.purchased;
          const isLimitReached = remaining <= 0;
          const progressPercent = Math.min((animal.purchased / animal.purchaseLimit) * 100, 100);

          return (
            <div
              key={animal.id}
              className={`rounded-xl p-4 transition-all ${animal.isBanned ? 'opacity-60 ring-2 ring-red-300' : ''}`}
              style={{
                backgroundColor: animal.isBanned ? '#fef2f2' : 'white',
                border: animal.isBanned ? '1px solid #f0c0c0' : '1px solid #e8e4df'
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-medium"
                    style={{ backgroundColor: '#f5f2ed', color: '#6b5c4c' }}
                  >
                    {animal.order}
                  </span>
                  <h3 className="text-sm font-medium" style={{ color: '#3d3428' }}>
                    {animal.name}
                  </h3>
                </div>

                {/* Toggle */}
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={animal.isEnabled}
                    onChange={(e) => updateAnimal(animal.id, { isEnabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div
                    className="w-9 h-5 rounded-full transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"
                    style={{ backgroundColor: animal.isEnabled ? '#a5673f' : '#d1ccc4' }}
                  />
                </label>
              </div>

              {/* Hạn mức từng con */}
              <div className="space-y-2 mb-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Hạn mức:</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={animal.purchaseLimit}
                      onChange={(e) => updateAnimal(animal.id, { purchaseLimit: Number(e.target.value) })}
                      className="w-20 px-2 py-1 text-right text-xs border border-gray-200 rounded"
                      step="10000"
                    />
                    <span className="text-gray-500">đ</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-blue-600">Đã mua:</span>
                  <span className="font-bold text-blue-700">{animal.purchased.toLocaleString('vi-VN')}đ</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className={isLimitReached ? 'text-red-600' : 'text-green-600'}>Còn lại:</span>
                  <span className={`font-bold ${isLimitReached ? 'text-red-700' : 'text-green-700'}`}>
                    {isLimitReached ? 'HẾT HẠN MỨC!' : `${remaining.toLocaleString('vi-VN')}đ`}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${progressPercent >= 100 ? 'bg-red-500' : progressPercent >= 80 ? 'bg-orange-500' : 'bg-green-500'}`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                {/* Quick buttons */}
                <div className="flex gap-1">
                  <button
                    onClick={() => updateAnimal(animal.id, { purchaseLimit: animal.purchaseLimit + 50000 })}
                    className="flex-1 px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                  >
                    +50k
                  </button>
                  <button
                    onClick={() => updateAnimal(animal.id, { purchaseLimit: animal.purchaseLimit + 100000 })}
                    className="flex-1 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    +100k
                  </button>
                </div>
              </div>

              {/* Ban button */}
              <button
                onClick={() => {
                  if (animal.isBanned) {
                    toggleBan(animal.id);
                  } else {
                    const reason = prompt('Nhập lý do cấm con này:');
                    if (reason !== null) {
                      toggleBan(animal.id, reason || 'Không có lý do');
                    }
                  }
                }}
                className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${animal.isBanned
                  ? 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-300'
                  : 'bg-red-100 text-red-700 hover:bg-red-200 border border-red-300'
                  }`}
              >
                {animal.isBanned ? '✅ Bỏ cấm' : '🚫 Cấm con này'}
              </button>

              {animal.isBanned && animal.banReason && (
                <p className="text-xs italic text-red-600 bg-red-50 p-2 rounded mt-2">
                  🚫 Lý do: {animal.banReason}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </AdminPageWrapper>
  );
};

export default AdminAnimals;
