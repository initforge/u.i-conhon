import React, { useState } from 'react';
import { mockThais, mockKetQuas, mockAnimals } from '../../mock-data/mockData';
import AdminPageWrapper, { AdminCard, AdminButton } from '../../components/AdminPageWrapper';

// Mapping bộ phận cơ thể cho An Nhơn / Nhơn Phong (theo đồ hình nhơn)
const bodyPartMapping: Record<number, { bodyPart: string; column: string }> = {
  // BÊN TRÁI
  39: { bodyPart: 'thượng', column: 'BÊN TRÁI' },
  26: { bodyPart: 'lỗ tai', column: 'BÊN TRÁI' },
  34: { bodyPart: 'bả vai', column: 'BÊN TRÁI' },
  23: { bodyPart: 'đầu vai', column: 'BÊN TRÁI' },
  33: { bodyPart: 'chổ tay', column: 'BÊN TRÁI' },
  17: { bodyPart: 'cùi tay', column: 'BÊN TRÁI' },
  32: { bodyPart: 'nách', column: 'BÊN TRÁI' },
  21: { bodyPart: 'vú', column: 'BÊN TRÁI' },
  11: { bodyPart: 'hông', column: 'BÊN TRÁI' },
  18: { bodyPart: 'đùi', column: 'BÊN TRÁI' },
  1: { bodyPart: 'vế đùi', column: 'BÊN TRÁI' },
  16: { bodyPart: 'đầu gối', column: 'BÊN TRÁI' },
  24: { bodyPart: 'bụng chân', column: 'BÊN TRÁI' },
  15: { bodyPart: 'bàn chân', column: 'BÊN TRÁI' },
  40: { bodyPart: 'hạ', column: 'BÊN TRÁI' },
  // Ở GIỮA
  5: { bodyPart: 'đầu', column: 'Ở GIỮA' },
  12: { bodyPart: 'trán', column: 'Ở GIỮA' },
  14: { bodyPart: 'miệng', column: 'Ở GIỮA' },
  28: { bodyPart: 'cổ họng', column: 'Ở GIỮA' },
  6: { bodyPart: 'tim', column: 'Ở GIỮA' },
  7: { bodyPart: 'bụng', column: 'Ở GIỮA' },
  8: { bodyPart: 'rún', column: 'Ở GIỮA' },
  35: { bodyPart: 'hậu môn', column: 'Ở GIỮA' },
  31: { bodyPart: 'sinh dục', column: 'Ở GIỮA' },
  // BÊN PHẢI
  37: { bodyPart: 'thượng', column: 'BÊN PHẢI' },
  19: { bodyPart: 'lỗ tai', column: 'BÊN PHẢI' },
  36: { bodyPart: 'bả vai', column: 'BÊN PHẢI' },
  3: { bodyPart: 'đầu vai', column: 'BÊN PHẢI' },
  2: { bodyPart: 'chổ tay', column: 'BÊN PHẢI' },
  10: { bodyPart: 'cùi tay', column: 'BÊN PHẢI' },
  27: { bodyPart: 'nách', column: 'BÊN PHẢI' },
  4: { bodyPart: 'vú', column: 'BÊN PHẢI' },
  13: { bodyPart: 'hông', column: 'BÊN PHẢI' },
  25: { bodyPart: 'đùi', column: 'BÊN PHẢI' },
  9: { bodyPart: 'vế đùi', column: 'BÊN PHẢI' },
  20: { bodyPart: 'đầu gối', column: 'BÊN PHẢI' },
  22: { bodyPart: 'bụng chân', column: 'BÊN PHẢI' },
  29: { bodyPart: 'bàn chân', column: 'BÊN PHẢI' },
  38: { bodyPart: 'hạ', column: 'BÊN PHẢI' },
  30: { bodyPart: 'lá cờ', column: 'BÊN PHẢI' },
};

