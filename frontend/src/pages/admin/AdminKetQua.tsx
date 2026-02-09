import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { THAIS, KetQua, getAnimalsByThai } from '../../types';
import { useThaiConfig } from '../../contexts/ThaiConfigContext';
import AdminPageWrapper, { AdminCard, AdminButton } from '../../components/AdminPageWrapper';
import { getAvailableYears } from '../../utils/yearUtils';
import { ProfitLossData, getResultsHistory, deleteSessionResult, LotteryResult, submitLotteryResult, getAdminYearlyProfitLoss, setLunarDate, getAdminDaySlots, DaySlot } from '../../services/api';

// Mapping bộ phận cá thể cho An Nhơn / Nhơn Phong (theo đồ hình nhơn)
const bodyPartMapping: Record<number, { bodyPart: string; column: string }> = {
  // BÊN TRÁI
  39: { bodyPart: 'thượng', column: 'BÊN TRÁI' },
  26: { bodyPart: 'lỗ tai', column: 'BÊN TRÁI' },
  34: { bodyPart: 'bả vai', column: 'BÊN TRÁI' },
  23: { bodyPart: 'đầu vai', column: 'BÊN TRÁI' },
  33: { bodyPart: 'chỏ tay', column: 'BÊN TRÁI' },
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
  2: { bodyPart: 'chỏ tay', column: 'BÊN PHẢI' },
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
  const [ketQuas, setKetQuas] = useState<(KetQua | LotteryResult)[]>([]);
  const [loadingResults, setLoadingResults] = useState(false);
  const [editingKetQua, setEditingKetQua] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    thaiId: THAIS[0]?.id || '',
    date: (() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; })(),
    lunarLabel: '',
    winningAnimalIds: [] as string[],
    imageUrl: '',
    isOff: false,
  });
  const [savingResult, setSavingResult] = useState(false);

  // Day-slots state (new UX)
  const [daySlots, setDaySlots] = useState<DaySlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlotType, setSelectedSlotType] = useState<string | null>(null);

  // Get Thai configs from context (dynamic from database)
  const { thais, loading: thaiLoading } = useThaiConfig();

  const thaiTabs = [
    { id: 'an-nhon', name: 'An Nhơn', thaiId: 'thai-an-nhon' },
    { id: 'nhon-phong', name: 'Nhơn Phong', thaiId: 'thai-nhon-phong' },
    { id: 'hoai-nhon', name: 'Hoài Nhơn', thaiId: 'thai-hoai-nhon' },
  ];

  // Get current Thai's timeSlots from context (now dynamic!)
  const currentThaiConfig = useMemo(() => {
    return thais.find(t => t.id === `thai-${selectedThai}`) ?? thais[0];
  }, [selectedThai, thais]);

  const availableYears = getAvailableYears(5);

  const [yearlyProfitLoss, setYearlyProfitLoss] = useState<{
    sang?: ProfitLossData;
    trua?: ProfitLossData;
    chieu?: ProfitLossData;
    toi?: ProfitLossData;
  }>({});
  const [loadingYearlyPL, setLoadingYearlyPL] = useState(false);

  // Fetch yearly P&L when year or thai changes
  useEffect(() => {
    if (!selectedYear) {
      setYearlyProfitLoss({});
      return;
    }
    const fetchYearlyPL = async () => {
      try {
        setLoadingYearlyPL(true);
        const res = await getAdminYearlyProfitLoss(selectedThai, selectedYear);
        setYearlyProfitLoss(res.profitLoss);
      } catch (error) {
        console.error('Failed to fetch yearly profit/loss:', error);
        setYearlyProfitLoss({});
      } finally {
        setLoadingYearlyPL(false);
      }
    };
    fetchYearlyPL();
  }, [selectedThai, selectedYear]);

  // Fetch results history from database
  const fetchResultsHistory = useCallback(async () => {
    try {
      setLoadingResults(true);
      const thaiId = thaiTabs.find(t => t.id === selectedThai)?.thaiId || 'thai-an-nhon';
      const res = await getResultsHistory({ thai_id: thaiId, limit: 200 });
      // Convert LotteryResult to KetQua-like format
      const formatted = res.results.map(r => ({
        id: r.id,
        thaiId: r.thai_id,
        date: r.session_date?.split('T')[0] || r.session_date,
        winningAnimalIds: r.winning_animal ? [r.winning_animal.toString()] : [],
        lunarLabel: r.lunar_label,
        isOff: !r.winning_animal,
        sessionType: r.session_type,
      }));
      setKetQuas(formatted as any);
    } catch (error) {
      console.error('Failed to fetch results history:', error);
    } finally {
      setLoadingResults(false);
    }
  }, [selectedThai]);

  useEffect(() => {
    fetchResultsHistory();
  }, [fetchResultsHistory]);

  // Fetch day slots when Thai or date changes
  const fetchDaySlots = useCallback(async () => {
    try {
      setLoadingSlots(true);
      const thaiId = thaiTabs.find(t => t.id === selectedThai)?.thaiId || 'thai-an-nhon';
      const res = await getAdminDaySlots(thaiId, formData.date);
      setDaySlots(res.slots || []);
      // Auto-fill lunar label from API
      if (res.lunar_label) {
        setFormData(prev => ({ ...prev, lunarLabel: res.lunar_label }));
      }
    } catch (error) {
      console.error('Failed to fetch day slots:', error);
      setDaySlots([]);
    } finally {
      setLoadingSlots(false);
    }
  }, [selectedThai, formData.date]);

  useEffect(() => {
    if (formData.date) {
      fetchDaySlots();
      setSelectedSlotType(null); // Reset selected slot when date/thai changes
    }
  }, [fetchDaySlots]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Get the selected slot from daySlots
    const selectedSlot = daySlots.find(s => s.session_type === selectedSlotType);
    if (!selectedSlot) {
      alert('Vui lòng chọn khung giờ!');
      return;
    }

    // Validate: must select an animal or mark as holiday
    if (!formData.isOff && formData.winningAnimalIds.length === 0) {
      alert('Vui lòng chọn con vật trúng hoặc đánh dấu ngày nghỉ!');
      return;
    }

    // Get thaiId from current tab
    const thaiId = currentThaiConfig?.id || `thai-${selectedThai}`;

    try {
      setSavingResult(true);

      // Get winning animal ORDER number (not ID string) for backend
      let winningAnimal: number | undefined;
      if (formData.winningAnimalIds.length > 0) {
        winningAnimal = parseInt(formData.winningAnimalIds[0], 10);
      }

      // Use simplified API - backend handles session finding/creation
      await submitLotteryResult({
        thai_id: thaiId,
        date: formData.date,
        slot_label: selectedSlot.label,
        winning_animal: formData.isOff ? undefined : winningAnimal,
        lunar_label: formData.lunarLabel || undefined,
        is_holiday: formData.isOff,
      });

      alert('Đã lưu kết quả thành công!');

      // Refetch slots + history
      await Promise.all([fetchDaySlots(), fetchResultsHistory()]);

      // Reset form but keep date + lunar
      setFormData(prev => ({
        ...prev,
        winningAnimalIds: [],
        imageUrl: '',
        isOff: false,
      }));
      setSelectedSlotType(null);
    } catch (error) {
      console.error('Failed to save result:', error);
      alert('Không thể lưu kết quả. Vui lòng thử lại!');
    } finally {
      setSavingResult(false);
    }
  };

  const startEditKetQua = (kq: typeof ketQuas[0]) => {
    setEditingKetQua(kq.id);
    setFormData({
      thaiId: kq.thaiId,
      date: kq.date,
      lunarLabel: (kq as { lunarLabel?: string }).lunarLabel || '',
      winningAnimalIds: kq.winningAnimalIds,
      imageUrl: kq.imageUrl || '',
      isOff: kq.isOff || false,
    });
  };

  const deleteKetQua = async (id: string) => {
    if (confirm('Bạn có chắc muốn xóa kết quả này? Điều này sẽ reset trạng thái đơn hàng liên quan về "paid".')) {
      try {
        await deleteSessionResult(id);
        setKetQuas(ketQuas.filter(kq => kq.id !== id));
        alert('Đã xóa kết quả thành công!');
      } catch (error) {
        console.error('Failed to delete result:', error);
        alert('Không thể xóa kết quả. Vui lòng thử lại!');
      }
    }
  };

  const toggleAnimal = (animalId: string) => {
    setFormData({
      ...formData,
      winningAnimalIds: formData.winningAnimalIds.includes(animalId)
        ? formData.winningAnimalIds.filter((id) => id !== animalId)
        : [...formData.winningAnimalIds, animalId],
    });
  };

  const currentThaiId = thaiTabs.find(t => t.id === selectedThai)?.thaiId;
  const filteredKetQuas = ketQuas.filter(kq => kq.thaiId === currentThaiId);

  const groupByYear = () => {
    const grouped: Record<string, typeof filteredKetQuas> = {};
    filteredKetQuas.forEach(kq => {
      const year = new Date(kq.date).getFullYear().toString();
      if (!grouped[year]) grouped[year] = [];
      grouped[year].push(kq);
    });
    return Object.entries(grouped).sort((a, b) => parseInt(b[0]) - parseInt(a[0]));
  };

  const groupByDate = (yearKetQuas: typeof filteredKetQuas) => {
    const grouped: Record<string, typeof filteredKetQuas> = {};
    yearKetQuas.forEach(kq => {
      const dateStr = kq.date;
      if (!grouped[dateStr]) grouped[dateStr] = [];
      grouped[dateStr].push(kq);
    });
    return Object.entries(grouped).sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime());
  };

  const getAnimalWithBodyPart = (animalId: string) => {
    const thaiId = selectedThai === 'an-nhon' ? 'thai-an-nhon' : selectedThai === 'nhon-phong' ? 'thai-nhon-phong' : 'thai-hoai-nhon';
    const animals = getAnimalsByThai(thaiId);
    // animalId is order as string (e.g., "2"), parse to number for comparison
    const orderNum = parseInt(animalId, 10);
    const animal = animals.find(a => a.order === orderNum);
    if (!animal) return null;
    const bodyInfo = bodyPartMapping[animal.order];
    return {
      ...animal,
      bodyPart: bodyInfo?.bodyPart || '',
      column: bodyInfo?.column || '',
    };
  };

  const yearGroups = groupByYear();

  const getGroupStatistics = () => {
    if (!selectedYear) return [];
    const yearKetQuas = filteredKetQuas.filter(kq =>
      new Date(kq.date).getFullYear() === selectedYear
    );
    const isHoaiNhon = selectedThai === 'hoai-nhon';
    const filteredGroups = isHoaiNhon
      ? animalGroups.filter(g => !g.orders.some(order => order > 36))
      : animalGroups;

    const thaiId = selectedThai === 'an-nhon' ? 'thai-an-nhon' : selectedThai === 'nhon-phong' ? 'thai-nhon-phong' : 'thai-hoai-nhon';
    const thaiAnimalsForStats = getAnimalsByThai(thaiId);

    return filteredGroups.map(group => {
      let count = 0;
      const animalCounts: Record<number, number> = {};
      yearKetQuas.forEach(kq => {
        kq.winningAnimalIds.forEach(animalId => {
          const orderNum = parseInt(animalId, 10);
          if (!isNaN(orderNum) && group.orders.includes(orderNum)) {
            count++;
            animalCounts[orderNum] = (animalCounts[orderNum] || 0) + 1;
          }
        });
      });
      const animalsInGroup = group.orders.map(order => {
        const animal = thaiAnimalsForStats.find(a => a.order === order);
        return { order, name: animal?.name || '', count: animalCounts[order] || 0 };
      });
      return { ...group, totalCount: count, animals: animalsInGroup };
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
        <AdminCard title="Nhập kết quả" icon="✨">
          {/* ① Date + Lunar Label */}
          <div className="space-y-3 mb-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#6b5c4c' }}>📅 Ngày</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none"
                  style={{ border: '1px solid #e8e4df' }}
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#6b5c4c' }}>🌙 Âm lịch</label>
                <input
                  type="text"
                  value={formData.lunarLabel}
                  onChange={(e) => setFormData({ ...formData, lunarLabel: e.target.value })}
                  onBlur={() => {
                    if (formData.lunarLabel.trim() && formData.date) {
                      setLunarDate(formData.date, formData.lunarLabel.trim()).catch(console.error);
                    }
                  }}
                  placeholder="Mùng 3, 25 tháng Chạp..."
                  className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none"
                  style={{ border: '1px solid #e8e4df', backgroundColor: '#fffbeb' }}
                />
              </div>
            </div>
          </div>

          {/* ② Slot Cards */}
          <div className="mb-4">
            <label className="block text-xs font-medium mb-2" style={{ color: '#6b5c4c' }}>
              Khung giờ — {thaiTabs.find(t => t.id === selectedThai)?.name}
            </label>
            {loadingSlots ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {daySlots.map((slot) => {
                  const isSelected = selectedSlotType === slot.session_type;
                  const isResulted = slot.status === 'resulted';
                  const isHoliday = isResulted && slot.winning_animal === null;
                  const hasResult = isResulted && slot.winning_animal !== null;
                  const baseThaiIdForSlot = (currentThaiConfig?.id || `thai-${selectedThai}`).replace(/-sang|-chieu|-toi|-trua$/, '');
                  const animalName = hasResult ? getAnimalsByThai(baseThaiIdForSlot).find(a => a.order === slot.winning_animal)?.name : null;
                  const slotIcons: Record<string, string> = { morning: '☀️', afternoon: '🌤️', evening: '🌙' };

                  return (
                    <button
                      key={slot.session_type}
                      type="button"
                      onClick={() => {
                        setSelectedSlotType(isSelected ? null : slot.session_type);
                        // Pre-fill if editing existing result
                        if (!isSelected && hasResult) {
                          setFormData(prev => ({ ...prev, winningAnimalIds: [slot.winning_animal!.toString()], isOff: false }));
                        } else if (!isSelected && isHoliday) {
                          setFormData(prev => ({ ...prev, winningAnimalIds: [], isOff: true }));
                        } else if (!isSelected) {
                          setFormData(prev => ({ ...prev, winningAnimalIds: [], isOff: false }));
                        }
                      }}
                      className={`p-3 rounded-xl text-center transition-all border-2 ${isSelected
                        ? 'border-amber-500 bg-amber-50 shadow-md'
                        : hasResult
                          ? 'border-green-200 bg-green-50'
                          : isHoliday
                            ? 'border-red-200 bg-red-50'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                    >
                      <div className="text-lg mb-1">{slotIcons[slot.session_type] || '🕐'}</div>
                      <div className="text-xs font-semibold" style={{ color: '#6b5c4c' }}>{slot.label}</div>
                      <div className="text-[10px] text-gray-400">{slot.draw_time}</div>
                      <div className="mt-1">
                        {hasResult ? (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-green-100 text-green-700">✅ {animalName}</span>
                        ) : isHoliday ? (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-600">🚫 Nghỉ</span>
                        ) : (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-100 text-yellow-700">⏳ Chưa có</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* ③ Inline Result Form (only when a slot is selected) */}
          {selectedSlotType && (
            <form onSubmit={handleSubmit} className="space-y-3 p-3 rounded-xl" style={{ backgroundColor: '#faf8f5', border: '1px solid #e8e4df' }}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold" style={{ color: '#6b5c4c' }}>
                  Nhập KQ — {daySlots.find(s => s.session_type === selectedSlotType)?.label} {daySlots.find(s => s.session_type === selectedSlotType)?.draw_time}
                </span>
                <button type="button" onClick={() => setSelectedSlotType(null)} className="text-gray-400 hover:text-gray-600 text-lg">✕</button>
              </div>

              {/* Checkbox Nghỉ */}
              <div className="flex items-center gap-2 p-2 rounded-lg" style={{ backgroundColor: formData.isOff ? '#fef2f2' : 'white', border: '1px solid #e8e4df' }}>
                <input
                  type="checkbox"
                  id="isOff"
                  checked={formData.isOff}
                  onChange={(e) => setFormData({
                    ...formData,
                    isOff: e.target.checked,
                    winningAnimalIds: e.target.checked ? [] : formData.winningAnimalIds
                  })}
                  className="w-4 h-4 rounded"
                  style={{ accentColor: '#dc2626' }}
                />
                <label htmlFor="isOff" className="text-xs font-medium cursor-pointer" style={{ color: formData.isOff ? '#dc2626' : '#6b5c4c' }}>
                  🚫 Nghỉ - Không xổ
                </label>
              </div>

              {/* Animal grid */}
              <div style={{ opacity: formData.isOff ? 0.3 : 1, pointerEvents: formData.isOff ? 'none' : 'auto' }}>
                <div className="max-h-40 overflow-y-auto rounded-lg p-2" style={{ backgroundColor: 'white', border: '1px solid #e8e4df' }}>
                  <div className="grid grid-cols-4 gap-1.5">
                    {(() => {
                      const baseThaiId = (currentThaiConfig?.id || `thai-${selectedThai}`).replace(/-sang|-chieu|-toi|-trua$/, '');
                      const animals = getAnimalsByThai(baseThaiId);
                      return animals.map((animal) => {
                        const orderStr = animal.order.toString();
                        const isAnimalSelected = formData.winningAnimalIds.includes(orderStr);
                        const bodyInfo = bodyPartMapping[animal.order];
                        return (
                          <button
                            key={orderStr}
                            type="button"
                            onClick={() => toggleAnimal(orderStr)}
                            className="p-1.5 rounded-lg text-center transition-all"
                            style={{
                              backgroundColor: isAnimalSelected ? '#a5673f' : 'white',
                              color: isAnimalSelected ? 'white' : '#6b5c4c',
                              border: '1px solid #e8e4df'
                            }}
                            title={bodyInfo ? `${bodyInfo.column} - ${bodyInfo.bodyPart}` : ''}
                          >
                            <div className="text-xs font-medium">{animal.order}</div>
                            <div className="text-[10px] truncate">{animal.name}</div>
                          </button>
                        );
                      });
                    })()}
                  </div>
                </div>
              </div>

              <AdminButton variant="primary" type="submit" className="w-full">
                {formData.isOff ? '🚫 Lưu ngày nghỉ' : '💾 Lưu kết quả'}
              </AdminButton>
            </form>
          )}
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
                  <div className="px-4 py-2 font-bold flex items-center gap-2" style={{ backgroundColor: '#fef3c7', color: '#92400e' }}>
                    <span>📅</span>
                    <span>Năm {year}</span>
                    <span className="text-xs font-normal ml-auto">({yearKetQuas.length} kết quả)</span>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {groupByDate(yearKetQuas).map(([date, dateKetQuas]) => (
                      <div key={date} className="px-4 py-3">
                        <div className="text-sm font-medium mb-2" style={{ color: '#6b5c4c' }}>
                          📆 {new Date(date).toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}
                        </div>
                        {dateKetQuas.map((kq) => {
                          const thai = THAIS.find(t => t.id === kq.thaiId);
                          return (
                            <div key={kq.id} className="ml-4 p-2 rounded-lg mb-2" style={{ backgroundColor: '#faf8f5' }}>
                              <div className="flex items-center justify-between mb-2">
                                <div className="text-xs font-medium" style={{ color: '#9a8c7a' }}>
                                  🏛️ {thai?.name}
                                </div>
                                <div className="flex gap-1">
                                  <button
                                    onClick={() => startEditKetQua(kq)}
                                    className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                                  >
                                    ✏️ Sửa
                                  </button>
                                  <button
                                    onClick={() => deleteKetQua(kq.id)}
                                    className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                                  >
                                    🗑️ Xóa
                                  </button>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {kq.winningAnimalIds.length > 0 ? kq.winningAnimalIds.map(animalId => {
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
                                }) : (
                                  <span className="text-xs text-gray-400 italic">🚫 Nghỉ xổ</span>
                                )}
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
        <div className="flex items-center gap-4 mb-6">
          <span className="text-gray-600 font-medium">Năm:</span>
          <select
            value={selectedYear || ''}
            onChange={(e) => setSelectedYear(e.target.value ? Number(e.target.value) : null)}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg font-bold cursor-pointer hover:bg-amber-700 transition-colors"
          >
            <option value="">-- Chọn năm --</option>
            {availableYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        {/* Group Statistics */}
        {selectedYear ? (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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

      {/* TỔNG KẾT CUỐI MÙA */}
      <div className="mt-8 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-lg p-6 border border-amber-200">
        <h2 className="text-2xl font-bold text-amber-800 mb-6 flex items-center gap-3">
          <span className="text-3xl">📊</span>
          TỔNG KẾT CUỐI MÙA - NĂM {selectedYear || new Date().getFullYear()}
        </h2>

        {!selectedYear && (
          <div className="text-center py-8 bg-white/50 rounded-xl">
            <span className="text-5xl mb-4 block">👆</span>
            <p className="text-amber-700 font-medium">Chọn năm ở phần trên để xem tổng kết cuối mùa</p>
          </div>
        )}

        {selectedYear && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {thaiTabs.map((thai) => {
                const thaiKetQuas = ketQuas.filter(kq =>
                  kq.thaiId === thai.thaiId &&
                  new Date(kq.date).getFullYear() === selectedYear
                );
                const uniqueAnimals = new Set(thaiKetQuas.flatMap(kq => kq.winningAnimalIds));
                const totalDraws = thaiKetQuas.length;

                return (
                  <div key={thai.id} className="bg-white border border-amber-200 rounded-xl p-4">
                    <h3 className="font-bold text-amber-800 mb-3 text-lg">🏛️ {thai.name}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tổng số lần xổ:</span>
                        <span className="font-bold">{totalDraws} lần</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Số con đã xổ:</span>
                        <span className="font-bold">{uniqueAnimals.size}/{thai.id === 'hoai-nhon' ? 36 : 40} con</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Con chưa xổ:</span>
                        <span className="font-bold text-red-600">{(thai.id === 'hoai-nhon' ? 36 : 40) - uniqueAnimals.size} con</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="flex border-b">
                {thaiTabs.map((thai) => (
                  <button
                    key={thai.id}
                    onClick={() => setSelectedThai(thai.id)}
                    className={`flex-1 px-4 py-3 font-semibold text-sm transition-all ${selectedThai === thai.id
                      ? 'bg-amber-100 text-amber-700 border-b-2 border-amber-500'
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

                  const animalCounts: Record<number, number> = {};
                  thaiKetQuas.forEach(kq => {
                    kq.winningAnimalIds.forEach(id => {
                      const orderNum = parseInt(id, 10);
                      if (!isNaN(orderNum)) {
                        animalCounts[orderNum] = (animalCounts[orderNum] || 0) + 1;
                      }
                    });
                  });

                  const thaiAnimals = getAnimalsByThai(currentThai?.thaiId || 'thai-an-nhon');
                  const sortedAnimals = Object.entries(animalCounts)
                    .map(([orderStr, count]) => ({ animal: thaiAnimals.find(a => a.order === parseInt(orderStr, 10)), count }))
                    .filter(a => a.animal)
                    .sort((a, b) => b.count - a.count);
                  const top5 = sortedAnimals.slice(0, 5);

                  const drawnOrders = new Set(Object.keys(animalCounts).map(k => parseInt(k, 10)));
                  const notDrawn = thaiAnimals.filter(a => !drawnOrders.has(a.order));

                  const isHoaiNhon = currentThai?.id === 'hoai-nhon' || currentThai?.thaiId === 'thai-hoai-nhon';
                  const filteredAnimalGroups = isHoaiNhon
                    ? animalGroups.filter(g => !g.orders.some(order => order > 36))
                    : animalGroups;

                  const groupCounts = filteredAnimalGroups.map(group => {
                    let count = 0;
                    thaiKetQuas.forEach(kq => {
                      kq.winningAnimalIds.forEach(id => {
                        const orderNum = parseInt(id, 10);
                        if (!isNaN(orderNum) && group.orders.includes(orderNum)) count++;
                      });
                    });
                    return { ...group, count };
                  }).sort((a, b) => b.count - a.count);

                  const drawnGroups = groupCounts.filter(g => g.count > 0);
                  const noDrawGroups = groupCounts.filter(g => g.count === 0);

                  const positionCounts: Record<string, number> = {};
                  thaiKetQuas.forEach(kq => {
                    kq.winningAnimalIds.forEach(id => {
                      const orderNum = parseInt(id, 10);
                      if (!isNaN(orderNum)) {
                        const bodyInfo = bodyPartMapping[orderNum];
                        if (bodyInfo) {
                          positionCounts[bodyInfo.bodyPart] = (positionCounts[bodyInfo.bodyPart] || 0) + 1;
                        }
                      }
                    });
                  });
                  const sortedPositions = Object.entries(positionCounts)
                    .sort((a, b) => b[1] - a[1]);
                  const top5Positions = sortedPositions.slice(0, 5);

                  const allPositions = new Set(Object.values(bodyPartMapping).map(b => b.bodyPart));
                  const drawnPositions = new Set(Object.keys(positionCounts));
                  const noDrawPositions = [...allPositions].filter(p => !drawnPositions.has(p));


                  return (
                    <>
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

                      <div>
                        <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                          <span>🔥</span> Nhóm xổ (xếp từ nhiều → ít)
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {drawnGroups.length > 0 ? drawnGroups.map((group, i) => (
                            <div key={group.id} className={`px-4 py-2 rounded-lg text-sm font-medium ${i === 0 ? 'bg-amber-100 text-amber-800' : i === 1 ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700'}`}>
                              <span className="font-bold">#{i + 1}</span> {group.name} ({group.count} lần)
                            </div>
                          )) : <span className="text-gray-500">Chưa có dữ liệu</span>}
                        </div>
                        {noDrawGroups.length > 0 && (
                          <p className="mt-2 text-sm text-gray-500">
                            ❄️ Nhóm chưa xổ: {noDrawGroups.map(g => g.name).join(', ')}
                          </p>
                        )}
                      </div>

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



                      {/* Yearly Profit/Loss Summary */}
                      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-4 border border-amber-200">
                        <h4 className="font-bold text-amber-800 mb-3 flex items-center gap-2">
                          <span>💰</span> Báo cáo Thắng/Thua CẢ NĂM {selectedYear}
                        </h4>
                        {loadingYearlyPL ? (
                          <div className="flex items-center justify-center py-6">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
                          </div>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b border-amber-200">
                                  <th className="text-left py-2 px-3">Buổi</th>
                                  <th className="text-right py-2 px-3">Doanh thu</th>
                                  <th className="text-right py-2 px-3">Trả thưởng</th>
                                  <th className="text-right py-2 px-3">Lãi/Lỗ</th>
                                </tr>
                              </thead>
                              <tbody>
                                {(['sang', 'trua', 'chieu', 'toi'] as const).map(slot => {
                                  const data = yearlyProfitLoss[slot];
                                  if (!data) return null;
                                  const net = data.revenue - data.payout;
                                  const slotLabels: Record<string, string> = { sang: 'Sáng', trua: 'Trưa', chieu: 'Chiều', toi: 'Tối' };
                                  return (
                                    <tr key={slot} className="border-b border-amber-100">
                                      <td className="py-2 px-3 font-medium">{slotLabels[slot]}</td>
                                      <td className="py-2 px-3 text-right">{data.revenue.toLocaleString()}đ</td>
                                      <td className="py-2 px-3 text-right text-red-600">{data.payout.toLocaleString()}đ</td>
                                      <td className={`py-2 px-3 text-right font-bold ${net > 0 ? 'text-green-600' : net < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                                        {net > 0 ? '+' : ''}{net.toLocaleString()}đ
                                      </td>
                                    </tr>
                                  );
                                })}
                                {!yearlyProfitLoss.sang && !yearlyProfitLoss.trua && !yearlyProfitLoss.chieu && !yearlyProfitLoss.toi && (
                                  <tr><td colSpan={4} className="py-6 text-center text-gray-500">Chưa có dữ liệu tài chính cho năm {selectedYear}</td></tr>
                                )}
                              </tbody>
                              {(yearlyProfitLoss.sang || yearlyProfitLoss.trua || yearlyProfitLoss.chieu || yearlyProfitLoss.toi) && (
                                <tfoot>
                                  {(() => {
                                    const totalRev = (yearlyProfitLoss.sang?.revenue || 0) + (yearlyProfitLoss.trua?.revenue || 0) + (yearlyProfitLoss.chieu?.revenue || 0) + (yearlyProfitLoss.toi?.revenue || 0);
                                    const totalPay = (yearlyProfitLoss.sang?.payout || 0) + (yearlyProfitLoss.trua?.payout || 0) + (yearlyProfitLoss.chieu?.payout || 0) + (yearlyProfitLoss.toi?.payout || 0);
                                    const totalNet = totalRev - totalPay;
                                    return (
                                      <tr className="bg-amber-100 font-bold">
                                        <td className="py-2 px-3">TỔNG NĂM {selectedYear}</td>
                                        <td className="py-2 px-3 text-right">{totalRev.toLocaleString()}đ</td>
                                        <td className="py-2 px-3 text-right text-red-600">{totalPay.toLocaleString()}đ</td>
                                        <td className={`py-2 px-3 text-right ${totalNet > 0 ? 'text-green-700' : totalNet < 0 ? 'text-red-700' : 'text-gray-600'}`}>
                                          {totalNet > 0 ? '+' : ''}{totalNet.toLocaleString()}đ
                                        </td>
                                      </tr>
                                    );
                                  })()}
                                </tfoot>
                              )}
                            </table>
                          </div>
                        )}
                        {selectedThai !== 'hoai-nhon' && (
                          <p className="mt-3 text-xs text-amber-600 bg-amber-100 rounded px-3 py-2">
                            ℹ️ <strong>Lưu ý:</strong> Trả thưởng đã bao gồm con xổ + con thế thân (trừ Hoài Nhơn chỉ tính con xổ). Hệ số: 1:30, riêng Trùn 1:70.
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
