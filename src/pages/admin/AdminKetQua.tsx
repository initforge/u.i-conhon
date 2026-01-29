import React, { useState } from 'react';
import { mockThais, mockKetQuas, mockAnimals } from '../../mock-data/mockData';
import AdminPageWrapper, { AdminCard, AdminButton } from '../../components/AdminPageWrapper';
import { getAvailableYears } from '../../utils/yearUtils';

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

// Nhóm con vật
const animalGroups = [
  { id: 'tu-trang-nguyen', name: 'Tứ trạng nguyên', orders: [1, 2, 3, 4] },
  { id: 'ngu-ho-tuong', name: 'Ngũ hổ tướng', orders: [5, 6, 7, 8, 9] },
  { id: 'that-sinh-ly', name: 'Thất sinh lý', orders: [10, 11, 12, 13, 14, 15, 16] },
  { id: 'nhi-dao-si', name: 'Nhị đạo sĩ', orders: [17, 18] },
  { id: 'tu-my-nu', name: 'Tứ mỹ nữ', orders: [19, 20, 21, 22] },
  { id: 'tu-hao-mang', name: 'Tứ hảo mạng', orders: [23, 24, 25, 26] },
  { id: 'tu-hoa-thuong', name: 'Tứ hòa thượng', orders: [27, 28, 29, 30] },
  { id: 'ngu-khat-thuc', name: 'Ngũ khất thực', orders: [31, 32, 33, 34, 35] },
  { id: 'nhat-ni-co', name: 'Nhất ni cô', orders: [36] },
  { id: 'tu-than-linh', name: 'Tứ thần linh', orders: [37, 38, 39, 40] },
];

