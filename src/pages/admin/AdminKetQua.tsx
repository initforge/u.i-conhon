import React, { useState } from 'react';
import { mockThais, mockKetQuas, mockAnimals } from '../../mock-data/mockData';
import AdminPageWrapper, { AdminCard, AdminButton } from '../../components/AdminPageWrapper';

const AdminKetQua: React.FC = () => {
  const [ketQuas, setKetQuas] = useState(mockKetQuas);
  const [formData, setFormData] = useState({
    thaiId: mockThais[0]?.id || '',
    date: new Date().toISOString().split('T')[0],
    winningAnimalIds: [] as string[],
    imageUrl: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newKetQua = { id: `kq-${Date.now()}`, ...formData };
    setKetQuas([...ketQuas, newKetQua]);
    setFormData({
      thaiId: mockThais[0]?.id || '',
      date: new Date().toISOString().split('T')[0],
      winningAnimalIds: [],
      imageUrl: '',
    });
    alert('Đã thêm kết quả!');
  };

  const toggleAnimal = (animalId: string) => {
    setFormData({
      ...formData,
      winningAnimalIds: formData.winningAnimalIds.includes(animalId)
        ? formData.winningAnimalIds.filter((id) => id !== animalId)
        : [...formData.winningAnimalIds, animalId],
    });
  };

  return (
    <AdminPageWrapper
      title="Quản lý kết quả"
      subtitle="Nhập kết quả xổ và quản lý lịch sử"
      icon="🎯"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminCard title="Tạo kết quả mới" icon="✨">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#6b5c4c' }}>Thai</label>
                <select
                  value={formData.thaiId}
                  onChange={(e) => setFormData({ ...formData, thaiId: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg focus:outline-none"
                  style={{ border: '1px solid #e8e4df' }}
                  required
                >
                  {mockThais.map((thai) => (
                    <option key={thai.id} value={thai.id}>{thai.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#6b5c4c' }}>Ngày</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg focus:outline-none"
                  style={{ border: '1px solid #e8e4df' }}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#6b5c4c' }}>
                Chọn con vật trúng ({formData.winningAnimalIds.length} đã chọn)
              </label>
              <div
                className="max-h-48 overflow-y-auto rounded-lg p-3"
                style={{ backgroundColor: '#faf8f5', border: '1px solid #e8e4df' }}
              >
                <div className="grid grid-cols-4 gap-2">
                  {mockAnimals.map((animal) => {
                    const isSelected = formData.winningAnimalIds.includes(animal.id);
                    return (
                      <button
                        key={animal.id}
                        type="button"
                        onClick={() => toggleAnimal(animal.id)}
                        className="p-2 rounded-lg text-center transition-all"
                        style={{
                          backgroundColor: isSelected ? '#a5673f' : 'white',
                          color: isSelected ? 'white' : '#6b5c4c',
                          border: '1px solid #e8e4df'
                        }}
                      >
                        <div className="text-sm font-medium">{animal.order}</div>
                        <div className="text-xs truncate">{animal.name}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <AdminButton variant="primary" type="submit" className="w-full">
              💾 Lưu kết quả
            </AdminButton>
          </form>
        </AdminCard>

        <AdminCard title="Danh sách kết quả" icon="📋">
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {ketQuas.length === 0 ? (
              <div className="text-center py-8">
                <span className="text-3xl mb-3 block">📭</span>
                <p className="text-sm" style={{ color: '#9a8c7a' }}>Chưa có kết quả nào</p>
              </div>
            ) : (
              ketQuas.map((ketQua) => {
                const thai = mockThais.find((t) => t.id === ketQua.thaiId);
                const winningAnimals = mockAnimals.filter(a => ketQua.winningAnimalIds.includes(a.id));

                return (
                  <div key={ketQua.id} className="p-3 rounded-lg" style={{ backgroundColor: '#faf8f5' }}>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-medium" style={{ color: '#6b5c4c' }}>{thai?.name}</span>
                      <span className="text-xs" style={{ color: '#9a8c7a' }}>
                        {new Date(ketQua.date).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {winningAnimals.map(animal => (
                        <span
                          key={animal.id}
                          className="px-2 py-0.5 rounded text-xs"
                          style={{ backgroundColor: '#ecf5ec', color: '#3d7a3d' }}
                        >
                          🏆 {animal.name}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </AdminCard>
      </div>
    </AdminPageWrapper>
  );
};

export default AdminKetQua;
