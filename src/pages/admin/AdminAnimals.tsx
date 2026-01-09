import React, { useState } from 'react';
import { mockAnimals } from '../../mock-data/mockData';
import AdminPageWrapper, { AdminButton } from '../../components/AdminPageWrapper';

const AdminAnimals: React.FC = () => {
  const [animals, setAnimals] = useState(mockAnimals);
  const [selectedThai, setSelectedThai] = useState('an-nhon');
  const [bannedCount, setBannedCount] = useState(
    animals.filter((a) => a.isBanned).length
  );

  const thaiOptions = [
    { id: 'an-nhon', name: 'Thai An Nhơn', color: 'green' },
    { id: 'nhon-phong', name: 'Thai Nhơn Phong', color: 'yellow' },
    { id: 'hoai-nhon', name: 'Thai Hoài Nhơn', color: 'blue' },
  ];

  const updateAnimal = (id: string, updates: Partial<typeof animals[0]>) => {
    setAnimals((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
    );
  };

  const toggleBan = (id: string, reason?: string) => {
    const animal = animals.find((a) => a.id === id);
    if (!animal) return;

    if (animal.isBanned) {
      updateAnimal(id, { isBanned: false, banReason: undefined });
      setBannedCount((prev) => prev - 1);
    } else {
      updateAnimal(id, { isBanned: true, banReason: reason || 'Không có lý do' });
      setBannedCount((prev) => prev + 1);
    }
  };

  return (
    <AdminPageWrapper
      title="Quản lý con vật"
      subtitle="Cấu hình giá, hạn mức và trạng thái 40 con"
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
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-2 text-center">
          Đang quản lý: <strong>{thaiOptions.find(t => t.id === selectedThai)?.name}</strong>
        </p>
      </div>
      {/* Stats */}
      <div
        className="flex items-center justify-between p-4 rounded-xl"
        style={{ backgroundColor: '#faf8f5', border: '1px solid #e8e4df' }}
      >
        <div className="flex items-center space-x-3">
          <span className="text-xl">⛔</span>
          <div>
            <p className="text-sm" style={{ color: '#6b5c4c' }}>Con vật đã cấm</p>
            <p className="text-lg font-semibold" style={{ color: '#3d3428' }}>{bannedCount}/2</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-xl">🐾</span>
          <div>
            <p className="text-sm" style={{ color: '#6b5c4c' }}>Tổng con vật</p>
            <p className="text-lg font-semibold" style={{ color: '#3d3428' }}>{animals.length}</p>
          </div>
        </div>
      </div>

      {/* Animal Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {animals.map((animal) => (
          <div
            key={animal.id}
            className={`rounded-xl p-4 transition-all ${animal.isBanned ? 'opacity-60' : ''}`}
            style={{
              backgroundColor: 'white',
              border: animal.isBanned ? '1px solid #f0c0c0' : '1px solid #e8e4df'
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
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

            {/* Fields */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs mb-1" style={{ color: '#9a8c7a' }}>Giá (VNĐ)</label>
                <input
                  type="number"
                  value={animal.price}
                  onChange={(e) => updateAnimal(animal.id, { price: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-200"
                  style={{ border: '1px solid #e8e4df' }}
                />
              </div>

              <div>
                <label className="block text-xs mb-1" style={{ color: '#9a8c7a' }}>Hạn mức còn lại</label>
                <input
                  type="number"
                  value={animal.remainingLimit}
                  onChange={(e) => updateAnimal(animal.id, { remainingLimit: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-200"
                  style={{ border: '1px solid #e8e4df' }}
                />
              </div>

              {/* Ban */}
              <div
                className="flex items-center justify-between p-2 rounded-lg"
                style={{ backgroundColor: '#faf8f5' }}
              >
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={animal.isBanned}
                    onChange={(e) => {
                      if (e.target.checked) {
                        const reason = prompt('Nhập lý do cấm:');
                        if (reason) toggleBan(animal.id, reason);
                      } else {
                        toggleBan(animal.id);
                      }
                    }}
                    className="w-4 h-4 rounded"
                    style={{ accentColor: '#b8856c' }}
                  />
                  <span className="text-xs" style={{ color: '#6b5c4c' }}>Cấm con này</span>
                </label>
              </div>

              {animal.banReason && (
                <p className="text-xs italic" style={{ color: '#b8856c' }}>
                  Lý do: {animal.banReason}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </AdminPageWrapper>
  );
};

export default AdminAnimals;