const AdminKetQua: React.FC = () => {
  const [selectedThai, setSelectedThai] = useState('an-nhon');
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
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

  // Available years
  const availableYears = getAvailableYears(5);

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

  // Thống kê theo nhóm cho năm được chọn
  const getGroupStatistics = () => {
    if (!selectedYear) return [];

    const yearKetQuas = filteredKetQuas.filter(kq =>
      new Date(kq.date).getFullYear() === selectedYear
    );

    return animalGroups.map(group => {
      let count = 0;
      const animalCounts: Record<number, number> = {};

      yearKetQuas.forEach(kq => {
        kq.winningAnimalIds.forEach(animalId => {
          const animal = mockAnimals.find(a => a.id === animalId);
          if (animal && group.orders.includes(animal.order)) {
            count++;
            animalCounts[animal.order] = (animalCounts[animal.order] || 0) + 1;
          }
        });
      });

      const animalsInGroup = group.orders.map(order => {
        const animal = mockAnimals.find(a => a.order === order);
        return {
          order,
          name: animal?.name || '',
          count: animalCounts[order] || 0
        };
      });

      return {
        ...group,
        totalCount: count,
        animals: animalsInGroup
      };
    }).sort((a, b) => b.totalCount - a.totalCount);
  };

  const groupStats = getGroupStatistics();
  const mostDrawnGroup = groupStats[0];
  const leastDrawnGroup = groupStats[groupStats.length - 1];

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
                <label className="block text-sm font-medium mb-2" style={{ color: '#6b5c4c' }}>Thai (Khung giờ)</label>
                <select
                  value={formData.thaiId}
                  onChange={(e) => setFormData({ ...formData, thaiId: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg focus:outline-none"
                  style={{ border: '1px solid #e8e4df' }}
                  required
                >
                  <optgroup label="Thai An Nhơn">
                    <option value="thai-an-nhon-sang">Thai An Nhơn - Sáng (11:00)</option>
                    <option value="thai-an-nhon-chieu">Thai An Nhơn - Chiều (17:00)</option>
                    <option value="thai-an-nhon-toi">Thai An Nhơn - Tối (21:00)</option>
                  </optgroup>
                  <optgroup label="Thai Nhơn Phong">
                    <option value="thai-nhon-phong-sang">Thai Nhơn Phong - Sáng (11:00)</option>
                    <option value="thai-nhon-phong-chieu">Thai Nhơn Phong - Chiều (17:00)</option>
                    <option value="thai-nhon-phong-toi">Thai Nhơn Phong - Tối (21:00)</option>
                  </optgroup>
                  <optgroup label="Thai Hoài Nhơn">
                    <option value="thai-hoai-nhon-trua">Thai Hoài Nhơn - Trưa (13:00)</option>
                    <option value="thai-hoai-nhon-chieu">Thai Hoài Nhơn - Chiều (19:00)</option>
                  </optgroup>
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

      {/* Year Selector at Bottom */}
      <div className="mt-6 bg-white rounded-xl shadow-md p-6">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span>📅</span>
          <span>Chọn năm để xem thống kê NHÓM</span>
        </h3>
        <div className="flex flex-wrap gap-2 mb-6">
          {availableYears.map(year => (
            <button
              key={year}
              onClick={() => setSelectedYear(selectedYear === year ? null : year)}
              className={`px-6 py-3 rounded-lg font-semibold text-sm transition-all ${selectedYear === year
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              Năm {year}
            </button>
          ))}
        </div>

        {/* Group Statistics */}
        {selectedYear ? (
          <div>
            {/* Summary Cards - Always show both side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Most Drawn Group - Green */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <h4 className="font-bold text-green-800 mb-2">🔥 Nhóm xổ nhiều nhất</h4>
                {mostDrawnGroup ? (
                  <>
                    <p className="text-2xl font-bold text-green-700">{mostDrawnGroup.name}</p>
                    <p className="text-sm text-green-600">{mostDrawnGroup.totalCount} lần xổ</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {mostDrawnGroup.animals.filter(a => a.count > 0).length > 0
                        ? mostDrawnGroup.animals.filter(a => a.count > 0).map(a => (
                          <span key={a.order} className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                            {a.name} ({a.count})
                          </span>
                        ))
                        : <span className="text-xs text-green-600">Chưa có dữ liệu</span>
                      }
                    </div>
                  </>
                ) : (
                  <p className="text-gray-500">Chưa có dữ liệu</p>
                )}
              </div>

              {/* Least Drawn Group - Red */}
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <h4 className="font-bold text-red-800 mb-2">❄️ Nhóm xổ ít nhất</h4>
                {leastDrawnGroup ? (
                  <>
                    <p className="text-2xl font-bold text-red-700">{leastDrawnGroup.name}</p>
                    <p className="text-sm text-red-600">{leastDrawnGroup.totalCount} lần xổ</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {leastDrawnGroup.animals.map(a => (
                        <span key={a.order} className={`px-2 py-1 rounded text-xs ${a.count === 0 ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                          {a.name} ({a.count})
                        </span>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-gray-500">Chưa có dữ liệu</p>
                )}
              </div>
            </div>

            {/* All Groups Table */}
            <h4 className="font-bold text-gray-700 mb-3">📊 Thống kê tất cả nhóm - Năm {selectedYear}</h4>
            <div className="space-y-3">
              {groupStats.map((group, index) => (
                <div
                  key={group.id}
                  className={`p-4 rounded-lg border ${index === 0 && group.totalCount > 0 ? 'bg-green-50 border-green-200' : index === groupStats.length - 1 ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </span>
                      <span className="font-bold text-gray-800">{group.name}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full font-bold text-sm ${group.totalCount > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {group.totalCount} lần
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {group.animals.map(a => (
                      <div
                        key={a.order}
                        className={`px-3 py-1.5 rounded text-xs font-medium ${a.count > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
                      >
                        #{a.order} {a.name}
                        {a.count > 0 && <span className="ml-1 font-bold">({a.count})</span>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <span className="text-4xl mb-2 block">👆</span>
            <p className="text-gray-500">Chọn năm ở trên để xem thống kê theo nhóm</p>
          </div>
        )}
      </div>

      {/* ===== TỔNG KẾT CUỐI MÙA ===== */}
      <div className="mt-8 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-lg p-6 border border-amber-200">
        <h2 className="text-2xl font-bold text-amber-800 mb-6 flex items-center gap-3">
          <span className="text-3xl">📊</span>
          TỔNG KẾT CUỐI MÙA - NĂM {selectedYear || new Date().getFullYear()}
        </h2>

        {/* Chọn năm để tổng kết */}
        {!selectedYear && (
          <div className="text-center py-8 bg-white/50 rounded-xl">
            <span className="text-5xl mb-4 block">👆</span>
            <p className="text-amber-700 font-medium">Chọn năm ở phần trên để xem tổng kết cuối mùa</p>
          </div>
        )}

        {selectedYear && (
          <div className="space-y-6">
            {/* Stats Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {thaiTabs.map((thai) => {
                const thaiKetQuas = ketQuas.filter(kq =>
                  kq.thaiId === thai.thaiId &&
                  new Date(kq.date).getFullYear() === selectedYear
                );
                const uniqueAnimals = new Set(thaiKetQuas.flatMap(kq => kq.winningAnimalIds));
                const totalDraws = thaiKetQuas.length;

                const colorClass = thai.id === 'an-nhon' ? 'green' : thai.id === 'nhon-phong' ? 'yellow' : 'blue';

                return (
                  <div key={thai.id} className={`bg-${colorClass}-50 border border-${colorClass}-200 rounded-xl p-4`}>
                    <h3 className={`font-bold text-${colorClass}-800 mb-3 text-lg`}>🏛️ {thai.name}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tổng số lần xổ:</span>
                        <span className="font-bold">{totalDraws} lần</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Số con unique:</span>
                        <span className="font-bold">{uniqueAnimals.size}/40 con</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Con chưa xổ:</span>
                        <span className="font-bold text-red-600">{40 - uniqueAnimals.size} con</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Detailed Stats by Thai */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              {/* Thai Tabs */}
              <div className="flex border-b">
                {thaiTabs.map((thai) => (
                  <button
                    key={thai.id}
                    onClick={() => setSelectedThai(thai.id)}
                    className={`flex-1 px-4 py-3 font-semibold text-sm transition-all ${selectedThai === thai.id
                      ? thai.id === 'an-nhon' ? 'bg-green-100 text-green-700 border-b-2 border-green-500'
                        : thai.id === 'nhon-phong' ? 'bg-yellow-100 text-yellow-700 border-b-2 border-yellow-500'
                          : 'bg-blue-100 text-blue-700 border-b-2 border-blue-500'
                      : 'text-gray-500 hover:bg-gray-50'
                      }`}
                  >
                    {thai.name}
                  </button>
                ))}
              </div>

              <div className="p-4 space-y-6">
                {(() => {
                  const currentThai = thaiTabs.find(t => t.id === selectedThai);
                  const thaiKetQuas = ketQuas.filter(kq =>
                    kq.thaiId === currentThai?.thaiId &&
                    new Date(kq.date).getFullYear() === selectedYear
                  );

                  // Đếm số lần xổ của từng con
                  const animalCounts: Record<string, number> = {};
                  thaiKetQuas.forEach(kq => {
                    kq.winningAnimalIds.forEach(id => {
                      animalCounts[id] = (animalCounts[id] || 0) + 1;
                    });
                  });

                  // Top 5 con vật
                  const sortedAnimals = Object.entries(animalCounts)
                    .map(([id, count]) => ({ animal: mockAnimals.find(a => a.id === id), count }))
                    .filter(a => a.animal)
                    .sort((a, b) => b.count - a.count);
                  const top5 = sortedAnimals.slice(0, 5);

                  // Con không xổ
                  const drawnIds = new Set(Object.keys(animalCounts));
                  const notDrawn = mockAnimals.filter(a => !drawnIds.has(a.id));

                  // Thống kê nhóm
                  const groupCounts = animalGroups.map(group => {
                    let count = 0;
                    thaiKetQuas.forEach(kq => {
                      kq.winningAnimalIds.forEach(id => {
                        const animal = mockAnimals.find(a => a.id === id);
                        if (animal && group.orders.includes(animal.order)) count++;
                      });
                    });
                    return { ...group, count };
                  }).sort((a, b) => b.count - a.count);

                  const top2Groups = groupCounts.slice(0, 2);
                  const noDrawGroups = groupCounts.filter(g => g.count === 0);

                  // Thống kê vị trí
                  const positionCounts: Record<string, number> = {};
                  thaiKetQuas.forEach(kq => {
                    kq.winningAnimalIds.forEach(id => {
                      const animal = mockAnimals.find(a => a.id === id);
                      if (animal) {
                        const bodyInfo = bodyPartMapping[animal.order];
                        if (bodyInfo) {
                          positionCounts[bodyInfo.bodyPart] = (positionCounts[bodyInfo.bodyPart] || 0) + 1;
                        }
                      }
                    });
                  });
                  const sortedPositions = Object.entries(positionCounts)
                    .sort((a, b) => b[1] - a[1]);
                  const top5Positions = sortedPositions.slice(0, 5);

                  // Vị trí không xổ
                  const allPositions = new Set(Object.values(bodyPartMapping).map(b => b.bodyPart));
                  const drawnPositions = new Set(Object.keys(positionCounts));
                  const noDrawPositions = [...allPositions].filter(p => !drawnPositions.has(p));

                  // Kiểm tra con Trùn (order = 5)
                  const trunId = mockAnimals.find(a => a.order === 5)?.id;
                  const trunDraws = thaiKetQuas.filter(kq => trunId && kq.winningAnimalIds.includes(trunId));

                  // Mock thống kê thắng/thua
                  const mockProfitLoss = {
                    sang: { revenue: 5000000, payout: 3200000 },
                    chieu: { revenue: 4500000, payout: 2800000 },
                    toi: selectedThai === 'an-nhon' ? { revenue: 3000000, payout: 1500000 } : null,
                    trua: selectedThai === 'hoai-nhon' ? { revenue: 2000000, payout: 1200000 } : null,
                  };

                  return (
                    <>
                      {/* Top 5 con vật */}
                      <div>
                        <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                          <span>🏆</span> Top 5 con vật xổ nhiều nhất
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {top5.length > 0 ? top5.map((item, i) => (
                            <div key={item.animal?.id} className="px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium flex items-center gap-2">
                              <span className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center font-bold text-xs">
                                {i + 1}
                              </span>
                              <span>#{item.animal?.order} {item.animal?.name}</span>
                              <span className="font-bold">({item.count} lần)</span>
                            </div>
                          )) : <span className="text-gray-500">Chưa có dữ liệu</span>}
                        </div>
                      </div>

                      {/* Con không xổ */}
                      <div>
                        <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                          <span>❌</span> Con vật chưa xổ ({notDrawn.length} con)
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {notDrawn.length > 0 ? notDrawn.map(animal => (
                            <span key={animal.id} className="px-2 py-1 bg-red-50 text-red-600 rounded text-xs">
                              #{animal.order} {animal.name}
                            </span>
                          )) : <span className="text-green-600 font-medium">✅ Tất cả con đều đã xổ!</span>}
                        </div>
                      </div>

                      {/* Top 2 nhóm */}
                      <div>
                        <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                          <span>🔥</span> Top 2 nhóm xổ nhiều nhất
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {top2Groups.map((group, i) => (
                            <div key={group.id} className={`px-4 py-2 rounded-lg text-sm font-medium ${i === 0 ? 'bg-amber-100 text-amber-800' : 'bg-orange-100 text-orange-700'}`}>
                              <span className="font-bold">#{i + 1}</span> {group.name} ({group.count} lần)
                            </div>
                          ))}
                        </div>
                        {noDrawGroups.length > 0 && (
                          <p className="mt-2 text-sm text-gray-500">
                            ❄️ Nhóm chưa xổ: {noDrawGroups.map(g => g.name).join(', ')}
                          </p>
                        )}
                      </div>

                      {/* Top 5 vị trí */}
                      <div>
                        <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                          <span>📍</span> Top 5 vị trí xổ nhiều nhất
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {top5Positions.length > 0 ? top5Positions.map(([pos, count], i) => (
                            <div key={pos} className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium">
                              #{i + 1} {pos.charAt(0).toUpperCase() + pos.slice(1)} ({count} lần)
                            </div>
                          )) : <span className="text-gray-500">Chưa có dữ liệu</span>}
                        </div>
                        {noDrawPositions.length > 0 && (
                          <p className="mt-2 text-sm text-gray-500">
                            ❄️ Vị trí chưa xổ: {noDrawPositions.join(', ')}
                          </p>
                        )}
                      </div>

                      {/* Quy luật đặc biệt */}
                      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200">
                        <h4 className="font-bold text-indigo-800 mb-3 flex items-center gap-2">
                          <span>🔗</span> Quy luật xổ đặc biệt
                        </h4>
                        <div className="space-y-2 text-sm">
                          {/* Con Trùn */}
                          {(selectedThai === 'an-nhon' || selectedThai === 'nhon-phong') && (
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 bg-indigo-200 rounded-full flex items-center justify-center">🐛</span>
                              <span>Con Trùn (số 5):</span>
                              {trunDraws.length > 0 ? (
                                <span className="text-green-600 font-medium">
                                  ✅ Đã xổ {trunDraws.length} lần
                                </span>
                              ) : (
                                <span className="text-red-600 font-medium">❌ Chưa xổ</span>
                              )}
                            </div>
                          )}

                          {/* Quy luật tối An Nhơn */}
                          {selectedThai === 'an-nhon' && (
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 bg-indigo-200 rounded-full flex items-center justify-center">🌙</span>
                              <span>Buổi tối:</span>
                              <span className="text-indigo-600">
                                Kiểm tra trùng/thế thân với sáng-chiều...
                              </span>
                            </div>
                          )}

                          {/* Quy luật liên tiếp */}
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 bg-indigo-200 rounded-full flex items-center justify-center">🔄</span>
                            <span>Nhóm xổ liên tiếp:</span>
                            <span className="text-indigo-600">
                              Tứ trạng nguyên (3 lần), Ngũ hổ tướng (2 lần)...
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Báo cáo Thắng/Thua */}
                      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-200">
                        <h4 className="font-bold text-emerald-800 mb-3 flex items-center gap-2">
                          <span>💰</span> Báo cáo Thắng/Thua theo buổi
                        </h4>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-emerald-200">
                                <th className="text-left py-2 px-3">Buổi</th>
                                <th className="text-right py-2 px-3">Doanh thu</th>
                                <th className="text-right py-2 px-3">Trả thưởng</th>
                                <th className="text-right py-2 px-3">Lãi/Lỗ</th>
                              </tr>
                            </thead>
                            <tbody>
                              {mockProfitLoss.sang && (
                                <tr className="border-b border-emerald-100">
                                  <td className="py-2 px-3 font-medium">Sáng (11:00)</td>
                                  <td className="py-2 px-3 text-right">{mockProfitLoss.sang.revenue.toLocaleString()}đ</td>
                                  <td className="py-2 px-3 text-right text-red-600">{mockProfitLoss.sang.payout.toLocaleString()}đ</td>
                                  <td className={`py-2 px-3 text-right font-bold ${mockProfitLoss.sang.revenue - mockProfitLoss.sang.payout > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {mockProfitLoss.sang.revenue - mockProfitLoss.sang.payout > 0 ? '+' : ''}{(mockProfitLoss.sang.revenue - mockProfitLoss.sang.payout).toLocaleString()}đ
                                  </td>
                                </tr>
                              )}
                              {mockProfitLoss.trua && (
                                <tr className="border-b border-emerald-100">
                                  <td className="py-2 px-3 font-medium">Trưa (13:00)</td>
                                  <td className="py-2 px-3 text-right">{mockProfitLoss.trua.revenue.toLocaleString()}đ</td>
                                  <td className="py-2 px-3 text-right text-red-600">{mockProfitLoss.trua.payout.toLocaleString()}đ</td>
                                  <td className={`py-2 px-3 text-right font-bold ${mockProfitLoss.trua.revenue - mockProfitLoss.trua.payout > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {mockProfitLoss.trua.revenue - mockProfitLoss.trua.payout > 0 ? '+' : ''}{(mockProfitLoss.trua.revenue - mockProfitLoss.trua.payout).toLocaleString()}đ
                                  </td>
                                </tr>
                              )}
                              {mockProfitLoss.chieu && (
                                <tr className="border-b border-emerald-100">
                                  <td className="py-2 px-3 font-medium">Chiều ({selectedThai === 'hoai-nhon' ? '19:00' : '17:00'})</td>
                                  <td className="py-2 px-3 text-right">{mockProfitLoss.chieu.revenue.toLocaleString()}đ</td>
                                  <td className="py-2 px-3 text-right text-red-600">{mockProfitLoss.chieu.payout.toLocaleString()}đ</td>
                                  <td className={`py-2 px-3 text-right font-bold ${mockProfitLoss.chieu.revenue - mockProfitLoss.chieu.payout > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {mockProfitLoss.chieu.revenue - mockProfitLoss.chieu.payout > 0 ? '+' : ''}{(mockProfitLoss.chieu.revenue - mockProfitLoss.chieu.payout).toLocaleString()}đ
                                  </td>
                                </tr>
                              )}
                              {mockProfitLoss.toi && (
                                <tr className="border-b border-emerald-100">
                                  <td className="py-2 px-3 font-medium">Tối (21:00)</td>
                                  <td className="py-2 px-3 text-right">{mockProfitLoss.toi.revenue.toLocaleString()}đ</td>
                                  <td className="py-2 px-3 text-right text-red-600">{mockProfitLoss.toi.payout.toLocaleString()}đ</td>
                                  <td className={`py-2 px-3 text-right font-bold ${mockProfitLoss.toi.revenue - mockProfitLoss.toi.payout > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {mockProfitLoss.toi.revenue - mockProfitLoss.toi.payout > 0 ? '+' : ''}{(mockProfitLoss.toi.revenue - mockProfitLoss.toi.payout).toLocaleString()}đ
                                  </td>
                                </tr>
                              )}
                            </tbody>
                            <tfoot>
                              <tr className="bg-emerald-100 font-bold">
                                <td className="py-2 px-3">TỔNG CỘNG</td>
                                <td className="py-2 px-3 text-right">
                                  {((mockProfitLoss.sang?.revenue || 0) + (mockProfitLoss.chieu?.revenue || 0) + (mockProfitLoss.toi?.revenue || 0) + (mockProfitLoss.trua?.revenue || 0)).toLocaleString()}đ
                                </td>
                                <td className="py-2 px-3 text-right text-red-600">
                                  {((mockProfitLoss.sang?.payout || 0) + (mockProfitLoss.chieu?.payout || 0) + (mockProfitLoss.toi?.payout || 0) + (mockProfitLoss.trua?.payout || 0)).toLocaleString()}đ
                                </td>
                                <td className="py-2 px-3 text-right text-green-700">
                                  +{(
                                    ((mockProfitLoss.sang?.revenue || 0) - (mockProfitLoss.sang?.payout || 0)) +
                                    ((mockProfitLoss.chieu?.revenue || 0) - (mockProfitLoss.chieu?.payout || 0)) +
                                    ((mockProfitLoss.toi?.revenue || 0) - (mockProfitLoss.toi?.payout || 0)) +
                                    ((mockProfitLoss.trua?.revenue || 0) - (mockProfitLoss.trua?.payout || 0))
                                  ).toLocaleString()}đ
                                </td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>

                        {/* Ghi chú thế thân */}
                        {selectedThai !== 'hoai-nhon' && (
                          <p className="mt-3 text-xs text-emerald-600 bg-emerald-100 rounded px-3 py-2">
                            ℹ️ <strong>Lưu ý:</strong> Trả thưởng đã bao gồm con xổ + con thế thân (trừ Hoài Nhơn chỉ tính con xổ)
                          </p>
                        )}
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminPageWrapper>
  );
};

export default AdminKetQua;
