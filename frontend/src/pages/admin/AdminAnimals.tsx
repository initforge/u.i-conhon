import React, { useState, useEffect, useMemo } from 'react';
import { anNhonAnimals } from '../../types';
import { useThaiConfig } from '../../contexts/ThaiConfigContext';
import AdminPageWrapper from '../../components/AdminPageWrapper';
import Portal from '../../components/Portal';
import { getThaiLimits, saveThaiLimits, getAdminCurrentSession, updateAdminSessionAnimal } from '../../services/api';

// Data cho Hoài Nhơn (36 con) - Thêm purchaseCount (đơn hàng)
const animalsHoaiNhon36 = [
  { id: 'hn-1', order: 1, name: 'Cá Trắng', alias: 'Chiếm Khôi', isEnabled: true, isBanned: false, purchaseLimit: 100000, purchased: 0, purchaseCount: 0 },
  { id: 'hn-2', order: 2, name: 'Ốc', alias: 'Bản Quế', isEnabled: true, isBanned: false, purchaseLimit: 100000, purchased: 0, purchaseCount: 0 },
  { id: 'hn-3', order: 3, name: 'Ngỗng', alias: 'Vinh Sanh', isEnabled: true, isBanned: false, purchaseLimit: 100000, purchased: 0 },
  { id: 'hn-4', order: 4, name: 'Công', alias: 'Phùng Xuân', isEnabled: true, isBanned: false, purchaseLimit: 100000, purchased: 0 },
  { id: 'hn-5', order: 5, name: 'Trùn', alias: 'Chí Cao', isEnabled: true, isBanned: false, purchaseLimit: 100000, purchased: 0 },
  { id: 'hn-6', order: 6, name: 'Cọp', alias: 'Khôn Sơn', isEnabled: true, isBanned: false, purchaseLimit: 100000, purchased: 0 },
  { id: 'hn-7', order: 7, name: 'Heo', alias: 'Chánh Thuận', isEnabled: true, isBanned: false, purchaseLimit: 100000, purchased: 0 },
  { id: 'hn-8', order: 8, name: 'Thỏ', alias: 'Nguyệt Bửu', isEnabled: true, isBanned: false, purchaseLimit: 100000, purchased: 0 },
  { id: 'hn-9', order: 9, name: 'Trâu', alias: 'Hớn Vân', isEnabled: true, isBanned: false, purchaseLimit: 100000, purchased: 0 },
  { id: 'hn-10', order: 10, name: 'Rồng Bay', alias: 'Giang Tứ', isEnabled: true, isBanned: false, purchaseLimit: 100000, purchased: 0 },
  { id: 'hn-11', order: 11, name: 'Chó', alias: 'Phước Tôn', isEnabled: true, isBanned: false, purchaseLimit: 100000, purchased: 0 },
  { id: 'hn-12', order: 12, name: 'Ngựa', alias: 'Quang Minh', isEnabled: true, isBanned: false, purchaseLimit: 100000, purchased: 0 },
  { id: 'hn-13', order: 13, name: 'Voi', alias: 'Hữu Tài', isEnabled: true, isBanned: false, purchaseLimit: 100000, purchased: 0 },
  { id: 'hn-14', order: 14, name: 'Mèo', alias: 'Chỉ Đắc', isEnabled: true, isBanned: false, purchaseLimit: 100000, purchased: 0 },
  { id: 'hn-15', order: 15, name: 'Chuột', alias: 'Tất Khắc', isEnabled: true, isBanned: false, purchaseLimit: 100000, purchased: 0 },
  { id: 'hn-16', order: 16, name: 'Ong', alias: 'Mậu Lâm', isEnabled: true, isBanned: false, purchaseLimit: 100000, purchased: 0 },
  { id: 'hn-17', order: 17, name: 'Hạc', alias: 'Trọng Tiên', isEnabled: true, isBanned: false, purchaseLimit: 100000, purchased: 0 },
  { id: 'hn-18', order: 18, name: 'Kỳ Lân', alias: 'Thiên Thần', isEnabled: true, isBanned: false, purchaseLimit: 100000, purchased: 0 },
  { id: 'hn-19', order: 19, name: 'Bướm', alias: 'Cấn Ngọc', isEnabled: true, isBanned: false, purchaseLimit: 100000, purchased: 0 },
  { id: 'hn-20', order: 20, name: 'Hòn Núi', alias: 'Trân Châu', isEnabled: true, isBanned: false, purchaseLimit: 100000, purchased: 0 },
  { id: 'hn-21', order: 21, name: 'Én', alias: 'Thượng Chiêu', isEnabled: true, isBanned: false, purchaseLimit: 100000, purchased: 0 },
  { id: 'hn-22', order: 22, name: 'Bồ Câu', alias: 'Song Đồng', isEnabled: true, isBanned: false, purchaseLimit: 100000, purchased: 0 },
  { id: 'hn-23', order: 23, name: 'Khỉ', alias: 'Tam Hoè', isEnabled: true, isBanned: false, purchaseLimit: 100000, purchased: 0 },
  { id: 'hn-24', order: 24, name: 'Ếch', alias: 'Hiệp Hải', isEnabled: true, isBanned: false, purchaseLimit: 100000, purchased: 0 },
  { id: 'hn-25', order: 25, name: 'Quạ', alias: 'Cửu Quan', isEnabled: true, isBanned: false, purchaseLimit: 100000, purchased: 0 },
  { id: 'hn-26', order: 26, name: 'Rồng Nằm', alias: 'Thái Bình', isEnabled: true, isBanned: false, purchaseLimit: 100000, purchased: 0 },
  { id: 'hn-27', order: 27, name: 'Rùa', alias: 'Hỏa Diệm', isEnabled: true, isBanned: false, purchaseLimit: 100000, purchased: 0 },
  { id: 'hn-28', order: 28, name: 'Gà', alias: 'Nhựt Thăng', isEnabled: true, isBanned: false, purchaseLimit: 100000, purchased: 0 },
  { id: 'hn-29', order: 29, name: 'Lươn', alias: 'Địa Lươn', isEnabled: true, isBanned: false, purchaseLimit: 100000, purchased: 0 },
  { id: 'hn-30', order: 30, name: 'Cá Đỏ', alias: 'Tỉnh Lợi', isEnabled: true, isBanned: false, purchaseLimit: 100000, purchased: 0 },
  { id: 'hn-31', order: 31, name: 'Tôm', alias: 'Trường Thọ', isEnabled: true, isBanned: false, purchaseLimit: 100000, purchased: 0 },
  { id: 'hn-32', order: 32, name: 'Rắn', alias: 'Vạn Kim', isEnabled: true, isBanned: false, purchaseLimit: 100000, purchased: 0 },
  { id: 'hn-33', order: 33, name: 'Nhện', alias: 'Thanh Tuyền', isEnabled: true, isBanned: false, purchaseLimit: 100000, purchased: 0 },
  { id: 'hn-34', order: 34, name: 'Nai', alias: 'Nguyên Cát', isEnabled: true, isBanned: false, purchaseLimit: 100000, purchased: 0 },
  { id: 'hn-35', order: 35, name: 'Dê', alias: 'Nhứt Phẩm', isEnabled: true, isBanned: false, purchaseLimit: 100000, purchased: 0 },
  { id: 'hn-36', order: 36, name: 'Bà Vãi', alias: 'An Sĩ', isEnabled: true, isBanned: false, purchaseLimit: 100000, purchased: 0 },
];

