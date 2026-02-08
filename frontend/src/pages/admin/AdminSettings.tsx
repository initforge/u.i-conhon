import React, { useState, useEffect, useMemo } from 'react';
import AdminPageWrapper, { AdminCard, AdminButton, AdminTabBar } from '../../components/AdminPageWrapper';
import { useSystemConfig } from '../../contexts/SystemConfigContext';
import { useThaiConfig } from '../../contexts/ThaiConfigContext';
import { Thai } from '../../types';
import { saveAdminThaiSwitches, ThaiSwitches } from '../../services/api';
import { getDrawTimeForSlot, getEndTimeValidationError, getKhungLabel } from '../../constants/drawTimes';
import { TetModeIcon, LightbulbIcon } from '../../components/icons/ThaiIcons';

const AdminSettings: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'time' | 'switch'>('time');

    // ===== THỜI GIAN STATE (từ ThaiConfigContext) =====
    const { thais: contextThais, updateAllThais, loading: thaiLoading } = useThaiConfig();
    const [thais, setThais] = useState<Thai[]>([]);
    const [savingTime, setSavingTime] = useState(false);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    // Sync local state with context when context loads
    useEffect(() => {
        if (contextThais.length > 0) {
            setThais([...contextThais]);
        }
    }, [contextThais]);

    const updateTimeSlot = (thaiId: string, slotIndex: number, field: 'startTime' | 'endTime', value: string) => {
        // Auto-correct endTime if >= drawTime (must be at least 10 mins before)
        let adjustedValue = value;
        if (field === 'endTime') {
            const drawTime = getDrawTimeForSlot(thaiId, slotIndex);
            if (value >= drawTime) {
                // Parse drawTime and subtract 10 minutes
                const [hours, minutes] = drawTime.split(':').map(Number);
                const drawDate = new Date();
                drawDate.setHours(hours, minutes, 0, 0);
                drawDate.setMinutes(drawDate.getMinutes() - 10);
                adjustedValue = `${drawDate.getHours().toString().padStart(2, '0')}:${drawDate.getMinutes().toString().padStart(2, '0')}`;

                // Notify user about auto-correction
                const errorKey = `${thaiId}-${slotIndex}`;
                setValidationErrors(prev => ({ ...prev, [errorKey]: `Đã tự động điều chỉnh về ${adjustedValue} (trước giờ xổ ${drawTime} 10 phút)` }));
                // Clear error after 3 seconds
                setTimeout(() => {
                    setValidationErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors[errorKey];
                        return newErrors;
                    });
                }, 3000);
            } else {
                // Clear any existing error
                const errorKey = `${thaiId}-${slotIndex}`;
                setValidationErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors[errorKey];
                    return newErrors;
                });
            }
        }

        setThais((prev) =>
            prev.map((thai) => {
                if (thai.id !== thaiId) return thai;
                const newTimeSlots = [...thai.timeSlots];
                // Ensure we only have 2 slots normally
                while (newTimeSlots.length < 2) {
                    newTimeSlots.push({ startTime: '07:00', endTime: '10:30' });
                }
                newTimeSlots[slotIndex] = { ...newTimeSlots[slotIndex], [field]: adjustedValue };
                const newTimes = newTimeSlots.slice(0, 2).map(slot => slot.endTime);
                return { ...thai, timeSlots: newTimeSlots.slice(0, 2), times: newTimes };
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
                const newTetMode = !thai.isTetMode;
                // Initialize tetTimeSlot with default if enabling Tet mode and it doesn't exist
                const tetTimeSlot = newTetMode && !thai.tetTimeSlot
                    ? { startTime: '18:00', endTime: '20:30' }
                    : thai.tetTimeSlot;
                return { ...thai, isTetMode: newTetMode, tetTimeSlot };
            })
        );
    };

    // Check if there are validation errors
    const hasValidationErrors = useMemo(() => Object.keys(validationErrors).length > 0, [validationErrors]);

    const handleSaveTime = async () => {
        // Prevent save if there are validation errors
        if (hasValidationErrors) {
            alert('❌ Vui lòng sửa các lỗi validation trước khi lưu.');
            return;
        }

        setSavingTime(true);
        try {
            const success = await updateAllThais(thais);
            if (success) {
                alert('✅ Đã lưu cấu hình thời gian! Các trang khác sẽ tự động cập nhật.');
            } else {
                alert('❌ Lỗi khi lưu cấu hình. Vui lòng thử lại.');
            }
        } catch (error) {
            console.error('Save time config error:', error);
            alert('❌ Lỗi khi lưu cấu hình. Vui lòng thử lại.');
        } finally {
            setSavingTime(false);
        }
    };

    // ===== CÔNG TẮC STATE =====
    const {
        isSystemActive,
        thaiSwitches,
        updateSwitchesFromApi,
    } = useSystemConfig();

    const [savingSwitch, setSavingSwitch] = useState<string | null>(null);

    // Save to API when toggling Thai switch
    const handleToggleThai = async (thaiId: string) => {
        // Normalize thaiId: 'thai-an-nhon' -> 'an-nhon'
        const normalizedId = thaiId.replace('thai-', '');

        const currentSwitch = thaiSwitches.find(t => t.thaiId === normalizedId);
        const newValue = !(currentSwitch?.isOpen ?? true);

        console.log('🔧 Toggle Thai:', { thaiId, normalizedId, currentValue: currentSwitch?.isOpen, newValue });
        console.log('🔧 Sending request:', { [normalizedId]: newValue });

        setSavingSwitch(thaiId);
        try {
            const result = await saveAdminThaiSwitches({ [normalizedId]: newValue } as Partial<ThaiSwitches>);
            console.log('🔧 Response received:', result);
            updateSwitchesFromApi(result.switches);
        } catch (error) {
            console.error('Failed to save switch:', error);
            alert('Lỗi khi lưu trạng thái. Vui lòng thử lại.');
        } finally {
            setSavingSwitch(null);
        }
    };

    // Save master switch to API
    const handleToggleMaster = async () => {
        setSavingSwitch('master');
        try {
            const result = await saveAdminThaiSwitches({ master: !isSystemActive } as Partial<ThaiSwitches>);
            updateSwitchesFromApi(result.switches);
        } catch (error) {
            console.error('Failed to save master switch:', error);
            alert('Lỗi khi lưu trạng thái. Vui lòng thử lại.');
        } finally {
            setSavingSwitch(null);
        }
    };

    // Helper to check if thai is open from context
    const isThaiOpenFromContext = (thaiId: string) => {
        // Normalize thaiId: 'thai-an-nhon' -> 'an-nhon'
        const normalizedId = thaiId.replace('thai-', '');
        const thaiSwitch = thaiSwitches.find(t => t.thaiId === normalizedId);
        return thaiSwitch ? thaiSwitch.isOpen : true;
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
                                {/* Only show first 2 khungs (Sáng, Chiều) - Khung 3 is Tết only */}
                                {thai.timeSlots.slice(0, 2).map((slot, idx) => {
                                    const errorKey = `${thai.id}-${idx}`;
                                    const hasError = validationErrors[errorKey];
                                    const drawTime = getDrawTimeForSlot(thai.id, idx);
                                    const khungLabel = getKhungLabel(thai.id, idx);

                                    return (
                                        <div key={idx} className="p-4 rounded-xl" style={{
                                            backgroundColor: hasError ? '#fef2f2' : '#faf8f5',
                                            border: `1px solid ${hasError ? '#fecaca' : '#e8e4df'}`
                                        }}>
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-semibold" style={{ color: '#6b5c4c' }}>
                                                        Khung {idx + 1} - {khungLabel}
                                                    </span>
                                                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 font-medium">
                                                        Xổ lúc {drawTime}
                                                    </span>
                                                </div>
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
                                                    <label className="block text-xs mb-1" style={{ color: hasError ? '#dc2626' : '#9a8c7a' }}>
                                                        Giờ kết thúc mua (đóng tịch)
                                                    </label>
                                                    <input
                                                        type="time"
                                                        value={slot.endTime}
                                                        onChange={(e) => updateTimeSlot(thai.id, idx, 'endTime', e.target.value)}
                                                        className={`w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 ${hasError ? 'focus:ring-red-200 border-red-300' : 'focus:ring-amber-200'}`}
                                                        style={{ border: `1px solid ${hasError ? '#fecaca' : '#e8e4df'}` }}
                                                    />
                                                    {hasError && (
                                                        <p className="text-xs text-red-600 mt-1">
                                                            ⚠️ {validationErrors[errorKey]}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Tet Mode Toggle - Chỉ An Nhơn có buổi tối (Nhơn Phong không có) */}
                            {thai.id === 'thai-an-nhon' && (
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
                                                <TetModeIcon size={24} />
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
                                            <div className="mt-3 pt-3 border-t border-amber-200">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <span className="text-sm font-semibold" style={{ color: '#9a7a2d' }}>
                                                        Khung 3 - Tối (Tết)
                                                    </span>
                                                    <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-700 font-medium">
                                                        Xổ lúc 21:00
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-3">
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
                                                            🎋 Giờ kết thúc (Tết)
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
                            <LightbulbIcon size={28} />
                            <div className="text-sm" style={{ color: '#0369a1' }}>
                                <p className="font-medium mb-1">Hướng dẫn:</p>
                                <ul className="list-disc list-inside space-y-1 text-xs">
                                    <li><strong>Bắt đầu mua:</strong> Giờ người chơi bắt đầu được mua con vật</li>
                                    <li><strong>Giờ kết thúc:</strong> Giờ đóng tịch (phải trước giờ xổ)</li>
                                    <li><strong>Giờ xổ (cố định):</strong> Giờ công bố kết quả - không thể thay đổi</li>
                                    <li><strong>Chế độ Tết:</strong> Bật để thêm khung giờ tối (chỉ An Nhơn)</li>
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
                                        onChange={handleToggleMaster}
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

                    {/* Individual Thai Switches */}
                    <AdminCard title="Công tắc từng khu vực" icon="🗺️">
                        <p className="text-sm mb-4" style={{ color: '#6b5c4c' }}>
                            Tắt/Mở riêng từng Thai (chỉ hoạt động khi Master Switch = ON)
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {thais.map((thai) => {
                                const thaiIsOpen = isThaiOpenFromContext(thai.id);
                                const isActive = thaiIsOpen && isSystemActive;
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
                                                    checked={thaiIsOpen}
                                                    onChange={() => handleToggleThai(thai.id)}
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
            )
            }
        </AdminPageWrapper >
    );
};

export default AdminSettings;
