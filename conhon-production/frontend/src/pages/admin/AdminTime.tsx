import React, { useState } from 'react';
import { THAIS, Thai } from '../../types';
import AdminPageWrapper, { AdminCard, AdminButton } from '../../components/AdminPageWrapper';

const AdminTime: React.FC = () => {
  const [thais, setThais] = useState<Thai[]>([...THAIS]);

  const updateTimeSlot = (thaiId: string, slotIndex: number, field: 'startTime' | 'endTime', value: string) => {
    setThais((prev) =>
      prev.map((thai) => {
        if (thai.id !== thaiId) return thai;
        const newTimeSlots = [...thai.timeSlots];
        newTimeSlots[slotIndex] = { ...newTimeSlots[slotIndex], [field]: value };
        // Also update legacy times for backward compatibility
        const newTimes = newTimeSlots.map(slot => slot.endTime);
        return { ...thai, timeSlots: newTimeSlots, times: newTimes };
      })
    );
  };

  const updateTetTimeSlot = (thaiId: string, field: 'startTime' | 'endTime', value: string) => {
    setThais((prev) =>
      prev.map((thai) => {
        if (thai.id !== thaiId) return thai;
        const currentTetSlot = thai.tetTimeSlot || { startTime: '18:00', endTime: '20:30' };
        return { ...thai, tetTimeSlot: { ...currentTetSlot, [field]: value } };
      })
    );
  };

  const toggleTetMode = (thaiId: string) => {
    setThais((prev) =>
      prev.map((thai) => {
        if (thai.id !== thaiId) return thai;
        return { ...thai, isTetMode: !thai.isTetMode };
      })
    );
  };

  const handleSave = () => {
    // TODO: Save to database
    console.log('Saving thais config:', thais);
    alert('Đã lưu cấu hình thời gian!');
  };

  return (
    <AdminPageWrapper
      title="Cấu hình thời gian"
      subtitle="Thiết lập khung giờ mở/đóng mua cho các Thai"
      icon="⏰"
      actions={<AdminButton variant="primary" onClick={handleSave}>💾 Lưu cấu hình</AdminButton>}
    >
      {/* Time Settings - Each Thai has its own card */}
      <div className="space-y-6">
        {thais.map((thai) => (
          <AdminCard key={thai.id}>
            {/* Thai Header */}
            <div className="mb-4 pb-3 border-b border-gray-200">
              <h3 className="text-lg font-bold" style={{ color: '#3d3428' }}>{thai.name}</h3>
              <p className="text-xs mt-1" style={{ color: '#9a8c7a' }}>{thai.description}</p>
            </div>

            {/* Time Slots */}
            <div className="space-y-4">
              {thai.timeSlots.map((slot, idx) => (
                <div key={idx} className="p-4 rounded-xl" style={{ backgroundColor: '#faf8f5', border: '1px solid #e8e4df' }}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold" style={{ color: '#6b5c4c' }}>
                      Khung {idx + 1}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: '#e8e4df', color: '#6b5c4c' }}>
                      {slot.startTime} → {slot.endTime}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs mb-1" style={{ color: '#9a8c7a' }}>
                        Bắt đầu mua
                      </label>
                      <input
                        type="time"
                        value={slot.startTime}
                        onChange={(e) => updateTimeSlot(thai.id, idx, 'startTime', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-200"
                        style={{ border: '1px solid #e8e4df' }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs mb-1" style={{ color: '#9a8c7a' }}>
                        Giờ xổ (kết thúc)
                      </label>
                      <input
                        type="time"
                        value={slot.endTime}
                        onChange={(e) => updateTimeSlot(thai.id, idx, 'endTime', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-200"
                        style={{ border: '1px solid #e8e4df' }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tet Mode Toggle - Only for An Nhon and Nhon Phong */}
            {(thai.id === 'thai-an-nhon' || thai.id === 'thai-nhon-phong') && (
              <div className="mt-4">
                <div
                  className="p-4 rounded-xl transition-colors"
                  style={{
                    backgroundColor: thai.isTetMode ? '#fef8ec' : '#faf8f5',
                    border: `1px solid ${thai.isTetMode ? '#fde68a' : '#e8e4df'}`
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">🎋</span>
                      <div>
                        <p className="text-sm font-medium" style={{ color: '#3d3428' }}>Chế độ Tết</p>
                        <p className="text-xs" style={{ color: '#9a8c7a' }}>Thêm khung giờ tối cho dịp Tết</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={thai.isTetMode}
                        onChange={() => toggleTetMode(thai.id)}
                        className="sr-only peer"
                      />
                      <div
                        className="w-11 h-6 rounded-full transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5"
                        style={{ backgroundColor: thai.isTetMode ? '#c9a86c' : '#d1ccc4' }}
                      />
                    </label>
                  </div>

                  {/* Tet Time Slot - Only show when Tet mode is enabled */}
                  {thai.isTetMode && thai.tetTimeSlot && (
                    <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-amber-200">
                      <div>
                        <label className="block text-xs mb-1" style={{ color: '#9a7a2d' }}>
                          🎋 Bắt đầu mua (Tết)
                        </label>
                        <input
                          type="time"
                          value={thai.tetTimeSlot.startTime}
                          onChange={(e) => updateTetTimeSlot(thai.id, 'startTime', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-200"
                          style={{ border: '1px solid #fde68a', backgroundColor: '#fffbeb', color: '#9a7a2d' }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs mb-1" style={{ color: '#9a7a2d' }}>
                          🎋 Giờ xổ (Tết)
                        </label>
                        <input
                          type="time"
                          value={thai.tetTimeSlot.endTime}
                          onChange={(e) => updateTetTimeSlot(thai.id, 'endTime', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-200"
                          style={{ border: '1px solid #fde68a', backgroundColor: '#fffbeb', color: '#9a7a2d' }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </AdminCard>
        ))}
      </div>

      {/* Info Box */}
      <div className="mt-6 p-4 rounded-xl" style={{ backgroundColor: '#f0f9ff', border: '1px solid #bae6fd' }}>
        <div className="flex items-start space-x-3">
          <span className="text-xl">💡</span>
          <div className="text-sm" style={{ color: '#0369a1' }}>
            <p className="font-medium mb-1">Hướng dẫn:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li><strong>Bắt đầu mua:</strong> Giờ người chơi bắt đầu được mua con vật</li>
              <li><strong>Giờ xổ:</strong> Giờ kết thúc mua và công bố kết quả</li>
              <li><strong>Chế độ Tết:</strong> Bật để thêm khung giờ tối (chỉ An Nhơn & Nhơn Phong)</li>
            </ul>
          </div>
        </div>
      </div>
    </AdminPageWrapper>
  );
};

export default AdminTime;