// Tạo data cho An Nhơn / Nhơn Phong (40 con) với purchased và limit
const createAnNhonAnimals = () => anNhonAnimals.map(a => ({
  ...a,
  purchaseLimit: 100000,
  purchased: 0,
  purchaseCount: 0
}));

// Common animal type
type AnimalWithPurchase = ReturnType<typeof createAnNhonAnimals>[0];

const AdminAnimals: React.FC = () => {
  const [selectedThai, setSelectedThai] = useState('an-nhon');
  const [selectedKhungIndex, setSelectedKhungIndex] = useState(0); // Index of khung in timeSlots array

  // Get Thai configs from context (dynamic from database)
  const { thais, loading: thaiLoading } = useThaiConfig();

  // Get current Thai's timeSlots from context (now dynamic!)
  const currentThaiConfig = useMemo(() => {
    return thais.find(t => t.id === `thai-${selectedThai}`) ?? thais[0];
  }, [selectedThai, thais]);

  // Compute khung options from timeSlots + detect active khung based on current time
  const { khungOptions, activeKhungIndex } = useMemo(() => {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    // -1 means no khung is currently active
    let detectedActiveIndex = -1;

    const options = currentThaiConfig.timeSlots.map((slot, idx) => {
      const isCrossDay = slot.startTime > slot.endTime; // e.g. 17:30 > 10:30
      const isActive = isCrossDay
        ? (currentTime >= slot.startTime || currentTime < slot.endTime)  // Cross-midnight
        : (currentTime >= slot.startTime && currentTime < slot.endTime); // Same-day
      if (isActive) detectedActiveIndex = idx;

      return {
        index: idx,
        name: `Khung ${idx + 1}`,
        time: `${slot.startTime} → ${slot.endTime}`,
        icon: idx === 0 ? '🌅' : '🌇',
        startTime: slot.startTime,
        endTime: slot.endTime,
      };
    });

    // Thai An Nhơn Khung 3 (Tối) - chỉ hiển thị khi isTetMode=true
    // Đây là khung Tết đặc biệt, không phải session thường
    if (currentThaiConfig.id === 'thai-an-nhon' && currentThaiConfig.isTetMode && currentThaiConfig.tetTimeSlot) {
      const eveningSlot = currentThaiConfig.tetTimeSlot;
      const isCrossDay = eveningSlot.startTime > eveningSlot.endTime;
      const isEveningActive = isCrossDay
        ? (currentTime >= eveningSlot.startTime || currentTime < eveningSlot.endTime)
        : (currentTime >= eveningSlot.startTime && currentTime < eveningSlot.endTime);
      if (isEveningActive) detectedActiveIndex = options.length;

      options.push({
        index: options.length,
        name: 'Khung 3 - Tết',
        time: `${eveningSlot.startTime} → ${eveningSlot.endTime}`,
        icon: '🎋',
        startTime: eveningSlot.startTime,
        endTime: eveningSlot.endTime,
      });
    }

    return { khungOptions: options, activeKhungIndex: detectedActiveIndex };
  }, [currentThaiConfig]);

  // Auto-select active khung when Thai changes (default to 0 if no khung active)
  useEffect(() => {
    setSelectedKhungIndex(activeKhungIndex >= 0 ? activeKhungIndex : 0);
  }, [selectedThai, activeKhungIndex]);

  // Hạn mức tổng cho mỗi Thai
  const [thaiLimits, setThaiLimits] = useState({
    'an-nhon': 300000,
    'nhon-phong': 500000,
    'hoai-nhon': 200000,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [limitsLoaded, setLimitsLoaded] = useState(false);

  // Load thai limits từ API khi mount
  useEffect(() => {
    const loadLimits = async () => {
      try {
        const limits = await getThaiLimits();
        setThaiLimits(prev => ({ ...prev, ...limits }));
        setLimitsLoaded(true);
      } catch (error) {
        console.error('Failed to load thai limits:', error);
        setLimitsLoaded(true); // Still mark as loaded to prevent infinite loop
      }
    };
    loadLimits();
  }, []);

  // Modal cấm con vật
  const [banModal, setBanModal] = useState<{
    isOpen: boolean;
    animalId: string | null;
    animalName: string;
    reason: string;
  }>({ isOpen: false, animalId: null, animalName: '', reason: '' });

  // Animals state for each Thai
  const [animalsAnNhon, setAnimalsAnNhon] = useState(createAnNhonAnimals());
  const [animalsNhonPhong, setAnimalsNhonPhong] = useState(createAnNhonAnimals());
  const [animalsHoaiNhon, setAnimalsHoaiNhon] = useState(
    animalsHoaiNhon36.map(a => ({ ...a, banReason: undefined as string | undefined }))
  );

  // Current session ID cho mỗi Thai
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  // NOTE: Global Thai limits are applied as defaults inside fetchSessionAnimals below.
  // Per-animal limits from DB always win over global limits.

  // Fetch session_animals thực từ API khi Thai/Khung thay đổi hoặc khi limits đã load xong
  useEffect(() => {
    if (!limitsLoaded) return; // Wait for global limits to load first

    const fetchSessionAnimals = async () => {
      try {
        const thaiId = `thai-${selectedThai}`;
        const globalLimit = thaiLimits[selectedThai as keyof typeof thaiLimits] || 100000;
        const response = await getAdminCurrentSession(thaiId, selectedKhungIndex);
        const session = response.session;
        setCurrentSessionId(session.id);

        if (session.animals && Array.isArray(session.animals)) {
          // Merge sold_amount, is_banned, ban_reason, limit_amount từ DB vào animals state
          // DB limit_amount wins over global Thai limit
          const mergeData = (prev: any[]) => prev.map(a => {
            const dbAnimal = session.animals.find((sa: any) => sa.animal_order === a.order);
            if (dbAnimal) {
              return {
                ...a,
                purchased: dbAnimal.sold_amount || 0,
                isBanned: dbAnimal.is_banned || false,
                banReason: dbAnimal.ban_reason || undefined,
                // DB limit wins; fall back to global Thai limit if DB has no limit
                purchaseLimit: dbAnimal.limit_amount || globalLimit,
              };
            }
            // No DB record: use global Thai limit as default
            return { ...a, purchaseLimit: globalLimit };
          });

          switch (selectedThai) {
            case 'an-nhon': setAnimalsAnNhon(mergeData); break;
            case 'nhon-phong': setAnimalsNhonPhong(mergeData); break;
            case 'hoai-nhon': setAnimalsHoaiNhon(mergeData); break;
          }
        }
      } catch (error) {
        console.error('Failed to fetch session animals:', error);
        setCurrentSessionId(null);
        // Even on error, apply global limits so UI isn't stuck on hardcoded values
        const globalLimit = thaiLimits[selectedThai as keyof typeof thaiLimits] || 100000;
        const applyGlobal = (prev: any[]) => prev.map(a => ({ ...a, purchaseLimit: globalLimit }));
        switch (selectedThai) {
          case 'an-nhon': setAnimalsAnNhon(applyGlobal); break;
          case 'nhon-phong': setAnimalsNhonPhong(applyGlobal); break;
          case 'hoai-nhon': setAnimalsHoaiNhon(applyGlobal); break;
        }
      }
    };
    fetchSessionAnimals();
  }, [selectedThai, selectedKhungIndex, limitsLoaded, thaiLimits]);

  const thaiOptions = [
    { id: 'an-nhon', name: 'Thai An Nhơn', color: 'green', animals: 40 },
    { id: 'nhon-phong', name: 'Thai Nhơn Phong', color: 'yellow', animals: 40 },
    { id: 'hoai-nhon', name: 'Thai Hoài Nhơn', color: 'blue', animals: 36 },
  ];

  // Save thai limits to backend
  const handleSaveLimits = async () => {
    if (!currentSessionId) {
      alert('❌ Chưa có phiên hoạt động. Không thể lưu.');
      return;
    }
    setIsSaving(true);
    try {
      // 1. Save global Thai limits
      await saveThaiLimits(thaiLimits);

      // 2. Save per-animal limits to DB
      const savePromises = animals.map(animal =>
        updateAdminSessionAnimal({
          session_id: currentSessionId,
          animal_order: animal.order,
          limit_amount: animal.purchaseLimit,
          is_banned: animal.isBanned,
          ban_reason: animal.banReason || '',
        })
      );
      await Promise.all(savePromises);

      alert('✅ Đã lưu hạn mức thành công!');
    } catch (error) {
      console.error('Failed to save limits:', error);
      alert('❌ Lỗi khi lưu hạn mức. Vui lòng thử lại.');
    } finally {
      setIsSaving(false);
    }
  };

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

  const toggleBan = async (id: string, reason?: string) => {
    const animal = animals.find((a) => a.id === id);
    if (!animal || !currentSessionId) return;

    const newBanned = !animal.isBanned;
    const banReason = newBanned ? (reason || 'Không có lý do') : undefined;

    try {
      // Call API to persist ban to database
      await updateAdminSessionAnimal({
        session_id: currentSessionId,
        animal_order: animal.order,
        is_banned: newBanned,
        ban_reason: banReason || '',
      });

      // Update local state after successful API call
      updateAnimal(id, { isBanned: newBanned, banReason });
    } catch (error) {
      console.error('Failed to toggle ban:', error);
      alert('❌ Lỗi khi cập nhật trạng thái cấm. Vui lòng thử lại.');
    }
  };

  // Áp dụng hạn mức Thai cho tất cả con vật
  const applyThaiLimitToAll = () => {
    const limit = thaiLimits[selectedThai as keyof typeof thaiLimits];
    const updatedAnimals = animals.map(a => ({ ...a, purchaseLimit: limit }));
    setCurrentAnimals(updatedAnimals);
  };

  // Mở modal cấm
  const openBanModal = (animal: typeof animals[0]) => {
    setBanModal({
      isOpen: true,
      animalId: animal.id,
      animalName: animal.name,
      reason: ''
    });
  };

  // Xác nhận cấm
  const confirmBan = () => {
    if (banModal.animalId) {
      toggleBan(banModal.animalId, banModal.reason || 'Không có lý do');
      setBanModal({ isOpen: false, animalId: null, animalName: '', reason: '' });
    }
  };

  return (
    <AdminPageWrapper
      title="Quản lý con vật"
      subtitle={`Cấu hình hạn mức và trạng thái - ${thaiOptions.find(t => t.id === selectedThai)?.animals} con`}
      icon="🐾"
    >
      {/* Thai Tabs */}
      <div className="mb-4">
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

      {/* Khung Selector - Prominent display of which session/timeframe */}
      <div className="mb-6 p-4 bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl border-2 border-amber-300">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⏰</span>
            <div>
              <p className="font-bold text-amber-800">Chọn khung giờ đang cấu hình:</p>
              <p className="text-xs text-amber-600">Hạn mức áp dụng cho khung giờ được chọn</p>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {khungOptions.map((khung) => (
              <button
                key={khung.index}
                onClick={() => setSelectedKhungIndex(khung.index)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all border-2 ${selectedKhungIndex === khung.index
                  ? 'bg-amber-600 text-white border-amber-600 shadow-lg'
                  : 'bg-white text-amber-700 border-amber-300 hover:border-amber-500'
                  }`}
              >
                <span className="mr-1">{khung.icon}</span>
                {khung.name}
                <span className="ml-1 text-xs opacity-75">({khung.time})</span>
                {khung.index === activeKhungIndex && (
                  <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs bg-green-500 text-white">
                    LIVE
                  </span>
                )}
              </button>
            ))}
          </div>
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

      {/* Hạn mức Thai tổng */}
      <div
        className="p-4 rounded-xl mb-6"
        style={{ backgroundColor: '#f0f9ff', border: '1px solid #bfdbfe' }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">💰</span>
            <div>
              <p className="text-sm font-medium text-blue-700">Hạn mức tổng cho {thaiOptions.find(t => t.id === selectedThai)?.name}</p>
              <p className="text-xs text-blue-500">Áp dụng cho tất cả {animals.length} con vật</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={thaiLimits[selectedThai as keyof typeof thaiLimits]}
              onChange={(e) => setThaiLimits({
                ...thaiLimits,
                [selectedThai]: Number(e.target.value)
              })}
              className="w-32 px-3 py-2 text-right font-bold border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-500"
              step="50000"
            />
            <span className="text-blue-700 font-medium">đ</span>
            <button
              onClick={applyThaiLimitToAll}
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              ✅ Áp dụng tất cả
            </button>
            <button
              onClick={handleSaveLimits}
              disabled={isSaving}
              className={`px-4 py-2 font-semibold rounded-lg transition-colors ${isSaving
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-red-600 text-white hover:bg-red-700'
                }`}
            >
              {isSaving ? '⏳ Đang lưu...' : '💾 Lưu thay đổi'}
            </button>
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          {[100000, 200000, 300000, 500000].map(amount => (
            <button
              key={amount}
              onClick={() => setThaiLimits({ ...thaiLimits, [selectedThai]: amount })}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${thaiLimits[selectedThai as keyof typeof thaiLimits] === amount
                ? 'bg-blue-600 text-white'
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
            >
              {(amount / 1000)}k
            </button>
          ))}
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
              className={`rounded-xl p-4 transition-all ${animal.isBanned ? 'ring-2 ring-red-500' : ''}`}
              style={{
                backgroundColor: animal.isBanned ? '#fef2f2' : 'white',
                border: animal.isBanned ? '2px solid #ef4444' : '1px solid #e8e4df'
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
                {/* Toggle bật/tắt con vật */}
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={animal.isEnabled && !animal.isBanned}
                    onChange={() => updateAnimal(animal.id, { isEnabled: !animal.isEnabled })}
                    disabled={animal.isBanned}
                    className="sr-only peer"
                  />
                  <div
                    className={`w-11 h-6 rounded-full transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5 ${animal.isBanned ? 'cursor-not-allowed opacity-50' : ''}`}
                    style={{ backgroundColor: (animal.isEnabled && !animal.isBanned) ? '#22c55e' : '#d1d5db' }}
                  />
                </label>
              </div>

              {/* Status badges */}
              <div className="flex gap-2 mb-3 flex-wrap">
                {animal.isBanned ? (
                  <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded">
                    🚫 ĐÃ CẤM
                  </span>
                ) : animal.isEnabled ? (
                  <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded">
                    ✅ ĐANG BẬT
                  </span>
                ) : (
                  <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded">
                    ⏸️ ĐÃ TẮT
                  </span>
                )}
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
                  <span className="font-bold text-blue-700">
                    {(animal as any).purchaseCount || 0} lượt • {animal.purchased.toLocaleString('vi-VN')}đ
                  </span>
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
                    openBanModal(animal);
                  }
                }}
                className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${animal.isBanned
                  ? 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-300'
                  : 'bg-red-100 text-red-700 hover:bg-red-200 border border-red-300'
                  }`}
              >
                {animal.isBanned ? '✅ Bỏ cấm' : '🚫 Cấm con này'}
              </button>

              {/* Banner cấm nổi bật */}
              {animal.isBanned && (
                <div className="mt-3 p-3 bg-red-500 text-white rounded-lg">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    🚫 CON NÀY ĐANG BỊ CẤM
                  </div>
                  {animal.banReason && (
                    <p className="text-xs mt-1 opacity-90">
                      Lý do: {animal.banReason}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal cấm con vật */}
      {banModal.isOpen && (
        <Portal>
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl w-full max-w-md max-h-[95vh] sm:max-h-[90vh] shadow-2xl overflow-y-auto my-auto">
              {/* Header */}
              <div className="bg-red-500 text-white p-5">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  🚫 Cấm con vật
                </h3>
                <p className="text-red-100 text-sm mt-1">
                  Bạn đang cấm: <strong>{banModal.animalName}</strong>
                </p>
              </div>

              {/* Body */}
              <div className="p-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nhập lý do cấm con này:
                </label>
                <textarea
                  value={banModal.reason}
                  onChange={(e) => setBanModal({ ...banModal, reason: e.target.value })}
                  placeholder="VD: Con này đã có nhiều người mua..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-400 resize-none"
                  rows={3}
                  autoFocus
                />
              </div>

              {/* Footer */}
              <div className="flex gap-3 p-5 bg-gray-50">
                <button
                  onClick={() => setBanModal({ isOpen: false, animalId: null, animalName: '', reason: '' })}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-colors"
                >
                  ❌ Hủy
                </button>
                <button
                  onClick={confirmBan}
                  className="flex-1 px-4 py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-colors"
                >
                  🚫 Xác nhận cấm
                </button>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </AdminPageWrapper>
  );
};

export default AdminAnimals;
