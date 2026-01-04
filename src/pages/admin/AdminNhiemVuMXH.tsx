import React, { useState } from 'react';

interface SocialTask {
    enabled: boolean;
    platform: 'facebook-page' | 'facebook-group' | 'youtube';
    title: string;
    link: string;
    imageUrl: string;
    regions: {
        anNhon: boolean;
        nhonPhong: boolean;
        hoaiNhon: boolean;
    };
    dateFrom: string;
    dateTo: string;
}

const AdminNhiemVuMXH: React.FC = () => {
    const [task, setTask] = useState<SocialTask>({
        enabled: true,
        platform: 'facebook-page',
        title: 'Thông báo ngày 04/01/2026',
        link: 'https://facebook.com/conhonannhon/posts/123456',
        imageUrl: '',
        regions: {
            anNhon: true,
            nhonPhong: true,
            hoaiNhon: true,
        },
        dateFrom: '2026-01-04',
        dateTo: '2026-01-04',
    });

    const [isSaved, setIsSaved] = useState(false);

    const handleSave = () => {
        // Mock save
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    };

    const activeRegionsCount = Object.values(task.regions).filter(Boolean).length;

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Nhiệm vụ Mạng xã hội</h1>
                <p className="text-gray-600">Cấu hình nhiệm vụ Like/Share cho người chơi</p>
            </div>

            {/* Status Box */}
            <div className={`rounded-xl p-6 mb-8 border-2 ${task.enabled
                    ? 'bg-green-50 border-green-300'
                    : 'bg-gray-50 border-gray-300'
                }`}>
                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full font-bold text-sm ${task.enabled
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-400 text-white'
                            }`}>
                            {task.enabled ? '🟢 ĐANG ÁP DỤNG' : '⚪ ĐANG TẮT'}
                        </span>
                    </div>
                </div>
                {task.enabled && (
                    <div className="mt-4 space-y-2 text-gray-700">
                        <p><strong>Bài viết hiện tại:</strong> {task.title}</p>
                        <p><strong>Link:</strong> <a href={task.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{task.link}</a></p>
                        <p><strong>Áp dụng cho:</strong> {activeRegionsCount} khu vực</p>
                    </div>
                )}
            </div>

            {/* Main Form */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6 pb-4 border-b">
                    NHIỆM VỤ MẠNG XÃ HỘI HÔM NAY
                </h2>

                {/* Toggle Enable */}
                <div className="mb-6">
                    <div className="flex items-center justify-between">
                        <label className="font-semibold text-gray-700">Bật nhiệm vụ Like / Share</label>
                        <button
                            onClick={() => setTask({ ...task, enabled: !task.enabled })}
                            className={`w-14 h-7 rounded-full relative transition-colors ${task.enabled ? 'bg-green-500' : 'bg-gray-300'
                                }`}
                        >
                            <span className={`absolute w-5 h-5 bg-white rounded-full top-1 shadow transition-transform ${task.enabled ? 'translate-x-8' : 'translate-x-1'
                                }`} />
                        </button>
                    </div>
                </div>

                {/* Platform Selection */}
                <div className="mb-6">
                    <label className="block font-semibold text-gray-700 mb-3">Loại nhiệm vụ:</label>
                    <div className="space-y-2">
                        {[
                            { value: 'facebook-page', label: 'Facebook Page', icon: '📘' },
                            { value: 'facebook-group', label: 'Facebook Group', icon: '👥' },
                            { value: 'youtube', label: 'YouTube', icon: '📺' },
                        ].map((opt) => (
                            <label key={opt.value} className="flex items-center space-x-3 cursor-pointer">
                                <input
                                    type="radio"
                                    name="platform"
                                    value={opt.value}
                                    checked={task.platform === opt.value}
                                    onChange={(e) => setTask({ ...task, platform: e.target.value as any })}
                                    className="w-4 h-4 text-red-600"
                                />
                                <span className="text-lg">{opt.icon}</span>
                                <span className="text-gray-700">{opt.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Title */}
                <div className="mb-6">
                    <label className="block font-semibold text-gray-700 mb-2">Tiêu đề hiển thị cho người chơi:</label>
                    <input
                        type="text"
                        value={task.title}
                        onChange={(e) => setTask({ ...task, title: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="VD: Thông báo ngày 12/01/2026"
                    />
                </div>

                {/* Link */}
                <div className="mb-6">
                    <label className="block font-semibold text-gray-700 mb-2">Link bài viết:</label>
                    <input
                        type="url"
                        value={task.link}
                        onChange={(e) => setTask({ ...task, link: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="https://facebook.com/..."
                    />
                    <p className="text-sm text-gray-500 mt-1">👉 Admin chỉ cần DÁN LINK + LƯU</p>
                </div>

                {/* Image Upload */}
                <div className="mb-6">
                    <label className="block font-semibold text-gray-700 mb-2">Ảnh đại diện bài viết:</label>
                    <div className="flex items-center space-x-4">
                        <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                            {task.imageUrl ? (
                                <img src={task.imageUrl} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                            ) : (
                                <span className="text-3xl">🖼️</span>
                            )}
                        </div>
                        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium">
                            📤 Upload ảnh
                        </button>
                        <span className="text-sm text-gray-500">(hoặc auto thumbnail)</span>
                    </div>
                </div>

                {/* Regions */}
                <div className="mb-6">
                    <label className="block font-semibold text-gray-700 mb-3">Áp dụng cho:</label>
                    <div className="flex flex-wrap gap-4">
                        {[
                            { key: 'anNhon', label: 'An Nhơn', color: 'green' },
                            { key: 'nhonPhong', label: 'Nhơn Phong', color: 'yellow' },
                            { key: 'hoaiNhon', label: 'Hoài Nhơn', color: 'blue' },
                        ].map((region) => (
                            <label key={region.key} className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={task.regions[region.key as keyof typeof task.regions]}
                                    onChange={(e) => setTask({
                                        ...task,
                                        regions: { ...task.regions, [region.key]: e.target.checked }
                                    })}
                                    className="w-5 h-5 text-red-600 rounded"
                                />
                                <span className={`px-3 py-1 rounded-full text-sm font-medium bg-${region.color}-100 text-${region.color}-700`}>
                                    {region.label}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Date Range */}
                <div className="mb-8">
                    <label className="block font-semibold text-gray-700 mb-3">Hiệu lực:</label>
                    <div className="flex items-center space-x-4">
                        <div>
                            <label className="block text-sm text-gray-500 mb-1">Từ ngày:</label>
                            <input
                                type="date"
                                value={task.dateFrom}
                                onChange={(e) => setTask({ ...task, dateFrom: e.target.value })}
                                className="px-4 py-2 border border-gray-300 rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-500 mb-1">Đến ngày:</label>
                            <input
                                type="date"
                                value={task.dateTo}
                                onChange={(e) => setTask({ ...task, dateTo: e.target.value })}
                                className="px-4 py-2 border border-gray-300 rounded-lg"
                            />
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <button
                    onClick={handleSave}
                    className="w-full py-4 bg-red-600 text-white rounded-xl text-lg font-bold hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                >
                    <span>💾</span>
                    <span>LƯU NHIỆM VỤ</span>
                </button>

                {/* Success Message */}
                {isSaved && (
                    <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-lg text-center font-semibold">
                        ✅ Đã lưu nhiệm vụ thành công!
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminNhiemVuMXH;
