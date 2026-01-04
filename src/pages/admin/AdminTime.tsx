import React, { useState } from 'react';
import { mockThais } from '../../mock-data/mockData';
import AdminPageWrapper, { AdminCard, AdminButton } from '../../components/AdminPageWrapper';

const AdminTime: React.FC = () => {
  const [thais, setThais] = useState(mockThais);
  const [isTetMode, setIsTetMode] = useState(false);

  const updateTime = (thaiId: string, timeIndex: number, newTime: string) => {
    setThais((prev) =>
      prev.map((thai) => {
        if (thai.id !== thaiId) return thai;
        const newTimes = [...thai.times];
        newTimes[timeIndex] = newTime;
        return { ...thai, times: newTimes };
      })
    );
  };

  return (
    <AdminPageWrapper
      title="Cấu hình thời gian"
      subtitle="Thiết lập khung giờ cho các Thai"
      icon="⏰"
      actions={<AdminButton variant="primary">💾 Lưu cấu hình</AdminButton>}
    >
      {/* Tet Mode Toggle */}
      <div
        className="p-4 rounded-xl flex items-center justify-between"
        style={{
          backgroundColor: isTetMode ? '#fef8ec' : '#faf8f5',
          border: `1px solid ${isTetMode ? '#fde68a' : '#e8e4df'}`
        }}
      >
        <div className="flex items-center space-x-3">
          <span className="text-xl">🎋</span>
          <div>
            <p className="text-sm font-medium" style={{ color: '#3d3428' }}>Chế độ Tết</p>
            <p className="text-xs" style={{ color: '#9a8c7a' }}>Thêm khung 20:30 cho An Nhơn/Nhơn Phong</p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isTetMode}
            onChange={(e) => setIsTetMode(e.target.checked)}
            className="sr-only peer"
          />
          <div
            className="w-11 h-6 rounded-full transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5"
            style={{ backgroundColor: isTetMode ? '#c9a86c' : '#d1ccc4' }}
          />
        </label>
      </div>

      {/* Time Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {thais.map((thai) => (
          <AdminCard key={thai.id}>
            <div className="mb-4">
              <h3 className="text-base font-medium" style={{ color: '#3d3428' }}>{thai.name}</h3>
              <p className="text-xs mt-1" style={{ color: '#9a8c7a' }}>{thai.description}</p>
            </div>

            <div className="space-y-3">
              {thai.times.map((time, idx) => (
                <div key={idx} className="flex items-center space-x-3">
                  <label className="w-24 text-sm" style={{ color: '#6b5c4c' }}>Khung {idx + 1}</label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => updateTime(thai.id, idx, e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-200"
                    style={{ border: '1px solid #e8e4df' }}
                  />
                </div>
              ))}

              {isTetMode && (thai.id === 'thai-an-nhon' || thai.id === 'thai-nhon-phong') && (
                <div className="flex items-center space-x-3">
                  <label className="w-24 text-sm" style={{ color: '#c9a86c' }}>🎋 Tết</label>
                  <input
                    type="time"
                    value="20:30"
                    disabled
                    className="flex-1 px-3 py-2 rounded-lg text-sm"
                    style={{ border: '1px solid #fde68a', backgroundColor: '#fef8ec', color: '#9a7a2d' }}
                  />
                </div>
              )}
            </div>
          </AdminCard>
        ))}
      </div>
    </AdminPageWrapper>
  );
};

export default AdminTime;
