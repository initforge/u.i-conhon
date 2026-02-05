import React, { useState } from 'react';
import { THAIS, Thai } from '../../types';
import AdminPageWrapper, { AdminCard } from '../../components/AdminPageWrapper';

const AdminSwitch: React.FC = () => {
  const [thais, setThais] = useState<Thai[]>([...THAIS]);
  const [masterSwitch, setMasterSwitch] = useState(true);

  const toggleThai = (thaiId: string) => {
    setThais((prev) =>
      prev.map((thai) => (thai.id === thaiId ? { ...thai, isOpen: !thai.isOpen } : thai))
    );
  };

  return (
    <AdminPageWrapper
      title="Công tắc vận hành"
      subtitle="Quản lý trạng thái hoạt động hệ thống"
      icon="🔌"
    >
      {/* Master Switch */}
      <div
        className="p-5 rounded-xl"
        style={{
          backgroundColor: masterSwitch ? '#ecf5ec' : '#f8ecec',
          border: `1px solid ${masterSwitch ? '#c8e6c8' : '#f0c0c0'}`
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold" style={{ color: '#3d3428' }}>
              Master Switch
            </h2>
            <p className="text-sm mt-1" style={{ color: '#6b5c4c' }}>
              Tắt/Mở toàn bộ hệ thống (tất cả Thai)
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={masterSwitch}
              onChange={(e) => setMasterSwitch(e.target.checked)}
              className="sr-only peer"
            />
            <div
              className="w-14 h-7 rounded-full transition-colors after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-[22px] after:w-[22px] after:transition-all after:shadow-sm peer-checked:after:translate-x-7"
              style={{ backgroundColor: masterSwitch ? '#3d7a3d' : '#d1ccc4' }}
            />
          </label>
        </div>
        <div
          className="mt-3 flex items-center space-x-2"
          style={{ color: masterSwitch ? '#3d7a3d' : '#9a4a4a' }}
        >
          <span>{masterSwitch ? '✓' : '✗'}</span>
          <span className="text-sm font-medium">
            {masterSwitch ? 'Hệ thống đang hoạt động' : 'Hệ thống đã tạm dừng'}
          </span>
        </div>
      </div>

      {/* Individual Switches */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {thais.map((thai) => {
          const isActive = thai.isOpen && masterSwitch;
          return (
            <AdminCard key={thai.id}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-medium" style={{ color: '#3d3428' }}>{thai.name}</h3>
                  <p className="text-sm mt-1" style={{ color: '#9a8c7a' }}>{thai.description}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={() => toggleThai(thai.id)}
                    disabled={!masterSwitch}
                    className="sr-only peer"
                  />
                  <div
                    className={`w-11 h-6 rounded-full transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5 ${!masterSwitch ? 'opacity-50' : ''}`}
                    style={{ backgroundColor: isActive ? '#a5673f' : '#d1ccc4' }}
                  />
                </label>
              </div>
              <div
                className="mt-3 flex items-center space-x-2 text-sm"
                style={{ color: isActive ? '#3d7a3d' : '#9a8c7a' }}
              >
                <span>{isActive ? '✓' : '✗'}</span>
                <span>{isActive ? 'Đang mở' : 'Đã đóng'}</span>
              </div>
            </AdminCard>
          );
        })}
      </div>
    </AdminPageWrapper>
  );
};

export default AdminSwitch;