const AdminKetQua: React.FC = () => {
  const [selectedThai, setSelectedThai] = useState('an-nhon');
  const [ketQuas, setKetQuas] = useState(mockKetQuas);
  const [formData, setFormData] = useState({
    thaiId: mockThais[0]?.id || '',
    date: new Date().toISOString().split('T')[0],
    winningAnimalIds: [] as string[],
    imageUrl: '',
  });

  const thaiTabs = [
    { id: 'an-nhon', name: 'An Nhơn', thaiId: 'thai-an-nhon' },
    { id: 'nhon-phong', name: 'Nhơn Phong', thaiId: 'thai-nhon-phong' },
    { id: 'hoai-nhon', name: 'Hoài Nhơn', thaiId: 'thai-hoai-nhon' },
  ];

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

  // Lọc kết quả theo thai đang chọn
  const currentThaiId = thaiTabs.find(t => t.id === selectedThai)?.thaiId;
  const filteredKetQuas = ketQuas.filter(kq => kq.thaiId === currentThaiId);

  // Nhóm kết quả theo năm
  const groupByYear = () => {
    const grouped: Record<string, typeof filteredKetQuas> = {};
    filteredKetQuas.forEach(kq => {
      const year = new Date(kq.date).getFullYear().toString();
      if (!grouped[year]) grouped[year] = [];
      grouped[year].push(kq);
    });
    // Sort years descending
    return Object.entries(grouped).sort((a, b) => parseInt(b[0]) - parseInt(a[0]));
  };

  // Nhóm kết quả theo ngày trong năm
  const groupByDate = (yearKetQuas: typeof filteredKetQuas) => {
    const grouped: Record<string, typeof filteredKetQuas> = {};
    yearKetQuas.forEach(kq => {
      const dateStr = kq.date;
      if (!grouped[dateStr]) grouped[dateStr] = [];
      grouped[dateStr].push(kq);
    });
    // Sort dates descending
    return Object.entries(grouped).sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime());
  };

  // Lấy thông tin bộ phận cho con vật
  const getAnimalWithBodyPart = (animalId: string) => {
    const animal = mockAnimals.find(a => a.id === animalId);
    if (!animal) return null;
    const bodyInfo = bodyPartMapping[animal.order];
    return {
      ...animal,
      bodyPart: bodyInfo?.bodyPart || '',
      column: bodyInfo?.column || '',
    };
  };

  const yearGroups = groupByYear();

  return (
    <AdminPageWrapper
      title="Quản lý kết quả"
      subtitle="Nhập kết quả xổ và quản lý lịch sử"
      icon="🎯"
    >
      {/* Thai Tabs */}
      <div className="mb-6">
        <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
          {thaiTabs.map((thai) => (
            <button
              key={thai.id}
              onClick={() => setSelectedThai(thai.id)}
              className={`flex-1 px-4 py-3 rounded-lg font-semibold text-sm transition-all ${selectedThai === thai.id
                ? 'bg-white shadow-md text-amber-700'
                : 'text-gray-600 hover:bg-gray-200'
                }`}
            >
              {thai.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tạo kết quả mới */}
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
                    const bodyInfo = bodyPartMapping[animal.order];
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
                        title={bodyInfo ? `${bodyInfo.column} - ${bodyInfo.bodyPart}` : ''}
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

        {/* Lịch sử kết quả theo hierarchy */}
        <AdminCard title={`Lịch sử kết quả - ${thaiTabs.find(t => t.id === selectedThai)?.name}`} icon="📋">
          <div className="space-y-4 max-h-[500px] overflow-y-auto">
            {yearGroups.length === 0 ? (
              <div className="text-center py-8">
                <span className="text-3xl mb-3 block">📭</span>
                <p className="text-sm" style={{ color: '#9a8c7a' }}>Chưa có kết quả nào</p>
              </div>
            ) : (
              yearGroups.map(([year, yearKetQuas]) => (
                <div key={year} className="border border-gray-200 rounded-lg overflow-hidden">
                  {/* Year Header */}
                  <div className="px-4 py-2 font-bold flex items-center gap-2" style={{ backgroundColor: '#fef3c7', color: '#92400e' }}>
                    <span>📅</span>
                    <span>Năm {year}</span>
                    <span className="text-xs font-normal ml-auto">({yearKetQuas.length} kết quả)</span>
                  </div>

                  {/* Dates */}
                  <div className="divide-y divide-gray-100">
                    {groupByDate(yearKetQuas).map(([date, dateKetQuas]) => (
                      <div key={date} className="px-4 py-3">
                        {/* Date Header */}
                        <div className="text-sm font-medium mb-2" style={{ color: '#6b5c4c' }}>
                          📆 {new Date(date).toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}
                        </div>

                        {/* Results for this date */}
                        {dateKetQuas.map((kq) => {
                          const thai = mockThais.find(t => t.id === kq.thaiId);
                          return (
                            <div key={kq.id} className="ml-4 p-2 rounded-lg mb-2" style={{ backgroundColor: '#faf8f5' }}>
                              <div className="text-xs font-medium mb-2" style={{ color: '#9a8c7a' }}>
                                🏛️ {thai?.name}
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {kq.winningAnimalIds.map(animalId => {
                                  const animalInfo = getAnimalWithBodyPart(animalId);
                                  if (!animalInfo) return null;
                                  return (
                                    <div
                                      key={animalId}
                                      className="px-2 py-1 rounded text-xs"
                                      style={{ backgroundColor: '#ecf5ec', color: '#3d7a3d' }}
                                    >
                                      <span className="font-bold">🏆 {animalInfo.name}</span>
                                      {animalInfo.bodyPart && (
                                        <span className="ml-1 opacity-75">({animalInfo.bodyPart})</span>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </AdminCard>
      </div>
    </AdminPageWrapper>
  );
};

export default AdminKetQua;
