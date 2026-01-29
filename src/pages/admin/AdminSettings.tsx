import React, { useState } from 'react';
import AdminPageWrapper, { AdminCard, AdminButton, AdminTabBar } from '../../components/AdminPageWrapper';
import { useSystemConfig } from '../../contexts/SystemConfigContext';
import { mockThais, Thai } from '../../mock-data/mockData';

const AdminSettings: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'time' | 'switch'>('time');

    // ===== THỜI GIAN STATE (từ AdminTime) =====
    const [thais, setThais] = useState<Thai[]>(mockThais);

    const updateTimeSlot = (thaiId: string, slotIndex: number, field: 'startTime' | 'endTime', value: string) => {
        setThais((prev) =>
            prev.map((thai) => {
                if (thai.id !== thaiId) return thai;
                const newTimeSlots = [...thai.timeSlots];
                newTimeSlots[slotIndex] = { ...newTimeSlots[slotIndex], [field]: value };
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

    const handleSaveTime = () => {
        console.log('Saving thais config:', thais);
        alert('Đã lưu cấu hình thời gian!');
    };

    // ===== CÔNG TẮC STATE =====
    const {
        isSystemActive,
        maintenanceMessage,
        toggleSystem,
        setMaintenanceMessage
    } = useSystemConfig();

    const [messageInput, setMessageInput] = useState(maintenanceMessage);

    const toggleThai = (thaiId: string) => {
        setThais((prev) =>
            prev.map((thai) => (thai.id === thaiId ? { ...thai, isOpen: !thai.isOpen } : thai))
        );
    };

    const handleSaveMessage = () => {
        setMaintenanceMessage(messageInput);
        alert('Đã lưu thông báo bảo trì!');
    };

    const tabs = [
        { id: 'time', label: '⏰ Thời gian' },
        { id: 'switch', label: '🔌 Công tắc' },
    ];

    return (
        <AdminPageWrapper
            title="Cài đặt hệ thống"
            subtitle="Quản lý thời gian và trạng thái hoạt động"
            icon="⚙️"
            actions={
                activeTab === 'time' ? (
                    <AdminButton variant="primary" onClick={handleSaveTime}>💾 Lưu cấu hình</AdminButton>
                ) : null
            }
        >
            {/* Tab Bar */}
            <div className="mb-6">
                <AdminTabBar
                    tabs={tabs}
                    activeTab={activeTab}
                    onTabChange={(tabId) => setActiveTab(tabId as 'time' | 'switch')}
                />
            </div>

            {/* ===== TAB: THỜI GIAN ===== */}
            {activeTab === 'time' && (
                <div className="space-y-6">
                    {thais.map((thai) => (
                        <AdminCard key={thai.id}>
                            <div className="mb-4 pb-3 border-b border-gray-200">
                                <h3 className="text-lg font-bold" style={{ color: '#3d3428' }}>{thai.name}</h3>
                                <p className="text-xs mt-1" style={{ color: '#9a8c7a' }}>{thai.description}</p>
                            </div>

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

                            {/* Tet Mode Toggle */}
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

                    {/* Info Box */}
                    <div className="p-4 rounded-xl" style={{ backgroundColor: '#f0f9ff', border: '1px solid #bae6fd' }}>
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
                </div>
            )}

            {/* ===== TAB: CÔNG TẮC ===== */}
            {activeTab === 'switch' && (
                <div className="space-y-6">
                    {/* Master System Switch */}
                    <AdminCard title="Công tắc tổng" icon="🔌">
                        <div
                            className="p-5 rounded-xl"
                            style={{
                                backgroundColor: isSystemActive ? '#ecf5ec' : '#fef2f2',
                                border: `1px solid ${isSystemActive ? '#c8e6c8' : '#fecaca'}`
                            }}
                        >
                            <div className="flex items-center justify-between flex-wrap gap-4">
                                <div>
                                    <h2 className="text-lg font-semibold" style={{ color: '#3d3428' }}>
                                        Master Switch
                                    </h2>
                                    <p className="text-sm mt-1" style={{ color: '#6b5c4c' }}>
                                        Tắt/Mở toàn bộ hệ thống cho người chơi
                                    </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={isSystemActive}
                                        onChange={toggleSystem}
                                        className="sr-only peer"
                                    />
                                    <div
                                        className="w-16 h-8 rounded-full transition-colors after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-[24px] after:w-[24px] after:transition-all after:shadow-md peer-checked:after:translate-x-8"
                                        style={{ backgroundColor: isSystemActive ? '#16a34a' : '#dc2626' }}
                                    />
                                </label>
                            </div>

                            <div
                                className="mt-4 flex items-center space-x-2"
                                style={{ color: isSystemActive ? '#16a34a' : '#dc2626' }}
                            >
                                <span className="text-xl">{isSystemActive ? '✓' : '✗'}</span>
                                <span className="font-semibold">
                                    {isSystemActive ? 'Hệ thống đang hoạt động' : 'Hệ thống đã tạm dừng'}
                                </span>
                            </div>

                            {!isSystemActive && (
                                <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
                                    <p className="text-sm text-red-700">
                                        ⚠️ Khi tắt: Người chơi sẽ không thể đăng nhập và mua con vật. Chỉ Admin vào được.
                                    </p>
                                </div>
                            )}
                        </div>
                    </AdminCard>

                    {/* Maintenance Message */}
                    <AdminCard title="Thông báo bảo trì" icon="📢">
                        <div className="space-y-4">
                            <p className="text-sm" style={{ color: '#6b5c4c' }}>
                                Thông báo hiển thị cho người dùng khi hệ thống tắt
                            </p>
                            <textarea
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:ring-red-200 focus:border-red-400 transition-all"
                                style={{ borderColor: '#e8e4df', minHeight: '100px' }}
                                placeholder="Nhập thông báo..."
                            />
                            <div className="flex justify-between items-center">
                                <p className="text-xs" style={{ color: '#9a8c7a' }}>
                                    {messageInput.length} ký tự
                                </p>
                                <button
                                    onClick={handleSaveMessage}
                                    className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
                                    style={{ background: 'linear-gradient(135deg, #b91c1c 0%, #991b1b 100%)' }}
                                >
                                    💾 Lưu thông báo
                                </button>
                            </div>
                        </div>
                    </AdminCard>

                    {/* Individual Thai Switches */}
                    <AdminCard title="Công tắc từng khu vực" icon="🗺️">
                        <p className="text-sm mb-4" style={{ color: '#6b5c4c' }}>
                            Tắt/Mở riêng từng Thai (chỉ hoạt động khi Master Switch = ON)
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {thais.map((thai) => {
                                const isActive = thai.isOpen && isSystemActive;
                                return (
                                    <div
                                        key={thai.id}
                                        className={`p-4 rounded-xl border transition-all ${!isSystemActive ? 'opacity-50' : ''}`}
                                        style={{
                                            backgroundColor: isActive ? '#f0fdf4' : '#fafafa',
                                            borderColor: isActive ? '#bbf7d0' : '#e5e5e5'
                                        }}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-medium" style={{ color: '#3d3428' }}>
                                                    {thai.name}
                                                </h3>
                                                <p className="text-xs mt-1" style={{ color: '#9a8c7a' }}>
                                                    {thai.description}
                                                </p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={thai.isOpen}
                                                    onChange={() => toggleThai(thai.id)}
                                                    disabled={!isSystemActive}
                                                    className="sr-only peer"
                                                />
                                                <div
                                                    className={`w-11 h-6 rounded-full transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5 ${!isSystemActive ? 'cursor-not-allowed' : ''}`}
                                                    style={{ backgroundColor: isActive ? '#a5673f' : '#d1d5db' }}
                                                />
                                            </label>
                                        </div>
                                        <div
                                            className="mt-3 flex items-center space-x-2 text-sm"
                                            style={{ color: isActive ? '#16a34a' : '#9a8c7a' }}
                                        >
                                            <span>{isActive ? '✓' : '✗'}</span>
                                            <span>{isActive ? 'Đang mở' : 'Đã đóng'}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </AdminCard>

                    {/* System Status Summary */}
                    <div
                        className="p-4 rounded-xl flex items-center space-x-4"
                        style={{
                            backgroundColor: isSystemActive ? '#ecfdf5' : '#fef2f2',
                            border: `1px solid ${isSystemActive ? '#a7f3d0' : '#fecaca'}`
                        }}
                    >
                        <div
                            className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                            style={{ backgroundColor: isSystemActive ? '#dcfce7' : '#fee2e2' }}
                        >
                            {isSystemActive ? '🟢' : '🔴'}
                        </div>
                        <div>
                            <h3 className="font-bold" style={{ color: '#3d3428' }}>
                                Trạng thái hiện tại: {isSystemActive ? 'HOẠT ĐỘNG' : 'TẠM DỪNG'}
                            </h3>
                            <p className="text-sm" style={{ color: '#6b5c4c' }}>
                                {isSystemActive
                                    ? 'Người chơi có thể đăng nhập và sử dụng hệ thống bình thường.'
                                    : 'Chỉ Admin có thể truy cập. Người chơi sẽ thấy trang bảo trì.'}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </AdminPageWrapper>
    );
};

export default AdminSettings;
