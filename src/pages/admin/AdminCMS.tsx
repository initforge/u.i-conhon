import React, { useState } from 'react';

const AdminCMS: React.FC = () => {
    const [bannerUrl, setBannerUrl] = useState('https://example.com/banner.jpg');
    const [pinnedPost, setPinnedPost] = useState('Chào mừng Tết Ất Tỵ 2025! Chương trình khuyến mãi đặc biệt...');
    const [videos, setVideos] = useState([
        { id: '1', title: 'Hướng dẫn chơi Cổ Nhơn', url: 'https://youtube.com/watch?v=abc123' },
        { id: '2', title: 'Kết quả ngày 03/01', url: 'https://youtube.com/watch?v=def456' },
    ]);

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">CMS Nội dung</h1>
                <p className="text-gray-600">Quản lý nội dung trang chủ và cộng đồng</p>
            </div>

            {/* Banner */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <h2 className="font-bold text-gray-800 mb-4 flex items-center space-x-2">
                    <span>🖼️</span>
                    <span>Banner Homepage</span>
                </h2>
                <div className="h-48 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-gray-500">Preview Banner (Mock)</span>
                </div>
                <input
                    type="text"
                    value={bannerUrl}
                    onChange={(e) => setBannerUrl(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3"
                    placeholder="URL hình ảnh banner"
                />
                <button className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700">
                    💾 Lưu Banner
                </button>
            </div>

            {/* Pinned Post */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <h2 className="font-bold text-gray-800 mb-4 flex items-center space-x-2">
                    <span>📌</span>
                    <span>Bài ghim</span>
                </h2>
                <textarea
                    value={pinnedPost}
                    onChange={(e) => setPinnedPost(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-3 h-32"
                    placeholder="Nội dung bài ghim..."
                />
                <button className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700">
                    💾 Lưu bài ghim
                </button>
            </div>

            {/* Videos */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="font-bold text-gray-800 mb-4 flex items-center space-x-2">
                    <span>📺</span>
                    <span>Video Cộng đồng</span>
                </h2>
                <div className="space-y-3 mb-4">
                    {videos.map((video) => (
                        <div key={video.id} className="flex items-center space-x-4 bg-gray-50 p-3 rounded-lg">
                            <div className="w-16 h-12 bg-gray-200 rounded flex items-center justify-center">
                                ▶️
                            </div>
                            <div className="flex-1">
                                <input
                                    type="text"
                                    value={video.title}
                                    className="w-full px-2 py-1 border-b border-transparent hover:border-gray-300 focus:border-red-500"
                                />
                                <input
                                    type="text"
                                    value={video.url}
                                    className="w-full px-2 py-1 text-sm text-blue-600"
                                />
                            </div>
                            <button className="p-2 text-red-500 hover:bg-red-50 rounded">🗑️</button>
                        </div>
                    ))}
                </div>
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
                    ➕ Thêm video
                </button>
            </div>
        </div>
    );
};

export default AdminCMS;
