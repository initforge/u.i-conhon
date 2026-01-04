import React, { useState } from 'react';

// Reusable Toggle Component
const Toggle: React.FC<{ enabled: boolean; onChange: () => void; size?: 'sm' | 'md' | 'lg' }> = ({
    enabled,
    onChange,
    size = 'md'
}) => {
    const sizes = {
        sm: { track: 'w-10 h-5', knob: 'w-4 h-4', translate: 'left-5' },
        md: { track: 'w-12 h-6', knob: 'w-5 h-5', translate: 'left-6' },
        lg: { track: 'w-14 h-7', knob: 'w-6 h-6', translate: 'left-7' },
    };
    const s = sizes[size];

    return (
        <button
            onClick={onChange}
            className={`${s.track} rounded-full relative transition-colors flex-shrink-0 ${enabled ? 'bg-green-500' : 'bg-gray-300'
                }`}
        >
            <span
                className={`absolute ${s.knob} bg-white rounded-full top-0.5 shadow-md transition-all duration-200 ${enabled ? s.translate : 'left-0.5'
                    }`}
            />
        </button>
    );
};

const AdminCaiDat: React.FC = () => {
    const [systemEnabled, setSystemEnabled] = useState(true);
    const [thaiSettings, setThaiSettings] = useState([
        { id: 'an-nhon', name: 'Thai An Nhơn', enabled: true, openTime: '08:00', closeTime: '18:00' },
        { id: 'nhon-phong', name: 'Thai Nhơn Phong', enabled: true, openTime: '08:00', closeTime: '18:00' },
        { id: 'hoai-nhon', name: 'Thai Hoài Nhơn', enabled: false, openTime: '08:00', closeTime: '18:00' },
    ]);

    const handleToggleThai = (id: string) => {
        setThaiSettings(thaiSettings.map(t =>
            t.id === id ? { ...t, enabled: !t.enabled } : t
        ));
    };

    const handleTimeChange = (id: string, field: 'openTime' | 'closeTime', value: string) => {
        setThaiSettings(thaiSettings.map(t =>
            t.id === id ? { ...t, [field]: value } : t
        ));
    };

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Cài đặt Hệ thống</h1>
                <p className="text-gray-600">Cấu hình hệ thống và các Thai</p>
            </div>

            {/* System Toggle */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="font-bold text-gray-800 text-lg">🔌 Bật/Tắt Hệ thống</h2>
                        <p className="text-gray-500 text-sm">Tắt để ngừng toàn bộ hoạt động mua bán</p>
                    </div>
                    <Toggle
                        enabled={systemEnabled}
                        onChange={() => setSystemEnabled(!systemEnabled)}
                        size="lg"
                    />
                </div>
                <div className={`mt-4 p-3 rounded-lg ${systemEnabled ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {systemEnabled ? '✅ Hệ thống đang hoạt động' : '❌ Hệ thống đang tắt'}
                </div>
            </div>

            {/* Thai Settings */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <h2 className="font-bold text-gray-800 text-lg mb-4">🏠 Cài đặt từng Thai</h2>
                <div className="space-y-4">
                    {thaiSettings.map((thai) => (
                        <div
                            key={thai.id}
                            className={`p-4 rounded-lg border-2 transition-all ${thai.enabled ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
                                }`}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-bold text-gray-800">{thai.name}</h3>
                                <Toggle
                                    enabled={thai.enabled}
                                    onChange={() => handleToggleThai(thai.id)}
                                    size="sm"
                                />
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-600">Mở cửa:</span>
                                    <input
                                        type="time"
                                        value={thai.openTime}
                                        onChange={(e) => handleTimeChange(thai.id, 'openTime', e.target.value)}
                                        className="px-2 py-1 border border-gray-300 rounded"
                                    />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-600">Đóng cửa:</span>
                                    <input
                                        type="time"
                                        value={thai.closeTime}
                                        onChange={(e) => handleTimeChange(thai.id, 'closeTime', e.target.value)}
                                        className="px-2 py-1 border border-gray-300 rounded"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Save Button */}
            <button className="w-full py-4 bg-red-600 text-white rounded-xl text-lg font-bold hover:bg-red-700">
                💾 Lưu tất cả cài đặt
            </button>
        </div>
    );
};

export default AdminCaiDat;
